import {Point} from "../finitefield/curves.js";
import { Mod } from "../finitefield/bits.js";


let charSize = BigInt(256);

function encrypt (curve, message, sender, reciever) {
    let pointResult = [];
    let numberResult = [];
    let blockIndex = [];
    let numPoints = BigInt(curve.points.length);
    let blockSize = estLog2BigIntFloor(numPoints)/estLog2BigIntFloor(charSize);    //log__charSize(points)
    if (blockSize < 1) {
        throw("Not enough points on curve");
    }
    let blocks = BigInt(message.length) / blockSize;
    if (blockSize * blocks !== BigInt(message.length)) {
        blocks = blocks + 1n;
    }
    for (let i = 0; i < blocks; i++) {
        let lastIndexOfMessageInBlock = Math.min((i+1)*Number(blockSize), message.length);
        let block = message.substring(i*Number(blockSize), lastIndexOfMessageInBlock);
        let charValuesArr = [];
        for (let char of block) {
            charValuesArr.push(char.charCodeAt(0));
        }
        let blockValue = combineLettersToNumber(charValuesArr, charSize);    //char3 * 256^2 + char2 * 256^1 + char1 * 256^0
        let encryptedPoint = encryptBlock(curve, blockValue, sender, reciever);
        blockIndex.push(blockValue);
        pointResult.push(encryptedPoint);
        numberResult.push(curve.pointToNumber(encryptedPoint));
    }
    //let pointTextResult = "";
    //pointResult.forEach((e) => {
        //pointTextResult += e.toString() + ","; 
    //});
    //pointTextResult = pointTextResult.slice(0, pointTextResult.length-1);
    //return pointTextResult;
    return {encryptedPoints: pointListToString(pointResult)/*JSON.stringify(pointResult)*/, blocks: blockIndex };
    //return combineLettersToNumber(numberResult, BigInt(curve.points.length));     //block3 * 256 ^ blocksize ^ 2 + block2 * 256 ^ blocksize ^ 1 + block1 * 256 ^ blocksize ^ 0
}
function decrypt (curve, chipherText, sender, reciever) {
    let pointArray = stringToPointList(chipherText);// JSON.parse(chipherText);
    let result = "";
    let numPoints = BigInt(curve.points.length);
    let blockSize = estLog2BigIntFloor(numPoints)/estLog2BigIntFloor(charSize);    //log__base(points)
    if (blockSize < 1) {
        throw("Not enough points on curve");
    }
    //let blockArr = seperateLettersFromNumber(chipherText, BigInt(curve.points.length));
    for (let point of pointArray) {
        //let point = curve.numberToPoint(block);
        let decruptValue = decryptBlock(curve, point, sender, reciever);
        let arrIntVal = seperateLettersFromNumber(decruptValue, charSize);
        arrIntVal.forEach((elem)=> {
            result += String.fromCharCode(Number(elem));
        });
        //result += String.fromCharCode(Number(...arrIntVal));
        //arrIntVal.forEach((value) => {result += String.fromCharCode()})
        //return String.fromCharCode();
    }
    return result;
}

function encryptBlock (curve, number, sender, reciever) {
    let pointMessage = curve.numberToPoint(number);
    let akG = curve.calcPointMultiplication(sender.privateKey, reciever.publicKey);
    let encryptedPoint = curve.calcPointAddition(pointMessage, akG);

    return encryptedPoint;
}

function decryptBlock (curve, point, sender, reciever) {
    let pointAKG = curve.calcPointMultiplication(reciever.privateKey, sender.publicKey);
    let pointPM = curve.calcPointAddition(point, curve.inverseOfPoint(pointAKG));
    return curve.pointToNumber(pointPM);
}

function estLog2BigIntCeil(bigInt) {
    let bits = BigInt(bigInt.toString(2).length);
    if (2 ** bits === bigInt) {
        return bits;
    } else {
        return bits + 1;
    }
    return 
}

function estLog2BigIntFloor(bigInt) {
    return BigInt(bigInt.toString(2).length-1);
}

function combineLettersToNumber (numbers, base) {
    let sum = BigInt(0);
    for(let i = BigInt(0); i < numbers.length; i++) {
        let value = BigInt(numbers[i]);
        if (numbers[i] >= base) {
            throw("The value can not be larger than the base");
        }
        sum += value * (base ** i); // === value * Math.pow(base, i);
    }
    return sum;
}

function seperateLettersFromNumber (number, base) {
    let result = [];
    let i = BigInt(0);
    let val = BigInt(0);
    while ((val = number / (base ** i)) > 0) {
        result.push(Mod(val,base));
        i++;
    }
    return result;
}

function pointListToString (list) {
    let result = ``;
    for (let element of list) {
        result = result + `(${element.x},${element.y}), `;
    }
    result = result.substring(0, result.length - 2);
    return result;
}
function stringToPointList (string) {
    let pointArray = [];
    string = string.replaceAll("(", "");
    string = string.replaceAll(")","");
    string = string.replaceAll(" ","");
    let stringArray = string.split(",");
    for (let i = 0; i < stringArray.length; i+=2) {
        let x = Number(stringArray[i]);
        let y = Number(stringArray[i+1]);
        pointArray.push(new Point(x,y));
    }
    return pointArray;
}

export {encrypt, decrypt}

