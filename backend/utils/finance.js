const METHOD_MAP = {
  'UPI':'UPI','CASH':'CASH','CARD':'DEBIT_CARD','CREDIT CARD':'CREDIT_CARD',
  'DEBIT CARD':'DEBIT_CARD','BANK TRANSFER':'BANK_TRANSFER','NET BANKING':'NET_BANKING',
  'OTHER':'OTHER'
};
function toDbMethod(value, fallback='OTHER') {
  return METHOD_MAP[String(value||'').trim().toUpperCase()] || fallback;
}
function fromDbMethod(value) {
  return ({CASH:'Cash',UPI:'UPI',CREDIT_CARD:'Card',DEBIT_CARD:'Card',NET_BANKING:'Net banking',BANK_TRANSFER:'Bank transfer',OTHER:'Other'})[value] || value;
}
module.exports={toDbMethod,fromDbMethod};
