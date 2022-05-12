import { HmacSHA256, enc } from "crypto-js";
import { randomBytes } from "crypto";


export function randomETHAddress() {
    var Wallet = require('ethereumjs-wallet');
    return Wallet.default.generate();
}

export function randomBlockhash() {
    return `0x${randomBytes(32).toString('hex')}`
}

// export const seedGenerator = (address: string, buy_blockhash: string, runeId: number, quantityOfFusion: number, fomula: number, lucky: number = 0): string => {
//     if (runeId < 0 || runeId > 11) throw new Error(`runeId must be in range 0 and 11`)

//     return HmacSHA256(`${address}:${buy_blockhash}:${runeId.toString()}:${quantityOfFusion.toString()}:${fomula.toString()}:${lucky.toString()}`, 
//                             runeId.toString()).toString(enc.Hex)
// }


export const seedGenerator = (address: string, buy_blockhash: string, runeId: number, multi_numbers: number, lucky: number = 0): string => {
    if (runeId < 0 || runeId > 11) throw new Error(`runeId must be in range 0 and 11`)

    return HmacSHA256(`${address}:${buy_blockhash}:${runeId.toString()}:${multi_numbers.toString()}:${lucky.toString()}`, 
                            buy_blockhash).toString(enc.Hex)
}


export const seedGeniusGenerator = (before_seed: string, numberTimes : number) : string => {

    return HmacSHA256(before_seed,"0").toString(enc.Hex)
}
