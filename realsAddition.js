function pointAddition() {
    let points = document.getElementsByClassName('workingPoints')
    
	storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
        point2: [points[1].getAttribute('cx'), points[1].getAttribute('cy')]
    }
    let x1 = storePoints.point1[0], y1 = storePoints.point1[1];
    let x2 = storePoints.point2[0], y2 = storePoints.point2[1];

    let lambda = ((y2 - y1) / (x2 - x1));
    let newX = lambda * lambda  - x2 - x1;
    let newY = -y2 + lambda*(x2-newX);
}