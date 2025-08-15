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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  @UseGuards(CombinedAuthGuard)
  findAll(@Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.categoriesService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(CombinedAuthGuard)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CombinedAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.sub;
    return this.categoriesService.update(id, userId, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(CombinedAuthGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
