import { Router } from "express"
import Table from "../model/TableModel.js"
import Database from "../model/DataBaseModel.js"
const { getTables, getTableByName, createTable, deleteTable, updateTable } = Table
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
    if (validate) {
        req.db = validate
        next()
    } else {
        res.status(401).json({
            status: false,
            message: "Invaild credential",
            data: credentials
        })
    }
}
export default function TableController() {
    const router = Router()
    router.use(middleware)
    router.get("/", (req, res) => {
        res.json({
            status: true,
            message: "All tables",
            data: getTables(null)
        })
    })
    router.get("/:tableId", (req, res) => {
        res.json({
            status: true,
            message: "All tables",
            tableId: req.params.tableId,
            data: getTables(req.params.tableId)
        })
    })
    router.post("/", (req, res) => {
        let tableName = req.body.name
        let tableStructure = req.body.structure
        if (getTableByName(tableName)) {
            res.status(400).json({
                status: false,
                message: "Table name already exists",
                data: req.body
            })
        } else {
            let parentId = req.db.id ?? 0
            res.status(201).json({
                status: true,
                message: "Success table created",
                // data: req.body
                data: createTable(tableName, tableStructure, parentId)
            })
        }
    })
    router.put("/:tableId", (req, res) => {
        let tableId = parseInt(req.params.tableId)
        let parentId = parseInt(req.db.id)
        let body = req.body
        res.json({
            status: true,
            message: "All tables",
            data: updateTable(tableId, parentId, body.name, body.structure)
        })
    })
    router.delete("/:tableId", (req, res) => {
        let deleteStatus = deleteTable(req.params.tableId)
        // let deleteStatus = req.params.tableId
        let resOb = {
            status: deleteStatus,
            data: getTables()
        }
        if (deleteStatus) {
            resOb = {
                ...resOb,
                message: "Table deleted"
            }
        } else {
            resOb = {
                ...resOb,
                message: "Table delete failed"
            }
        }
        res.json(resOb)
    })
    return router
}