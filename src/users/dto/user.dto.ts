import { IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsNumber()
  cid: number;

  @IsString()
  nameFull: string;
}
