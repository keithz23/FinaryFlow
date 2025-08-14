import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { EPeriod } from 'src/common/enums/EPeriod';

export class CreateBudgetDto {
  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsString()
  period: EPeriod;
}
