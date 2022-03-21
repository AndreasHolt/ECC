const firstBox = document.getElementById('curve');
firstBox[2].addEventListener('click', e => {
    let firstParameter = document.getElementById('a');
    let secondParameter = document.getElementById('b');
    console.log(firstParameter.value, secondParameter.value);

    /* myGraph.parameterA = firstParameter.value;
    myGraph.parameterB = secondParameter.value; */

    myGraph.context.clearRect(0, 0, 578, 300) // Use var of size instead

    myGraph = new Graph({
        canvasId: 'myCanvas',
        minX: -10,
        minY: -10,
        maxX: 10,
        maxY: 10,
        parameterA: firstParameter.value,
	    parameterB: secondParameter.value,
        unitsPerTick: 1
    });

    drawEquation()

    console.log("graph A:" + myGraph.parameterA, "graph B: " + myGraph.parameterB);
});
