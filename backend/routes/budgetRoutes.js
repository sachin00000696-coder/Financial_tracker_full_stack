const router=require('express').Router(),db=require('../config/db');
const auth=require('../middleware/auth'),asyncHandler=require('../utils/asyncHandler');
router.use(auth);
router.get('/',asyncHandler(async(req,res)=>{
 const [rows]=await db.execute(`
 SELECT b.id,c.name AS category,b.amount AS \`limit\`,
 COALESCE(SUM(e.amount),0) AS spent
 FROM budgets b LEFT JOIN categories c ON c.id=b.category_id
 LEFT JOIN expenses e ON e.user_id=b.user_id AND e.category_id=b.category_id
   AND MONTH(e.transaction_date)=b.month AND YEAR(e.transaction_date)=b.year
 WHERE b.user_id=? AND b.month=MONTH(CURDATE()) AND b.year=YEAR(CURDATE())
 GROUP BY b.id,c.name,b.amount ORDER BY b.id DESC`,[req.user.id]);
 res.json(rows.map(r=>({...r,limit:Number(r.limit),spent:Number(r.spent),color:'#14b8a6'})));
}));
router.post('/',asyncHandler(async(req,res)=>{
 const {category,limit}=req.body, month=new Date().getMonth()+1, year=new Date().getFullYear();
 if(!category||!(Number(limit)>0)) return res.status(400).json({message:'Category and positive budget limit are required.'});
 const [cats]=await db.execute("SELECT id FROM categories WHERE user_id=? AND name=? AND type='EXPENSE'",[req.user.id,category]);
 if(!cats.length) return res.status(400).json({message:'Expense category not found.'});
 const [existing]=await db.execute('SELECT id FROM budgets WHERE user_id=? AND category_id=? AND month=? AND year=?',[req.user.id,cats[0].id,month,year]);
 if(existing.length) return res.status(409).json({message:'A budget already exists for this category this month.'});
 const [r]=await db.execute('INSERT INTO budgets (user_id,category_id,amount,month,year) VALUES (?,?,?,?,?)',[req.user.id,cats[0].id,Number(limit),month,year]);
 res.status(201).json({id:r.insertId,category,limit:Number(limit),spent:0,color:'#14b8a6'});
}));
module.exports=router;
