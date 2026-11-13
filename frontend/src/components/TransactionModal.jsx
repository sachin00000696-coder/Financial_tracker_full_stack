import React from 'react';
import { useState } from 'react';
import { X } from 'lucide-react';
const categories = ['Food','Housing','Transport','Shopping','Bills','Education','Entertainment','Healthcare','Salary','Freelance','Other'];
export default function TransactionModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title:'', amount:'', type:'expense', category:'Food', date:new Date().toISOString().slice(0,10), method:'UPI', note:'' });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); if (!form.title.trim() || Number(form.amount) <= 0) return; onSave({ ...form, amount:Number(form.amount) }); onClose(); };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}>
    <div className="modal-head"><div><span className="eyebrow">YOUR MONEY, YOUR WAY</span><h2>Add transaction</h2></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>
    <form onSubmit={submit} className="form-grid">
      <label className="field full">Transaction name<input name="title" value={form.title} onChange={update} placeholder="e.g. Grocery shopping" required/></label>
      <label className="field">Amount (₹)<input name="amount" type="number" min="1" value={form.amount} onChange={update} placeholder="0" required/></label>
      <label className="field">Type<select name="type" value={form.type} onChange={update}><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <label className="field">Category<select name="category" value={form.category} onChange={update}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
      <label className="field">Date<input type="date" name="date" value={form.date} onChange={update}/></label>
      <label className="field">Payment method<select name="method" value={form.method} onChange={update}><option>UPI</option><option>Cash</option><option>Card</option><option>Bank transfer</option></select></label>
      <label className="field">Note<input name="note" value={form.note} onChange={update} placeholder="Optional note"/></label>
      <div className="form-actions full"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary">Save transaction</button></div>
    </form>
  </div></div>;
}