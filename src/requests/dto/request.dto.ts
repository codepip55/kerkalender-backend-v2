import { User } from '../../users/schemas/user.schema';
import { Service } from '../../services/schemas/services.schema';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';

export class RequestDto {
  @IsObject()
  @IsNotEmptyObject()
  team: {
    name: string;
    positions: {
      name: string;
      users: {
        user: User;
        status: 'accepted' | 'waiting' | 'declined';
      }[];
    }[];
  };

  @IsObject()
  @IsNotEmptyObject()
  position: {
    name: string;
    users: {
      user: User;
      status: 'accepted' | 'waiting' | 'declined';
    }[];
  };

  @IsObject()
  @IsNotEmptyObject()
  service: Service;

  @IsString()
  @IsNotEmpty()
  status: 'accepted' | 'waiting' | 'declined';

  @IsObject()
  @IsNotEmptyObject()
  user: User;
}
