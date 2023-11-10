require('dotenv').config()


const express = require('express')
const morgan = require('morgan')
const redis = require("./common/cache/redis")
const mongo = require("./common/database/mongodb")

// Inits
redis.init();
mongo.init();

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
