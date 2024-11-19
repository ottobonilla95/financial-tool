export type AppDictionary = {
  dashboard: {
    lastUpdated: string;
    addSaving: string;
    saving: string;
    addIncome: string;
    addExpense: string;
    expense: string;
    totalIncome: string;
    totalExpenses: string;
    balance: string;
    byEmotion: string;
    bySatisfaction: string;
    totalExpensesPerDayByCategory: string;
    totalExpensesPerCategory: string;
    samePeriodLastMonth: string;
  };
  forms: {
    expense: {
      create: {
        levelOfSatisfaction: string;
        whatEmotionDidIFeel: string;
        neutral: string;
        sadness: string;
        happiness: string;
        stress: string;
        boredom: string;
        excitement: string;
        guilt: string;
        anxiety: string;
      };
      delete: {
        title: string;
        message: string;
      };
    };
    income: {
      delete: {
        title: string;
        message: string;
      };
    };
    saving: {
      delete: {
        title: string;
        message: string;
      };
    };
    category: {
      create: {
        title: string;
      };
      update: {
        title: string;
      };
    };
    subCategory: {
      create: {
        title: string;
      };
      update: {
        title: string;
      };
    };
    shared: {
      category: string;
      subcategory: string;
      description: string;
      amount: string;
      date: string;
      save: string;
      cancel: string;
      name: string;
      color: string;
      enterAmount: string;
      enterDescription: string;
      delete: string;
      enterName: string;
      add: string;
    };
  };
  psychologyPage: {
    emotionalSpendingPatterns: string;
    satisfactionSpendingPatterns: string;
    premiumNavLinkMessage: string;
    whereYouSpendTheMostByEmotion: string;
  };

  shared: {
    total: string;
    name: string;
    date: string;
    price: string;
    satisfaction: string;
    emotion: string;
    noExpensesAdded: string;
    expenses: string;
    savings: string;
    income: string;
    contactUs: string;
    password: string;
    email: string;
    confirmPassword: string;
    currency: string;
    close: string;
    pricing: string;
    goPremium: string;
    manageSubscription: string;
    changeSubsCription: string;
    subscriptionMessages: {
      youHaveReaachedYourCategoryLimitTitle: string;
      youHaveReaachedYourCategoryLimit: string;
      addEmotionsAndLevelOfSatisfactionTitle: string;
      addEmotionsAndLevelOfSatisfactionMessage: string;
      seeExpensesPerMonthByCategoryTitle: string;
      seeExpensesPerMonthByCategoryMessage: string;
      seeTotalExpensesPerDayTitle: string;
      seeTotalExpensesPerDayMessage: string;
      psychologyPagePremiumTitle: string;
      psychologyPagePremiumMessage: string;
    };
    satisfactionLevels: {
      veryUnsatisfied: string;
      unsatisfied: string;
      neutral: string;
      satisfied: string;
      verySatisfied: string;
    };
    currencies: {
      COP: string; // Colombian Peso
      MXN: string; // Mexican Peso
      ARS: string; // Argentine Peso
      CLP: string; // Chilean Peso
      UYU: string; // Uruguayan Peso
      DOP: string; // Dominican Peso
      VES: string; // Venezuelan Bolívar
      PYG: string; // Paraguayan Guaraní
      PEN: string; // Peruvian Sol
      GTQ: string; // Guatemalan Quetzal
      PAB: string; // Panamanian Balboa
      NIO: string; // Nicaraguan Córdoba
      HNL: string; // Honduran Lempira
      USD: string; // US Dollar
      EUR: string; // Euro
      GBP: string; // British Pound
      CHF: string; // Swiss Franc
      CAD: string; // Canadian Dollar
      JPY: string; // Japanese Yen
      BRL: string; // Brazilian Real
      AUD: string; // Australian Dollar
      CNY: string; // Chinese Yuan
      NZD: string; // New Zealand Dollar
      RUB: string; // Russian Ruble
      INR: string; // Indian Rupee
      SEK: string; // Swedish Krona
    };
  };
  insights: {
    totalIncomeExpensesSavings: string;
    expensesByCategory: string;
  };
  contactPage: {
    weWouldLoveToHearFromYou: string;
    youCanSendUsAnEmailTo: string;
    weStriveToRespondWithin: string;
    meta: {
      title: string;
      description: string;
    };
  };
  aboutUsPage: {
    aboutUs: string;
    aboutUsDescription: string;
    aboutUsDescription2: string;
    meta: {
      title: string;
      description: string;
    };
  };
  authPages: {
    login: string;
    pleaseLogIn: string;
    createAccount: string;
    enterYourEmail: string;
    enterYourPassword: string;
    enterYourPasswordConfirmation: string;
    enterYourName: string;
    acceptPrivacyPolicy: string;
    privacyPolicy: string;
  };
  mainPage: {
    introMessage1: string;
    introMessage2: string;
    introMessage3: string;
    welcomeDescription: string;
    takeControlToday: string;
    visualBenefit: {
      changeFrom: string;
      changeTo: string;
    };
    painPoints: {
      title: string;
      items: {
        before: string;
        highlight: string;
        after: string;
      }[];
      betterWayText: string;
    };
    benefits: {
      title: string;
      items: {
        title: string;
        description: string;
      }[];
    };

    keyFeatures: {
      title: string;
      description: string;
      feature1: { title: string; description: string };
      feature2: { title: string; description: string };
      feature3: { title: string; description: string };
    };
    howItWorks: {
      title: string;
      step1: { title: string; description: string };
      step2: { title: string; description: string };
      step3: { title: string; description: string };
      step4: { title: string; description: string };
    };
    screenShots: {
      title: string;
      description: string;
      screenshot1: {
        description: string;
      };
      screenshot2: {
        description: string;
      };
      screenshot3: {
        description: string;
      };
      screenshot4: {
        description: string;
      };
      screenshot5: {
        description: string;
      };
      screenshot6: {
        description: string;
      };
      screenshot7: {
        description: string;
      };
      screenshot8: {
        description: string;
      };
    };
    testimonials: {
      title: string;
      testimonial1: {
        feedback: string;
      };
      testimonial2: {
        feedback: string;
      };
      testimonial3: {
        feedback: string;
      };
      testimonial4: {
        feedback: string;
      };
    };
  };

  sideMenu: {
    home: string;
    summary: string;
    yourPsychology: string;
    support: string;
    account: string;
    logOut: string;
  };
  supportPage: {
    title: string;
    description: string;
    getInContact: string;
    getInContactDescription: string;
  };
  faqs: {
    title: string;
    question1: string;
    answer1: string;
  };
  accountPage: {
    title: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    enterCurrentPassword: string;
    enterNewPassword: string;
    enterYourPasswordConfirmation: string;
    finishesOn: string;
    premium: string;
    free: string;
  };
  privacyPolicyPage: {
    meta: {
      title: string;
      description: string;
    };
  };
  footer: {
    aboutUsTitle: string;
    aboutUsDescription: string;
    quickLinksTitle: string;
    home: string;
    aboutUs: string;
    contactUs: string;
    privacyPolicy: string;
    allRightsReserved: string;
  };
  meta: {
    title: string;
    description: string;
    structuredData: {
      description: string;
      freeTierDescription: string;
      monthlySubscriptionDescription: string;
      lifetimeAccessDescription: string;
    };
  };
  api: {
    shared: {
      requiredField: string;
      passwordShouldHaveAtLeast6Chars: string;
      passwordsDontMatch: string;
      invalidEmail: string;
      somethingWentWrong: string;
    };
    auth: {
      invalidCredentials: string;
    };
    expenses: {
      create: {
        error: string;
        success: string;
      };
      delete: {
        error: string;
        success: string;
      };
    };
    income: {
      create: {
        error: string;
        success: string;
      };
      delete: {
        error: string;
        success: string;
      };
    };
    savings: {
      create: {
        error: string;
        success: string;
      };
      delete: {
        error: string;
        success: string;
      };
    };
    category: {
      create: {
        error: string;
        success: string;
      };
      update: {
        error: string;
        success: string;
      };
    };
    subCategory: {
      create: {
        error: string;
        success: string;
      };
    };
    password: {
      update: {
        error: string;
        success: string;
        userNotFound: string;
        invalidPassword: string;
      };
    };
    user: {
      create: {
        error: string;
        success: string;
        alreadyExists: string;
      };
    };
  };
  tour: {
    start: string;
    welcomeTitle: string;
    endTitle: string;
    endMessage: string;
    step0: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  pricingPage: {
    chooseYourPlan: string;
    mostPopular: string;
    free: string;
    per: string;
    month: string;
    currentPlan: string;
    subscribe: string;
    getStarted: string;
    basicPlan: string;
    premiumPlan: string;
    trackExpenses: string;
    basicReporting: string;
    advancedAnalytics: string;
    prioritySupport: string;
    lifeTimeDeal: string;
    allPremiumFeatures: string;
    oneTimePayment: string;
  };
};

export type AvailableLanguages = "en" | "es";
