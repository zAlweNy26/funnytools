import { displayTable } from "./functions.js"

const CreditCard = {
    Visa: [[40000, 499999], [402600, 402699], [417500, 417599], [450800, 450899], [484400, 484499], [491300, 491399], [491700, 491799]],
    MasterCard: [[222100, 272099], [510000, 559999]]
}

export function isValidCreditCard(number) {
    let checkDigit = number[number.length - 1]
    let genDigit = getLuhnDigit(number.substring(0, number.length - 1))
    console.log(`\x1b[33mLast digit : ${checkDigit} | Generated digit : ${genDigit}\x1b[0m`)
    if (checkDigit == genDigit) console.log("\x1b[32mThe credit card number is valid.\x1b[0m")
    else console.log("\x1b[31mThe credit card number is not valid !\x1b[0m")
}

export function generateCreditCard(amount, options) {
    let currentYear = new Date().getFullYear()
    let type = []
    if ((options.visa != undefined && options.mastercard != undefined)
        || (options.visa == undefined && options.mastercard == undefined)) type = [CreditCard.Visa, CreditCard.MasterCard]
    else if (options.visa != undefined) type = [CreditCard.Visa]
    else if (options.mastercard != undefined) type = [CreditCard.MasterCard]
    let creditCardsNumbers = { "Visa": [], "MasterCard": [] }
    console.time("Credit cards generated in")
    if (type.includes(CreditCard.Visa)) {
        for (let i = 0; i < amount; i++) {
            let firstSixRange = CreditCard.Visa[getRandomNumber(0, 6)]
            let firstSixNumbers = getRandomNumber(firstSixRange[0], firstSixRange[1]).toString()
            let middleNineNumbers = getRandomNumber(0, 999999999).toString()
            let finalNumbers = firstSixNumbers + middleNineNumbers
            finalNumbers += getLuhnDigit(finalNumbers)
            creditCardsNumbers.Visa.push({ 
                Digits: finalNumbers.match(/.{1,4}/g).join(' '),
                Expiration: getRandomNumber(1, 12) + "/" + getRandomNumber(currentYear, currentYear + 5),
                CVV: getRandomNumber(0, 999)
            })
        }
        console.log("\x1b[34mVisa\x1b[0m")
        displayTable(creditCardsNumbers.Visa)
    }
    if (type.includes(CreditCard.MasterCard)) {
        for (let i = 0; i < amount; i++) {
            let firstSixRange = CreditCard.MasterCard[getRandomNumber(0, 1)]
            let firstSixNumbers = getRandomNumber(firstSixRange[0], firstSixRange[1]).toString()
            let middleNineNumbers = getRandomNumber(0, 999999999).toString()
            let finalNumbers = firstSixNumbers + middleNineNumbers
            finalNumbers += getLuhnDigit(finalNumbers)
            creditCardsNumbers.MasterCard.push({ 
                Digits: finalNumbers.match(/.{1,4}/g).join(' '),
                Expiration: getRandomNumber(1, 12) + "/" + getRandomNumber(currentYear, currentYear + 5),
                CVV: getRandomNumber(0, 999)
            })
        }
        console.log("\x1b[31mMaster\x1b[33mCard\x1b[0m")
        displayTable(creditCardsNumbers.MasterCard)
    }
    console.timeEnd("Credit cards generated in")
    //console.log(JSON.stringify(creditCardsNumbers, null, 2))
}

function getLuhnDigit(num) {
    let sum = 0, digit = 0, len = num.length, even = false
    while (len--) {
      digit = Number(num[len])
      sum += (even = !even) ? digit * 2 : digit
    }
    return (sum * 9) % 10
}

function getRandomNumber(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1) + min).toString()
    while (num.length < max.toString().length) num = "0" + num
    return num
}