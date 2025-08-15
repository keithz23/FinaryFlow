import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { EPeriod } from 'src/common/enums/EPeriod';

export class CreateBudgetDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  period: EPeriod;
}
