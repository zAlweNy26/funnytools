import fs from "fs"
import { Command } from "commander"
const pjson = JSON.parse(fs.readFileSync("package.json"))

import { isValidUrl, convertToInteger, readFile } from "./functions.js"
import { isValidCreditCard, generateCreditCard } from "./cctool.js"
import { doBruteForce } from "./attacktool.js"
import { isValidIBAN } from "./ibantool.js"

const program = new Command()
    .version(`v${pjson.version} by zAlweNy26 & Flyon32`, '-v, --version', 'Output the current version of the program')
    .configureOutput({ outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`) })
    
program.command("check")
    .argument('<number>', 'the credit card number to validate', convertToInteger)
    .description("Check if the credit card number is valid using the luhn algorithm")
    .action(number => isValidCreditCard(number.toString()))

program.command("generate")
    .argument('[amount]', 'the amount of credit card to generate', convertToInteger, 1)
    .description("Generate a specific amount of credit cards")
    .option('-vs, --visa', 'Generate only Visa credit card numbers')
    .option('-mc, --mastercard', 'Generate only MasterCard credit card numbers')
    .action((amount, options) => {
        if (amount > 50) return console.log("\x1b[31mThe inserted value is above the maximum limit of 50.\x1b[0m")
        generateCreditCard(amount, options)
        isValidIBAN("GB82WEST12345698765432", 22)
    })

program.command("bruteforce")
    .argument('<victim>', 'The victim login entry, can be a username, email or phone number')
    .argument('<website>', 'The website where to use the attack', isValidUrl)
    .description("Make a bruteforce attack in the chosen website, optionally with a dictionary")
    .option('-dt, --dictionary <file>', 'The dictionary file path to use for the attack', readFile)
    .action((username, website, options) => doBruteForce(username, website, options.dictionary))

program.parse(process.argv)