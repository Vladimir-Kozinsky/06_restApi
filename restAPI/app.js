const express = require("express")
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use('/images', express.static(path.join(__dirname, 'images')))

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    cors({
        origin: '*',
        //methods: ['POST']
        //credentials: true
    })
)

app.use('/api', require('./routes/auth.routes'))
const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {

        })
        app.listen(PORT, () => console.log(`SERWER WAS STARTED ON ... ${PORT}`))
    } catch (error) {
        console.log("Server Error", error.message)
        process.exit(1)
    }
}

start()
