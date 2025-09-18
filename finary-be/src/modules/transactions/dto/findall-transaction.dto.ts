import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindAllTransactionsDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsIn(['INCOME', 'EXPENSE'])
  type?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
