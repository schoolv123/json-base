import express from "express"
import Api from './api/index.js'

const port = 3000 || 3003
const App = express()

App.use(express.urlencoded({ extended: true }))
App.use(express.json())
App.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to jsonBase to enhance your application performance",
        data: null
    })
})
App.use("/api", Api)

App.listen(port, () => {
    console.log(`Express app running on port ${port}`)
})