import {
    addCalculatedPoint, getXY, graphToCoords, removeBinaryParagraphs, checkExplanationDisplay
} from './graphHelpers';
import { calculateDouble } from './realsDoubling';
import { calculateAddition, listPoints, twoDecimalRound } from './realsAddition';

function pointMultiplicationSteps(myGraph, points, x, y, scalar) {
    points.x = twoDecimalRound(points.x);
    points.y = twoDecimalRound(points.y);

    const binary = convertToBinary(scalar, 0);

    // If so we should use Number.toFixed
    const newX = twoDecimalRound(x);
    const newY = twoDecimalRound(y);

    const arrayPowerOfTwo = [];
    const arrayPowerOfTwoOnes = [];

    console.log(binary);
    // Show binary representation calculations
    for (let i = 0; i < binary.length; i += 1) {
        if (binary[i] === '1') {
            arrayPowerOfTwo.push(`\\(1 \\cdot 2^{${binary.length - 1 - i}}\\) `);
            arrayPowerOfTwoOnes.push(`\\(2^{${binary.length - 1 - i}}\\)`);
        } else {
            arrayPowerOfTwo.push(`\\(0 \\cdot 2^{${binary.length - 1 - i}}\\) `);
        }
    }

    const stepRows = document.getElementsByClassName('steps');

    // TODO Only load LaTeX when eventListener on calculation button is triggered
    // REMOVE FROM HTML when calculation button event listener
    removeBinaryParagraphs();

    const paragraphPowerOfTwo = document.createElement('p');
    paragraphPowerOfTwo.className = 'paragraphBinary';
    stepRows[0].insertAdjacentElement('afterend', paragraphPowerOfTwo);

    // clear inner HTML whenever a new scalar is being input

    document.getElementById('calculatingHeader').innerHTML = 'Point Multiplication: Double and Add Algorithm';
    stepRows[0].innerHTML = `There exist faster algorithms than simply computing \\(n \\cdot P\\), which requires n additions. One of them is the double and add algorithm: <br>
                              Get the binary representation of the scalar \\(${scalar}\\), which is \\(\\textbf{${binary}}\\). This binary representation can be turned into a sum of powers of two: <br>
                              \\(${scalar} = \\) &nbsp`;

    for (let i = 0; i < arrayPowerOfTwo.length; i += 1) {
        stepRows[0].innerHTML += arrayPowerOfTwo[i];
        if (i !== arrayPowerOfTwo.length - 1) {
            stepRows[0].innerHTML += ' + ';
        }
    }

    stepRows[0].innerHTML += `<br> <br> Which we can write as: <br>
                              \\(${scalar} \\cdot P = \\) &nbsp`;

    for (let i = 0; i < arrayPowerOfTwoOnes.length; i += 1) {
        stepRows[0].innerHTML += `${arrayPowerOfTwoOnes[i]}\\(P\\)`;
        if (i !== arrayPowerOfTwoOnes.length - 1) {
            stepRows[0].innerHTML += ' + ';
        }
    }

    stepRows[0].innerHTML += '<br> Therefore the Double and Add algorithm tells us to: <br> <br>• Take \\(P\\) <br>';

    const binaryReversed = binary.toString().split('').reverse().join('');
    console.log(binaryReversed);

    for (let i = 0; i < binary.length; i += 1) {
        if (i !== 0) {
            stepRows[0].innerHTML += `• Double \\( 2^{${i - 1}}P\\), so that we get \\(2^{${i}}P\\) <br>`;
            if (binary[binary.length - 1 - i] === '1') {
                console.log('Index: ', binary.length - 1 - i);
                stepRows[0].innerHTML += `• Add \\(2^{${i}}P\\) to our result <br>`;
            } else {
                stepRows[0].innerHTML += `• Don't perform any addition involving \\(2^{${i}}P\\) <br>`;
            }
        }
    }

    stepRows[0].innerHTML += `<br>Thus, to compute \\(${scalar} \\cdot P \\), we only have to perform ${arrayPowerOfTwoOnes.length - 1} additions and ${binary.length - 1} doublings.`;

    /*   stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a new point \\(R = (x_R, y_R):\\) <br>
                               \\(x_R = m^2 - 2x_P = ${lambda}^2 - 2 \\cdot ${points.x}  = \\underline{${newX}}\\) <br>
                               \\(y_R = -y_P + m(x_P - x_R) = -${points.y} + ${lambda}(${points.x} -  ${newX}) = \\underline{${newY}}\\) <br> <br>
                               \\(\\textbf{R = (${newX}, ${newY})}\\)`;
    */
    // eslint-disable-next-line no-undef
    checkExplanationDisplay();

}

function convertToBinary(scalar, arrayBool) {
    let num = scalar;
    let binary = (num % 2).toString();

    while (num > 1) {
        num = parseInt(num / 2, 10);
        binary = (num % 2) + (binary);
    }

    if (arrayBool !== 1) {
        return binary;
    }

    const binaryArray = (`${binary}`).split('').reverse();
    console.log(binaryArray);

    return binaryArray;
}

// function pointMultiplication(myGraph) {
//     const points = document.getElementsByClassName('workingPoints');
//     const point = [(points[0].getAttribute('cx') - myGraph.centerX) / myGraph.scaleX, -(points[0].getAttribute('cy') - myGraph.centerY) / myGraph.scaleY];
//     const storePoint = [getXY(document.getElementsByClassName('workingPoints')[0])]; // TODO Check if this is the same as above

//     const scalar = document.getElementById('scalarForm').value;
//     const binary = convertToBinary(scalar, 1); // the array of bits, from msb to lsb

//     let i = binary.length - 2;
//     let res = point;

//     while (i >= 0) { // traversing from most significant bit to least significant bit
//         res = calculateDouble(myGraph, res); // double

//         // eslint-disable-next-line eqeqeq
//         if (binary[i] == 1) {
//             res = calculateAddition(myGraph, res, point); // addition
//         }

//         i -= 1;
//     }

//     console.log('Calculated points: ', res[0], -res[1]);

//     const listedPoints = listPoints(myGraph, storePoint, res[0], res[1], 'doubling');

//     pointMultiplicationSteps(myGraph, listedPoints, res[0], res[1], scalar);

//     addCalculatedPoint(myGraph, res[0], res[1], 3);

//     res[1] = -res[1];
//     return res;
// }

function pointMultiplication(myGraph) {
    const pointEl = document.getElementsByClassName('workingPoints')[0];
    const point = graphToCoords(myGraph, getXY(pointEl));
    point.y = -point.y;

    const scalar = document.getElementById('scalarForm').value;
    const binary = convertToBinary(scalar, 1); // the array of bits, from msb to lsb

    let i = binary.length - 2;
    let res = point;

    while (i >= 0) { // traversing from most significant bit to least significant bit
        res = calculateDouble(myGraph, res); // double

        // eslint-disable-next-line
        if (binary[i] == 1) {
            res = calculateAddition(myGraph, [res, point]);
        }

        i -= 1;
    }

    const listedPoints = listPoints(myGraph, [point], res.x, res.y, 'doubling');
    pointMultiplicationSteps(myGraph, listedPoints, res.x, res.y, scalar);

    addCalculatedPoint(myGraph, res, 3);

    res.y = -res.y;
    return res;
}

export { pointMultiplication };
