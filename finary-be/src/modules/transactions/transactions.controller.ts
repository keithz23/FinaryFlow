import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import Request from 'express';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(CombinedAuthGuard)
  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.sub;
    return this.transactionsService.create(createTransactionDto, userId);
  }

  @UseGuards(CombinedAuthGuard)
  @Get()
  findAll(
    @Param('page') page: number = 1,
    @Param('limit') limit: number = 10,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.sub;
    return this.transactionsService.findAll(page, limit, userId);
  }

  @UseGuards(CombinedAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.transactionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const userId = (req as any).user.sub;
    return this.transactionsService.update(id, userId, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.transactionsService.remove(id, userId);
  }
}
