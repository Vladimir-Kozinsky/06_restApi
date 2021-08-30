const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const config = require('config')

const storage = new GridFsStorage({
    url: 'http://localhost:5000/file/',
    //url: config.get('mongoUri'),
    options: {
        useNewUrlParsel: true,
        useUnifiedTopology: true
    },
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg', 'image/jpg']
        if (match.indexOf(file.mimetype) === -1) {
            const filename = new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname
            return filename
        }
        return {
            bucketName: "photos",
            filename: new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname
        }
    }

})

module.exports = multer({ storage })

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'images/')
//     },
//     filename(req, file, cb) {
//         cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
//     }
// })

// const types = ['image/png', 'image/jpeg', 'image/jpg']
// const fileFilter = (req, file, cb) => {
//     if (types.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

// module.exports = multer({ storage, fileFilter })