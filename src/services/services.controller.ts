import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ServiceDto } from './dto/service.dto';
import { Request } from 'express';
import { User } from '../users/schemas/user.schema';
import { RequestsService } from '../requests/requests.service';
import { RequestDto } from '../requests/dto/request.dto';

@Controller('services')
export class ServicesController {
  constructor(
    private servicesService: ServicesService,
    private reqestsService: RequestsService,
  ) {}

  /**
   * Get all services
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  getAllServices(@Query() qs: Record<string, string>) {
    return this.servicesService.findServices(qs);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getServiceById(@Param('id') id: string) {
    return this.servicesService.findServiceById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createService(@Body() dto: ServiceDto) {
    return this.servicesService.createService(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateService(@Param('id') id: string, @Body() dto: ServiceDto) {
    return this.servicesService.updateServiceById(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteService(@Param('id') id: string) {
    return this.servicesService.deleteServiceById(id);
  }

  @Get('requests/user')
  @UseGuards(JwtAuthGuard)
  getRequests(@Req() req: Request) {
    const user = req.user as User;

    return this.reqestsService.getRequestsByCid(user.cid);
  }

  @Put('requests/user')
  @UseGuards(JwtAuthGuard)
  updateRequestStatus(@Body() dto: RequestDto, @Req() req: Request) {
    const user = req.user as User;

    return this.reqestsService.updateRequestStatus(dto, dto.status, user.cid);
  }
}
