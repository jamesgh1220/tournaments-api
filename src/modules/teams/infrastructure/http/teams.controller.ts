import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TeamDto } from '../../application/dto/team.dto';
import { TeamsService } from '../../application/services/teams.service';
import { JwtAuthGuard } from 'common/guards/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() dto: TeamDto) {
    return this.teamsService.create(dto);
  }

  @Get()
  findAll() {
    return this.teamsService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamsService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: TeamDto) {
    return this.teamsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.teamsService.remove(+id);
  }
}
