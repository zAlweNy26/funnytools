import fs from "fs"
import commander from "commander"

const scootersJson = JSON.parse(fs.readFileSync("scooters.json"))

const availableSortModes = ["pot"]

export function validateSortMode(mode) {
    if (availableSortModes.includes(mode)) return mode
    else throw new commander.InvalidArgumentError("The valid sort modes are :\npot (price over time)")
}

export function displaySortedScooters(city, sort) {
    if (Object.keys(scootersJson).map(key => key.toLowerCase()).indexOf(city.toLowerCase()) != -1) {
        let scooters = scootersJson[city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()]
        if (sort === "pot") {
            scooters.sort((a, b) => (a.unlockPrice + a.minutePrice) - (b.unlockPrice + b.minutePrice))
        }
        console.table(scooters.map(s => {
            return {
                Name: s["scooterName"],
                UnlockPrice: s["unlockPrice"],
                MinutePrice: s["minutePrice"],
                PausePrice: s["pausePrice"],
            }
        }))
    }
}