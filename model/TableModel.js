import CommonFunction from './CommonFunction.js';
const { rand, getName, deleteFile, renameFile, writeFile, readFile } = CommonFunction
const TableData = readFile('tablemetadata.json');
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
    createTable: (name, structure, parentId) => {
        let tableOb = {
            id: rand(),
            name: name,
            parentId: parentId,
            structure: structure,
            createdAt: new Date().toLocaleString(),
        }
        TableData.push(tableOb);
        //write meta data
        writeFile('tablemetadata.json', TableData);
        //create table
        writeFile(getName(tableOb.id, tableOb.name), []);
        return tableOb;
    },
    updateTable: (tableId, parentId, name, structure) => {
        let tableOb = {
            id: tableId,
            parentId: parentId,
            name: name,
            structure: structure
        }
        console.log(TableData)
        console.log(tableOb)
        //find table index
        let index = TableData.findIndex(obj => obj.id == tableId && obj.parentId == parentId);
        if (index == -1)
            return false
        else {
            let prevOb = TableData[index];
            //rename table
            renameFile(getName(prevOb.id, prevOb.name), getName(tableId, tableOb.name));
            //rewrite table data
            let updatedOb = { ...prevOb, ...tableOb };
            TableData[index] = updatedOb
            writeFile('tablemetadata.json', TableData);
            return updatedOb;
        }
    },
    deleteTable: (tableId) => {
        let id = parseInt(tableId);
        let index = TableData.findIndex(obj => obj.id === id);
        if (index == -1) {
            return false
        } else {
            let tablename = TableData[index].name ?? null;
            console.log(TableData)
            console.log(TableData[index])
            // return index;
            if (TableData.splice(index, 1)) {
                deleteFile(getName(id, tablename))
                writeFile('tablemetadata.json', TableData)
                return true
            }
            else {
                return false
            }
        }
    },
    totalTable: () => {
        return TableData.length;
    }
}

//default export
export default Table;