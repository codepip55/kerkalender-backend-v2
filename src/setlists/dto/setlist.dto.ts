import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SetlistDto {
  @IsString()
  @IsNotEmpty()
  service: string;

  @IsArray()
  songs: {
    title: string;
    artist: string;
    key: string;
    bpm: number;
    vocalNotes: string;
    bandNotes: string;
  }[];
}