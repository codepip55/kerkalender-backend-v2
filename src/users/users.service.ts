import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private userModel: Model<UserDocument>) {}

  async createUser(dto: UserDto) {
    const user = new this.userModel({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await user.save();
  }

  async findByCid(cid: number) {
    const user = await this.userModel.findOne({ cid });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findById(id: string) {
    const user = this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByCidAndUpdate(cid: string, dto: UserDto) {
    const user = await this.userModel.findOne({ cid });
    if (!user) {
      throw new NotFoundException();
    }

    user.nameFull = dto.nameFull;
    user.updatedAt = new Date();

    return await user.save();
  }
}
