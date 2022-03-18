Graph.prototype.movePoint = function (event) {
	let mousePos = this.mouseToGraph(event.clientX, event.clientY)
	let coords = this.graphToCoords(mousePos.x, mousePos.y)

	if (mousePos.y > this.centerY) {
		this.moveSection("point", mousePos.x, this.centerY - (-equationP(coords.x) * this.scaleY));
	} else {
		this.moveSection("point", mousePos.x, this.centerY - (equationP(coords.x) * this.scaleY));
	}
};

Graph.prototype.moveSection = function (id, x, y) {
    var el = document.getElementById(id);

    if (!y)
        return

    if (el) {
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
    }
}

Graph.prototype.mouseToGraph = function(mouseX, mouseY) {
	x = (this.centerX - this.offsetLeft) + mouseX - 10 * this.scaleX;
	y = (this.centerY - this.offsetTop) + mouseY - 10 * this.scaleY;
	return {x, y}
}

Graph.prototype.graphToCoords = function(graphX, graphY) {
	x = (graphX/this.scaleX) - this.rangeX/2
	y = -((graphY/this.scaleY) - this.rangeY/2)

	return {x, y}
}

Graph.prototype.coordsToGraph = function(coordsX, coordsY) {
	x = this.centerX - coordsX
	y = this.centerY - coordsY
	return {x, y}
}

Graph.prototype.addCalculatedPoint = function(x, y) {
	if(document.getElementsByClassName('calculatedPoints').length == 2){
		document.getElementsByClassName('calculatedPoints')[1].remove();
		document.getElementsByClassName('calculatedPoints')[0].remove();
        
		document.getElementsByClassName('linesConnecting')[1].remove();
		document.getElementsByClassName('linesConnecting')[0].remove();
	}
    var svgNS = "http://www.w3.org/2000/svg";

    let arrayIntersectInverted = [y, -y]

    for(i = 0; i < arrayIntersectInverted.length; i++){
         var circle = document.createElementNS(svgNS,'circle');
         (i == 0)?(circle.setAttribute('fill','dodgerblue')):(circle.setAttribute('fill','fuchsia'));

         circle.setAttribute('cx', (x * this.scaleX) + this.centerX);
         circle.setAttribute('cy', (-arrayIntersectInverted[i] * this.scaleY) + this.centerY);
         circle.classList.add('calculatedPoints')
         circle.setAttribute('r', 5);

         var svg = document.querySelector('svg');
         svg.appendChild(circle);

        let fromPoint = document.getElementsByClassName('workingPoints')[0]

        var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        if(i == 0){
            newLine.setAttribute('x1',fromPoint.getAttribute('cx'));
            newLine.setAttribute('y1',fromPoint.getAttribute('cy'));

            newLine.classList.add('linesConnecting')
            newLine.setAttribute('x2', (x * this.scaleX) + this.centerX);
            newLine.setAttribute('y2', (arrayIntersectInverted[i+1] * this.scaleY) + this.centerY);
            newLine.setAttribute("stroke", "dodgerblue")
            newLine.setAttribute("stroke-width", "2")
            svg.appendChild(newLine);
        } else {
            newLine.setAttribute('x1', (x * this.scaleX) + this.centerX);
            newLine.setAttribute('y1', (arrayIntersectInverted[i] * this.scaleY) + this.centerY);
 
            newLine.classList.add('linesConnecting')
            newLine.setAttribute('x2', (x * this.scaleX) + this.centerX);
            newLine.setAttribute('y2', (arrayIntersectInverted[i-1] * this.scaleY) + this.centerY);
            newLine.setAttribute("stroke", "fuchsia")
            newLine.setAttribute("stroke-width", "2")
            svg.appendChild(newLine);
        }

        








    }
}

Graph.prototype.addPointOnClick = function() {
    let point = document.getElementById('point')
    var svgNS = "http://www.w3.org/2000/svg";

     var circle = document.createElementNS(svgNS,'circle');
     circle.setAttribute('fill','red');
     circle.setAttribute('cx', point.getAttribute('cx'));
     circle.setAttribute('cy', point.getAttribute('cy'));
     circle.classList.add('workingPoints')
     circle.setAttribute('r',5);

     var svg = document.querySelector('svg');
     svg.appendChild(circle);
}
