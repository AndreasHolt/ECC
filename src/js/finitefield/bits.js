function numberOfBits2(val) {
    return Math.floor(Math.log2(val)) + 1;
}

function Mod(val, mod) {
    return ((val % mod) + mod) % mod;
}

export { numberOfBits2, Mod };
