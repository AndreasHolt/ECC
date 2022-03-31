import { addCalculatedPoint } from './graphHelpers';

function pointDouble(myGraph) {
    const points = document.getElementsByClassName('workingPoints');
    const storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
    };

    const x = (storePoints.point1[0] - myGraph.centerX) / myGraph.scaleX;
    const y = -(storePoints.point1[1] - myGraph.centerY) / myGraph.scaleY;

    const lambda = (3 * x * x + myGraph.parameterA) / (2 * y);
    const newX = lambda * lambda - 2 * x;
    const newY = -y + lambda * (x - newX);

    addCalculatedPoint(myGraph, newX, newY, 2);
}

export { pointDouble };
