import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SetlistsService } from './setlists.service';
import { SetlistDto } from './dto/setlist.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('setlists')
export class SetlistsController {
  constructor(private setlistsService: SetlistsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSetlist(@Query() qs: Record<string, string>) {
    if (!qs.id && !qs.service_id) {
      throw new BadRequestException('Setlist id or service id is required');
    }
    if (qs.id) {
      return await this.setlistsService.findSetlistById(qs.id);
    }
    if (qs.service_id) {
      return await this.setlistsService.findSetlistByServiceId(qs.service_id);
    }
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  async createSetlist(@Body() dto: SetlistDto) {
    return await this.setlistsService.createSetlist(dto);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateSetlist(@Param('id') id: string, @Body() dto: SetlistDto) {
    return await this.setlistsService.updateSetlistById(id, dto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteSetlist(@Param('id') id: string) {
    return await this.setlistsService.deleteSetlistById(id);
  }
}
