import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { User } from "../../users/schemas/user.schema";

export class ServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @IsDate()
  @IsNotEmpty()
  endTime: Date;

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
        status: 'accepted' | 'waiting' | 'rejected';
      }[];
    }[];
  }[];
}
