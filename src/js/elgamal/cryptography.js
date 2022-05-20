import { Point } from '../finitefield/curves';
import { Mod } from '../finitefield/bits';

const charSize = BigInt(256);

function encrypt(curve, message, sender, reciever) {
    const points = [];
    const pointResult = [];
    // const numberResult = [];
    const blockString = [];
    const numPoints = BigInt(curve.points.length);
    const blockSize = estLog2BigIntFloor(numPoints) / estLog2BigIntFloor(charSize); // log__charSize(points)
    if (blockSize < 1) {
        throw new Error('Not enough points on curve');
    }
    let blocks = BigInt(message.length) / blockSize;
    if (blockSize * blocks !== BigInt(message.length)) {
        blocks += 1n;
    }
    for (let i = 0; i < blocks; i += 1) {
        const lastIndexOfMessageInBlock = Math.min((i + 1) * Number(blockSize), message.length);
        const block = message.substring(i * Number(blockSize), lastIndexOfMessageInBlock);
        const charValuesArr = [];
        for (const char of block) {
            charValuesArr.push(char.charCodeAt(0));
        }
        const blockValue = combineNumbersToNumberGivenABase(charValuesArr, charSize); // char3 * 256^2 + char2 * 256^1 + char1 * 256^0
        const point = curve.numberToPoint(blockValue);
        const encryptedPoint = encryptBlock(curve, point, sender, reciever);
        points.push(point);
        blockString.push(block);
        pointResult.push(encryptedPoint);
        // numberResult.push(curve.pointToNumber(encryptedPoint));
    }

    return { encryptedPoints: pointResult, points, blockString };
    // return combineLettersToNumber(numberResult, BigInt(curve.points.length)); points to number.     //block3 * 256 ^ blocksize ^ 2 + block2 * 256 ^ blocksize ^ 1 + block1 * 256 ^ blocksize ^ 0
}
function decrypt(curve, chipherText, sender, reciever) {
    const pointArray = stringToPointList(chipherText);// JSON.parse(chipherText);
    let result = '';
    const numPoints = BigInt(curve.points.length);
    const blockSize = estLog2BigIntFloor(numPoints) / estLog2BigIntFloor(charSize); // log__base(points)
    if (blockSize < 1) {
        throw ('Not enough points on curve');
    }
    // let blockArr = seperateLettersFromNumber(chipherText, BigInt(curve.points.length));
    for (const point of pointArray) {
        // let point = curve.numberToPoint(block);
        const decruptValue = decryptBlock(curve, point, sender, reciever);
        const arrIntVal = seperateNumberIntoArrayOfNumbersGivenABase(decruptValue, charSize);
        arrIntVal.forEach((elem) => {
            result += String.fromCharCode(Number(elem));
        });
        // result += String.fromCharCode(Number(...arrIntVal));
        // arrIntVal.forEach((value) => {result += String.fromCharCode()})
        // return String.fromCharCode();
    }
    return result;
}

// function estLog2BigIntCeil(bigInt) {
//     const bits = BigInt(bigInt.toString(2).length);
//     if (2 ** bits === bigInt) {
//         return bits;
//     }

//     return bits + 1;
// }

function encryptBlock(curve, point, sender, reciever) {
    const akG = curve.calcPointMultiplication(sender.privateKey, reciever.publicKey);
    return curve.calcPointAddition(point, akG);
}

function decryptBlock(curve, point, sender, reciever) {
    const pointAKG = curve.calcPointMultiplication(reciever.privateKey, sender.publicKey);
    const pointPM = curve.calcPointAddition(point, curve.inverseOfPoint(pointAKG));
    return curve.pointToNumber(pointPM);
}

function estLog2BigIntFloor(bigInt) {
    return BigInt(bigInt.toString(2).length - 1);
}

function combineNumbersToNumberGivenABase(numbers, base) {
    let sum = BigInt(0);
    for (let i = BigInt(0); i < numbers.length; i++) {
        const value = BigInt(numbers[i]);
        if (numbers[i] >= base) {
            throw ('The value can not be larger than the base');
        }
        sum += value * (base ** i); // === value * Math.pow(base, i);
    }
    return sum;
}

function seperateNumberIntoArrayOfNumbersGivenABase(number, base) {
    const result = [];
    let i = BigInt(0);
    let val = BigInt(0);
    while ((val = number / (base ** i)) > 0) {
        result.push(Mod(val, base));
        i += 1;
    }
    return result;
}

function pointListToString(list) {
    let result = '';
    for (const element of list) {
        result = `${result + element.toString()}, `;
    }
    return result.substring(0, result.length - 2);
}
function stringToPointList(string) {
    const pointArray = [];
    string = string.replaceAll('(', '');
    string = string.replaceAll(')', '');
    string = string.replaceAll(' ', '');
    const stringArray = string.split(',');
    for (let i = 0; i < stringArray.length; i += 2) {
        const x = Number(stringArray[i]);
        const y = Number(stringArray[i + 1]);
        pointArray.push(new Point(x, y));
    }
    return pointArray;
}

export { encrypt, decrypt, pointListToString };
