import {Mod } from "./bits.js";
export {inversePrime };


function inversePrime (x, mod) {        //Enhance later (Double and add /// sqaure and multiply)
    let result = x;

    for (let i = 0 ; i < mod - 3 ; ++i) {
        result = Mod(result * x, mod);
    }

    return result;
}