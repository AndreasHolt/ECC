import { pointDouble } from './realsDoubling';
import { pointAddition, twoDecimalRound} from './realsAddition';
import { pointMultiplication } from './realsMultiplication';
import {
    movePoint, graphToCoords, coordsToGraph, addPointOnClick, addPointByInput, removeBinaryParagraphs,
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

const widthGraph = 751.4;
const heightGraph = 390;

document.getElementById('pointSVG').addEventListener('wheel', (e) => {
    e.preventDefault();
    movePoint(e, myGraph); // Move point when scrolling

    let graphPos; let
        graphPos2;

    e.preventDefault(); // Prevents page scroll when zooming

    myGraph.context.clearRect(0, 0, widthGraph, heightGraph); // Use var of size instead

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
        const coords = graphToCoords(myGraph, { x: cx, y: cy });

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

        const coords1 = graphToCoords(myGraph, { x: el.getAttribute('x1'), y: el.getAttribute('y1') });
        const coords2 = graphToCoords(myGraph, { x: el.getAttribute('x2'), y: el.getAttribute('y2') });

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

function isOnPage(element) {
    return (element === document.body) ? false : document.body.contains(element);
}

function deletePoints() {
    const allSVG = [
        document.getElementsByClassName('workingPoints'),
        document.getElementsByClassName('linesConnecting'),
        document.getElementsByClassName('calculatedPoints'),
    ];

    Array.from(allSVG).forEach((key) => {
        for (let i = key.length; i > 0; i -= 1) {
            key[i - 1].remove();
        }
    });

    if (!document.getElementById('pointMultiplication').disabled && isOnPage(document.getElementById('scalarFormsActive'))) {
        document.getElementById('scalarFormsActive').remove();
    }

    if (document.getElementsByClassName('paragraphBinary')) {
        let paragraphs = document.getElementsByClassName('paragraphBinary');
        for (let i = 0; i < paragraphs.length; i += 1) {
            paragraphs[i].remove();
        }
    }
    for (const point of document.getElementsByClassName('border-solid border-2 border-black h-10 w-14')) { 
        point.value = "";
    }
    removeBinaryParagraphs();
}

document.getElementById('pointSVG').addEventListener('mousemove', (e) => {
    movePoint(e, myGraph);
});

document.getElementById('negateP').addEventListener('click', (e) => {
    const pointsOnGraph = document.getElementsByClassName('workingPoints');
    let x; let
        y;
    const pointPx = document.getElementById('Px');
    const pointPy = document.getElementById('Py');

    for (const x of pointsOnGraph) {
        if ((pointPx.value < (x.getAttribute('cx') - myGraph.centerX)/myGraph.scaleX + 0.0001) && (pointPx.value > (x.getAttribute('cx') - myGraph.centerX)/myGraph.scaleX - 0.0001)) {
            pointPy.value = `${-twoDecimalRound(pointPy.value)}`

            y = (x.getAttribute('cy') - myGraph.centerY) / myGraph.scaleY;
            x.setAttribute('cy', -(y * myGraph.scaleY) + myGraph.centerY);

            document.getElementById('negateP').value = (document.getElementById('negateP').value === '+') ? '-' : '+';
        }

        if (document.getElementById('pointAddition').disabled == true && pointsOnGraph.length == 2) {
            pointAddition(myGraph);
        } else if (document.getElementById('pointDoubling').disabled == true && pointsOnGraph.length == 1) {
            pointDouble(myGraph);
        }
    }
});

document.getElementById('negateQ').addEventListener('click', (e) => {
    const pointsOnGraph = document.getElementsByClassName('workingPoints');
    let x; let
        y;
    const pointQx = document.getElementById('Qx');
    const pointQy = document.getElementById('Qy');

    for (const x of pointsOnGraph) {
        console.log((x.getAttribute('cx') - myGraph.centerX)/myGraph.scaleX)
        if ((pointQx.value < (x.getAttribute('cx') - myGraph.centerX)/myGraph.scaleX + 0.0001) && (pointQx.value > (x.getAttribute('cx') - myGraph.centerX)/myGraph.scaleX - 0.0001)) {
            pointQy.value = `${-twoDecimalRound(pointQy.value)}`

            y = (x.getAttribute('cy') - myGraph.centerY) / myGraph.scaleY;
            x.setAttribute('cy', -(y * myGraph.scaleY) + myGraph.centerY);

            document.getElementById('negateQ').value = (document.getElementById('negateQ').value === '+') ? '-' : '+';
        }

        if (pointsOnGraph.length == 2) {
            pointAddition(myGraph);
        }
    }
});

document.getElementById('pointQ').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const pointsOnGraph = document.getElementsByClassName('workingPoints');

        // Delete the point on the graph that was placed first
        if (document.getElementById('pointAddition').disabled) {
            if (pointsOnGraph.length === 0) {
                addPointByInput('Qx', myGraph);
            } else if (pointsOnGraph.length === 1) {
                addPointByInput('Qx', myGraph);
                pointAddition(myGraph);
            } else {
                deletePoints();
            }
        }
    }
});

