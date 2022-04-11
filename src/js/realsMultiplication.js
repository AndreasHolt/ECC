import { addCalculatedPoint, getXY, graphToCoords } from './graphHelpers';
import { calculateDouble } from './realsDoubling';
import { calculateAddition, listPoints, twoDecimalRound } from './realsAddition';

function pointMultiplicationSteps(myGraph, points, x, y, scalar) {
    points.x = twoDecimalRound(points.x);
    points.y = twoDecimalRound(points.y);

    const binary = convertToBinary(scalar,0);

    // If so we should use Number.toFixed
    const newX = twoDecimalRound(x);
    const newY = twoDecimalRound(y);

    let arrayPowerOfTwo = [];

    // Show binary representation calculations
    for (let i = 0; i < binary.length; i += 1) {
        if (binary[i] === '1') {
            arrayPowerOfTwo.push(`\\(1 \\cdot 2^${i}\\) `);
        } else {
            arrayPowerOfTwo.push(`\\(0 \\cdot 2^${i}\\) `);
        }
    }

    const stepRows = document.getElementsByClassName('steps');

    // TODO Only load LaTeX when eventListener on calculation button is triggered
    // REMOVE FROM HTML when calculation button event listener
    let paragraphPowerOfTwo = document.createElement('p');
    stepRows[stepRows.length - 1].insertAdjacentElement('afterend', paragraphPowerOfTwo);

    arrayPowerOfTwo.forEach(number => paragraphPowerOfTwo.innerHTML += number);

    document.getElementById('calculatingHeader').innerHTML = 'Point Multiplication: Double and Add Algorithm'
     stepRows[0].innerHTML = `There exist faster algorithms than simply computing \\(n \\cdot P\\), which requires n additions. One of them is the double and add algorithm: <br>
                              Get the binary representation of the scalar \\(${scalar}\\), which is \\(\\textbf{${binary}\\)`;

 /*   stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a new point \\(R = (x_R, y_R):\\) <br>
                            \\(x_R = m^2 - 2x_P = ${lambda}^2 - 2 \\cdot ${points.x}  = \\underline{${newX}}\\) <br>
                            \\(y_R = -y_P + m(x_P - x_R) = -${points.y} + ${lambda}(${points.x} -  ${newX}) = \\underline{${newY}}\\) <br> <br>
                            \\(\\textbf{R = (${newX}, ${newY})}\\)`;
 */
    // eslint-disable-next-line no-undef
    MathJax.typeset();
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
    const binary = convertToBinary(scalar); // the array of bits, from msb to lsb

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
