import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext(null);
export function FinanceProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!localStorage.getItem('finora_token')) {
      setTransactions([]); setBudgets([]); setGoals([]); setMonthlyData([]);
      return;
    }
    setLoading(true);
    try {
      const [t,b,g,m] = await Promise.all([
        api.get('/transactions'), api.get('/budgets'), api.get('/goals'), api.get('/analytics/monthly')
      ]);
      setTransactions(t.data); setBudgets(b.data); setGoals(g.data); setMonthlyData(m.data);
    } finally { setLoading(false); }
  };
  useEffect(() => {
    refresh().catch(err => console.error('Unable to load finance data:', err));
  }, [user?.id]);

  const addTransaction = async item => {
    const { data } = await api.post('/transactions', item);
    await refresh(); return data;
  };
  const deleteTransaction = async id => { await api.delete(`/transactions/${id}`); await refresh(); };
  const addBudget = async item => { const {data}=await api.post('/budgets',item); await refresh(); return data; };
  const addGoal = async item => { const {data}=await api.post('/goals',item); await refresh(); return data; };
  const contribute = async (id,amount) => { const {data}=await api.post(`/goals/${id}/contributions`,{amount}); await refresh(); return data; };

  const value = useMemo(() => ({transactions,budgets,goals,monthlyData,loading,refresh,addTransaction,deleteTransaction,addBudget,addGoal,contribute}),
    [transactions,budgets,goals,monthlyData,loading]);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
export const useFinance = () => useContext(FinanceContext);
