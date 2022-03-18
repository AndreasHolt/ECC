var myGraph = new Graph({
	canvasId: 'myCanvas',
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	unitsPerTick: 1
});

var pointGraph = new Graph({
	canvasId: 'myCanvas',
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	unitsPerTick: 1
});

function equationP(x) {
	let a = -4, b = 15;
	return Math.sqrt((x * x * x) + a * x + b);
}

myGraph.drawEquation(function (x) {
	return equationP(x);
}, 'green', 3);

myGraph.drawEquation(function (x) {
	return -equationP(x);
}, 'green', 3);

/// ----------------------------------------------------------------------
/// Draw points on graph
/// ----------------------------------------------------------------------


document.getElementById('pointSVG').addEventListener('mousemove', e => {
	myGraph.movePoint(e);
});

let operations = document.getElementsByClassName('operation');

function init() {
	for (const input of operations) {
		input.addEventListener('click',  e => {
			let pointsOnGraph = document.getElementsByClassName('workingPoints');
			let calculatedPoints = document.getElementsByClassName('calculatedPoints');

			for (const buttons of operations) {
				if(buttons.disabled == true) {
					buttons.disabled = false;
				}
			}

			if(pointsOnGraph.length == 2) {
				pointsOnGraph[1].remove()
				pointsOnGraph[0].remove()
			} else if(pointsOnGraph.length == 1) {
				pointsOnGraph[0].remove()
			} 

			if(calculatedPoints.length == 1) {
				calculatedPoints[0].remove();
			}
			
			input.disabled = true;
		});
	}
}

init()

document.getElementById('layer2').addEventListener('click', e => {
    let pointsOnGraph = document.getElementsByClassName('workingPoints')

    // Delete the point on the graph that was placed first
	if(operations[0].disabled){
		if(pointsOnGraph.length === 1){
			myGraph.addPointOnClick();
			runOperation(1);   
	
		} else if(pointsOnGraph.length === 0){
			myGraph.addPointOnClick();
	
		} else {
			pointsOnGraph[0].remove();
			myGraph.addPointOnClick();
			runOperation(1);
		}
	} else if (operations[1].disabled) {
		if(pointsOnGraph.length === 0){
			myGraph.addPointOnClick();
			runOperation(2);   

		} else if(pointsOnGraph.length === 1){
			pointsOnGraph[0].remove();
			myGraph.addPointOnClick();
			runOperation(2);
		}
	}
});

function runOperation(operations) {
	switch (operations) {
		case 1:
			pointAddition();
			break;
		case 2:
			myGraph.pointDouble();
			break;
		case 3:
			console.log('Hey Chat!');
			break;
		default:
			console.log('Please no');
			break;
	}
}