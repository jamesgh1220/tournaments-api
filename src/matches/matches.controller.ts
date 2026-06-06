import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchService: MatchesService) {}

  @Get()
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matchService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateMatchDto) {
    return this.matchService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(+id);
  }
}
