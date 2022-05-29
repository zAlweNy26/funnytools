import fs from "fs"
import commander from "commander"
import emoji from "node-emoji"

import { displayTable, getRandomNumber } from "./functions.js"

const countriesIBANs = JSON.parse(fs.readFileSync("ibans.json"))

var alphaNumerics = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function isValidCountryCode(code) {
    if (!countriesIBANs.some(e => e.countryCode == code.toUpperCase())) 
        throw new commander.InvalidArgumentError("The inserted country code is not valid.")
    return code.toUpperCase()
}

export function isValidIBAN(iban) {
    iban = iban.replace(/\s+/g, '').toUpperCase()
    let ibanCountryCode = iban.substring(0, 2)
    let searchCode = countriesIBANs.find(c => c.countryCode == ibanCountryCode)
    if (searchCode == undefined) return console.log(`\x1b[31mThe IBAN country code does not exist !\x1b[0m`)
    if (iban.length != searchCode.completeLength) return console.log(`\x1b[31mThe IBAN should be ${searchCode.completeLength} characters long !\x1b[0m`)
    let checkDigits = iban.substring(2, 4), genDigits = addCheckDigits(iban).substring(2, 4)
    console.log(`\x1b[33mCurrent check digits : ${checkDigits}\nGenerated check digits : ${genDigits}\x1b[0m`)
    let final = Array.from(iban.substring(4) + iban.substring(0, 4)).map(c => isNaN(c) ? c.charCodeAt(0) - 55 : c).join("")
    if (calculateModule97(final) == 1) console.log("\x1b[32mThis IBAN is valid.\x1b[0m")
    else console.log("\x1b[31mThis IBAN is not valid.\x1b[0m")
}

export function generateIBAN(amount, code) {
    let generatedIBANs = []
    console.time("IBANs generated in")
    while (amount--) {
        let countryCode = code || countriesIBANs[Math.floor(Math.random() * countriesIBANs.length)].countryCode
        let countryInfos = countriesIBANs.find(c => c.countryCode == countryCode)
        let firstFourDigits = countryCode + "00"
        let formatsBBAN = countryInfos.formatBBAN.split(",")
        let otherDigits = ""
        formatsBBAN.forEach(f => {
            let times = parseInt(f)
            let type = f.substring(f.length - 1)
            while (times--) { // https://bank-codes.it/iban/bank/
                if (type == "n") otherDigits += getRandomNumber(0, 9)
                else if (type == "a") otherDigits += String.fromCharCode(getRandomNumber(65, 90))
                else if (type == "c") otherDigits += alphaNumerics[getRandomNumber(0, alphaNumerics.length - 1, false)]
            }
        })
        let finalIBAN = addCheckDigits(firstFourDigits + otherDigits)
        generatedIBANs.push({ 
            Country: countryInfos.countryName,
            SEPA: countryInfos.SEPA ? emoji.get("white_check_mark") : emoji.get("x"),
            IBAN: finalIBAN.match(/.{1,4}/g).join(' ')
        })
    }
    console.log("\x1b[33mGenerated IBANs\n\x1b[0m")
    displayTable(generatedIBANs)
    console.timeEnd("IBANs generated in")
}

function addCheckDigits(iban) {
    let fourDigits = iban.substring(0, 2) + "00"
    let final = Array.from(iban.substring(4) + fourDigits).map(c => isNaN(c) ? c.charCodeAt(0) - 55 : c).join("")
    let checkDigits = (98 - calculateModule97(final)).toString().padStart(2, "0")
    return iban.substring(0, 2) + checkDigits + iban.substring(4)
}

function calculateModule97(str) {
    let checksum = str.slice(0, 2), fragment;
    for (let offset = 2; offset < str.length; offset += 7) {
        fragment = String(checksum) + str.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
}