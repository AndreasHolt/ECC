let form = document.querySelector("#form");
//let table = document.querySelector("#table");

form.addEventListener("submit", handleSubmit);

function handleSubmit (event) {
    event.preventDefault();
    let sizeOfTable = event.target["sizeSubmit"].value;
    let modoli = event.target["modoliSubmit"].value;
    let optionsList = [{mode:"additive"}, {mode:"multiplicative"}];
    for (let options of optionsList) {
        let arrayValues = createTable(sizeOfTable, modoli, options);
        createTableHTML(arrayValues, sizeOfTable, options.mode);
    }
    findInverse(4, modoli);
}

function createTableHTML (tableArray, tableSize, htmlID) {
    let oldTable = document.getElementById(htmlID);
    let newTable = document.createElement("table");
    newTable.id = htmlID;

    let headerRow = document.createElement("tr");
    for (let i = -1; i < tableSize; i++) {
        let header = document.createElement("th");
        if (i !== -1) {
            header.textContent = i;
        } else {
            if (htmlID === "multiplicative") {
                header.textContent = "*";
            } else if (htmlID === "additive"){
                header.textContent = "+";
            }
        }
        headerRow.appendChild(header);
    }
    newTable.appendChild(headerRow);

    //For each row
    for (let rowIndex = 0; rowIndex < tableSize; rowIndex++) {
        let row = document.createElement("tr");
        let dataCell = document.createElement("td");
        dataCell.textContent = rowIndex;
        row.appendChild(dataCell);
        for (let i = 0; i < tableSize; i++) {
            let dataCell = document.createElement("td");
            dataCell.textContent = tableArray[i][rowIndex];
            row.appendChild(dataCell);
        }
        newTable.appendChild(row);
    }

    if (oldTable) {
        oldTable.replaceWith(newTable);
    } else {
        form.after(newTable);
    }

}


function createTable (sizeOfTable, mod, options) {
    let arrayValues = [];
    if (options.mode === "additive") {
        arrayValues = calculateElements(sizeOfTable, mod, additiveXOR);
        
    } else if (options.mode === "multiplicative") {
        arrayValues = calculateElements(sizeOfTable, mod, multiplicativeXOR);
    }
    
    return arrayValues;
}

function calculateElements(size, mod, combinationFunction) {
    let arrayValues = [];
    for (let i = 0; i < size; i++) {
        let column = [];
        for (let j = 0; j < size; j++) {
            column[j] = combinationFunction(i, j, mod);
        }
        arrayValues[i] = column;
    }
    return arrayValues;
}

function multiplicativeXOR (x1, x2, mod) {
    let tempResult = 0;
    for (let i = 0; i <= Math.floor(Math.log2(x2)) + 1; i++) {
        if (x2 >> i & 1 === 1) {
            let leftshiftedValue = x1 << i;
            tempResult = additiveXOR(leftshiftedValue, tempResult);
        }
    }
    while (numberOfBits(tempResult) >= numberOfBits(mod)) {
        tempResult = polyMod(tempResult, mod);
    }
    return tempResult;
}

function numberOfBits (val) {
    return Math.floor(Math.log2(val)) + 1;
}


function additiveXOR (x1, x2) {
    return x1^x2;
}

function findInverse (x1, modoli) {
    //Find the inverse a in a*x1 = 1 (mod modoli)
    let inverse = gf2_quo_rem(gf2_eea_rec(x1, modoli).x, modoli).remainder;
    

    //Magic
    console.log("Inverse: " + inverse);
    //ExtEuclidAlgXOR(modoli, x1, modoli);

    return inverse;
}

function ExtEuclidAlg (a, b) {
    let quotients = [];
    let remainders = [a, b];
    let Si = [1, 0];
    let Ti = [0, 1];
    let index = 1;
    
    while (remainders[index] !== 0) {
        index++;
        quotients[index] = Math.floor(remainders[index-2] / remainders[index-1]);
        remainders[index] = remainders[index-2] - quotients[index] * remainders[index-1];
        Si[index] = Si[index - 2] - quotients[index] * Si[index - 1];
        Ti[index] = Ti[index - 2] - quotients[index] * Ti[index - 1];
        console.log(`Index: ${index} Quotient: ${quotients[index]} Remainder: ${remainders[index]} Si: ${Si[index]} Ti: ${Ti[index]}`);

    }

}

function ExtEuclidAlgXOR (a, b, mod) {
    let quotients = [];
    let remainders = [a, b];
    let Si = [1, 0];
    let Ti = [0, 1];
    let index = 1;
    
    while (remainders[index] !== 0) {
        index++;
        quotients[index] = Math.floor(remainders[index-2] / remainders[index-1]);
        remainders[index] = additiveXOR(remainders[index-2], multiplicativeXOR(quotients[index], remainders[index-1], mod));
        Si[index] = additiveXOR(Si[index - 2], multiplicativeXOR(quotients[index], Si[index - 1], mod));
        Ti[index] = additiveXOR(Ti[index - 2], multiplicativeXOR(quotients[index], Ti[index - 1], mod));
        console.log(`Index: ${index} Quotient: ${quotients[index]} Remainder: ${remainders[index]} Si: ${Si[index]} Ti: ${Ti[index]}`);

    }

}

// Returns d, x, y such that a*x+b*y=d
// d = gcd(a,b)
function gf2_eea_rec (a, b) {
    if (b === 0) {
        let d = a;
        let x = 1;
        let y = 0;
        return {d:d, x:x, y:y};
    } else {
        let qr = gf2_quo_rem(a,b);
        let q = qr.quotient;
        let r = qr.remainder;
        let temp = gf2_eea_rec(b, r);
        let d = temp.d;
        let x1 = temp.x;
        let y1 = temp.y;

        let x = y1;
        let y = additiveXOR(x1, multiplicativeXOR(y1, q));
        return {"d":d, "x":x, "y":y};
    }
}

function gf2_quo_rem (a, b) {
    let remainder = a;
    let quotient = 0;
    while (degree(remainder) >= degree(b)) {
        let pos = degree(remainder) - degree(b);
        remainder = remainder ^ (b << pos);
        quotient += 1<<pos
    }
    return {"quotient":quotient, "remainder":remainder};
}

function degree (a) {
    if (a === 0) {
        return -1;
    } else {
        return numberOfBits(a) - 1;
    }
}

function gcd (val1, val2) {

}

function calcIreduciblePoly (size) {

    
}
//Performs modulo operation on the polynomial.
function polyMod (value, mod) {
    return value ^ (mod << (numberOfBits(value) - numberOfBits(mod)));
}





function showTable(arrayValues) {
    console.log(arrayValues);
}




