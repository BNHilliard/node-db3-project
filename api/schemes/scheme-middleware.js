const Scheme = require('./scheme-model')

const checkSchemeId = (req, res, next) => {
  Scheme.findById(req.params.scheme_id)
  .then(resp => {
    if (!resp){
    res.status(404).json({message: `scheme with scheme_id ${req.params.scheme_id} not found`})
    } else {next(); }
  }).catch(err => {
    res.status(500).json({message: `Internal service error`})
  })
}


const validateScheme = (req, res, next) => {
if (req.body.scheme_name == undefined || req.body.scheme_name == '' || typeof(req.body.scheme_name) != 'string') {
  res.status(400).json(  {"message": "invalid scheme_name"})
  } else {
    next();
  }
} 

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const {instructions, step_number} = req.body
if (typeof step_number !== Number || step_number < 1) {
    res.status(400).json({ "message": "invalid step"})
  } else if (instructions == undefined || !instructions.trim()){
    res.status(400).json({ "message": "invalid step"})
  } else {next();}}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