document.getElementById('pointP').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const pointsOnGraph = document.getElementsByClassName('workingPoints');

        // Delete the point on the graph that was placed first
        if (document.getElementById('pointAddition').disabled) {
            if (pointsOnGraph.length === 0) {
                addPointByInput('Px', myGraph);
            } else if (pointsOnGraph.length === 1) {
                addPointByInput('Px', myGraph);
                pointAddition(myGraph);
            } else {
                deletePoints();
            }
        } else if (document.getElementById('pointDoubling').disabled) {
            if (pointsOnGraph.length === 0) {
                addPointByInput('Px', myGraph);
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
    
                    const html = "<p class='font-bold text-xl text-gray-800 mb-10' id='parameters'>\\(nP = P + P + ... + P\\) \\((n \\; times)\\)</p>"
                    + "<label class='block tracking-wide text-gray-700 text-x font-bold mb-2' for='setScalar'> Choose a scalar \\(n\\)</label>"
                    + "<input class='mb-6 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' type='number' id='scalarForm' name='setScalar' min='-5' placeholder='Ex: 4' value='4'>";
    
                    document.getElementById('scalarFormsActive').innerHTML = html;
    
                    document.getElementById('scalarForm').addEventListener('input', () => {
                        pointMultiplication(myGraph);
                    });
    
                    MathJax.typeset();
                }
                addPointOnClick(myGraph);
                pointMultiplication(myGraph);
            } else if (pointsOnGraph.length === 1) {
                deletePoints();
            }
        }
    }
});

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

                const html = "<p class='font-bold text-xl text-gray-800 mb-10' id='parameters'>\\(nP = P + P + ... + P\\) \\((n \\; times)\\)</p>"
                + "<label class='block tracking-wide text-gray-700 text-x font-bold mb-2' for='setScalar'> Choose a scalar \\(n\\)</label>"
                + "<input class='mb-6 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' type='number' id='scalarForm' name='setScalar' min='-5' placeholder='Ex: 4' value='4'>";

                document.getElementById('scalarFormsActive').innerHTML = html;

                document.getElementById('scalarForm').addEventListener('input', () => {
                    pointMultiplication(myGraph);
                });

                MathJax.typeset();
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

document.getElementById('curve')[0].addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const firstParameter = document.getElementById('a');
        const secondParameter = document.getElementById('b');

        myGraph.context.clearRect(0, 0, widthGraph, heightGraph, myGraph); // Use var of size instead

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
    }
});
document.getElementById('curve')[1].addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const firstParameter = document.getElementById('a');
        const secondParameter = document.getElementById('b');

        myGraph.context.clearRect(0, 0, widthGraph, heightGraph, myGraph); // Use var of size instead

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
    }
});

document.getElementById('explanationExpand').addEventListener('click', () => {
    const container = document.getElementById('explanationContainer');
    if (container.style.display === 'none' && document.getElementsByClassName('calculatedPoints').length === 0) {
        alert('Place points on the graph first!');
    } else if (container.style.display === 'none') {
        container.style.display = '';
    } else {
        container.style.display = 'none ';
    }
});

function init() {
    drawEquations();

    const operations = document.querySelectorAll('#pointAddition, #pointDoubling, #pointMultiplication');

    document.getElementById('pointAddition').addEventListener('click', (e) => {
        Array.from(operations).forEach((buttons) => {
            if (buttons.disabled === true) {
                // eslint-disable-next-line no-param-reassign
                buttons.disabled = false;
            }
        });
        document.getElementById('pointQ').style.display = 'block';

        document.getElementById('explanationContainer').style.display = 'none';
        deletePoints();
        e.target.disabled = true;
    });

    document.getElementById('pointDoubling').addEventListener('click', (e) => {
        Array.from(operations).forEach((buttons) => {
            if (buttons.disabled === true) {
                // eslint-disable-next-line no-param-reassign
                buttons.disabled = false;
            }
        });

        document.getElementById('pointQ').style.display = 'none';

        document.getElementById('explanationContainer').style.display = 'none';
        deletePoints();
        e.target.disabled = true;
    });

    document.getElementById('pointMultiplication').addEventListener('click', (e) => {
        Array.from(operations).forEach((buttons) => {
            if (buttons.disabled === true) {
                // eslint-disable-next-line no-param-reassign
                buttons.disabled = false;
            }
        });
        document.getElementById('pointQ').style.display = 'none';

        document.getElementById('explanationContainer').style.display = 'none';
        deletePoints();
        e.target.disabled = true;
    });
}

init();
