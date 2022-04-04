import { pointDouble } from './realsDoubling';
import { pointAddition } from './realsAddition';
import { pointMultiplication } from './realsMultiplication';
import {
    movePoint, graphToCoords, coordsToGraph, addPointOnClick,
} from './graphHelpers';
import {
    Graph, drawXAxis, drawYAxis, drawEquation,
} from './graph';

let scaleZoom = 10;

let myGraph = new Graph({
    canvasId: 'myCanvas',
    minX: -scaleZoom,
    minY: -scaleZoom,
    maxX: scaleZoom,
    maxY: scaleZoom,
    parameterA: -5,
    parameterB: 15,
    unitsPerTick: scaleZoom / 5,
});

function drawEquations() {
    drawEquation((x) => myGraph.equationP(x), 'rgb(59,129,246)', 3, myGraph);

    drawEquation((x) => -myGraph.equationP(x), 'rgb(59,129,246)', 3, myGraph);
}

document.getElementById('pointSVG').addEventListener('wheel', (e) => {
    e.preventDefault();
    movePoint(e, myGraph); // Move point when scrolling

    let graphPos; let
        graphPos2;

    e.preventDefault(); // Prevents page scroll when zooming

    myGraph.context.clearRect(0, 0, 751.4, 390); // Use var of size instead

    if (e.deltaY < 0) { // Zoom in
        scaleZoom /= 1.02;
    } else { // Zoom out
        scaleZoom *= 1.02;
    }

    myGraph = new Graph({
        canvasId: 'myCanvas',
        minX: -scaleZoom,
        minY: -scaleZoom,
        maxX: scaleZoom,
        maxY: scaleZoom,
        parameterA: Number(document.getElementById('a').value),
        parameterB: Number(document.getElementById('b').value),
        unitsPerTick: scaleZoom / 5,
    });

    drawXAxis(myGraph);
    drawYAxis(myGraph);

    drawEquations();

    const points = document.querySelectorAll('.workingPoints,.calculatedPoints,.point');

    for (let i = 0; i < points.length; i += 1) {
        const el = points[i];

        const cx = el.getAttribute('cx');
        const cy = el.getAttribute('cy');
        const coords = graphToCoords(myGraph, cx, cy);

        if (e.deltaY < 0) { // Zoom in
            graphPos = coordsToGraph(myGraph, coords.x * 1.02, coords.y * 1.02);
        } else { // Zoom out
            graphPos = coordsToGraph(myGraph, coords.x / 1.02, coords.y / 1.02);
        }

        el.setAttribute('cx', graphPos.x);
        el.setAttribute('cy', graphPos.y);
    }

    const lines = document.getElementsByClassName('linesConnecting');

    for (let i = 0; i < lines.length; i += 1) {
        const el = lines[i];

        const x1 = el.getAttribute('x1');
        const y1 = el.getAttribute('y1');
        const x2 = el.getAttribute('x2');
        const y2 = el.getAttribute('y2');

        const coords1 = graphToCoords(myGraph, x1, y1);
        const coords2 = graphToCoords(myGraph, x2, y2);

        if (e.deltaY < 0) { // Zoom in
            graphPos = coordsToGraph(myGraph, coords1.x * 1.02, coords1.y * 1.02);
            graphPos2 = coordsToGraph(myGraph, coords2.x * 1.02, coords2.y * 1.02);
        } else { // Zoom out
            graphPos = coordsToGraph(myGraph, coords1.x / 1.02, coords1.y / 1.02);
            graphPos2 = coordsToGraph(myGraph, coords2.x / 1.02, coords2.y / 1.02);
        }

        el.setAttribute('x1', graphPos.x);
        el.setAttribute('y1', graphPos.y);
        el.setAttribute('x2', graphPos2.x);
        el.setAttribute('y2', graphPos2.y);
    }
});

/// ----------------------------------------------------------------------
/// Draw points on graph
/// ----------------------------------------------------------------------
//

