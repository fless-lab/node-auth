const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const redis = require("./common/cache/redis")

// Inits
redis.init();

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res, next) => {
    res.send('Hello from node-tdd.')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
