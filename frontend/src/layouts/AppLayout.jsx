import React from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, WalletCards, Target, ChartNoAxesCombined, Settings, LogOut, Menu, Bell, Search, Plus, X } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import TransactionModal from '../components/TransactionModal';
import { useFinance } from '../context/FinanceContext';

const nav = [
  { to:'/dashboard', label:'Overview', icon:LayoutDashboard },
  { to:'/transactions', label:'Transactions', icon:ArrowLeftRight },
  { to:'/budgets', label:'Budgets', icon:WalletCards },
  { to:'/goals', label:'Savings goals', icon:Target },
  { to:'/analytics', label:'Analytics', icon:ChartNoAxesCombined },
];
export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false), [modal, setModal] = useState(false);
  const { user, logout } = useAuth(); const { addTransaction } = useFinance(); const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); };
  return <div className="app-shell">
    {open && <div className="mobile-scrim" onClick={()=>setOpen(false)} />}
    <aside className={`sidebar ${open?'sidebar-open':''}`}>
      <div className="side-brand"><Logo light/><button className="mobile-close icon-btn" onClick={()=>setOpen(false)}><X/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav className="side-nav">{nav.map(({to,label,icon:Icon})=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`nav-link ${isActive?'active':''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="side-bottom">
        <div className="side-label">PREFERENCES</div>
        <NavLink to="/settings" className={({isActive})=>`nav-link ${isActive?'active':''}`}><Settings size={18}/><span>Settings</span></NavLink>
        <div className="sidebar-tip"><div className="tip-icon">✦</div><strong>Small steps add up.</strong><p>Every smart money decision brings you closer to your goals.</p></div>
        <button className="nav-link logout-link" onClick={signOut}><LogOut size={18}/><span>Log out</span></button>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <button className="icon-btn menu-toggle" onClick={()=>setOpen(true)}><Menu/></button>
        <div className="crumb">Workspace <span>/</span> <b>{nav.find(n=>n.to===location.pathname)?.label || 'Settings'}</b></div>
        <div className="top-actions"><button className="search-trigger"><Search size={16}/><span>Search anything</span><kbd>⌘ K</kbd></button><button className="icon-btn notification-btn" aria-label="Notifications"><Bell size={19}/><i/></button><div className="user-chip"><div className="avatar">{user?.name?.[0]?.toUpperCase()||'U'}</div><div className="user-chip-text"><b>{user?.name || 'User'}</b><span>Personal account</span></div></div></div>
      </header>
      <div className="page-content">{children}</div>
    </main>
    <button className="floating-add" onClick={()=>setModal(true)}><Plus size={18}/> Add transaction</button>
    {modal && <TransactionModal onClose={()=>setModal(false)} onSave={addTransaction}/>}
  </div>;
}