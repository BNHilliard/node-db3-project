const Scheme = require('./scheme-model')

const checkSchemeId = (req, res, next) => {
  Scheme.find(req.params.id) 
  .then(resp => {
    if (!resp) {
      res.status(404).json( {
        "message": "scheme with scheme_id <actual id> not found"
      })
    } else {
      next();
    }
  }).catch(err => {

  })
}


const validateScheme = (req, res, next) => {
if (req.body.name == undefined || req.body.name == '' || typeof(req.body.name) != 'string') {
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
if (isNan(step_number || step_number < 1)) {
    res.status(400).json({ "message": "invalid step"})
  } else if (instructions == undefined || instructions == ''){
    res.status(400).json({ "message": "invalid step"})
  } else {next();}}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
