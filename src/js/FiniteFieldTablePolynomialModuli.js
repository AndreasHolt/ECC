let form = document.querySelector("#form");
let table = document.querySelector("#table");

form.addEventListener("submit", handleSubmit);

function handleSubmit (event) {
    event.preventDefault();
    
    createTable(event.target["sizeSubmit"].value, event.target["modoliSubmit"].value);
    
}

function createTableHTML (tableArray, tableSize) {
    let oldTable = document.getElementById("table");
    let newTable = document.createElement("table");
    newTable.id = "table";


    let headerRow = document.createElement("tr");
    for (let i = 0; i < tableSize; i++) {
        let header = document.createElement("th");
        header.textContent = i;
        headerRow.appendChild(header);
    }
    newTable.appendChild(headerRow);

    //For each row
    for (let rowIndex = 1; rowIndex < tableSize; rowIndex++) {
        let row = document.createElement("tr");
        let dataCell = document.createElement("td");
        dataCell.textContent = rowIndex;
        row.appendChild(dataCell);
        for (let i = 1; i < tableSize; i++) {
            let dataCell = document.createElement("td");
            dataCell.textContent = tableArray[i][rowIndex];
            row.appendChild(dataCell);
        }
        newTable.appendChild(row);
    }


    oldTable.replaceWith(newTable);

}


function createTable (sizeOfTable, mod) {
    let arrayValues = calculateElements(sizeOfTable, mod);
    createTableHTML(arrayValues, sizeOfTable);
    showTable(arrayValues);

}

function calculateElements(size, mod) {
    let arrayValues = [];
    for (let i = 1; i < size; i++) {
        let column = [];
        for (let j = 1; j < size; j++) {
            column[j] = multiplicativeXOR(i, j, mod);
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
            tempResult = leftshiftedValue ^ tempResult;
        }
    }
    while (Math.floor(Math.log2(tempResult)) + 1 >= Math.floor(Math.log2(mod)) + 1) {
        tempResult = polyMod(tempResult, mod);
    }
    return tempResult;
}

function polyMod (value, mod) {
    let modoliBitLength = Math.floor(Math.log2(mod)) + 1;
    let valueBitLength = Math.floor(Math.log2(value)) + 1;
    return value ^ (mod << (valueBitLength - modoliBitLength));
}





function showTable(arrayValues) {
    console.log(arrayValues);
}





