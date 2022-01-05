import { Router } from "express";
import Table from "../model/TableModel.js";
const { getTables, getTableByName, createTable, deleteTable, updateTable } = Table;
const middleware = (req, res, next) => {
    console.log(req.headers)
    next();
}
export default function TableController() {
    const router = Router();
    router.use(middleware)
    router.get("/", (req, res) => {
        res.json({
            status: true,
            message: "All tables",
            data: getTables(null) ?? {}
        });
    });
    router.get("/:tableId", (req, res) => {
        res.json({
            status: true,
            message: "All tables",
            tableId: req.params.tableId,
            data: getTables(req.params.tableId)
        });
    });
    router.put("/:tableId", (req, res) => {
        let tableId = req.params.tableId;
        let body = req.body;
        res.json({
            status: true,
            message: "All tables",
            data: updateTable(tableId, body.name, body.structure)
        });
    });
    router.delete("/:tableId", (req, res) => {
        let deleteStatus = deleteTable(req.params.tableId);
        // let deleteStatus = req.params.tableId;
        let resOb = {
            status: deleteStatus,
            data: getTables()
        };
        if (deleteStatus) {
            resOb = {
                ...resOb,
                message: "Table deleted"
            };
        } else {
            resOb = {
                ...resOb,
                message: "Table delete failed"
            }
        }
        res.json(resOb);
    });
    router.post("/", (req, res) => {
        let tableName = req.body.name;
        let tableStructure = req.body.structure;
        if (getTableByName(tableName)) {
            res.status(400).json({
                status: false,
                message: "Table name already exists",
                data: req.body
            });
        } else {
            res.status(201).json({
                status: true,
                message: "Success table created",
                // data: req.body
                data: createTable(tableName, tableStructure)
            });
        }
    });


    return router;
}