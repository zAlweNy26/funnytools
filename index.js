import fs from "fs"
import { Command } from "commander"
const pjson = JSON.parse(fs.readFileSync("package.json"))

import { isValidUrl, convertToInteger, readFile } from "./functions.js"
import { isValidCreditCard, generateCreditCard } from "./cctool.js"
import { doBruteForce } from "./attacktool.js"
import { generateIBAN, isValidCountryCode, isValidIBAN } from "./ibantool.js"
import { displaySortedScooters, validateSortMode } from "./scooterstool.js"

const program = new Command()
    .version(`v${pjson.version} by zAlweNy26`, '-v, --version', 'Output the current version of the program')
    .configureOutput({ outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`) })
    
program.command("check")
    .argument('<number>', 'the credit card number or iban to validate')
    .option('-c, --cc', 'check if the credit card number is valid')
    .option('-i, --iban', 'check if the iban is valid')
    .description("Check if the credit card number or iban is valid using the luhn algorithm (for cards) or the modulus 97 algorithm (for iban)")
    .action((number, options) => {
        if (options.cc != undefined) isValidCreditCard(number.toString())
        else if (options.iban != undefined) isValidIBAN(number.toString())
        else console.log("\x1b[31mYou must specify either --cc or --iban !\x1b[0m")
    })

program.command("gencard")
    .argument('[amount]', 'the amount of credit cards to generate', convertToInteger, 1)
    .description("Generate a specific amount of credit cards")
    .option('-vs, --visa', 'Generate only Visa credit card numbers')
    .option('-mc, --mastercard', 'Generate only MasterCard credit card numbers')
    .action((amount, options) => {
        if (amount > 50) return console.log("\x1b[31mThe inserted value is above the maximum limit of 50.\x1b[0m")
        generateCreditCard(amount, options)
    })

program.command("geniban")
    .argument('[amount]', 'the amount of ibans to generate', convertToInteger, 1)
    .option('-c, --country <code>', 'the country code using ISO 3166-1 alpha-2', isValidCountryCode)
    .description("Generate a specific amount of ibans optionally for a specific country")
    .action((amount, options) => {
        if (amount > 50) return console.log("\x1b[31mThe inserted value is above the maximum limit of 50.\x1b[0m")
        generateIBAN(amount, options.country)
    })

program.command("bruteforce")
    .argument('<victim>', 'The victim login entry, can be a username, email or phone number')
    .argument('<website>', 'The website where to use the attack', isValidUrl)
    .description("Make a bruteforce attack in the chosen website, optionally with a dictionary")
    .option('-dt, --dictionary <file>', 'The dictionary file path to use for the attack', readFile)
    .action((username, website, options) => doBruteForce(username, website, options.dictionary))

program.command("scooters")
    .argument('<city>', 'The city to check for the list of scooters')
    .argument('<sort>', 'How the program should sort the list of scooters', validateSortMode)
    .description("Display a list of available scooters in a specific city and sort them like you prefer")
    .action((city, sort) => displaySortedScooters(city, sort))

program.parse(process.argv)