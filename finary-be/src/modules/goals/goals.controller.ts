import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  create(@Body() createGoalDto: CreateGoalDto, @GetUser('sub') userId: string) {
    return this.goalsService.create(createGoalDto, userId);
  }

  @Get()
  @UseGuards(CombinedAuthGuard)
  findAll(@GetUser('sub') userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(id);
  }
}
