import express from "express"
import Api from './api/index.js'

const port = 3000 || 3003
const App = express()

App.use(express.urlencoded({ extended: true }))
App.use(express.json())
App.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to jsonBase, enhance your application performance",
        data: null
    })
})

App.use("/api", Api)
App.get('/ytdownload', async (req, res) => {
    let videoId = req.query.videoid
    // let url = "https://www.youtube.com/watch?v=" + videoId
    let url = req.query.url
    let format = req.query.format || "mp4"
    let quality = req.query.quality || "highest"
    format = format.toLowerCase()
    quality = quality.toLowerCase()

    try {
        Youtube(url, {
            format: format,
            quality: quality
        }).pipe(res)
    } catch (err) {
        console.log(err)
        Youtube(url, {
            format: "mp4"
        }).pipe(res)
    }
})

App.listen(port, () => {
    console.log(`Express app running on port ${port}`)
})