import { Curve, AXYCurve } from "../finitefield/curves.js";
import {User} from "./user.js";
import {encrypt, decrypt, pointListToString} from "./cryptography.js";

let curve = new Curve(118, 0, 0, 0, 257, 257); //256 points??
console.log("Starting");
curve.createPoints();
console.log("Done: "+ curve.points.length);
curve.G = curve.points[143];//curve.points[Math.floor(Math.random()*curve.points.length)];
// console.log(`G.x: ${curve.G.x}, G.y: ${curve.G.y}.`);


let userPublicKeyHTML = document.getElementById("userPublicKey");
let userPrivateKeyHTML = document.getElementById("userPrivateKey");

let users = [];


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
*/
let humanUser = new User("Human", curve);
userPrivateKeyHTML.textContent = humanUser.privateKey;
userPublicKeyHTML.textContent = humanUser.publicKey.toString();



users[0] = new User("0", curve, humanUser);
users[0].insertMessageRecieveHTML(humanUser);
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
    document.getElementById(`publickey-${user.label}`).textContent += user.publicKey.toString(); //TODO use correct public key
    user.back.addEventListener("click", back);
    user.next.addEventListener("click", next);
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
        /*if (document.getElementById(`nextButton${label}`)) {
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
        }*/
        //remove all childred function maybe?
    }
    for (let user of users) {
        let textOut = document.getElementById("encryptedText" + user.label);
        let encryptedResult = encrypt(curve, inputField.value, humanUser, user);
        user.StageSystem.clearStages(humanUser);
        user.StageSystem.readyStages(encryptedResult.points, encryptedResult.encryptedPoints, encryptedResult.blockString);
        textOut.value = pointListToString(encryptedResult.encryptedPoints);
    }
});
document.getElementById("newKeyButton").addEventListener("click", () => {
    humanUser.privateKey = Math.floor(Math.random() * 100);
    humanUser.publicKey = curve.calcPointMultiplication(humanUser.privateKey, curve.G);
    userPrivateKeyHTML.textContent = humanUser.privateKey;
    userPublicKeyHTML.textContent = humanUser.publicKey.toString();
});
/*document.getElementById("sendMessageA").addEventListener("click", () => {
    let encryptedMessage = BigInt(document.getElementById("textPreviewA").value);
    let textOut = document.getElementById("textDecryptedA");
    console.log(encryptedMessage);
    let decryptedMessage = decrypt(curve, encryptedMessage, users[0], users[1]);
    textOut.value = decryptedMessage;
});*/








function back(e) {
    let label = e.target.id[e.target.id.length-1];
    console.log("Hell");
    users[Number(label)].StageSystem.previousStage();

    /*document.getElementById(`encryption${label}`).hidden = false;
    document.getElementById(`encryptionVisualization${label}`).hidden = true;
    document.getElementById(`sendMessage${label}`).disabled = false;
    document.getElementById(`nextButton${label}`).remove();
    document.getElementById(`backButton${label}`).remove();*/
    
}


function next(e) {
    let label = e.target.id[e.target.id.length-1];
    users[Number(label)].StageSystem.nextStage();

    /*document.getElementById(`decryption${label}`).hidden = true;
    document.getElementById(`decryptionVisualization${label}`).hidden = false;
    document.getElementById(`nextButton${label}`).removeEventListener("click", next);
    document.getElementById(`backButton${label}`).removeEventListener("click", back);
    e.target.style.visibility = "hidden";

    decryptionVisualization(label);*/
}

function back1(e) {
    let label = e.target.id[e.target.id.length-1];
/*     document.getElementById(`decryption${label}`).hidden = false; */
    document.getElementById(`decryptionVisualization${label}`).hidden = true;
    document.getElementById(`nextButton${label}`).style.visibility = "visible";
    document.getElementById(`backButton${label}`).removeEventListener("click", back1);

    encryptionVisualization(label);
}


/*function encryptionVisualization(label) {

    // visualization animation from point A to point B with message as point name

    document.getElementById(`backButton${label}`).addEventListener("click", back);
    document.getElementById(`nextButton${label}`).addEventListener("click", next);
}*/

/*function decryptionVisualization(label) {

     //visualization animation for part 3 here

    document.getElementById(`backButton${label}`).addEventListener("click", back1);
}*/


