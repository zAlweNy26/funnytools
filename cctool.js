import { displayTable, getRandomNumber } from "./functions.js"

const CreditCard = {
    Visa: [[40000, 499999], [402600, 402699], [417500, 417599], [450800, 450899], [484400, 484499], [491300, 491399], [491700, 491799]],
    MasterCard: [[222100, 272099], [510000, 559999]]
}

export function isValidCreditCard(number) {
    number = number.replace(/\s+/g, '')
    let checkDigit = number[number.length - 1], genDigit = getLuhnDigit(number.substring(0, number.length - 1))
    console.log(`\x1b[33mCurrent last digit : ${checkDigit}\nGenerated last digit : ${genDigit}\x1b[0m`)
    if (checkDigit == genDigit) console.log("\x1b[32mThis credit card number is valid.\x1b[0m")
    else console.log("\x1b[31mThis credit card number is not valid !\x1b[0m")
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
            let firstSixDigits = getRandomNumber(firstSixRange[0], firstSixRange[1]).toString()
            let middleNineDigits = getRandomNumber(0, 999999999).toString()
            let finalDigits = firstSixDigits + middleNineDigits
            finalDigits += getLuhnDigit(finalDigits)
            creditCardsNumbers.Visa.push({ 
                Digits: finalDigits.match(/.{1,4}/g).join(' '),
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
            let firstSixDigits = getRandomNumber(firstSixRange[0], firstSixRange[1]).toString()
            let middleNineDigits = Array.from({length: 9}, (_, i) => getRandomNumber(0, 9)).join("")
            let finalDigits = firstSixDigits + middleNineDigits
            finalDigits += getLuhnDigit(finalDigits)
            creditCardsNumbers.MasterCard.push({ 
                Digits: finalDigits.match(/.{1,4}/g).join(' '),
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
    let a = 0
    for (let i = 0; i < num.length; i++) a += parseInt(num.substring(i, i + 1))
    let n = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0]
    for (let i = num.length - 1; i >= 0; i -= 2) {
        let t = parseInt(num.substring(i, i + 1)), r = n[t]
        a += r
    }
    let s = a % 10
    return s = 10 - s, 10 == s && (s = 0), s
}