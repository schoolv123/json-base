import { Router } from "express"
import Database from "../model/DataBaseModel.js"
const { getDatabase, createDatabase, updateDatabase, deleteDatabase } = Database
export default function DBController() {
    const router = Router();
    router.get('/', function (req, res) {
        let data = getDatabase(null)
        if (data)
            res.json({
                status: true,
                message: "All database",
                data: data
            })
        else
            res.status(400).json({
                status: false,
                message: "Database not found",
                data: null
            })
    })
    router.get('/:dbId', function (req, res) {
        let data = getDatabase(req.params.dbId)
        if (data)
            res.json({
                status: true,
                message: "Single database",
                data: data
            })
        else
            res.status(400).json({
                status: false,
                message: "Invalid database id",
                data: null
            })
    })
    router.post('/', async function (req, res) {
        let data = {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        }
        let create = await createDatabase(data)
        if (create)
            res.json({
                status: true,
                message: "database created successfully",
                body: create
            })
        else
            res.status(400).json({
                status: false,
                message: "database not created",
                data: null
            })
    })
    router.put('/:dbId', async function (req, res) {
        let dbId = parseInt(req.params.dbId)
        let data = {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        }
        let update = await updateDatabase(dbId, data)
        if (update)
            res.json({
                status: true,
                message: "Database updated successfully",
                data: update
            })
        else
            res.status(400).json({
                status: false,
                message: "Database update failed",
                data: null
            })
    })
    router.delete('/:dbId', function (req, res) {
        let dbId = parseInt(req.params.dbId)
        let del = deleteDatabase(dbId)
        if (del) {
            res.json({
                status: true,
                message: 'Database deleted successfully',
                data: del
            })
        } else {
            res.status(400).json({
                status: false,
                message: 'Failed to delete database',
                data: null
            })
        }
    })

    // returnig router
    return router;
}