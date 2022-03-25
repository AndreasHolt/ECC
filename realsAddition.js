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

  myGraph.addCalculatedPoint(newX, newY, 1);
};
