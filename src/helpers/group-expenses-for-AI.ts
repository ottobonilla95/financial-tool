export const groupExpensesForAI = (
  expenses: any[],
  earnings: any[],
  savings: any[]
) => {
  let totalExpenses = 0;
  let totalEarnings = 0;
  let totalSavings = 0;

  const categoryTotals: Record<
    string,
    {
      total: number;
      subcategories: Record<
        string,
        {
          total: number;
          emotions: Record<string, number>;
          satisfaction: number | null; // Changed from array to single number
        }
      >;
    }
  > = {};

  const earningsTotals: Record<
    string,
    { total: number; subcategories: Record<string, number> }
  > = {};
  const savingsList: number[] = [];

  // Process earnings
  earnings.forEach((earning) => {
    totalEarnings += earning.amount;
    const categoryName = earning.category?.name || "Other Income";
    const subcategoryName = earning.subcategory?.name || "Uncategorized";

    if (!earningsTotals[categoryName]) {
      earningsTotals[categoryName] = { total: 0, subcategories: {} };
    }

    earningsTotals[categoryName].total += earning.amount;

    if (!earningsTotals[categoryName].subcategories[subcategoryName]) {
      earningsTotals[categoryName].subcategories[subcategoryName] = 0;
    }
    earningsTotals[categoryName].subcategories[subcategoryName] +=
      earning.amount;
  });

  // Process savings
  savings.forEach((saving) => {
    totalSavings += saving.amount;
    savingsList.push(saving.amount);
  });

  // Process expenses
  expenses.forEach((expense) => {
    totalExpenses += expense.amount;
    const categoryName = expense.category.name;
    const subcategoryName = expense.subcategory?.name || "Other";
    const emotionType = expense.emotion?.emotionType || "neutral";
    const satisfactionLevel = expense.satisfaction || 3;
    const amount = expense.amount;

    if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = { total: 0, subcategories: {} };
    }

    if (!categoryTotals[categoryName].subcategories[subcategoryName]) {
      categoryTotals[categoryName].subcategories[subcategoryName] = {
        total: 0,
        emotions: {},
        satisfaction: null, // Ensure it's not an array
      };
    }

    // Add to category & subcategory total
    categoryTotals[categoryName].total += amount;
    categoryTotals[categoryName].subcategories[subcategoryName].total += amount;

    // Add emotion breakdown at subcategory level
    if (
      !categoryTotals[categoryName].subcategories[subcategoryName].emotions[
        emotionType
      ]
    ) {
      categoryTotals[categoryName].subcategories[subcategoryName].emotions[
        emotionType
      ] = 0;
    }
    categoryTotals[categoryName].subcategories[subcategoryName].emotions[
      emotionType
    ] += amount;

    // Store satisfaction level for subcategory
    const subcategory =
      categoryTotals[categoryName].subcategories[subcategoryName];

    if (subcategory.satisfaction === null) {
      subcategory.satisfaction = satisfactionLevel;
    } else {
      subcategory.satisfaction =
        (subcategory.satisfaction + satisfactionLevel) / 2;
    }
  });

  // Convert emotions to percentages
  Object.keys(categoryTotals).forEach((category) => {
    Object.keys(categoryTotals[category].subcategories).forEach(
      (subcategory) => {
        const subcatData = categoryTotals[category].subcategories[subcategory];
        const totalSpent = subcatData.total;

        // Convert emotion amounts into percentages
        Object.keys(subcatData.emotions).forEach((emotion) => {
          subcatData.emotions[emotion] = Number(
            ((subcatData.emotions[emotion] / totalSpent) * 100).toFixed(2)
          );
        });

        // If no satisfaction data exists, set it to null
        if (subcatData.satisfaction === null) {
          subcatData.satisfaction = null;
        }
      }
    );
  });

  return {
    totalExpenses,
    totalEarnings,
    totalSavings,
    savingsList,
    categoryTotals,
    earningsTotals,
  };
};
