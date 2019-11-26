// validate info given in update

const validateAdminStatus = (req, res, next) => {
  const changes = req.body;
  if(!changes.request_status){
    res.status(400).json({ error: 'Please alter the status' })
  }else if(!changes.approved_by){
    res.status(400).json({ error: 'Please add your id' })
  }else{
    next();
  }
}

module.exports = validateAdminStatus;