import { Router } from "express"
import DBController from "../controller/DBController.js"
import TableController from "../controller/TableController.js"
import TableDataController from "../controller/TableDataController.js";
const Api = Router();
Api.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'This is the api path. Go next to your route',
    })
})
Api.use('/database', DBController())
Api.use('/table', TableController())
Api.use('/tabledata', TableDataController())

export default Api;