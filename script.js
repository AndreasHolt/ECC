/// ----------------------------------------------------------------------
/// Configuration of graph
/// ----------------------------------------------------------------------

  function Graph(config) {
    // user defined properties
    this.canvas = document.getElementById(config.canvasId);
    this.minX = config.minX;
    this.minY = config.minY;
    this.maxX = config.maxX;
    this.maxY = config.maxY;
    this.unitsPerTick = config.unitsPerTick;
    this.domRect = this.canvas.getBoundingClientRect();

    // constants
    this.axisColor = '#aaa';
    this.font = '8pt Calibri';
    this.tickSize = 20;

    // relationships
    this.context = this.canvas.getContext('2d');
    this.rangeX = this.maxX - this.minX;
    this.rangeY = this.maxY - this.minY;
    this.unitX = this.canvas.width / this.rangeX;
    this.unitY = this.canvas.height / this.rangeY;
    this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.canvas.height);
    this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.canvas.width);
    this.iteration = (this.maxX - this.minX) / 1000;
    this.scaleX = this.canvas.width / this.rangeX;
    this.scaleY = this.canvas.height / this.rangeY;

    // draw x and y axis
    this.drawXAxis();
    this.drawYAxis();
  }

  Graph.prototype.drawXAxis = function() {
    var context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(0, this.centerY);
    context.lineTo(this.canvas.width, this.centerY);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    var xPosIncrement = this.unitsPerTick * this.unitX;
    var xPos, unit;
    context.font = this.font;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // draw left tick marks
    xPos = this.centerX - xPosIncrement;
    unit = -1 * this.unitsPerTick;
    while(xPos > 0) {
      context.moveTo(xPos, this.centerY - this.tickSize / 2);
      context.lineTo(xPos, this.centerY + this.tickSize / 2);
      context.stroke();
      context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
      unit -= this.unitsPerTick;
      xPos = Math.round(xPos - xPosIncrement);
        console.log(xPos)
    }

    // draw right tick marks
    xPos = this.centerX + xPosIncrement;
    unit = this.unitsPerTick;
    while(xPos < this.canvas.width) {
      context.moveTo(xPos, this.centerY - this.tickSize / 2);
      context.lineTo(xPos, this.centerY + this.tickSize / 2);
      context.stroke();
      context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
      unit += this.unitsPerTick;
      xPos = Math.round(xPos + xPosIncrement);
    }
    context.restore();
  };

  Graph.prototype.drawYAxis = function() {
    var context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, this.canvas.height);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    var yPosIncrement = this.unitsPerTick * this.unitY;
    var yPos, unit;
    context.font = this.font;
    context.textAlign = 'right';
    context.textBaseline = 'middle';

    // draw top tick marks
    yPos = this.centerY - yPosIncrement;
    unit = this.unitsPerTick;
    while(yPos > 0) {
      context.moveTo(this.centerX - this.tickSize / 2, yPos);
      context.lineTo(this.centerX + this.tickSize / 2, yPos);
      context.stroke();
      context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
      unit += this.unitsPerTick;
      yPos = Math.round(yPos - yPosIncrement);
    }

    // draw bottom tick marks
    yPos = this.centerY + yPosIncrement;
    unit = -1 * this.unitsPerTick;
    while(yPos < this.canvas.height) {
      context.moveTo(this.centerX - this.tickSize / 2, yPos);
      context.lineTo(this.centerX + this.tickSize / 2, yPos);
      context.stroke();
      context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
      unit -= this.unitsPerTick;
      yPos = Math.round(yPos + yPosIncrement);
    }
    context.restore();
  };

  Graph.prototype.drawEquation = function(equation, color, thickness) {
    var context = this.context;
    context.save();
    context.save();
    this.transformContext();

    context.beginPath();
    context.moveTo(this.minX, equation(this.minX));

    for(var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
      context.lineTo(x, equation(x));
    }

    context.restore();
    context.lineJoin = 'round';
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();
    context.restore();
  };




  Graph.prototype.transformContext = function() {
    var context = this.context;

    // move context to center of canvas
    this.context.translate(this.centerX, this.centerY);

    /*
     * stretch grid to fit the canvas window, and
     * invert the y scale so that that increments
     * as you move upwards
     */
    context.scale(this.scaleX, -this.scaleY);
  };


// Defining new graph

  var myGraph = new Graph({
    canvasId: 'myCanvas',
    minX: -10,
    minY: -10,
    maxX: 10,
    maxY: 10,
    unitsPerTick: 1
  });



  myGraph.drawEquation(function(x) {
    return Math.sqrt(x*x*x-7*x+10);
  }, 'green', 3);

  myGraph.drawEquation(function(x) {
    return -Math.sqrt(x*x*x-7*x+10);
  }, 'green', 3);

/// ----------------------------------------------------------------------
/// Draw points on graph
/// ----------------------------------------------------------------------


document.getElementById('myCanvas').addEventListener('click', e => {
    myGraph.getPosition(e)
});

var pointSize = 10;

Graph.prototype.getPosition = function(event){

     var rect = this.domRect;
     var x = event.clientX - rect.left;
     var y = event.clientY - rect.top;
        
     myGraph.drawCoordinates(x,y);
}

Graph.prototype.drawCoordinates = function(x,y){	
    // Draw rectangle
    this.context.strokeRect(x,y,2,2);

    // Not working yet. Drawing cicles instead of rectangles..
  	this.context.fillStyle = "#ff2626"; // Red color
    this.context.beginPath();
    this.context.arc(this.scaleX * x, this.scaleY * y, pointSize, 0, Math.PI * 2, true);
    this.context.fill();
    console.log('printed')
}
