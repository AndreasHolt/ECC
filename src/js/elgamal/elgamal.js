import { createCurveAXY, createCurveABCD, calcPointAdditionPrime, calcPointAdditionGF2 } from "../finitefield/curves.js";
import { Mod } from "../finitefield/bits.js";

let curve = createCurveABCD(118, 0, 0, 0, 257, 257, calcPointAdditionPrime); //256 points??
curve.createPoints();
curve.G = curve.points[143];//curve.points[Math.floor(Math.random()*curve.points.length)];
console.log(`G.x: ${curve.G.x}, G.y: ${curve.G.y}.`);

let base = BigInt(256);

let userPrivateKeyHTML = document.getElementById("userPrivateKey");

let users = [];
class User {
    constructor (label) {
        this.label = label; //e.g. "A"
        ///Encrypted text field///
        this.encryptedTextField = document.createElement("input");
        this.encryptedTextField.classList.add("border-2");
        this.encryptedTextField.classList.add("border-black");
        this.encryptedTextField.classList.add("w-6/12");
        this.encryptedTextField.type = "text";
        this.encryptedTextField.id = "encryptedText" + this.label;
        this.encryptedTextField.readOnly = true;
        this.encryptedTextField.placeholder = "Encrypted text";

        ///Decrypted text field///
        this.decryptedTextField = document.createElement("input");
        this.decryptedTextField.classList.add("border-2");
        this.decryptedTextField.classList.add("border-black");
        this.decryptedTextField.classList.add("w-full");
        this.decryptedTextField.type = "text";
        this.decryptedTextField.id = "textDecrypted" + this.label;
        this.decryptedTextField.readOnly = true;
        this.decryptedTextField.placeholder = "Decrypted text";

        ///Decrypt message button///
        this.sendMessageButton = document.createElement("button");
        this.sendMessageButton.classList.add("border-2");
        this.sendMessageButton.classList.add("rounded-md");
        this.sendMessageButton.classList.add("border-slate-700");
        this.sendMessageButton.id = "sendMessage" + this.label;
        this.sendMessageButton.textContent = "Send message";

        this.sendMessageButton.addEventListener("click", () => {
            let encryptedMessage = BigInt(this.encryptedTextField.value);           ///Works????
            let textOut = this.decryptedTextField;
            let decryptedMessage = this.decrypt(curve, encryptedMessage, humanUser);
            textOut.value = decryptedMessage;
        });
        /*document.getElementById("sendMessageA").addEventListener("click", () => {
            let encryptedMessage = BigInt(document.getElementById("textPreviewA").value);
            let textOut = document.getElementById("textDecryptedA");
            console.log(encryptedMessage);
            let decryptedMessage = decrypt(curve, encryptedMessage, users[0], users[1]);
            textOut.value = decryptedMessage;
        });*/

        this.privateKey = Math.floor(Math.random() * 100);
        console.log(this.label + " has private key: " + this.privateKey);
        this.publicKey = curve.calcPointMultiplication(this.privateKey, curve.G);
    }
    insertMessageRecieveHTML () {
        let outerDiv = document.createElement("div");
        outerDiv.classList.add("basis-1/3");
        outerDiv.innerHTML = `
            <p class="font-bold text-xl mb-2 text-blue-400">From you to person ${this.label}</p>
            <div class="grid grid-cols-3 grid-rows-5 gap-1 border-4 border-black rounded-md">
                <div class="col-span-3 row-span-4 flex flex-row p-0.5 space-x-1">
                    <div class="basis-1/3 flex border-2 border-black rounded-md items-center p-0.5">
                        <h1 class="font-bold text-xl mb-2 text-gray-800">Encryption</h1>
                    </div>
                    <div class="basis-1/3 flex border-2 border-black rounded-md items-center p-0.5">
                        <h1 class="font-bold text-xl mb-2 text-gray-800">Public communication</h1>
                    </div>
                    <div class="basis-1/3 flex border-2 border-black rounded-md items-center p-0.5">
                        <h1 class="font-bold text-xl mb-2 text-gray-800">Decryption</h1>
                    </div>
                </div>
                <div class="col-span-2 px-0.5 py-1">
                    <input class="border-2 border-black w-6/12" 
                    type="text" id="textPreview${this.label}temp" readonly="true" placeholder="Encrypted text">
                </div>
                <div class="pr-0.5 pl-0 py-1">
                    <input class="border-2 border-black w-full"
                    type="text" id="textDecrypted${this.label}temp" readonly="true" placeholder="Decrypted text">
                </div>
            </div>
            <div class="p-0.5">
                <button class="border-2 rounded-md border-slate-700"
                id="sendMessage${this.label}temp" >Send message</button>
            </div>
        `;
        document.getElementById("communication").appendChild(outerDiv);
        document.getElementById(`textPreview${this.label}temp`).replaceWith(this.encryptedTextField);
        document.getElementById(`textDecrypted${this.label}temp`).replaceWith(this.decryptedTextField);
        document.getElementById(`sendMessage${this.label}temp`).replaceWith(this.sendMessageButton);
    }
    encrypt (curve, message, reciever) {
        let pointResult = [];
        let numberResult = [];
        for (let char of message) {
            let encryptedPoint = encryptBlock(curve, char, this, reciever);
            pointResult.push(encryptedPoint);
            console.log(char);
            numberResult.push(curve.pointToNumber(encryptedPoint));
        }
        return combineLettersToNumber(numberResult, base);
    }
    decrypt (curve, number, sender) {
        let result = "";
        let valuesArr = seperateLettersFromNumber(number, base);
        for (let val of valuesArr) {
            result += decryptBlock(curve, curve.numberToPoint(val), sender, this);
        }
        return result;
    }
}




