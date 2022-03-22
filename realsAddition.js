Graph.prototype.pointAddition = function() {
    let points = document.getElementsByClassName('workingPoints')
    
	storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
        point2: [points[1].getAttribute('cx'), points[1].getAttribute('cy')]
    }
    let x1 = (storePoints.point1[0]-this.centerX)/this.scaleX, y1 = (storePoints.point1[1]-this.centerY)/this.scaleY;
    let x2 = (storePoints.point2[0]-this.centerX)/this.scaleX, y2 = (storePoints.point2[1]-this.centerY)/this.scaleY;
    console.log(x1, x2, y1, y2)
    

    let lambda = ((y2 - y1) / (x2 - x1));
    let newX = (lambda * lambda) - x2 - x1;
    let newY = y2 + lambda*newX + lambda*(-x2);
    console.log(newX, newY)

    myGraph.addCalculatedPoint(newX, newY, 1);
}