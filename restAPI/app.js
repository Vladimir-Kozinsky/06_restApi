const express = require("express")
const config = require('config')
const mongoose = require('mongoose')

const app = express()
app.use('/api/auth', require('./routes/auth.routes'))
const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
        })
    } catch (error) {
        console.log("Server Error", error.message)
        process.exit(1)
    }
}

app.listen(PORT, () => console.log(`SERWER WAS STARTED ON ... ${PORT}`))