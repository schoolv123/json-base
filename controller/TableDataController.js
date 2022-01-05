import { Router } from "express";
// import { rand } from "../model/CommonFunction.js";
import TableData from "../model/TableDataModel.js";
import Table from "../model/TableModel.js";
const { getTableByName } = Table;
// const tableData = new TableData('demo', 49057);

const middleware = (req, res, next) => {
    let tableName = req.params.tableName
    let flag = false
    if (tableName != '' || tableName != null) {
        let tableMeta = getTableByName(tableName)
        if (tableMeta) {
            req.tableMeta = tableMeta
            flag = true
        }
    }
    if (flag)
        next()
    else
        res.status(400).json({
            status: false,
            message: 'Table not exists',
            data: null
        })
}
export default function TableDataController() {
    const router = Router();
    router.use('/:tableName', middleware)
    // let table = new TableData('demo', 25385)
    router.get('/', (req, res) => {
        res.json({
            status: true,
            message: 'You are on table router please enter table name in router',
            data: null
        })
    })
    router.get('/:tableName', (req, res) => {
        let dataId = req.query.id ?? null
        let tableMeta = req.tableMeta
        let table = new TableData(tableMeta.name, tableMeta.id)
        let data = dataId ? table.getData(dataId) : table.getData()
        console.log(dataId)
        res.json({
            status: true,
            message: 'Table data',
            data: data
        })
    })
    router.post('/:tableName', (req, res) => {
        let body = req.body
        let tableMeta = req.tableMeta
        let table = new TableData(tableMeta.name, tableMeta.id)
        res.json({
            status: true,
            message: 'Table data created',
            data: table.insertData(body)
        })
    })
    router.put('/:tableName', (req, res) => {
        let dataId = req.query.id ?? null
        let body = req.body
        let tableMeta = req.tableMeta
        if (dataId) {
            let table = new TableData(tableMeta.name, tableMeta.id)
            res.json({
                status: true,
                message: 'Table data created',
                data: table.updateData(dataId, body)
            })
        } else {
            res.status(400).json({
                status: false,
                message: 'Table record id is null',
                data: null
            })
        }
    })
    router.delete('/:tableName', (req, res) => {
        let dataId = req.query.id ?? null
        let tableMeta = req.tableMeta
        if (dataId) {
            let table = new TableData(tableMeta.name, tableMeta.id)
            res.json({
                status: true,
                message: 'Table data created',
                data: table.deleteData(dataId)
            })
        } else {
            res.status(400).json({
                status: false,
                message: 'Table record id is null',
                data: null
            })
        }
    })
    // return router as a controller
    return router;
}