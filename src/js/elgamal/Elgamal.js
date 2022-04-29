import { createCurveAXY, createCurveABCD, calcPointAdditionPrime, calcPointAdditionGF2 } from "../finiteField/curves.js";
import { Mod } from "../finiteField/Bits.js";

let curve = createCurveABCD(118, 0, 0, 0, 131, 131, calcPointAdditionPrime); //140 points
curve.createPoints();
curve.G = curve.points[15];//curve.points[Math.floor(Math.random()*curve.points.length)];
console.log(`G.x: ${curve.G.x}, G.y: ${curve.G.y}.`);

let base = 256;

let userPrivateKeyHTML = document.getElementById("userPrivateKey");
let users = [];
users[0] = {    /// The person using the website.
    privateKey: Math.floor(Math.random() * 100)
};
users[0].publicKey = curve.calcPointMultiplication(users[0].privateKey, curve.G);
userPrivateKeyHTML.textContent = users[0].privateKey;

users[1] = {
    privateKey: 32,//Math.floor(Math.random() * 100),
};
users[1].publicKey = curve.calcPointMultiplication(users[1].privateKey, curve.G);
users[2] = {
    privateKey: Math.floor(Math.random() * 100),
};
users[2].publicKey = curve.calcPointMultiplication(users[2].privateKey, curve.G);



let inputField = document.getElementById("messageInput");
/*inputField.addEventListener("input", (event) => {
    let textOut = document.getElementById("textPreview");
    textOut.textContent = event.target.value;
});*/

document.getElementById("inputMessageForm").addEventListener("submit", (Event) => {
    Event.preventDefault();
    let textOut = document.getElementById("textPreview");
    console.log(inputField.value);
    let encryptedText = encrypt(curve, inputField.value, users[0], users[1]);
    console.log(encryptedText);
    textOut.value = encryptedText;
});
document.getElementById("newKeyButton").addEventListener("click", () => {
    users[0].privateKey = 25;//Math.floor(Math.random() * 100);
    users[0].publicKey = curve.calcPointMultiplication(users[0].privateKey, curve.G);
    userPrivateKeyHTML.textContent = users[0].privateKey;
});
document.getElementById("sendMessage").addEventListener("click", () => {
    let encryptedMessage = document.getElementById("textPreview").value;
    let textOut = document.getElementById("textDecrypted");
    console.log(encryptedMessage);
    let decryptedMessage = decrypt(curve, encryptedMessage, users[0], users[1]);
    textOut.value = decryptedMessage;
});



function encrypt (curve, message, sender, reciever) {
    let pointResult = [];
    let numberResult = [];
    for (let char of message) {
        let encryptedPoint = encryptBlock(curve, char, sender, reciever);
        pointResult.push(encryptedPoint);
        numberResult.push(curve.pointToNumber(encryptedPoint));
    }
    return combineLettersToNumber(numberResult, base);
}

function encryptBlock (curve, char, sender, reciever) {
    let pointMessage = curve.numberToPoint(char.charCodeAt(0));
    let akG = curve.calcPointMultiplication(sender.privateKey, reciever.publicKey);
    let point = curve.calcPointAddition(pointMessage, akG);

    return point;
}

function decrypt (curve, number, sender, reciever) {
    let result = "";
    let valuesArr = seperateLettersFromNumber(number, base);
    for (let val of valuesArr) {
        result += decryptBlock(curve, curve.numberToPoint(val), sender, reciever);
    }
    return result;
}


function decryptBlock (curve, point, sender, reciever) {
    let pointAKG = curve.calcPointMultiplication(reciever.privateKey, sender.publicKey);
    let pointPM = curve.calcPointAddition(point, curve.inverseOfPoint(pointAKG));
    return String.fromCharCode(curve.pointToNumber(pointPM));
}


function combineLettersToNumber (numbers, base) {
    let sum = 0
    for(let i = 0; i < numbers.length; i++) {
        let value = numbers[i];
        sum += value * Math.pow(base, i);
    }
    return sum;
}

function seperateLettersFromNumber (number, base) {
    let result = [];
    let i = 0;
    let val;
    while ((val = Math.floor(number / Math.pow(base,i))) > 0) {
        result.push(Mod(val,base));
        i++;
    }
    return result;
}


