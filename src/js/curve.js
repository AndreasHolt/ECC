function changeEquation(a, b){

    let sign1;
    let sign2;
    (a < 0)?(sign1 = ''):(sign1 = '+');
    (b < 0)?(sign2 = ''):(sign2 = '+');

    document.getElementById('parameters').innerHTML = `Pick curve parameters: \\(y^2 = x^3 ${sign1} ${a}x ${sign2} ${b}\\)`;
    MathJax.typeset()
}

const firstBox = document.getElementById('curve');
firstBox[2].addEventListener('click', () => {
    const firstParameter = document.getElementById('a');
    const secondParameter = document.getElementById('b');

    myGraph.context.clearRect(0, 0, 751.4, 390); // Use var of size instead

    myGraph = new Graph({
        canvasId: 'myCanvas',
        minX: -scaleZoom,
        minY: -scaleZoom,
        maxX: scaleZoom,
        maxY: scaleZoom,
        parameterA: parseInt(firstParameter.value, 10),
        parameterB: parseInt(secondParameter.value, 10),
        unitsPerTick: scaleZoom / 5,
    });



    changeEquation(firstParameter.value, secondParameter.value);
    deletePoints();
    drawEquation();
});
