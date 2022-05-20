import { decrypt } from './cryptography';
import FiniteField from '../finitefield/finiteFieldVisual';

class User {
    constructor(label, curve, humanUser) {
        if (humanUser) {
            this.encryptFiniteField = new FiniteField();
            this.decryptFiniteField = new FiniteField();
            this.encryptFiniteField.addCurve(curve);
            this.decryptFiniteField.addCurve(curve);
            this.label = label; // e.g. "A"
            /// Encrypted text field///
            this.encryptedTextField = document.createElement('input');
            this.encryptedTextField.classList.add(
                'appearance-none',
                'block',
                'w-full',
                'bg-gray-200',
                'text-gray-700',
                'border',
                'border-gray-200',
                'rounded',
                'py-3',
                'px-4',
                'leading-tight',
                'focus:outline-none',
                'focus:bg-white',
                'focus:border-gray-500',
            );
            this.encryptedTextField.type = 'text';
            this.encryptedTextField.id = `encryptedText${this.label}`;
            this.encryptedTextField.readOnly = true;
            this.encryptedTextField.placeholder = 'Encrypted text';
            this.encryptedTextField.disabled = true;

            /// Decrypted text field///
            this.decryptedTextField = document.createElement('input');
            this.decryptedTextField.classList.add(
                'appearance-none',
                'block',
                'w-full',
                'bg-gray-200',
                'text-gray-700',
                'border',
                'border-gray-200',
                'rounded',
                'py-3',
                'px-4',
                'leading-tight',
                'focus:outline-none',
                'focus:bg-white',
                'focus:border-gray-500',
            );
            this.decryptedTextField.type = 'text';
            this.decryptedTextField.id = `textDecrypted${this.label}`;
            this.decryptedTextField.readOnly = true;
            this.decryptedTextField.placeholder = 'Decrypted text';
            this.decryptedTextField.disabled = true;

            /// Decrypt message button///
            this.sendMessageButton = document.createElement('button');
            this.sendMessageButton.classList.add(
                'bg-white',
                'hover:bg-gray-100',
                'disabled:bg-gray-200',
                'text-gray-800',
                'font-semibold',
                'py-2',
                'px-4',
                'border',
                'border-gray-400',
                'rounded',
                'shadow',
                'inline-flex',
                'items-center',
                'mb-10',
                'hidden',
            );
            this.sendMessageButton.id = `sendMessage${this.label}`;
            this.sendMessageButton.textContent = 'Send message';
            this.sendMessageButton.addEventListener('click', (e) => {
                const encryptedMessage = this.encryptedTextField.value; // Works????
                const textOut = this.decryptedTextField;
                const decryptedMessage = decrypt(curve, encryptedMessage, humanUser, this);
                textOut.value = decryptedMessage;

                /* document.getElementById(`encryption${this.label}`).hidden = true; */
                // document.getElementById(`encryptionVisualization${this.label}`).hidden = false;

                e.target.disabled = true;

                // encryptionVisualization(this.label);
            });

            this.back = document.createElement('INPUT');
            this.back.setAttribute('type', 'button');
            this.back.setAttribute('value', '← Back');
            this.back.setAttribute('id', `backButton${this.label}`);
            this.back.classList.add(
                'text-red-600',
                'bg-white',
                'hover:bg-gray-100',
                'disabled:bg-gray-200',
                'text-gray-800',
                'font-semibold',
                'py-2',
                'px-4',
                'border',
                'border-red-600',
                'rounded',
                'shadow',
                'inline-flex',
                'items-center',
                'mb-1',
                'mr-5',
            );

            this.next = document.createElement('INPUT'); // Next button goes to 2nd part of visualization
            this.next.setAttribute('type', 'button');
            this.next.setAttribute('value', 'Next →');
            this.next.setAttribute('id', `nextButton${this.label}`);
            this.next.classList.add(
                'text-green-600',
                'bg-white',
                'hover:bg-gray-100',
                'disabled:bg-gray-200',
                'text-gray-800',
                'font-semibold',
                'py-2',
                'px-4',
                'border',
                'border-green-600',
                'rounded',
                'shadow',
                'inline-flex',
                'items-center',
                'mb-1',
            );

            this.StageSystem = new StageSystem(this);
        }

        this.privateKey = Math.floor(Math.random() * 100);
        // console.log(this.label + " has private key: " + this.privateKey);
        this.publicKey = curve.calcPointMultiplication(this.privateKey, curve.G);
    }

