let form = document.querySelector("#form");
let table = document.querySelector("#table");

form.addEventListener("submit", handleSubmit);

function handleSubmit (event) {
    event.preventDefault();
    
    console.log("Hello");
    createTable(document.getElementById("sizeSubmit").value, document.getElementById("modoliSubmit").value);
}




function createTable (sizeOfTable, mod) {
    let arrayValues = [];
    
    calculateElements(arrayValues, sizeOfTable, mod);
    showTable(arrayValues);

}

function calculateElements(arrayValues, size, mod) {
    for (let i = 1; i < size; i++) {
        let column = [];
        for (let j = 1; j < size; j++) {
            column[j] = multiplicativeXOR(i, j, mod);
        }


        arrayValues[i] = column;


    }
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





