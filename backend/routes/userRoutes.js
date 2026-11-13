const router=require('express').Router(), db=require('../config/db');
const auth=require('../middleware/auth'), asyncHandler=require('../utils/asyncHandler');
router.put('/profile',auth,asyncHandler(async(req,res)=>{
  const {name,currency='INR'}=req.body;
  if(!name?.trim()) return res.status(400).json({message:'Name is required.'});
  if(!['INR','USD','EUR','GBP'].includes(currency)) return res.status(400).json({message:'Unsupported currency.'});
  await db.execute('UPDATE users SET name=?,currency=? WHERE id=?',[name.trim(),currency,req.user.id]);
  const [rows]=await db.execute('SELECT id,name,email,currency FROM users WHERE id=?',[req.user.id]);
  res.json({user:rows[0]});
}));
module.exports=router;