    insertMessageRecieveHTML(humanUser) {
        const outerDiv = document.createElement('div');
        outerDiv.classList.add('basis-1/3');
        outerDiv.innerHTML = `
            <p id="titleBox${this.label}"></p>
            <div class="flex flex-col gap-1 border-2 border-blue-500 rounded-md"
            id="encryptionBox">
                <div class="grow basis-7/8 grid grid-cols-2 p-0.5">
                    <div class="col-span-1 flex flex-col border-2 border-right-blue-500 rounded-md p-0.5">
                        <h1 id="encryption${this.label}"
                        class="basis-1/8 font-bold text-xl text-center mt-3 mb-2 text-gray-800">Encryption</h1>
                        <div id="innerDivEncryption">
                        </div>
                    </div>
                    <div class="col-span-1 flex flex-col border-2 border-left-blue-500 rounded-md p-0.5">
                        <h1 id="decryption${this.label}"
                        class="basis-1/8 font-bold text-xl text-center mt-3 mb-2 text-gray-800">Decryption</h1>
                        <div id="innerDivDecryption">
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
                <button class="border-2 rounded-md border-slate-700 hidden" 
                id="sendMessage${this.label}temp" ></button>
            </div>
        `;
        document.getElementById('communication').appendChild(outerDiv);
        document.getElementById(`textPreview${this.label}temp`).replaceWith(this.encryptedTextField);
        document.getElementById(`textDecrypted${this.label}temp`).replaceWith(this.decryptedTextField);
        document.getElementById(`sendMessage${this.label}temp`).replaceWith(this.sendMessageButton);
        document.getElementById('innerDivEncryption').appendChild(this.encryptFiniteField.createHTMLElement());
        document.getElementById('innerDivDecryption').appendChild(this.decryptFiniteField.createHTMLElement());

        this.drawKeys(humanUser);

        document.getElementById(`titleBox${this.label}`).appendChild(this.back);
        document.getElementById(`titleBox${this.label}`).appendChild(this.next);
    }

    drawKeys(humanUser) {
        this.encryptFiniteField.clearVisual();
        this.decryptFiniteField.clearVisual();

        this.decryptFiniteField.drawPointSvg(humanUser.publicKey, this.decryptFiniteField.operationPointStyle);
        this.decryptFiniteField.pointText(humanUser.publicKey, 'aG', false, false);
        this.encryptFiniteField.drawPointSvg(this.publicKey, this.encryptFiniteField.operationPointStyle);
        this.encryptFiniteField.pointText(this.publicKey, 'kG', false, false);

        this.encryptFiniteField.drawPointSvg(this.encryptFiniteField.curve.G, this.encryptFiniteField.pointStyle);
        this.decryptFiniteField.drawPointSvg(this.encryptFiniteField.curve.G, this.encryptFiniteField.pointStyle);
        this.encryptFiniteField.pointText(this.encryptFiniteField.curve.G, 'G', false, false);
        this.decryptFiniteField.pointText(this.encryptFiniteField.curve.G, 'G', false, false);
    }
}

class Stage {
    constructor(lastStage, point, encryptedPoint, blockString) {
        this.encryptedMessage = lastStage.encryptedMessage + encryptedPoint.toString();
        this.char = blockString;
        this.decryptedMessage = lastStage.decryptedMessage + blockString;
        this.point = point;
        this.encryptedPoint = encryptedPoint;
        this.show = 0;
    }
}
class StageSystem {
    constructor(user) {
        if (user instanceof User) {
            this.parent = user;
        } else {
            throw new Error('StageSystem can only be assigned to a user');
        }
        this.stageHistory = [];
        this.currentStage = 0;
    }

    nextStage() {
        // try {
        //     this.changeStage(1);
        // } catch (error) {
        //     console.log(error, this.currentStage, this.finalStage);
        //     this.currentStage--;
        // }
        this.changeStage(1);
    }

    previousStage() {
        this.changeStage(0);
    }

    clearStages(sender) {
        this.stageHistory = [];
        const akg = this.parent.encryptFiniteField.curve.calcPointMultiplication(sender.privateKey, this.parent.publicKey);
        this.stageHistory[0] = {
            encryptedMessage: '', decryptedMessage: '', point: akg, show: 1,
        };
        this.currentStage = 0;
    }

    readyStages(points, encryptedPoints, blockStrings) {
        for (let i = 0; i < encryptedPoints.length; i += 1) {
            this.stageHistory[i + 1] = new Stage(this.stageHistory[i], points[i], encryptedPoints[i], blockStrings[i]);
        }
        this.finalStage = this.stageHistory.length;
    }

