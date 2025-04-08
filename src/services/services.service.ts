import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './schemas/services.schema';
import { Model, SortOrder } from 'mongoose';
import { ServiceDto } from './dto/service.dto';
import { EmailService, EmailTemplates } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel('service') private serviceModel: Model<ServiceDocument>,
    private emailService: EmailService,
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  async findServices(qs: Record<string, string>) {
    // Query String: per_page & page, or per_page & offset. If both are present, per_page & page will be used. If none, default to 10 & 1.
    const perPage = parseInt(qs.per_page) || 10;
    const page = parseInt(qs.page) || 1;
    const offset = parseInt(qs.offset);
    const query = qs.query || '';
    const sort = qs.sort || 'date';
    const startDate = qs.start_date || '';
    const endDate = qs.end_date || '';
    // @ts-expect-error - sort_dir is not defined in the type
    const sortDir: SortOrder = qs.sort_dir || 'asc';

    // Find all services
    const services = await this.serviceModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { notes: { $regex: query, $options: 'i' } },
        ],
        date: {
          $gte: startDate ? new Date(startDate) : new Date('1970-01-01'),
          $lte: endDate ? new Date(endDate) : new Date(),
        },
      })
      .sort({ [sort]: sortDir })
      .skip(offset || (page - 1) * perPage)
      .limit(perPage)
      .populate('service_manager')
      .populate('teams.positions.users.user');

    // Count all services
    const count = await this.serviceModel.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { notes: { $regex: query, $options: 'i' } },
      ],
    });

    // Return services and count
    return {
      services,
      count,
      perPage,
      page,
      offset,
    };
  }
  async findServiceById(id: string) {
    const service = await this.serviceModel
      .findById(id)
      .populate('service_manager')
      .populate('teams.positions.users.user');
    if (!service) {
      throw new NotFoundException();
    }
    return service;
  }
  async createService(dto: ServiceDto) {
    const service = new this.serviceModel({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await service.save();
  }
  async updateServiceById(id: string, dto: ServiceDto) {
    const service = await this.serviceModel
      .findById(id)
      .populate('service_manager')
      .populate('teams.positions.users.user');;
    if (!service) {
      throw new NotFoundException();
    }

    const oldTeams = service.teams;

    service.title = dto.title;
    service.date = new Date(dto.date);
    service.startTime = dto.startTime;
    service.endTime = dto.endTime;
    service.location = dto.location;
    service.notes = dto.notes;
    // @ts-expect-error - expecting UserDocument, getting user id string
    service.service_manager = dto.service_manager;
    service.teams = dto.teams;
    service.updatedAt = new Date();

    const newTeams = dto.teams;
    // Log teams

    await service.save();

    // Dont wait for function to finish
    this.sendNotifications(oldTeams, newTeams, service).catch((err) => {
      console.error('Error sending notifications:', err);
    });

    return service;
  }
  async deleteServiceById(id: string) {
    const service = await this.serviceModel
      .deleteOne({ _id: id })
      .populate('service_manager')
      .populate('teams.positions.users.user');
    if (!service) {
      throw new NotFoundException();
    }
    return service;
  }
  private async sendNotifications(
    oldTeams: any,
    newTeams: any,
    service: Service,
  ) {
    /**
     * Send notifcation email to user if:
     * - user is added to a team user was not previously in
     * - user is added to a position in a team user was not previously in
     *
     * Compile list of users to notify with user email, user's name, service title, date, start and end time, team name, position name, service manager name
     */
    const usersToNotify = [];
    const serviceTitle = service.title;
    const serviceDate = service.date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const serviceStartTime = service.startTime;
    const serviceEndTime = service.endTime;
    const serviceManagerName = service.service_manager.nameFull;

    if (oldTeams.length === 0 || newTeams.length === 0) {
      // No teams, no need to send notifications
      return;
    }

    for (const team of newTeams) {
      const oldTeam = oldTeams.find((t) => t.name === team.name);
      if (team.positions.length === 0) {
        // No positions, no need to send notifications
        continue;
      }
      if (!oldTeam) {
        // New team
        for (const position of team.positions) {
          if (position.users.length === 0) {
            // No users, no need to send notifications
            continue;
          }
          for (const user of position.users) {
            usersToNotify.push({
              email: user.user.email,
              name: user.user.nameFull,
              serviceTitle,
              serviceDate,
              serviceStartTime,
              serviceEndTime,
              location: service.location,
              teamName: team.name,
              positionName: position.name,
              serviceManagerName,
            });
          }
        }
      } else {
        // Existing team
        for (const position of team.positions) {
          const oldPosition = oldTeam.positions.find(
            (p) => p.name === position.name,
          );
          if (!oldPosition) {
            // New position
            for (const user of position.members) {
              usersToNotify.push({
                email: user.user.email,
                name: user.user.nameFull,
                serviceTitle,
                serviceDate,
                serviceStartTime,
                serviceEndTime,
                location: service.location,
                teamName: team.name,
                positionName: position.name,
                serviceManagerName,
              });
            }
          } else {
            // Existing position
            for (const user of position.members) {
              const oldUser = oldPosition.users.find(
                (u) => u.user.toString() === user.user.toString(),
              );
              if (!oldUser) {
                // New user
                // Get user details
                const userDetails = await this.usersService.findById(
                  user.user_id.toString(),
                );

                usersToNotify.push({
                  email: userDetails.email,
                  name: userDetails.nameFull,
                  serviceTitle,
                  serviceDate,
                  serviceStartTime,
                  serviceEndTime,
                  location: service.location,
                  teamName: team.name,
                  positionName: position.name,
                  serviceManagerName,
                });
              }
            }
          }
        }
      }
    }

    // Send email to each user
    for (const user of usersToNotify) {
      await this.emailService.sendDynamicMail(
        user.email,
        `Je bent toegevoegd aan een serviceteam`,
        EmailTemplates.NOTIFICATION,
        {
          userName: user.name,
          serviceTitle: user.serviceTitle,
          serviceDate: user.serviceDate,
          serviceStartTime: user.serviceStartTime,
          serviceEndTime: user.serviceEndTime,
          location: user.location,
          teamName: user.teamName,
          positionName: user.positionName,
          serviceManager: user.serviceManagerName,
          confirmationLink: `${this.configService.get<string>('FRONTEND_URL')}/dashboard`,
        },
      );
    }
  }
}
