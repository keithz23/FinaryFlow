import { PrismaClient, Prisma, Type } from '@prisma/client';
const prisma = new PrismaClient();

const userId = 'cmg9mdwa40000jllm4yzxzhsa';

const categoriesSeed: Array<
  Omit<Prisma.CategoryCreateManyInput, 'type'> & {
    type: keyof typeof Type | string;
  }
> = [
  // EXPENSE
  {
    userId,
    name: 'Food & Dining',
    description: 'Restaurants, groceries, and dining expenses',
    type: 'expense',
  },
  {
    userId,
    name: 'Transportation',
    description: 'Gas, public transport, car maintenance',
    type: 'expense',
  },
  {
    userId,
    name: 'Shopping',
    description: 'Clothing, electronics, and general shopping',
    type: 'expense',
  },
  {
    userId,
    name: 'Entertainment',
    description: 'Movies, games, hobbies, and entertainment',
    type: 'expense',
  },
  {
    userId,
    name: 'Bills & Utilities',
    description: 'Electricity, water, internet, phone bills',
    type: 'expense',
  },
  {
    userId,
    name: 'Healthcare',
    description: 'Medical expenses, pharmacy, insurance',
    type: 'expense',
  },
  {
    userId,
    name: 'Education',
    description: 'Books, courses, tuition fees',
    type: 'expense',
  },
  {
    userId,
    name: 'Travel',
    description: 'Vacation, business travel, accommodation',
    type: 'expense',
  },

  // INCOME
  {
    userId,
    name: 'Salary',
    description: 'Monthly salary and wages',
    type: 'income',
  },
  {
    userId,
    name: 'Freelance',
    description: 'Freelance work and consulting',
    type: 'income',
  },
  {
    userId,
    name: 'Investment',
    description: 'Dividends, stock returns, crypto gains',
    type: 'income',
  },
  {
    userId,
    name: 'Business',
    description: 'Business revenue and profits',
    type: 'income',
  },
  {
    userId,
    name: 'Rental',
    description: 'Property rental income',
    type: 'income',
  },
  {
    userId,
    name: 'Side Hustle',
    description: 'Part-time jobs, gig economy',
    type: 'income',
  },
  {
    userId,
    name: 'Bonus',
    description: 'Work bonus, commissions, tips',
    type: 'income',
  },
  {
    userId,
    name: 'Other Income',
    description: 'Gifts, refunds, miscellaneous income',
    type: 'income',
  },

  // BUDGET
  {
    userId,
    name: 'Monthly Living',
    description: 'Essential monthly living expenses',
    type: 'budget',
  },
  {
    userId,
    name: 'Entertainment Budget',
    description: 'Monthly entertainment allowance',
    type: 'budget',
  },
  {
    userId,
    name: 'Shopping Budget',
    description: 'Non-essential shopping budget',
    type: 'budget',
  },
  {
    userId,
    name: 'Travel Fund',
    description: 'Budget for travel and vacation',
    type: 'budget',
  },
  {
    userId,
    name: 'Emergency Fund',
    description: 'Emergency expenses budget',
    type: 'budget',
  },
  {
    userId,
    name: 'Health & Fitness',
    description: 'Health and fitness related budget',
    type: 'budget',
  },
  {
    userId,
    name: 'Learning & Development',
    description: 'Education and skill development budget',
    type: 'budget',
  },
  {
    userId,
    name: 'Gift & Charity',
    description: 'Gifts and charitable donations budget',
    type: 'budget',
  },

  // GOAL
  {
    userId,
    name: 'Savings Goal',
    description: 'General savings and wealth building',
    type: 'goal',
  },
  {
    userId,
    name: 'House Purchase',
    description: 'Saving for home down payment',
    type: 'goal',
  },
  {
    userId,
    name: 'Car Purchase',
    description: 'Saving for a new vehicle',
    type: 'goal',
  },
  {
    userId,
    name: 'Dream Vacation',
    description: 'Saving for dream vacation',
    type: 'goal',
  },
  {
    userId,
    name: 'Retirement',
    description: 'Long-term retirement savings',
    type: 'goal',
  },
  {
    userId,
    name: 'Investment Goal',
    description: 'Investment portfolio targets',
    type: 'goal',
  },
  {
    userId,
    name: 'Education Fund',
    description: 'Children education or personal courses',
    type: 'goal',
  },
  {
    userId,
    name: 'Debt Payoff',
    description: 'Credit card or loan payoff goals',
    type: 'goal',
  },
];

// Map string -> enum
const categoriesData: Prisma.CategoryCreateManyInput[] = categoriesSeed.map(
  (c) => ({
    ...c,
    type: Type[(c.type as string).toLowerCase() as keyof typeof Type],
  }),
);

async function seedCategories() {
  try {
    console.log('Starting categories seed...');

    const result = await prisma.category.createMany({
      data: categoriesData,
      skipDuplicates: true,
    });

    console.log(`Successfully created ${result.count} categories`);
    console.log('Categories breakdown:');
    console.log('   - Expense: 8 categories');
    console.log('   - Income: 8 categories');
    console.log('   - Budget: 8 categories');
    console.log('   - Goal: 8 categories');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('🎉 Categories seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Categories seed failed:', error);
      process.exit(1);
    });
}

export default seedCategories;
