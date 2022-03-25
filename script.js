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

function drawEquation() {
    myGraph.drawEquation((x) => myGraph.equationP(x), 'green', 3);

    myGraph.drawEquation((x) => -myGraph.equationP(x), 'green', 3);
}

drawEquation();

document.getElementById('pointSVG').addEventListener('wheel', (e) => {
    e.preventDefault();
    let graphPos; let
        graphPos2;

    e.preventDefault(); // Prevents page scroll when zooming

    myGraph.context.clearRect(0, 0, 578, 300); // Use var of size instead

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
        parameterA: -5,
        parameterB: 15,
        unitsPerTick: scaleZoom / 5,
    });

    myGraph.drawXAxis();
    myGraph.drawYAxis();

    drawEquation();

    const points = document.querySelectorAll('.workingPoints,.calculatedPoints,.point');

    // TODO when scrolling in and out the "point" is not at the cursor y pos
    for (let i = 0; i < points.length; i++) {
        const el = points[i];

        const cx = el.getAttribute('cx');
        const cy = el.getAttribute('cy');
        const coords = myGraph.graphToCoords(cx, cy);

        if (e.deltaY < 0) { // Zoom in
            graphPos = myGraph.coordsToGraph(coords.x * 1.02, coords.y * 1.02);
        } else { // Zoom out
            graphPos = myGraph.coordsToGraph(coords.x / 1.02, coords.y / 1.02);
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

        const coords1 = myGraph.graphToCoords(x1, y1);
        const coords2 = myGraph.graphToCoords(x2, y2);

        if (e.deltaY < 0) { // Zoom in
            graphPos = myGraph.coordsToGraph(coords1.x * 1.02, coords1.y * 1.02);
            graphPos2 = myGraph.coordsToGraph(coords2.x * 1.02, coords2.y * 1.02);
        } else { // Zoom out
            graphPos = myGraph.coordsToGraph(coords1.x / 1.02, coords1.y / 1.02);
            graphPos2 = myGraph.coordsToGraph(coords2.x / 1.02, coords2.y / 1.02);
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
    myGraph.movePoint(e);
});

const operations = document.getElementsByClassName('operation');

function init() {
    for (const input of operations) {
        input.addEventListener('click', (e) => {
            for (const buttons of operations) {
                if (buttons.disabled == true) {
                    buttons.disabled = false;
                }
            }

            deletePoints();

            e.target.disabled = true;
        });
    }
}

init();

document.getElementById('layer2').addEventListener('click', (e) => {
    const pointsOnGraph = document.getElementsByClassName('workingPoints');

    // Delete the point on the graph that was placed first
    if (operations[0].disabled) {
        if (pointsOnGraph.length === 1) {
            myGraph.addPointOnClick();
            runOperation(1);
        } else if (pointsOnGraph.length === 0) {
            myGraph.addPointOnClick();
        } else {
            deletePoints();
        }
    } else if (operations[1].disabled) {
        if (pointsOnGraph.length === 0) {
            myGraph.addPointOnClick();
            runOperation(2);
        } else if (pointsOnGraph.length === 1) {
            deletePoints();
        }
    }
});

function runOperation(operations) {
    switch (operations) {
    case 1:
        myGraph.pointAddition();
        break;
    case 2:
        myGraph.pointDouble();
        break;
    case 3:
        console.log('Hey Chat!');
        break;
    default:
        console.log('Please no');
        break;
    }
}
