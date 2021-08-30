const express = require("express")
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const Grid = require('gridfs-stream');
const upload = require("./routes/auth.routes.js")
const file = require("./middleware/file.js")

const app = express()
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

//app.use('/images', express.static(path.join(__dirname, 'images')))
app.use("/images", upload)
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
        const connectionParams = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        };
        const conn = await mongoose.connect(config.get('mongoUri'), {})
        // setting of gridfs-stream
        console.log('Connected to DataBase')
        // conn.once('open', function () {
        //     let gfs = Grid(conn.db, mongoose.mongo);
        //     gfs.collection('images')
        //     // all set!
        // })



        app.listen(PORT, () => console.log(`SERWER WAS STARTED ON ... ${PORT}`))
    } catch (error) {
        console.log("Server Error", error.message)
        console.log("Not connected to Data base ")
        process.exit(1)

    }
}
let gfs;
start()

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

// media routes

app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

app.delete("/file/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});