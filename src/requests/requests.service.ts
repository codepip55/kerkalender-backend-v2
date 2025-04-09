import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { ServiceDto } from '../services/dto/service.dto';
import { Request } from './models/request.model';

@Injectable()
export class RequestsService {
  constructor(private servcesService: ServicesService) {}
  async getRequestsByCid(cid: number) {
    // Check services for user in teams
    const services = await this.servcesService.findServices({
      startDate: new Date().toISOString(),
    });

    const requests: Request[] = [];
    for (const service of services.services) {
      for (const team of service.teams) {
        for (const position of team.positions) {
          const users = position.users;
          for (const user of users) {
            if (user.user.cid === cid) {
              requests.push({
                team: team,
                position: position,
                service: service,
                status: user.status,
                user: user.user,
              });
            }
          }
        }
      }
    }

    return requests;
  }
  async updateRequestStatus(
    request: Request,
    status: 'accepted' | 'waiting' | 'declined',
    cid: number,
  ) {
    const service = await this.servcesService.findServiceById(
      request.service._id,
    );
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.teams.forEach((team) => {
      team.positions.forEach((position) => {
        position.users.forEach((user) => {
          if (user.user.cid === cid) {
            user.status = status;
          }
        });
      });
    });

    const serviceDto: ServiceDto = {
      title: service.title,
      date: service.date.toISOString(),
      startTime: service.startTime,
      endTime: service.endTime,
      location: service.location,
      notes: service.notes,
      // @ts-expect-error - expecting User getting string (user id)
      service_manager: service.service_manager,
      teams: service.teams,
    };
    // Update service
    return await this.servcesService.updateServiceById(service.id, serviceDto);
  }
}
