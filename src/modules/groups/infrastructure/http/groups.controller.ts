import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'common/guards/jwt-auth-guard';
import { GroupsService } from '../../application/services/groups.service';
import { GroupDto } from '../../application/dto/group.dto';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Get()
  findAll() {
    return this.groupService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findById(+id);
  }

  @Post()
  create(@Body() dto: GroupDto) {
    return this.groupService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: GroupDto) {
    return this.groupService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupService.remove(+id);
  }
}
