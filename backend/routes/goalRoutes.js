const router=require('express').Router(),db=require('../config/db');
const auth=require('../middleware/auth'),asyncHandler=require('../utils/asyncHandler');
router.use(auth);
const goalSelect=`
 SELECT g.id,g.name,g.target_amount AS target,g.current_amount AS saved,
 DATE_FORMAT(g.target_date,'%Y-%m-%d') AS due,g.status
 FROM savings_goals g WHERE g.user_id=?`;
router.get('/',asyncHandler(async(req,res)=>{
 const [rows]=await db.execute(goalSelect+' ORDER BY g.id DESC',[req.user.id]);
 res.json(rows.map(g=>({...g,target:Number(g.target),saved:Number(g.saved),icon:'Target'})));
}));
router.post('/',asyncHandler(async(req,res)=>{
 const {name,target,due=null}=req.body;
 if(!name?.trim()||!(Number(target)>0)) return res.status(400).json({message:'Goal name and positive target are required.'});
 const [r]=await db.execute('INSERT INTO savings_goals (user_id,name,target_amount,current_amount,target_date,status) VALUES (?,?,?,0,?,?)',
 [req.user.id,name.trim(),Number(target),due||null,'ACTIVE']);
 res.status(201).json({id:r.insertId,name:name.trim(),target:Number(target),saved:0,due,icon:'Target',status:'ACTIVE'});
}));
router.post('/:id/contributions',asyncHandler(async(req,res)=>{
 const amount=Number(req.body.amount);
 if(!(amount>0)) return res.status(400).json({message:'Contribution must be greater than zero.'});
 const conn=await db.getConnection();
 try {
  await conn.beginTransaction();
  const [goals]=await conn.execute('SELECT id,current_amount,target_amount FROM savings_goals WHERE id=? AND user_id=? FOR UPDATE',[req.params.id,req.user.id]);
  if(!goals.length){await conn.rollback();return res.status(404).json({message:'Savings goal not found.'});}
  await conn.execute('INSERT INTO savings_contributions (goal_id,user_id,amount,note,contribution_date) VALUES (?,?,?,NULL,CURDATE())',[req.params.id,req.user.id,amount]);
  const next=Number(goals[0].current_amount)+amount;
  const status=next>=Number(goals[0].target_amount)?'COMPLETED':'ACTIVE';
  await conn.execute('UPDATE savings_goals SET current_amount=?,status=? WHERE id=?',[next,status,req.params.id]);
  await conn.commit();
  const [rows]=await db.execute(goalSelect+' AND g.id=?',[req.user.id,req.params.id]);
  const g=rows[0]; res.json({...g,target:Number(g.target),saved:Number(g.saved),icon:'Target'});
 } catch(e){await conn.rollback();throw e;} finally{conn.release();}
}));
module.exports=router;
