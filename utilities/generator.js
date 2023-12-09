const crypto = require('crypto')

const generateRandomOTP = (length) => {
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < length; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
} 

const generateCryptoKeys = () =>{
    const key1 = crypto.randomBytes(32).toString('hex')
    const key2 = crypto.randomBytes(32).toString('hex')
    console.table({ key1, key2 })
}



module.exports = {
    generateRandomOTP
}