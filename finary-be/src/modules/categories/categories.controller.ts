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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import { CombinedAuthGuard } from '../auth/guards/combined.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ECategories } from 'src/common/enums/ECategories';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(CombinedAuthGuard)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser('sub') userId: string,
  ) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  @UseGuards(CombinedAuthGuard)
  findAll(@GetUser('sub') userId: string, @Query('type') type: ECategories) {
    return this.categoriesService.findAll(userId, type);
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
    @GetUser('sub') userId: string,
  ) {
    return this.categoriesService.update(id, userId, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(CombinedAuthGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