/*users[0] = {    /// The person using the website.
    privateKey: Math.floor(Math.random() * 100)
};
users[0].publicKey = curve.calcPointMultiplication(users[0].privateKey, curve.G);
userPrivateKeyHTML.textContent = users[0].privateKey;
*/
let humanUser = new User("Human");
users[0] = new User("A");
users[0].insertMessageRecieveHTML();
users[1] = new User("B");
users[1].insertMessageRecieveHTML();
users[2] = new User("C");
users[2].insertMessageRecieveHTML();
/*users[1] = {
    privateKey: 32,//Math.floor(Math.random() * 100),
};
users[1].publicKey = curve.calcPointMultiplication(users[1].privateKey, curve.G);
users[2] = {
    privateKey: Math.floor(Math.random() * 100),
};
users[2].publicKey = curve.calcPointMultiplication(users[2].privateKey, curve.G);

*/

let inputField = document.getElementById("messageInput");
/*inputField.addEventListener("input", (event) => {
    let textOut = document.getElementById("textPreview");
    textOut.textContent = event.target.value;
});*/

document.getElementById("inputMessageForm").addEventListener("submit", (Event) => {
    Event.preventDefault();
    for (let user of users) {
        let textOut = document.getElementById("encryptedText" + user.label);
        let encryptedText = humanUser.encrypt(curve, inputField.value, user);
        textOut.value = encryptedText;
    }
});
document.getElementById("newKeyButton").addEventListener("click", () => {
    humanUser.privateKey = Math.floor(Math.random() * 100);
    humanUser.publicKey = curve.calcPointMultiplication(humanUser.privateKey, curve.G);
    userPrivateKeyHTML.textContent = humanUser.privateKey;
});
/*document.getElementById("sendMessageA").addEventListener("click", () => {
    let encryptedMessage = BigInt(document.getElementById("textPreviewA").value);
    let textOut = document.getElementById("textDecryptedA");
    console.log(encryptedMessage);
    let decryptedMessage = decrypt(curve, encryptedMessage, users[0], users[1]);
    textOut.value = decryptedMessage;
});*/





function encryptBlock (curve, char, sender, reciever) {
    let pointMessage = curve.numberToPoint(char.charCodeAt(0));
    let akG = curve.calcPointMultiplication(sender.privateKey, reciever.publicKey);
    let point = curve.calcPointAddition(pointMessage, akG);

    return point;
}



function decryptBlock (curve, point, sender, reciever) {
    let pointAKG = curve.calcPointMultiplication(reciever.privateKey, sender.publicKey);
    let pointPM = curve.calcPointAddition(point, curve.inverseOfPoint(pointAKG));
    return String.fromCharCode(curve.pointToNumber(pointPM));
}


function combineLettersToNumber (numbers, base) {
    let sum = BigInt(0);
    for(let i = BigInt(0); i < numbers.length; i++) {
        let value = BigInt(numbers[i]);
        sum += value * (base ** i);//Math.pow(base, i);
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


