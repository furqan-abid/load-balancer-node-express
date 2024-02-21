const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors({
    origin:"*",
    optionsSuccessStatus:200
}))

app.use(morgan('dev'))



module.exports = app