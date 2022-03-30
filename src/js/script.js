import { pointDouble } from './realsDoubling';
import { pointAddition, listPoints, pointAdditionSteps } from './realsAddition';
import {
    movePoint, moveSection, mouseToGraph, graphToCoords, coordsToGraph, getPointPlacement, addCalculatedPoint, logicPointAddition, drawLine, addPointOnClick,
} from './graphHelpers';
import {
    Graph, drawXAxis, drawYAxis, drawEquation, transformContext,
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

Graph.prototype.equationP = function (x) {
    return Math.sqrt((x * x * x) + this.parameterA * x + this.parameterB);
};

function drawEquations() {
    drawEquation((x) => myGraph.equationP(x), 'rgb(59,129,246)', 3, myGraph);

    drawEquation((x) => -myGraph.equationP(x), 'rgb(59,129,246)', 3, myGraph);
}

drawEquations();

document.getElementById('pointSVG').addEventListener('wheel', (e) => {
    e.preventDefault();
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

    // TODO when scrolling in and out the "point" is not at the cursor y pos
    for (let i = 0; i < points.length; i++) {
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

    for (let i = 0; i < lines.length; i++) {
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
function deletePoints() {
    const allSVG = [
        document.getElementsByClassName('workingPoints'),
        document.getElementsByClassName('linesConnecting'),
        document.getElementsByClassName('calculatedPoints'),
    ];

    for (const key of allSVG) {
        for (let i = key.length; i > 0; i--) {
            // console.log(key[i-1])
            key[i - 1].remove();
        }
    }
}

document.getElementById('pointSVG').addEventListener('mousemove', (e) => {
    movePoint(e, myGraph);
});

// TODO add id's to button an interact with via their id instaed of runOperation
const operations = document.getElementsByClassName('operation');

function init() {
    for (const input of operations) {
        input.addEventListener('click', (e) => {
            for (const buttons of operations) {
                if (buttons.disabled === true) {
                    buttons.disabled = false;
                }
            }

            deletePoints();

            e.target.disabled = true;
        });
    }
}

init();

function runOperation(ops) {
    switch (ops) {
    case 1:
        pointAddition(myGraph);
        break;
    case 2:
        pointDouble(myGraph);
        break;
    case 3:
        console.log('Hey Chat!');
        break;
    default:
        console.log('Please no');
        break;
    }
}

document.getElementById('layer2').addEventListener('click', () => {
    const pointsOnGraph = document.getElementsByClassName('workingPoints');

    // Delete the point on the graph that was placed first
    if (operations[0].disabled) {
        if (pointsOnGraph.length === 1) {
            addPointOnClick(myGraph);
            runOperation(1);
        } else if (pointsOnGraph.length === 0) {
            addPointOnClick(myGraph);
        } else {
            deletePoints();
        }
    } else if (operations[1].disabled) {
        if (pointsOnGraph.length === 0) {
            addPointOnClick(myGraph);
            runOperation(2);
        } else if (pointsOnGraph.length === 1) {
            deletePoints();
        }
    }
});

function changeEquation(a, b) {
    let sign1;
    let sign2;
    (a < 0) ? (sign1 = '') : (sign1 = '+');
    (b < 0) ? (sign2 = '') : (sign2 = '+');

    document.getElementById('parameters').innerHTML = `Pick curve parameters: \\(y^2 = x^3 ${sign1} ${a}x ${sign2} ${b}\\)`;
    MathJax.typeset();
}

const firstBox = document.getElementById('curve');
firstBox[2].addEventListener('click', () => {
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
