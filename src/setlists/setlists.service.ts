import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SetlistDocument } from './schemas/setlist.schema';
import { SetlistDto } from './dto/setlist.dto';

@Injectable()
export class SetlistsService {
  constructor(
    @InjectModel('setlist') private setlistModel: Model<SetlistDocument>,
  ) {}

  async findSetlistById(id: string) {
    const setlist = await this.setlistModel.findById(id);
    if (!setlist) {
      throw new NotFoundException();
    }
    return setlist;
  }
  async findSetlistByServiceId(serviceId: string) {
    const setlist = await this.setlistModel.findOne({ service: serviceId });
    if (!setlist) {
      throw new NotFoundException();
    }
    return setlist;
  }
  async createSetlist(dto: SetlistDto) {
    const setlist = new this.setlistModel({
      service: dto.service,
      songs: dto.songs,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedSetlist = await setlist.save();
    return savedSetlist;
  }
  async updateSetlistById(id: string, dto: SetlistDto) {
    const setlist = await this.setlistModel.findById(id);
    if (!setlist) {
      throw new NotFoundException();
    }

    // @ts-expect-error - Expecting type Service, getting string. String is service id.
    setlist.service = dto.service;
    setlist.songs = dto.songs;
    setlist.updatedAt = new Date();

    return await setlist.save();
  }
  async deleteSetlistById(id: string) {
    const setlist = await this.setlistModel.findByIdAndDelete(id);
    if (!setlist) {
      throw new NotFoundException();
    }
    return setlist;
  }
}
