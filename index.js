import fs from "fs"
import { URL } from "url"
import path from "path"
import commander, { Command } from "commander"
const pjson = JSON.parse(fs.readFileSync("package.json"))

import { checkIsValid, generateCreditCard } from "./cctool.js"
import { doBruteForce } from "./attacktool.js"

function isValidUrl(str) {
    try {
        new URL(str)
        return str
    } catch (err) { throw new commander.InvalidArgumentError("The inserted url is not valid.") }
}

function readFile(filepath) {
    if (!fs.existsSync(filepath)) throw new commander.InvalidArgumentError("The inserted file path doesn't exist.")
    else if (fs.statSync(filepath).isDirectory()) throw new commander.InvalidArgumentError('The inserted file path is a directory but the command requires a file.')
    else if (path.extname(filepath) != ".txt") throw new commander.InvalidArgumentError('The inserted file path is not a txt file.')
    return fs.readFileSync(filepath, {encoding:'utf8', flag:'r'})
}

function convertToInteger(value) {
    let parsedValue = parseInt(value, 10)
    if (isNaN(parsedValue)) throw new commander.InvalidArgumentError('The inserted value is not a valid number.')
    else if (parsedValue < 1) throw new commander.InvalidArgumentError('The inserted value is under the minimum limit of 1.')
    return parsedValue
}

const program = new Command()
    .version(`v${pjson.version} by zAlweNy26 & Flyon32`, '-v, --version', 'Output the current version of the program')
    .configureOutput({ outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`) })
    
program.command("check")
    .argument('<number>', 'the credit card number to validate', convertToInteger)
    .description("Check if the credit card number is valid using the luhn algorithm")
    .action(number => checkIsValid(number.toString()))

program.command("generate")
    .argument('[amount]', 'the amount of credit card to generate', convertToInteger, 1)
    .description("Generate a specific amount of credit cards, hoping that one of them is valid")
    .option('-vs, --visa', 'Generate only Visa credit card numbers')
    .option('-mc, --mastercard', 'Generate only MasterCard credit card numbers')
    .action((amount, options) => {
        if (amount > 50) return console.log("\x1b[31mThe inserted value is above the maximum limit of 50.\x1b[0m")
        generateCreditCard(amount, options)
    })

program.command("bruteforce")
    .argument('<victim>', 'The victim login entry, can be a username, email or phone number')
    .argument('<website>', 'The website where to use the attack', isValidUrl)
    .description("Make a bruteforce attack in the chosen website, optionally with a dictionary")
    .option('-dt, --dictionary <file>', 'The dictionary file path to use for the attack', readFile)
    .action((username, website, options) => doBruteForce(username, website, options.dictionary))

program.parse(process.argv)