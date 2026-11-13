import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
export default function StatCard({ title, value, change, icon: Icon, tone = 'teal', note = 'vs last month' }) {
  const positive = String(change).startsWith('+');
  return <div className="stat-card">
    <div className="stat-top"><span className={`stat-icon ${tone}`}><Icon size={19}/></span><span className={`trend ${positive ? 'up' : 'down'}`}>{positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {change}</span></div>
    <p className="muted stat-title">{title}</p><h2>{value}</h2><span className="tiny muted">{note}</span>
  </div>;
}