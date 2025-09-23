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
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(CombinedAuthGuard)
  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser('sub') userId: string,
  ) {
    return this.transactionsService.create(createTransactionDto, userId);
  }

  @UseGuards(CombinedAuthGuard)
  @Get()
  findAll(
    @Query() dto: FindAllTransactionsDto,
    @GetUser('sub') userId: string,
  ) {
    const { page = 1, limit = 10, type, ...restFilters } = dto;
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
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser('sub') userId: string,
  ) {
    return this.transactionsService.update(id, userId, updateTransactionDto);
  }

  @UseGuards(CombinedAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.transactionsService.remove(id, userId);
  }
}
