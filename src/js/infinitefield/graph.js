function drawXAxis(myGraph) {
    const { context } = myGraph;
    context.save();
    context.beginPath();
    context.moveTo(0, myGraph.centerY);
    context.lineTo(myGraph.canvas.width, myGraph.centerY);
    context.strokeStyle = myGraph.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    const xPosIncrement = myGraph.unitsPerTick * myGraph.unitX;
    let xPos; let
        unit;
    context.font = myGraph.font;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // draw left tick marks
    xPos = myGraph.centerX - xPosIncrement;
    unit = -1 * myGraph.unitsPerTick;
    while (xPos > 0) {
        context.moveTo(xPos, myGraph.centerY - myGraph.tickSize / 2);
        context.lineTo(xPos, myGraph.centerY + myGraph.tickSize / 2);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, xPos, myGraph.centerY + myGraph.tickSize / 2 + 3);
        unit -= myGraph.unitsPerTick;
        xPos = Math.round(xPos - xPosIncrement);
    }

    // draw right tick marks
    xPos = myGraph.centerX + xPosIncrement;
    unit = myGraph.unitsPerTick;
    while (xPos < myGraph.canvas.width) {
        context.moveTo(xPos, myGraph.centerY - myGraph.tickSize / 2);
        context.lineTo(xPos, myGraph.centerY + myGraph.tickSize / 2);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, xPos, myGraph.centerY + myGraph.tickSize / 2 + 3);
        unit += myGraph.unitsPerTick;
        xPos = Math.round(xPos + xPosIncrement);
    }
    context.restore();
}

function drawYAxis(myGraph) {
    const { context } = myGraph;
    context.save();
    context.beginPath();
    context.moveTo(myGraph.centerX, 0);
    context.lineTo(myGraph.centerX, myGraph.canvas.height);
    context.strokeStyle = myGraph.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    const yPosIncrement = myGraph.unitsPerTick * myGraph.unitY;
    let yPos; let
        unit;
    context.font = myGraph.font;
    context.textAlign = 'right';
    context.textBaseline = 'middle';

    // draw top tick marks
    yPos = myGraph.centerY - yPosIncrement;
    unit = myGraph.unitsPerTick;
    while (yPos > 0) {
        context.moveTo(myGraph.centerX - myGraph.tickSize / 2, yPos);
        context.lineTo(myGraph.centerX + myGraph.tickSize / 2, yPos);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, myGraph.centerX - myGraph.tickSize / 2 - 3, yPos);
        unit += myGraph.unitsPerTick;
        yPos = Math.round(yPos - yPosIncrement);
    }

    // draw bottom tick marks
    yPos = myGraph.centerY + yPosIncrement;
    unit = -1 * myGraph.unitsPerTick;
    while (yPos < myGraph.canvas.height) {
        context.moveTo(myGraph.centerX - myGraph.tickSize / 2, yPos);
        context.lineTo(myGraph.centerX + myGraph.tickSize / 2, yPos);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, myGraph.centerX - myGraph.tickSize / 2 - 3, yPos);
        unit -= myGraph.unitsPerTick;
        yPos = Math.round(yPos + yPosIncrement);
    }
    context.restore();
}

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
    // this.domRect = this.canvas.getBoundingClientRect();

    // constants
    this.axisColor = 'rgb(155,163,175)';
    this.font = '10pt Calibri';
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

    // eslint-disable-next-line func-names
    this.equationP = function (x) {
        return Math.sqrt((x * x * x) + this.parameterA * x + this.parameterB);
    };

    // draw x and y axis
    drawXAxis(this);
    drawYAxis(this);
}

function transformContext(myGraph) {
    const { context } = myGraph;

    // move context to center of canvas
    myGraph.context.translate(myGraph.centerX, myGraph.centerY);

    /*
    * stretch grid to fit the canvas window, and
    * invert the y scale so that that increments
    * as you move upwards
    */
    context.scale(myGraph.scaleX, -myGraph.scaleY);
}

function drawEquation(equation, color, thickness, myGraph) {
    const { context } = myGraph;
    context.save();
    context.save();
    transformContext(myGraph);

    context.beginPath();
    context.moveTo(myGraph.minX, equation(myGraph.minX));

    let lastX = 0;

    /*for (let x = myGraph.minX + myGraph.iteration; x <= myGraph.maxX; x += myGraph.iteration) {
        if (Number.isNaN(equation(x))) {
            lastX = x;
        }
    }*/

    const realRootMultiplier = 1.01;
    const realRoot = lastX * realRootMultiplier;

    let isPrevXInSolution = false;
    let isCurrentXInSolution = false;
    for (let x = myGraph.minX + myGraph.iteration; x <= myGraph.maxX; x += myGraph.iteration) {
        if (Number.isNaN(equation(x)) /*&& x > realRoot*/) {
            //context.lineTo(x, 0);
            isCurrentXInSolution = false;
        } else {
            
            isCurrentXInSolution = true;
        }

        if (isCurrentXInSolution || isPrevXInSolution) {
            if (isCurrentXInSolution && isPrevXInSolution) {
                context.lineTo(x, equation(x));
            } else if (isCurrentXInSolution) {
                context.beginPath();
                context.moveTo(x - myGraph.iteration, 0);
                context.lineTo(x, equation(x));
            } else {
                context.lineTo(x, 0);
                context.restore();
                context.lineJoin = 'round';
                context.lineWidth = thickness;
                context.strokeStyle = color;
                context.stroke();
                context.closePath();
                context.save();
                transformContext(myGraph);
            }

        }



        isPrevXInSolution = isCurrentXInSolution;
    }

    context.restore();
    context.lineJoin = 'round';
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();
    context.restore();
}

export {
    Graph, drawXAxis, drawYAxis, drawEquation, transformContext,
};
