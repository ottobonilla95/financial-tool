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
  };
  mainPage: {
    welcome: string;
    welcomeDescription: string;
  };
  sideMenu: {
    home: string;
    summary: string;
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
  };
};

export type AvailableLanguages = "en" | "es";
