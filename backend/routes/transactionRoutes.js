const router=require('express').Router(), db=require('../config/db');
const auth=require('../middleware/auth'), asyncHandler=require('../utils/asyncHandler');
const {toDbMethod,fromDbMethod}=require('../utils/finance');
router.use(auth);
const listSql=`
 SELECT x.id,x.title,x.amount,x.type,c.name AS category,
 DATE_FORMAT(x.transaction_date,'%Y-%m-%d') AS date,
 x.payment_method,x.description
 FROM (
   SELECT id,user_id,category_id,title,amount,'income' AS type,payment_method,description,transaction_date FROM income
   UNION ALL
   SELECT id,user_id,category_id,title,amount,'expense' AS type,payment_method,description,transaction_date FROM expenses
 ) x JOIN categories c ON c.id=x.category_id
 WHERE x.user_id=? ORDER BY x.transaction_date DESC,x.id DESC`;
router.get('/',asyncHandler(async(req,res)=>{
  const [rows]=await db.execute(listSql,[req.user.id]);
  res.json(rows.map(r=>({id:r.id,title:r.title,amount:Number(r.amount),type:r.type,category:r.category,date:r.date,method:fromDbMethod(r.payment_method),note:r.description||''})));
}));
router.post('/',asyncHandler(async(req,res)=>{
  const {title,amount,type='expense',category='Other',date,method='UPI',note=''}=req.body;
  if(!title?.trim()||!(Number(amount)>0)||!['income','expense'].includes(type))
    return res.status(400).json({message:'Enter a title, positive amount and valid transaction type.'});
  const categoryType=type==='income'?'INCOME':'EXPENSE';
  const [cats]=await db.execute('SELECT id FROM categories WHERE user_id=? AND name=? AND type=?',[req.user.id,category,categoryType]);
  if(!cats.length) return res.status(400).json({message:`Category "${category}" is not available for ${type}.`});
  const table=type==='income'?'income':'expenses';
  const dbMethod=toDbMethod(method,type==='income'?'BANK_TRANSFER':'CASH');
  const txDate=date||new Date().toISOString().slice(0,10);
  const [r]=await db.execute(`INSERT INTO ${table} (user_id,category_id,title,amount,payment_method,description,transaction_date) VALUES (?,?,?,?,?,?,?)`,
    [req.user.id,cats[0].id,title.trim(),Number(amount),dbMethod,note||null,txDate]);
  res.status(201).json({id:r.insertId,title:title.trim(),amount:Number(amount),type,category,date:txDate,method:fromDbMethod(dbMethod),note});
}));
router.delete('/:id',asyncHandler(async(req,res)=>{
  const [a]=await db.execute('DELETE FROM income WHERE id=? AND user_id=?',[req.params.id,req.user.id]);
  const [b]=await db.execute('DELETE FROM expenses WHERE id=? AND user_id=?',[req.params.id,req.user.id]);
  if(!a.affectedRows&&!b.affectedRows) return res.status(404).json({message:'Transaction not found.'});
  res.json({message:'Transaction deleted.'});
}));
module.exports=router;
