const router=require('express').Router(),db=require('../config/db');
const auth=require('../middleware/auth'),asyncHandler=require('../utils/asyncHandler');
router.get('/monthly',auth,asyncHandler(async(req,res)=>{
 const [rows]=await db.execute(`
 SELECT DATE_FORMAT(d.month_start,'%Y-%m') AS month_key,
 DATE_FORMAT(d.month_start,'%b') AS month,
 COALESCE(i.total,0) AS income,COALESCE(e.total,0) AS expenses
 FROM (
   SELECT DATE_SUB(DATE_FORMAT(CURDATE(),'%Y-%m-01'),INTERVAL seq.n MONTH) AS month_start
   FROM (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) seq
 ) d
 LEFT JOIN (SELECT DATE_FORMAT(transaction_date,'%Y-%m-01') m,SUM(amount) total FROM income WHERE user_id=? GROUP BY m) i ON i.m=d.month_start
 LEFT JOIN (SELECT DATE_FORMAT(transaction_date,'%Y-%m-01') m,SUM(amount) total FROM expenses WHERE user_id=? GROUP BY m) e ON e.m=d.month_start
 ORDER BY d.month_start`,[req.user.id,req.user.id]);
 res.json(rows.map(r=>({month:r.month,income:Number(r.income),expenses:Number(r.expenses),savings:Number(r.income)-Number(r.expenses)})));
}));
module.exports=router;
