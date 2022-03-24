let scaleZoom = 10

var myGraph = new Graph({
	canvasId: 'myCanvas',
	minX: -scaleZoom,
	minY: -scaleZoom,
	maxX: scaleZoom,
	maxY: scaleZoom,
	parameterA: -5,
	parameterB: 15,
	unitsPerTick: scaleZoom/5
});

Graph.prototype.equationP = function(x) {
	return Math.sqrt((x * x * x) + this.parameterA * x + this.parameterB);
}

function drawEquation() {
	myGraph.drawEquation(function (x) {
		return myGraph.equationP(x);
	}, 'green', 3);
	
	myGraph.drawEquation(function (x) {
		return -myGraph.equationP(x);
	}, 'green', 3);
}

drawEquation()



document.getElementById("pointSVG").addEventListener("wheel", e => {
	console.log(e.deltaY);

	myGraph.context.clearRect(0, 0, 578, 300) // Use var of size instead

	if (e.deltaY < 0) { // Zoom in
		scaleZoom /= 1.02;
	} else {
		scaleZoom *= 1.02; // Zoom out
	}

	myGraph = new Graph({
		canvasId: 'myCanvas',
		minX: -scaleZoom,
		minY: -scaleZoom,
		maxX: scaleZoom,
		maxY: scaleZoom,
		unitsPerTick: scaleZoom/5
	});

	drawEquation()
})

/// ----------------------------------------------------------------------
/// Draw points on graph
/// ----------------------------------------------------------------------
function deletePoints() {
	let allSVG = [
		document.getElementsByClassName('workingPoints'),
		document.getElementsByClassName('linesConnecting'),
		document.getElementsByClassName('calculatedPoints')
	]
	
	for(const key of allSVG) {
		for(let i = key.length; i > 0; i--) {
			console.log(key[i-1])
			key[i-1].remove();
		}
	}
}

document.getElementById('pointSVG').addEventListener('mousemove', e => {
	myGraph.movePoint(e);
});

let operations = document.getElementsByClassName('operation');

function init() {
	for (const input of operations) {
		input.addEventListener('click',  e => {

			for (const buttons of operations) {
				if(buttons.disabled == true) {
					buttons.disabled = false;
				}
			}
			
			deletePoints();
			
			e.target.disabled = true;
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
			deletePoints();
		}
	} else if (operations[1].disabled) {
		if(pointsOnGraph.length === 0){
			myGraph.addPointOnClick();
			runOperation(2);   

		} else if(pointsOnGraph.length === 1){
			deletePoints();
		}
	}
});

function runOperation(operations) {
	switch (operations) {
		case 1:
			myGraph.pointAddition();
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
