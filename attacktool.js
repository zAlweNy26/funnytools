import axios from "axios"
import cheerio from "cheerio"

async function getInputFields(website) {
    // vedere codice instabrute
    const resp = await axios.get(website)
    const $ = cheerio.load(resp.data)
    let passwordField = $("body")
    console.log(passwordField.html())
    return []
}

export async function doBruteForce(username, website, dictionary = undefined) {
    let inputFields = await getInputFields(website)
    if (inputFields.length < 2) return console.log("\x1b[31mCouldn't find a username or password input field.\x1b[0m")
    if (dictionary != undefined) {
        let words = dictionary.split("\r\n")
        words.forEach(w => {
            
        })
    } else {

    }
}