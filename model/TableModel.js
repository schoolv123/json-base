import { rand, getName, deleteFile, renameFile, writeFile, readFile } from './CommonFunction.js';
const TableData = readFile('dbmetadata.json');
const Table = {
    // for table CRUD
    getTables: (tableId = null) => {
        if (tableId == null) {
            return TableData ?? [];
        }
        else {
            let id = parseInt(tableId);
            let foundIndex = TableData.findIndex(obj => obj.id === id);
            return TableData[foundIndex];
        }
    },
    getTableByName: (tableName) => {
        if (tableName == null) {
            return false;
        }
        else {
            let foundIndex = TableData.findIndex(obj => obj.name == tableName);
            return TableData[foundIndex] ? TableData[foundIndex] : false;
        }
    },
    createTable: (name, structure) => {
        let tableOb = {
            id: rand(),
            name: name,
            structure: structure,
            createdAt: new Date().toLocaleString(),
        }
        TableData.push(tableOb);
        let meta = writeFile('dbmetadata.json', TableData);
        let create = writeFile(getName(tableOb.id, tableOb.name), []);
        return meta.isFulfilled() && create.isFulfilled() ? tableOb : false;
    },
    updateTable: (tableId, name, structure) => {
        let id = parseInt(tableId);
        let tableOb = {
            id: id,
            name: name,
            structure: structure
        }
        //find table index
        let foundIndex = TableData.findIndex(obj => obj.id === id);
        //rename table file
        let prevOb = TableData[foundIndex];
        let rename = renameFile(getName(prevOb.id, prevOb.name), getName(tableOb.id, tableOb.name));
        //rewrite table data
        TableData[foundIndex] = tableOb;
        let write = writeFile('dbmetadata.json', TableData);
        return rename.isFulfilled() && write.isFulfilled() ? tableOb : false;
    },
    deleteTable: (tableId) => {
        let id = parseInt(tableId);
        let foundIndex = TableData.findIndex(obj => obj.id === id);
        let tablename = TableData[foundIndex].name ?? null;
        // return foundIndex;
        if (TableData.splice(foundIndex, 1)) {
            return deleteFile(getName(id, tablename)).isFulfilled() && writeFile('dbmetadata.json', TableData).isFulfilled() ? true : false;
        }
        else {
            return false;
        }
    },
    totalTable: () => {
        return TableData.length;
    }
}

//default export
export default Table;