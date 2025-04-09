import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  cid: number;

  @IsString()
  @IsNotEmpty()
  nameFull: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
