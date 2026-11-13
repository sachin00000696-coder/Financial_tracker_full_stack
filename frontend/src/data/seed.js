export const seedTransactions = [
  { id: 1, title: 'Monthly salary', category: 'Salary', type: 'income', amount: 65000, date: '2026-11-01', method: 'Bank transfer', note: 'November salary' },
  { id: 2, title: 'Apartment rent', category: 'Housing', type: 'expense', amount: 12000, date: '2026-11-02', method: 'UPI', note: '' },
  { id: 3, title: 'Groceries', category: 'Food', type: 'expense', amount: 3250, date: '2026-11-04', method: 'UPI', note: 'Weekly groceries' },
  { id: 4, title: 'Freelance project', category: 'Freelance', type: 'income', amount: 8500, date: '2026-11-06', method: 'Bank transfer', note: '' },
  { id: 5, title: 'Fuel', category: 'Transport', type: 'expense', amount: 1800, date: '2026-11-07', method: 'Card', note: '' },
  { id: 6, title: 'Internet bill', category: 'Bills', type: 'expense', amount: 999, date: '2026-11-08', method: 'UPI', note: '' },
  { id: 7, title: 'Course subscription', category: 'Education', type: 'expense', amount: 1499, date: '2026-11-10', method: 'Card', note: '' },
  { id: 8, title: 'Gift from family', category: 'Other', type: 'income', amount: 3000, date: '2026-11-11', method: 'UPI', note: '' }
];

export const seedBudgets = [
  { id: 1, category: 'Food', limit: 8000, spent: 5250, color: '#14b8a6' },
  { id: 2, category: 'Transport', limit: 4000, spent: 1800, color: '#818cf8' },
  { id: 3, category: 'Shopping', limit: 6000, spent: 4200, color: '#f59e0b' },
  { id: 4, category: 'Bills', limit: 3500, spent: 2499, color: '#ec4899' },
  { id: 5, category: 'Entertainment', limit: 2500, spent: 900, color: '#38bdf8' }
];

export const seedGoals = [
  { id: 1, name: 'Emergency fund', target: 100000, saved: 42000, due: '2027-06-30', icon: 'ShieldCheck' },
  { id: 2, name: 'New laptop', target: 85000, saved: 51000, due: '2027-03-31', icon: 'Laptop' },
  { id: 3, name: 'Weekend getaway', target: 25000, saved: 9000, due: '2027-02-15', icon: 'Plane' }
];

export const monthlyData = [
  { month: 'Jun', income: 52000, expenses: 34500, savings: 17500 },
  { month: 'Jul', income: 56000, expenses: 37200, savings: 18800 },
  { month: 'Aug', income: 58000, expenses: 39100, savings: 18900 },
  { month: 'Sep', income: 61000, expenses: 40500, savings: 20500 },
  { month: 'Oct', income: 62500, expenses: 41800, savings: 20700 },
  { month: 'Nov', income: 76500, expenses: 19548, savings: 56952 }
];