    changeStage(bool) {
        if (!this.currentStage) {
            this.parent.encryptFiniteField.drawPointSvg(this.stageHistory[this.currentStage].point, this.parent.encryptFiniteField.operationPointStyle);
            this.parent.decryptFiniteField.drawPointSvg(this.stageHistory[this.currentStage].point, this.parent.encryptFiniteField.operationPointStyle);

            this.parent.encryptFiniteField.pointText(this.stageHistory[this.currentStage].point, 'akG', true, false);
            this.parent.decryptFiniteField.pointText(this.stageHistory[this.currentStage].point, 'akG', true, false);

            this.parent.encryptedTextField.value = '';
            this.parent.decryptedTextField.value = '';
            this.currentStage += 1;
            // this.changeStage(1);
            // this.stageHistory[this.currentStage].show++
            this.parent.back.disabled = true;
            return;
        } if (this.currentStage == this.finalStage) {
            if (bool) {
                this.parent.next.disabled = true;
                this.parent.decryptFiniteField.drawPointSvg(this.stageHistory[this.currentStage - 1].point, this.parent.decryptFiniteField.resultPointStyle, true);
                this.parent.decryptFiniteField.pointText(this.stageHistory[this.currentStage - 1].point, this.stageHistory[this.currentStage - 1].char, true);
                this.parent.decryptedTextField.value = this.stageHistory[this.currentStage - 1].decryptedMessage;
            } else {
                this.currentStage -= 1;
                this.changeStage(!bool);
            }
            return;
        }

        this.parent.back.disabled = false;
        this.parent.next.disabled = false;

        document.querySelectorAll('.temp').forEach((element) => element.remove());
        this.parent.encryptFiniteField.drawPointSvg(this.stageHistory[this.currentStage].point, this.parent.encryptFiniteField.intermediatePointStyle, true);
        this.parent.encryptFiniteField.pointText(this.stageHistory[this.currentStage].point, this.stageHistory[this.currentStage].char, true);

        if (bool) {
            if (this.stageHistory[this.currentStage].show === 2) {
                this.stageHistory[this.currentStage].show = 1;
                this.currentStage += 1;
                this.changeStage(bool);
            } else if (this.stageHistory[this.currentStage].show === 1) {
                // let encryptedPoint = this.parent.encryptFiniteField.curve.calcPointAddition(this.stageHistory[0].point, this.stageHistory[this.currentStage].point);
                this.parent.encryptFiniteField.drawPointSvg(this.stageHistory[this.currentStage].encryptedPoint, this.parent.encryptFiniteField.resultPointStyle, true);
                this.parent.encryptFiniteField.pointText(this.stageHistory[this.currentStage].encryptedPoint, `${this.stageHistory[this.currentStage].char}'`, true);
                this.parent.encryptedTextField.value = this.stageHistory[this.currentStage].encryptedMessage;

                this.parent.decryptFiniteField.pointText(this.stageHistory[this.currentStage].encryptedPoint, '', true);
                this.parent.decryptFiniteField.drawPointSvg(this.stageHistory[this.currentStage].encryptedPoint, this.parent.decryptFiniteField.intermediatePointStyle, true);
                this.parent.decryptedTextField.value = this.stageHistory[this.currentStage - 1].decryptedMessage;

                this.stageHistory[this.currentStage].show += 1;
            } else {
                this.parent.encryptedTextField.value = this.stageHistory[this.currentStage - 1].encryptedMessage;

                if (this.currentStage > 1) {
                    this.parent.decryptFiniteField.drawPointSvg(this.stageHistory[this.currentStage - 1].point, this.parent.decryptFiniteField.resultPointStyle, true);
                    this.parent.decryptFiniteField.pointText(this.stageHistory[this.currentStage - 1].point, this.stageHistory[this.currentStage - 1].char, true);
                    this.parent.decryptedTextField.value = this.stageHistory[this.currentStage - 1].decryptedMessage;
                }

                this.stageHistory[this.currentStage].show += 1;
            }
        } else if (this.stageHistory[this.currentStage].show === 1) {
            this.stageHistory[this.currentStage].show = 0;
            this.currentStage -= 1;
            this.changeStage(!bool);
        } else {
            this.stageHistory[this.currentStage].show = 0;
            this.changeStage(!bool);
        }
    }
}

export default User;
