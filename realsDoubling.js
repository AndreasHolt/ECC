Graph.prototype.pointDouble = function () {
    const points = document.getElementsByClassName('workingPoints');
    storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
    };

    const x = (storePoints.point1[0] - this.centerX) / this.scaleX;
    const y = -(storePoints.point1[1] - this.centerY) / this.scaleY;

    const lambda = (3 * x * x + this.parameterA) / (2 * y);
    const newX = lambda * lambda - 2 * x;
    const newY = -y + lambda * (x - newX);

    myGraph.addCalculatedPoint(newX, newY, 2);
};
