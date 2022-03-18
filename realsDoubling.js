Graph.prototype.pointDouble = function (){
	let points = document.getElementsByClassName('workingPoints');
	storePoints = {
		point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')]
	}

	let x = (storePoints.point1[0]-this.centerX)/this.scaleX;
	let y = -(storePoints.point1[1]-this.centerY)/this.scaleY;

	let lambda = (3*x*x-4)/(2*y); // 10 = elliptic curve parameter a. 
	let newX = lambda * lambda - 2*x;
	let newY = -y + lambda*(x-newX);

	myGraph.addCalculatedPoint(newX, newY);
}