import fs from "fs"

const countriesIBANs = JSON.parse(fs.readFileSync("ibans.json"))

const lettersNumbers = Array.from({length: 26}, (_, i) => i + 10).reduce((map, num) => {
    map[String.fromCharCode(87 + num)] = num;
    return map;
}, {})

export function isValidIBAN(number, length) {
    if (length != countriesIBANs.filter(c => c.countryCode == number.substring(0, 2))[0].completeLength) 
        console.log("\x1b[31mThe credit card number is not valid !\x1b[0m")
    else console.log("\x1b[32mThe credit card number is valid.\x1b[0m")
}

export function generateIBAN(amount, options) {

}