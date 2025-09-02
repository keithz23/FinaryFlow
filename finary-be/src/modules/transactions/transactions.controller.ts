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
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import Request from 'express';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';
import { FindAllTransactionsDto } from './dto/findall-transaction.dto';

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
  findAll(@Query() dto: FindAllTransactionsDto, @Req() req: Request) {
    const { page = 1, limit = 10, type, ...restFilters } = dto;
    const userId = (req as any).user.sub;
    const filters = {
      ...restFilters,
      ...(type ? { type: type as any } : {}),
    };
    return this.transactionsService.findAll(page, limit, userId, filters);
  }

  @UseGuards(CombinedAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.transactionsService.findOne(id, userId);
  }

  @UseGuards(CombinedAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const userId = (req as any).user.sub;
    return this.transactionsService.update(id, userId, updateTransactionDto);
  }

  @UseGuards(CombinedAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.transactionsService.remove(id, userId);
  }
}
