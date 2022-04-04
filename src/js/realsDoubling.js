import { addCalculatedPoint, graphToCoords } from './graphHelpers';

function calculateDouble(myGraph, point) {
    const newPoint = [];
    const newPointArr = [];

    const lambda = (3 * point.x * point.x + myGraph.parameterA) / (2 * point.y);
    newPoint.x = lambda * lambda - 2 * point.x;
    newPoint.y = -point.y + lambda * (point.x - newPoint.x);

    return newPoint;
}

function pointDouble(myGraph) {
    let newPointArr = [];

    const points = document.getElementsByClassName('workingPoints');
    const storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
    };

    const pointArr = graphToCoords(myGraph, storePoints.point1);

    newPointArr = calculateDouble(myGraph, pointArr);

    addCalculatedPoint(myGraph, newPointArr.x, newPointArr.y, 2);
}

export { pointDouble, calculateDouble };
