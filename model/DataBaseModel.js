import CommonFunction from './CommonFunction.js'
import bcrypt from 'bcrypt'
const { rand, writeFile, readFile } = CommonFunction
const DBdata = readFile('dbmetadata.json') ?? []
const writeData = (data) => {
    writeFile('dbmetadata.json', data)
}
const Database = {
    getDatabase: (id = null) => {
        if (id != null) {
            let index = DBdata.findIndex(obj => obj.id == id)
            return DBdata[index] ? DBdata[index] : false
        } else {
            return DBdata ? DBdata : false
        }
    },
    createDatabase: async (body) => {
        let salt = await bcrypt.genSalt(10)
        let id = rand(1000)
        let DBob = {
            id: id,
            name: body.name,
            username: body.username,
            password: body.password,
            identity_token: 'db_' + id + '_' + body.name + '_' + body.username,
            auth_token: await bcrypt.hash(body.password, salt),
        }
        DBdata.push(DBob)
        writeData(DBdata)
        return DBob
    },
    updateDatabase: async (id, body) => {
        let salt = await bcrypt.genSalt(10)
        let encPass = await bcrypt.hash(body.password, salt)
        let DBob = {
            id: id,
            name: body.name,
            username: body.username,
            password: body.password,
            identity_token: 'db_' + id + '_' + body.name + '_' + body.username,
            auth_token: encPass,
        }
        let index = DBdata.findIndex(obj => obj.id === id)
        DBdata[index] = DBob
        writeData(DBdata)
        return DBob
    },
    deleteDatabase: (id) => {
        if (id != null) {
            let index = DBdata.findIndex(obj => obj.id == id)
            let data = DBdata[index]
            if (data.table.length > 0) {
                return false
            } else {
                let del = DBdata.splice(index, 1)
                writeData(DBdata)
                return del ? true : false
            }
        } else {
            return false
        }
    }
}

export default Database