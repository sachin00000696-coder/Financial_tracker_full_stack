import React from 'react';
import { Wallet } from 'lucide-react';
export default function Logo({ light = false }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><Wallet size={19}/></span><span>finora</span></div>;
}