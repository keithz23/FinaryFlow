export interface CreateGoalDto {
  name: string;
  amount: number;
  date: Date;
  categoryId: string;
}

export interface UpdateGoalDto extends CreateGoalDto {}
