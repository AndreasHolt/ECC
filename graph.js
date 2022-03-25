function Graph(config) {
  // user defined properties
  this.canvas = document.getElementById(config.canvasId);
  this.minX = config.minX;
  this.minY = config.minY;
  this.maxX = config.maxX;
  this.maxY = config.maxY;
  this.parameterA = config.parameterA;
  this.parameterB = config.parameterB;
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
  // this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.canvas.height);
  // this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.canvas.width);
  this.iteration = (this.maxX - this.minX) / 1000;
  this.scaleX = this.canvas.width / this.rangeX;
  this.scaleY = this.canvas.height / this.rangeY;

  // our settings
  this.pointSize = 4;
  this.svgID = 'pointSVG';
  this.offsetTop = this.canvas.offsetTop;
  this.offsetLeft = this.canvas.offsetLeft;
  this.centerY = (Math.abs(this.minY / this.rangeY) * this.canvas.height);
  this.centerX = (Math.abs(this.minX / this.rangeX) * this.canvas.width);

  // draw x and y axis
  this.drawXAxis();
  this.drawYAxis();
}

Graph.prototype.drawXAxis = function () {
  const { context } = this;
  context.save();
  context.beginPath();
  context.moveTo(0, this.centerY);
  context.lineTo(this.canvas.width, this.centerY);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 2;
  context.stroke();

  // draw tick marks
  const xPosIncrement = this.unitsPerTick * this.unitX;
  let xPos; let
    unit;
  context.font = this.font;
  context.textAlign = 'center';
  context.textBaseline = 'top';

  // draw left tick marks
  xPos = this.centerX - xPosIncrement;
  unit = -1 * this.unitsPerTick;
  while (xPos > 0) {
    context.moveTo(xPos, this.centerY - this.tickSize / 2);
    context.lineTo(xPos, this.centerY + this.tickSize / 2);
    context.stroke();
    context.fillText(Math.round(unit * 100) / 100, xPos, this.centerY + this.tickSize / 2 + 3);
    unit -= this.unitsPerTick;
    xPos = Math.round(xPos - xPosIncrement);
  }

  // draw right tick marks
  xPos = this.centerX + xPosIncrement;
  unit = this.unitsPerTick;
  while (xPos < this.canvas.width) {
    context.moveTo(xPos, this.centerY - this.tickSize / 2);
    context.lineTo(xPos, this.centerY + this.tickSize / 2);
    context.stroke();
    context.fillText(Math.round(unit * 100) / 100, xPos, this.centerY + this.tickSize / 2 + 3);
    unit += this.unitsPerTick;
    xPos = Math.round(xPos + xPosIncrement);
  }
  context.restore();
};

Graph.prototype.drawYAxis = function () {
  const { context } = this;
  context.save();
  context.beginPath();
  context.moveTo(this.centerX, 0);
  context.lineTo(this.centerX, this.canvas.height);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 2;
  context.stroke();

  // draw tick marks
  const yPosIncrement = this.unitsPerTick * this.unitY;
  let yPos; let
    unit;
  context.font = this.font;
  context.textAlign = 'right';
  context.textBaseline = 'middle';

  // draw top tick marks
  yPos = this.centerY - yPosIncrement;
  unit = this.unitsPerTick;
  while (yPos > 0) {
    context.moveTo(this.centerX - this.tickSize / 2, yPos);
    context.lineTo(this.centerX + this.tickSize / 2, yPos);
    context.stroke();
    context.fillText(Math.round(unit * 100) / 100, this.centerX - this.tickSize / 2 - 3, yPos);
    unit += this.unitsPerTick;
    yPos = Math.round(yPos - yPosIncrement);
  }

  // draw bottom tick marks
  yPos = this.centerY + yPosIncrement;
  unit = -1 * this.unitsPerTick;
  while (yPos < this.canvas.height) {
    context.moveTo(this.centerX - this.tickSize / 2, yPos);
    context.lineTo(this.centerX + this.tickSize / 2, yPos);
    context.stroke();
    context.fillText(Math.round(unit * 100) / 100, this.centerX - this.tickSize / 2 - 3, yPos);
    unit -= this.unitsPerTick;
    yPos = Math.round(yPos + yPosIncrement);
  }
  context.restore();
};

Graph.prototype.drawEquation = function (equation, color, thickness) {
  const { context } = this;
  context.save();
  context.save();
  this.transformContext();

  context.beginPath();
  context.moveTo(this.minX, equation(this.minX));

  let lastX = 0;

  for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
    if (isNaN(equation(x))) {
      lastX = x;
    }
  }

  const realRootMultiplier = 1.01;
  const realRoot = lastX * realRootMultiplier;

  for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
    if (isNaN(equation(x)) && x > realRoot) {
      context.lineTo(x, 0);
    } else {
      context.lineTo(x, equation(x));
    }
  }

  context.restore();
  context.lineJoin = 'round';
  context.lineWidth = thickness;
  context.strokeStyle = color;
  context.stroke();
  context.restore();
};

Graph.prototype.transformContext = function () {
  const { context } = this;

  // move context to center of canvas
  this.context.translate(this.centerX, this.centerY);

  /*
	 * stretch grid to fit the canvas window, and
	 * invert the y scale so that that increments
	 * as you move upwards
	 */
  context.scale(this.scaleX, -this.scaleY);
};
