import { Curve, AXYCurve } from "../finitefield/curves.js";
import { Mod } from "../finitefield/bits.js";

let curve = new Curve(118, 0, 0, 0, 257, 257); //256 points??
console.log("Starting");
curve.createPoints();
console.log("Done: "+ curve.points.length);
curve.G = curve.points[143];//curve.points[Math.floor(Math.random()*curve.points.length)];
// console.log(`G.x: ${curve.G.x}, G.y: ${curve.G.y}.`);

let base = BigInt(curve.points.length);
let charSize = BigInt(256);

let userPrivateKeyHTML = document.getElementById("userPrivateKey");

let users = [];
class User {
    constructor (label) {
        this.label = label; //e.g. "A"
        ///Encrypted text field///
        this.encryptedTextField = document.createElement("input");
        this.encryptedTextField.classList.add("appearance-none", "block", "w-full", "bg-gray-200", "text-gray-700", "border", "border-gray-200", "rounded", "py-3", "px-4", "leading-tight", "focus:outline-none", "focus:bg-white", "focus:border-gray-500");
        this.encryptedTextField.type = "text";
        this.encryptedTextField.id = "encryptedText" + this.label;
        this.encryptedTextField.readOnly = true;
        this.encryptedTextField.placeholder = "Encrypted text";
        this.encryptedTextField.disabled = true;

        ///Decrypted text field///
        this.decryptedTextField = document.createElement("input");
        this.decryptedTextField.classList.add("appearance-none", "block", "w-full", "bg-gray-200", "text-gray-700", "border", "border-gray-200", "rounded", "py-3", "px-4", "leading-tight", "focus:outline-none", "focus:bg-white", "focus:border-gray-500");
        this.decryptedTextField.type = "text";
        this.decryptedTextField.id = "textDecrypted" + this.label;
        this.decryptedTextField.readOnly = true;
        this.decryptedTextField.placeholder = "Decrypted text";
        this.decryptedTextField.disabled = true;

        ///Decrypt message button///
        this.sendMessageButton = document.createElement("button");
        this.sendMessageButton.classList.add("bg-white", "hover:bg-gray-100", "disabled:bg-gray-200", "text-gray-800", "font-semibold", "py-2", "px-4", "border", "border-gray-400", "rounded", "shadow", "inline-flex", "items-center", "mb-10");
        this.sendMessageButton.id = "sendMessage" + this.label;
        this.sendMessageButton.textContent = "Send message";

        this.sendMessageButton.addEventListener("click", (e) => {
            let encryptedMessage = this.encryptedTextField.value;           ///Works????
            let textOut = this.decryptedTextField;
            let decryptedMessage = this.decrypt(curve, encryptedMessage, humanUser);
            textOut.value = decryptedMessage;

            let back = document.createElement("INPUT");
            back.setAttribute("type", "button");
            back.setAttribute("value", "Back");
            back.setAttribute("id", `backButton${this.label}`);
            back.setAttribute("class", "bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow inline-flex items-center mb-1")
            document.getElementById(`titleBox${this.label}`).appendChild(back);

            let next = document.createElement("INPUT"); //Next button goes to 2nd part of visualization
            next.setAttribute("type", "button");
            next.setAttribute("value", "Next");
            next.setAttribute("id", `nextButton${this.label}`);
            next.setAttribute("class", "bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow inline-flex items-center mb-1")
            document.getElementById(`titleBox${this.label}`).appendChild(next);

            /* document.getElementById(`encryption${this.label}`).hidden = true; */
            document.getElementById(`encryptionVisualization${this.label}`).hidden = false;

            e.target.disabled = true;

            encryptionVisualization(this.label);
        });
        /*document.getElementById("sendMessageA").addEventListener("click", () => {
            let encryptedMessage = BigInt(document.getElementById("textPreviewA").value);
            let textOut = document.getElementById("textDecryptedA");
            console.log(encryptedMessage);
            let decryptedMessage = decrypt(curve, encryptedMessage, users[0], users[1]);
            textOut.value = decryptedMessage;
        });*/

        this.privateKey = Math.floor(Math.random() * 100);
        // console.log(this.label + " has private key: " + this.privateKey);
        this.publicKey = curve.calcPointMultiplication(this.privateKey, curve.G);
    }
    insertMessageRecieveHTML () {
        let outerDiv = document.createElement("div");
        outerDiv.classList.add(`basis-1/3`);
        outerDiv.innerHTML = `
            <p class="font-bold text-xl mb-2 text-blue-400">From you to person ${this.label}</p>
            <p id="titleBox${this.label}"></p>
            <div class="flex flex-col gap-1 border-2 border-black rounded-md"
            id="encryptionBox">
                <div class="grow basis-7/8 grid grid-cols-2 p-0.5">
                    <div class="col-span-1 flex flex-col border-2 border-black rounded-md p-0.5">
                        <h1 id="encryption${this.label}"
                        class="basis-1/8 font-bold text-xl mb-2 text-gray-800">Encryption</h1>
                        <div id="innerDivEncryption">
                            <h1 id="encryptionVisualization${this.label}" hidden="True"
                            class="grow basis-7/8 font-bold text-xl mb-2 text-gray-800">lmao</h1>
                            <h1 id="encryptionVisualization${this.label}" 
                            class="grow basis-7/8 font-bold text-xl mb-2 text-gray-800">hej</h1>
                        </div>
                    </div>
                    <div class="col-span-1 flex flex-col border-2 border-black rounded-md p-0.5">
                        <h1 id="decryption${this.label}"
                        class="basis-1/8 font-bold text-xl mb-2 text-gray-800">Decryption</h1>
                        <div id="innerDivDecryption">
                            <h1 id="decryptionVisualization${this.label}" hidden="True"
                            class="grow basis-7/8 font-bold text-xl mb-2 text-gray-800">idiot</h1>
                            <h1 id="decryptionVisualization${this.label}" 
                            class="grow basis-7/8 font-bold text-xl mb-2 text-gray-800">idiot</h1>
                            <h1 id="decryptionVisualization${this.label}" 
                            class="grow basis-7/8 font-bold text-xl mb-2 text-gray-800">idiot</h1>
                        </div>
                    </div>
                </div>
                <div class="basis-1/8 flex flex-row">
                    <div class="basis-1/2 px-0.5 py-1">
                        <input class="border-2 border-black w-full" 
                        type="text" id="textPreview${this.label}temp" readonly="true" placeholder="Encrypted text">
                    </div>
                    <div class="basis-1/2 pr-0.5 pl-0 py-1">
                        <input class="border-2 border-black w-full"
                        type="text" id="textDecrypted${this.label}temp" readonly="true" placeholder="Decrypted text">
                    </div>
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
            let encryptedPoint = encryptBlock(curve, blockValue, this, reciever);
            pointResult.push(encryptedPoint);
            numberResult.push(curve.pointToNumber(encryptedPoint));
        }
        //let pointTextResult = "";
        //pointResult.forEach((e) => {
            //pointTextResult += e.toString() + ","; 
        //});
        //pointTextResult = pointTextResult.slice(0, pointTextResult.length-1);
        //return pointTextResult;
        return JSON.stringify(pointResult);
        return combineLettersToNumber(numberResult, base);     //block3 * 256 ^ blocksize ^ 2 + block2 * 256 ^ blocksize ^ 1 + block1 * 256 ^ blocksize ^ 0
    }
    decrypt (curve, chipherText, sender) {
        let pointArray = JSON.parse(chipherText);
        let result = "";
        let numPoints = BigInt(curve.points.length);
        let blockSize = estLog2BigIntFloor(numPoints)/estLog2BigIntFloor(charSize);    //log__base(points)
        if (blockSize < 1) {
            throw("Not enough points on curve");
        }
        //let blockArr = seperateLettersFromNumber(chipherText, base);
        for (let point of pointArray) {
            //let point = curve.numberToPoint(block);
            let decruptValue = decryptBlock(curve, point, sender, this);
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
}

function createUTF8EncodingTable () {
    //Index from 32 to 127
    let table = document.createElement("table");
    let rowKey = document.createElement("tr");
    let rowValue = document.createElement("tr");
    for (let i = 32; i <= 127; i++) {
        if ((i-32) % 19 === 0) {
            if (rowKey && rowValue && (i !== 32)) {
                table.appendChild(rowKey);
                table.appendChild(rowValue);
            }
            rowKey = document.createElement("tr");
            rowValue = document.createElement("tr");
        }
        let dataCellKey = document.createElement("td");
        dataCellKey.textContent = curve.numberToPoint(i).toString();
        rowKey.appendChild(dataCellKey);
        let dataCellValue = document.createElement("td");
        dataCellValue.textContent = String.fromCharCode(i);
        rowValue.appendChild(dataCellValue);
    }
    return table;
}
document.getElementById("imbeddingTable").replaceWith(createUTF8EncodingTable());   


/*users[0] = {    /// The person using the website.
    privateKey: Math.floor(Math.random() * 100)
};
users[0].publicKey = curve.calcPointMultiplication(users[0].privateKey, curve.G);
userPrivateKeyHTML.textContent = users[0].privateKey;
*/
let humanUser = new User("Human");
users[0] = new User("A");
users[0].insertMessageRecieveHTML();
/* users[1] = new User("B");
users[1].insertMessageRecieveHTML();
users[2] = new User("C");
users[2].insertMessageRecieveHTML(); */
/*users[1] = {
    privateKey: 32,//Math.floor(Math.random() * 100),
};
users[1].publicKey = curve.calcPointMultiplication(users[1].privateKey, curve.G);
users[2] = {
    privateKey: Math.floor(Math.random() * 100),
};
users[2].publicKey = curve.calcPointMultiplication(users[2].privateKey, curve.G);

*/
for (const user of users) {
    document.getElementById(`privatekey-${user.label}`).textContent += user.privateKey;
    console.log(user.publicKey);
    document.getElementById(`publickey-${user.label}`).textContent += user.publicKey.x; //TODO use correct public key
}

let inputField = document.getElementById("messageInput");
/*inputField.addEventListener("input", (event) => {
    let textOut = document.getElementById("textPreview");
    textOut.textContent = event.target.value;
});*/

document.getElementById("inputMessageForm").addEventListener("submit", (Event) => {
    Event.preventDefault();
    for (const user of users) {
        let label = user.label;
        document.getElementById(`sendMessage${label}`).disabled = false;
        if (document.getElementById(`nextButton${label}`)) {
            document.getElementById(`nextButton${label}`).remove();
        }
        if (document.getElementById(`backButton${label}`)) {
            document.getElementById(`backButton${label}`).remove();
        }
        while (document.getElementById("innerDivEncryption").children.length > 0) {
            document.getElementById("innerDivEncryption").removeChild(document.getElementById("innerDivEncryption").children[0])
        }
        while (document.getElementById("innerDivDecryption").children.length > 0) {
            document.getElementById("innerDivDecryption").removeChild(document.getElementById("innerDivDecryption").children[0])
        }
        //remove all childred function maybe?
    }
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


function back(e) {
    let label = e.target.id[e.target.id.length-1];
/*     document.getElementById(`encryption${label}`).hidden = false; */
    document.getElementById(`encryptionVisualization${label}`).hidden = true;
    document.getElementById(`sendMessage${label}`).disabled = false;
    document.getElementById(`nextButton${label}`).remove();
    document.getElementById(`backButton${label}`).remove();
    
}


function next(e) {
    let label = e.target.id[e.target.id.length-1];

/*     document.getElementById(`decryption${label}`).hidden = true; */
    document.getElementById(`decryptionVisualization${label}`).hidden = false;
    document.getElementById(`nextButton${label}`).removeEventListener("click", next);
    document.getElementById(`backButton${label}`).removeEventListener("click", back);
    e.target.style.visibility = "hidden";

    decryptionVisualization(label);
}

function back1(e) {
    let label = e.target.id[e.target.id.length-1];
/*     document.getElementById(`decryption${label}`).hidden = false; */
    document.getElementById(`decryptionVisualization${label}`).hidden = true;
    document.getElementById(`nextButton${label}`).style.visibility = "visible";
    document.getElementById(`backButton${label}`).removeEventListener("click", back1);

    encryptionVisualization(label);
}


function encryptionVisualization(label) {

    // visualization animation from point A to point B with message as point name

    document.getElementById(`backButton${label}`).addEventListener("click", back);
    document.getElementById(`nextButton${label}`).addEventListener("click", next);
}

function decryptionVisualization(label) {

     //visualization animation for part 3 here

    document.getElementById(`backButton${label}`).addEventListener("click", back1);
}
