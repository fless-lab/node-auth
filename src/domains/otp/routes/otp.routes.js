const express = require('express')
const OTPController = require('../controllers/otp.controller')
const validateGenerateOTP = require('../../../common/middleware/validate-generate-otp')
const router = express.Router()


router.post('/generate', validateGenerateOTP,OTPController.generateOTP)
router.post('/validate', OTPController.validateOTP) //Possibly take params

module.exports = router
