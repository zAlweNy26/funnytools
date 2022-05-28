import { Console } from "console"
import { Transform } from "stream"
import { URL } from "url"
import path from "path"
import commander from "commander"

export function isValidUrl(str) {
    try {
        new URL(str)
        return str
    } catch (err) { throw new commander.InvalidArgumentError("The inserted url is not valid.") }
}

export function readFile(filepath) {
    if (!fs.existsSync(filepath)) throw new commander.InvalidArgumentError("The inserted file path doesn't exist.")
    else if (fs.statSync(filepath).isDirectory()) throw new commander.InvalidArgumentError('The inserted file path is a directory but the command requires a file.')
    else if (path.extname(filepath) != ".txt") throw new commander.InvalidArgumentError('The inserted file path is not a txt file.')
    return fs.readFileSync(filepath, {encoding:'utf8', flag:'r'})
}

export function convertToInteger(value) {
    let parsedValue = parseInt(value, 10)
    if (isNaN(parsedValue)) throw new commander.InvalidArgumentError('The inserted value is not a valid number.')
    else if (parsedValue < 1) throw new commander.InvalidArgumentError('The inserted value is under the minimum limit of 1.')
    return parsedValue
}

export function displayTable(input) {
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = ''
    for (let row of table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌')
        r = r.replace(/^├─*┼/, '├')
        r = r.replace(/│[^│]*/, '')
        r = r.replace(/^└─*┴/, '└')
        r = r.replace(/'/g, ' ')
        result += `${r}\n`
    }
    console.log(result)
}