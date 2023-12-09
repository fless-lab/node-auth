require('dotenv').config()


const express = require('express')
const morgan = require('morgan')
const redis = require("./common/cache/redis")
const mongo = require("./common/database/mongodb")

// Inits
redis.init();
mongo.init();

const OtpRoutes = require("./domains/otp/routes/otp.routes")
const AuthRoutes = require("./domains/auth/routes/auth.routes")
const createError = require('http-errors')
const { verifyAccessToken } = require('./common/jwt/jwt')
const path = require("path")


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const uploadDirectory = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDirectory));

app.get('/uploads/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  res.sendFile(path.join(uploadDirectory, fileName));
});

app.get('/', async (req, res, next) => {
    res.send('Hello from node-tdd.')
})

app.get('/user', verifyAccessToken, async (req, res, next) => {
  res.send('Welcome to protected route.')
})

app.use('/otp', OtpRoutes)
app.use('/auth', AuthRoutes)


app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app;

