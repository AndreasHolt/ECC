Graph.prototype.pointAddition = function () {
    const points = document.getElementsByClassName('workingPoints');

    storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
        point2: [points[1].getAttribute('cx'), points[1].getAttribute('cy')],
    };
    const x1 = (storePoints.point1[0] - this.centerX) / this.scaleX; const
        y1 = (storePoints.point1[1] - this.centerY) / this.scaleY;
    const x2 = (storePoints.point2[0] - this.centerX) / this.scaleX; const
        y2 = (storePoints.point2[1] - this.centerY) / this.scaleY;

    const lambda = ((y2 - y1) / (x2 - x1));
    const newX = (lambda * lambda) - x2 - x1;
    const newY = y2 + lambda * newX + lambda * (-x2);

    myGraph.latexAddition(storePoints, newX, newY)
    myGraph.addCalculatedPoint(newX, newY, 1);
};

Graph.prototype.latexAddition = function (placedPoints, calculatedX, calculatedY) {
    let pObj = this.graphToCoords(placedPoints.point1[0], placedPoints.point1[1])
    let P = `${Math.round(pObj.x * 100) / 100}, ${Math.round(-pObj.y * 100) / 100}`;

    let qObj = this.graphToCoords(placedPoints.point2[0], placedPoints.point2[1])
    let Q = `${Math.round(qObj.x * 100) / 100}, ${Math.round(-qObj.y * 100) / 100}`;

    console.log(calculatedX, calculatedY)
    let minusR = `${Math.round(calculatedX * 100) / 100}, ${Math.round(-calculatedY* 100) / 100}`;
    let R = `${Math.round(calculatedX * 100) / 100}, ${Math.round(calculatedY* 100) / 100}`;

    let pointsListed = document.getElementById('pointsListed')
    pointsListed.innerHTML = `\\(P = (${P})\\) &nbsp \\(Q = (${Q})\\) &nbsp \\(-R = (${minusR})\\) &nbsp \\(R = (${R})\\)`



    MathJax.typeset()

}
