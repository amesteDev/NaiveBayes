const fs = require('fs')
const csv = require('csv-parser')

class Load {
    /**Loads the data in the given file and transforms it to an array */
    load = async (file) => {
        let parseData = []
        await new Promise((resolve) => {
            fs.createReadStream(file)
                .pipe(csv({ separator: ',' }))
                .on('data', (data) => {
                    let curArr = []
                    for (let [key, value] of Object.entries(data)) {
                        if (!isNaN(value)) {
                            value = parseFloat(value)
                        }
                        curArr.push(value)
                    }
                    parseData.push(curArr)
                })
                .on('finish', () => {
                    resolve()
                })
        })
        return parseData
    }

    /**Creates a lookup-table for the labels, and transforms strings to ints */
    createLookup(data) {
        let uni = new Set()
        let lookup = {}

        for (let i = 0; i < data.length; i++) {
            let cur = data[i]
            uni.add(cur[cur.length - 1])
        }
        let idx = 0

        for (let value of uni) {
            lookup[value] = idx
            idx++
        }
        for (let k = 0; k < data.length; k++) {
            let cur = data[k]
            cur[cur.length - 1] = lookup[cur[cur.length - 1]]
        }

        return lookup
    }
}
module.exports = Load
