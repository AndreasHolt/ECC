import { Mod, numberOfBits2 } from './bits.js';

export { inversePrime, addField, multiplyField };

function inversePrime(x, mod) { // Enhance later (Double and add /// sqaure and multiply)
    let result = 1;
    const exp = mod - 2;
    let temp = 1 << (numberOfBits2(exp) - 1);
    // for (let i = 0 ; i < mod - 3 ; ++i) {
    //    result = Mod(result * x, mod);
    // }

    while (temp > 0) {
        result = Mod(result * result, mod);
        if (exp & temp) {
            result = Mod(result * x, mod);
        }
        temp >>= 1;
    }
    return result;
}

function addField(val1, val2, mod) {
    return Mod(val1 + val2, mod);
}

function multiplyField(val1, val2, mod) {
    return Mod(val1 * val2, mod);
}
