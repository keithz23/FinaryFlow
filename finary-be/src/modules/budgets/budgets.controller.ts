import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';
import { Request } from 'express';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  create(@Body() createBudgetDto: CreateBudgetDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.budgetsService.create(userId, createBudgetDto);
  }

  @Get()
  @UseGuards(CombinedAuthGuard)
  findAll(@Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.budgetsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(CombinedAuthGuard)
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CombinedAuthGuard)
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  @UseGuards(CombinedAuthGuard)
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }
}
