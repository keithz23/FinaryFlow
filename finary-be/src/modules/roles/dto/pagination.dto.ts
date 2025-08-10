import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsEnum, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
