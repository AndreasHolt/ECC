import { createCurveAXY, calcPointAdditionPrime, calcPointAdditionGF2 } from "../finiteField/curves.js";

document.getElementById("messageInput").addEventListener("input", (event) => {
    let textOut = document.getElementById("tekstPreview");
    textOut.textContent = event.target.value;
});

document.getElementById("inputMessageForm").addEventListener("submit", (Event) => {
    Event.preventDefault();
    let textOut = document.getElementById("tekstPreview");
    textOut.textContent = "Encrypted...";
});











let curve = createCurveAXY(1,1,1, 16, 19,calcPointAdditionGF2);
let publicKey = 0;
let users = [];
users[0] = {    /// The person using the website.
    privateKey: Math.floor(Math.random() * 100),
    publicKey: curve.calcPointMultiplication(privateKey, curve.G)
};
users[1] = {
    privateKey: Math.floor(Math.random() * 100),
    publicKey: curve.calcPointMultiplication(privateKey, curve.G)
};



function encrypt (curve, message, sender, reciever) {
    let point1 = sender.publicKey;
    let pointMessage = curve.messageToPoint(message);
    let point2 = pointMessage + curve.calcPointMultiplication(sender.privateKey, reciever.publicKey);



    return {p1: point1, p2: point2};
}

function decrypt (curve, pointPair, sender, reciever) {
    let pointAKG = curve.calcPointMultiplication(sender.publicKey, reciever.privateKey);
    let pointPM = curve.calcPointAddition(pointpair.p1, curve.inverseOfPoint(pointAKG));
}




