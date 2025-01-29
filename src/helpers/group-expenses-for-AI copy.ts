export const groupExpensesForAI = (expenses: any[]) => {
  const categoryTotals: Record<
    string,
    {
      total: number;
      subcategories: Record<
        string,
        {
          total: number;
          emotions: Record<string, number>;
          satisfaction: number[];
        }
      >;
    }
  > = {};

  // Step 1: Aggregate spending by category, subcategory, emotions, and satisfaction
  expenses.forEach((expense) => {
    const categoryName = expense.category.name;
    const subcategoryName = expense.subcategory?.name || "Other";
    const emotionType = expense.emotion?.emotionType || "neutral";
    const satisfactionLevel = expense.satisfaction || 3; // Default to 3 (neutral)
    const amount = expense.amount;

    if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = { total: 0, subcategories: {} };
    }

    if (!categoryTotals[categoryName].subcategories[subcategoryName]) {
      categoryTotals[categoryName].subcategories[subcategoryName] = {
        total: 0,
        emotions: {},
        satisfaction: [],
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
    categoryTotals[categoryName].subcategories[
      subcategoryName
    ].satisfaction.push(satisfactionLevel);
  });

  // Step 2: Calculate emotion percentages & average satisfaction per subcategory
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

        // Calculate average satisfaction level
        if (subcatData.satisfaction.length > 0) {
          const avgSatisfaction =
            subcatData.satisfaction.reduce((a, b) => a + b, 0) /
            subcatData.satisfaction.length;
          subcatData.satisfaction = Number(avgSatisfaction.toFixed(1));
        } else {
          subcatData.satisfaction = null;
        }
      }
    );
  });

  return categoryTotals;
};
