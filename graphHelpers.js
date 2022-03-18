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
	if(document.getElementsByClassName('calculatedPoints').length == 1){
		document.getElementsByClassName('calculatedPoints')[0].remove();
	}
    var svgNS = "http://www.w3.org/2000/svg";

     var circle = document.createElementNS(svgNS,'circle');
     circle.setAttribute('fill','dodgerblue');
     circle.setAttribute('cx', (x * this.scaleX) + this.centerX);
     circle.setAttribute('cy', (-y * this.scaleY) + this.centerY);
     circle.classList.add('calculatedPoints')
     circle.setAttribute('r',5);

     var svg = document.querySelector('svg');
     svg.appendChild(circle);
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