function deletePoints() {
    const allSVG = [
        document.getElementsByClassName('workingPoints'),
        document.getElementsByClassName('linesConnecting'),
        document.getElementsByClassName('calculatedPoints'),
    ];

    Array.from(allSVG).forEach((key) => {
        for (let i = key.length; i > 0; i -= 1) {
            // console.log(key[i-1])
            key[i - 1].remove();
        }
    });

    if (!document.getElementById('pointMultiplication').disabled && isOnPage(document.getElementById('scalarFormsActive'))) {
        document.getElementById('scalarFormsActive').remove();
    }
}

document.getElementById('pointSVG').addEventListener('mousemove', (e) => {
    movePoint(e, myGraph);
});

function isOnPage(element) {
    return (element === document.body) ? false : document.body.contains(element);
}

document.getElementById('layer2').addEventListener('click', (e) => {
    movePoint(e, myGraph); // Ensures that the point is on the graph when clicked

    const pointsOnGraph = document.getElementsByClassName('workingPoints');

    // Delete the point on the graph that was placed first
    if (document.getElementById('pointAddition').disabled) {
        if (pointsOnGraph.length === 1) {
            addPointOnClick(myGraph);
            pointAddition(myGraph); // TODO Zoom out if point is outside view
        } else if (pointsOnGraph.length === 0) {
            addPointOnClick(myGraph);
        } else {
            deletePoints();
        }
    } else if (document.getElementById('pointDoubling').disabled) {
        if (pointsOnGraph.length === 0) {
            addPointOnClick(myGraph);
            pointDouble(myGraph);
        } else if (pointsOnGraph.length === 1) {
            deletePoints();
        }
    } else if (document.getElementById('pointMultiplication').disabled) {
        if (pointsOnGraph.length === 0) {
            const scalarFormsActive = document.getElementById('scalarFormsActive');
            if (!isOnPage(scalarFormsActive)) {
                const scalarFormsX = document.createElement('div');
                document.body.appendChild(scalarFormsX);
                scalarFormsX.setAttribute('id', 'scalarFormsActive');
                const formPlaceholder = document.getElementById('formPlaceholder');
                formPlaceholder.appendChild(document.getElementById('scalarFormsActive'));
                console.log(document.getElementById('scalarFormsID'));

                const html = "<p class='font-bold text-xl mb-2 text-gray-800 mb-10' id='parameters'>\\(nP = P + P + ... + P\\) \\((n \\; times)\\)</p>"
                + "<label class='block tracking-wide text-gray-700 text-x font-bold mb-2' for='setScalar'> Choose a scalar \\(n\\)</label>"
                + "<input class='mb-6 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' type='number' id='setScalar' name='setScalar' min='-5' placeholder='Ex: -4' value='-5'>"
                + "<input class='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-10' type='button' value='Perform multiplication'>";

                document.getElementById('scalarFormsActive').innerHTML = html;

                MathJax.typeset();

                console.log('no');
            }
            addPointOnClick(myGraph);
            pointMultiplication(myGraph);
        } else if (pointsOnGraph.length === 1) {
            deletePoints();
        }
    }
});

function changeEquation(a, b) {
    let sign1 = '';
    let sign2 = '';

    if (a >= 0) {
        sign1 = '+';
    }
    if (b >= 0) {
        sign2 = '+';
    }

    document.getElementById('parameters').innerHTML = `Pick curve parameters: \\(y^2 = x^3 ${sign1} ${a}x ${sign2} ${b}\\)`;
    // eslint-disable-next-line no-undef
    MathJax.typeset();
}

document.getElementById('curve')[2].addEventListener('click', () => {
    const firstParameter = document.getElementById('a');
    const secondParameter = document.getElementById('b');

    myGraph.context.clearRect(0, 0, 751.4, 390, myGraph); // Use var of size instead

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
    drawEquations();
});

function init() {
    drawEquations();

    const operations = document.querySelectorAll('#pointAddition, #pointDoubling, #pointMultiplication')

    Array.from(operations).forEach((input) => {
        input.addEventListener('click', (e) => {
            Array.from(operations).forEach((buttons) => {
                if (buttons.disabled === true) {
                    // eslint-disable-next-line no-param-reassign
                    buttons.disabled = false;
                }
            });

            deletePoints();

            e.target.disabled = true;
        });
    });
}

init();
