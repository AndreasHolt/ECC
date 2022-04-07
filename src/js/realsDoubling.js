import { addCalculatedPoint } from './graphHelpers';

function pointDouble(myGraph) {
    const pointArr = [];
    let newPointArr = [];

    const points = document.getElementsByClassName('workingPoints');
    const storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
    };

    pointArr[0] = (storePoints.point1[0] - myGraph.centerX) / myGraph.scaleX;
    pointArr[1] = -(storePoints.point1[1] - myGraph.centerY) / myGraph.scaleY;

    newPointArr = calculateDouble(myGraph, pointArr);

    addCalculatedPoint(myGraph, newPointArr[0], newPointArr[1], 2);
}

function calculateDouble(myGraph, point) {
    const newPointArr = [];

    const lambda = (3 * point[0] * point[0] + myGraph.parameterA) / (2 * point[1]);
    const newX = lambda * lambda - 2 * point[0];
    const newY = -point[1] + lambda * (point[0] - newX);

    newPointArr[0] = newX;
    newPointArr[1] = newY;

    return newPointArr;
}

export { pointDouble, calculateDouble };
