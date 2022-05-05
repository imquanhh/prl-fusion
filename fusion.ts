import { randomBlockhash, randomETHAddress, seedGenerator } from "./random";

const amountOfFusion = [5, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2]
const formula = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3]
const formulaString = ["Common", "Rare", "Epic", "Legendary"]
const luckyPotion = [10, 10, 10, 10, 10, 10, 10, 7, 7, 5, 5]
const successRateInit = [90, 85, 75, 70, 65, 60, 55, 45, 45, 35, 25]

const getFusionResult = (
    _user: string,
    _fusion_blockhash: string,
    _runeId: number,
    _lucky_potion: number[]
): boolean => {
    if (_runeId < 0 || _runeId > 10) throw new Error(`_runeId must be in range 0 and 10`)

    if (_lucky_potion.length > 1) throw new Error(`_lucky_potion.length must be 0, 1`)

    var lucky = 0;

    if (_lucky_potion.length === 1) {
        lucky = luckyPotion[_lucky_potion[0]];
    }

    var seed = seedGenerator(_user, _fusion_blockhash, _runeId, amountOfFusion[_runeId], formula[_runeId], lucky)

    var prob = parseInt('0x' + seed, 16) % 100

    var rate = successRateInit[_runeId] + lucky

    var successRate = rate > 100 ? 100 : rate

    return prob < successRate ? true : false
}

// const rune = 0;
//const result = getFusionResult(randomETHAddress(), randomBlockhash(), rune, [])
var data = []

for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 10; j++) {
        for (let k = 0; k < 2; k++) {
            var result = getFusionResult(randomETHAddress(), randomBlockhash(), i, k === 0 ? [] : [i, i])

            data.push({
                'rune': i,
                'fusion': amountOfFusion[i],
                'lucky': k,
                'result': result,
            })
        }
    }

}
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'result.csv',
    header: [
        { id: 'rune', title: 'rune' },
        { id: 'fusion', title: 'fusion' },
        { id: 'lucky', title: 'lucky' },
        { id: 'result', title: 'result' },
    ]
});

csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));    
