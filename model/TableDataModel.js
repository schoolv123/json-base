import CommonFunction from './CommonFunction.js'
const { getName, writeFile, readFile } = CommonFunction
export default class TableData {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.data = readFile(getName(this.id, this.name));
        this.ob = null;
        this.dataId = null;
    }

    getData(id = null, hasCondition = false, condition = () => { }) {
        if (id != null && hasCondition) {
            return this.data.filter((obj) => {
                if (condition(...obj) && obj.id == id) {
                    return obj;
                }
            })
        } else if (id != null) {
            return this.data[id];
        } else if (hasCondition) {
            return this.data.filter((obj) => {
                if (condition(...obj)) {
                    return obj;
                }
            })
        } else {
            return this.data;
        }
    }
    insertData(data) {
        this.ob = {
            id: this.data.length + 1,
            ...data
        }
        this.data.push(this.ob);
        writeFile(getName(this.id, this.name), this.data);
        return this.ob;
    }
    updateData(id, data) {
        this.dataId = this.data[this.data.findIndex(obj => obj.id === id)];
        this.data[this.dataId] = data;
        writeFile(getName(this.id, this.name), this.data);
        return this.data[this.dataId];
    }
    deleteData(id) {
        // this.dataId = this.data[this.data.findIndex(obj => obj.id === id)];
        if (this.data.splice(id, 1)) {
            writeFile(getName(this.id, this.name), this.data);
            return true;
        } else {
            return false;
        }
    }
    searchData(condition) {
        return this.data.filter((obj) => {
            if (condition(...obj)) {
                return obj;
            }
        })
    }
    length() {
        return this.data.length;
    }
}