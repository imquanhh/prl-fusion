import { randomInt } from "crypto";
import Decimal from "decimal.js";
import { ReadVResult } from "fs";
import { randomBlockhash, randomETHAddress, seedGenerator, seedGeniusGenerator } from "./random";

const amountOfFusion = [5, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2]
const formula = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3]
const formulaString = ["Common", "Rare", "Epic", "Legendary"]
const luckyPotion = [10, 10, 10, 10, 10, 10, 10, 7, 7, 5, 5]
const successRateInit = [90, 85, 75, 70, 65, 60, 55, 45, 45, 35, 25]

const getFusionResult = (
    _user: string,
    _fusion_blockhash: string,
    _runeId: number,
    _lucky_potion: number[],
    fusion_times: number
): boolean[] => {
    if (_runeId < 0 || _runeId > 10) throw new Error(`_runeId must be in range 0 and 10`)

    if (_lucky_potion.length > 1) throw new Error(`_lucky_potion.length must be 0, 1`)

    var lucky = 0;

    if (_lucky_potion.length === 1) {
        lucky = luckyPotion[_lucky_potion[0]];
    }
    var results = []
    var rate = successRateInit[_runeId] + lucky
    var successRate = rate > 100 ? 100 : rate
    for (let i=0; i< fusion_times; i++){
        var seed = seedGenerator(_user, _fusion_blockhash, _runeId, i, lucky)
        var prob = GetIntBySeed(seed,100)
        results.push(prob < successRate ? true : false)
    }
    return results
}

function GetIntBySeed(seed: string, max_mod: number) {
    let rd_num = new Decimal(`0x` + seed).mod(max_mod).toNumber();
    return rd_num;
}

var data = []
for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 200; j++) {
        // console.log('Số lần %d', j)
        for (let k = 0; k < 2; k++) {
            var fusion_times = randomInt(1,100)
            var result = getFusionResult(randomETHAddress(), randomBlockhash(), i, k === 0 ? [] : [i], fusion_times)
            const _result = result.filter((elment) => elment === true)
            // console.log(result)
            data.push({
                'rune': i,
                'fusion_formula': amountOfFusion[i],
                'lucky': k,
                'times': fusion_times,
                'result': _result.length
            })
        }
    }

}
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'result.csv',
    header: [
        { id: 'rune', title: 'rune' },
        { id: 'fusion_formula', title: 'fusion' },
        { id: 'lucky', title: 'lucky' },
        { id: 'times', title: 'fusion_times'},
        { id: 'result', title: 'result' }
    ]
});

csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));    
