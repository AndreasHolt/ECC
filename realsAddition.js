function pointAddition() {
    let points = document.getElementsByClassName('workingPoints')
    
	storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
        point2: [points[1].getAttribute('cx'), points[1].getAttribute('cy')]
    }

    let lambda = ((storePoints.point2[1] - storePoints.point1[1]) / (storePoints.point2[0] - storePoints.point1[0]))
    let thirdX = lambda * lambda  + lambda // *
}