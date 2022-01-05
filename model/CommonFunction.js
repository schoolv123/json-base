import fs, { promises as pfs } from 'fs'
const pathName = 'database/'
const CommonFunction = {
    rand: (length = 100) => {
        return Math.floor((Math.random() * 100000) + length)
    },
    writeFile: async (name, data = []) => {
        let fileName = pathName + name
        let promise = await pfs.writeFile(fileName, JSON.stringify(data), (err) => {
            if (err) {
                throw err
            }
        })
    },
    readFile: (name) => {
        pfs.readFile(pathName + name)
        let FileData = fs.readFileSync(pathName + name, 'utf8')
        let data = JSON.parse(FileData)
        return data ? data : []
    },
    deleteFile: async (name) => {
        let del = await pfs.unlink(pathName + name, (err) => {
            if (err) {
                throw err
            }
        })
    },
    renameFile: async (oldName, newName) => {
        let rename = await pfs.rename(pathName + oldName, pathName + newName, (err) => {
            if (err) {
                throw err
            }
        })
    },
    getName: (id, name) => {
        return id + '-' + name + '.json';
    }
}

export default CommonFunction