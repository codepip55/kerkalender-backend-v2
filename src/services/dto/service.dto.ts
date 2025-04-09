import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/schemas/user.schema';

export class ServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsString()
  @IsNotEmpty()
  service_manager: string;

  @IsArray()
  teams: {
    name: string;
    positions: {
      name: string;
      users: {
        user: User;
        status: 'accepted' | 'waiting' | 'declined';
      }[];
    }[];
  }[];
}
