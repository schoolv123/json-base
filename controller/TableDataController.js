import { Router } from "express"
import TableData from "../model/TableDataModel.js"
import Table from "../model/TableModel.js"
import Database from "../model/DataBaseModel.js"
const { getTableByName } = Table
const { validateDatabase } = Database

const middleware = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }
    // verify auth credentials
    let base64Credentials = req.headers.authorization.split(' ')[1]
    let credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    let [identity_token, auth_token] = credentials.split(':')
    let validate = validateDatabase(identity_token, auth_token)
    let flag = false
    if (validate) {
        let tableName = req.params.tableName
        if (tableName != '' || tableName != null) {
            let tableMeta = getTableByName(tableName)
            if (tableMeta && tableMeta.parentId == validate.id) {
                req.tableMeta = tableMeta
                flag = true
            }
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
    const router = Router()
    router.use('/:tableName', middleware)
    router.get('/', (req, res) => {
        res.json({
            status: true,
            message: 'You are on table route please enter table name in route',
            data: null
        })
    })
    router.get('/:tableName', (req, res) => {
        let dataId = req.query.id ?? null
        let tableMeta = req.tableMeta
        let table = new TableData(tableMeta.name, tableMeta.id)
        let data = dataId ? table.getData(dataId) : table.getData()
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
            message: 'Table data inserted',
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
                message: 'Table data updated',
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
            let del = table.deleteData(dataId);
            if (del)
                res.json({
                    status: true,
                    message: 'Table data deleted'
                })
            else
                res.status(400).json({
                    status: false,
                    message: 'Failed to delete data'
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
    return router
}