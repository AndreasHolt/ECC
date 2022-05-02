import {Mod, numberOfBits2 } from "./bits.js";
export {inversePrime };


function inversePrime (x, mod) {        //Enhance later (Double and add /// sqaure and multiply)
    let result = 1;
    let exp = mod - 4;
    let temp = 1 << (numberOfBits2(exp) - 1);

    //for (let i = 0 ; i < mod - 3 ; ++i) {
    //    result = Mod(result * x, mod);
    //}

    while (temp > 0) {
        result = Mod(result * result, mod);
        if (exp & temp) {
            result = Mod(result * x, mod);
        }
        temp = temp >> 1;
    }

    return result;
}