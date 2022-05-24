function drawXAxis(rGraph) {
    const { context } = rGraph;
    context.save();
    context.beginPath();
    context.moveTo(0, rGraph.centerY);
    context.lineTo(rGraph.canvas.width, rGraph.centerY);
    context.strokeStyle = rGraph.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    const xPosIncrement = rGraph.unitsPerTick * rGraph.unitX;
    let xPos; let
        unit;
    context.font = rGraph.font;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    // draw left tick marks
    xPos = rGraph.centerX - xPosIncrement;
    unit = -1 * rGraph.unitsPerTick;
    while (xPos > 0) {
        context.moveTo(xPos, rGraph.centerY - rGraph.tickSize / 2);
        context.lineTo(xPos, rGraph.centerY + rGraph.tickSize / 2);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, xPos, rGraph.centerY + rGraph.tickSize / 2 + 3);
        unit -= rGraph.unitsPerTick;
        xPos = Math.round(xPos - xPosIncrement);
    }

    // draw right tick marks
    xPos = rGraph.centerX + xPosIncrement;
    unit = rGraph.unitsPerTick;
    while (xPos < rGraph.canvas.width) {
        context.moveTo(xPos, rGraph.centerY - rGraph.tickSize / 2);
        context.lineTo(xPos, rGraph.centerY + rGraph.tickSize / 2);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, xPos, rGraph.centerY + rGraph.tickSize / 2 + 3);
        unit += rGraph.unitsPerTick;
        xPos = Math.round(xPos + xPosIncrement);
    }
    context.restore();
}

function drawYAxis(rGraph) {
    const { context } = rGraph;
    context.save();
    context.beginPath();
    context.moveTo(rGraph.centerX, 0);
    context.lineTo(rGraph.centerX, rGraph.canvas.height);
    context.strokeStyle = rGraph.axisColor;
    context.lineWidth = 2;
    context.stroke();

    // draw tick marks
    const yPosIncrement = rGraph.unitsPerTick * rGraph.unitY;
    let yPos; let
        unit;
    context.font = rGraph.font;
    context.textAlign = 'right';
    context.textBaseline = 'middle';

    // draw top tick marks
    yPos = rGraph.centerY - yPosIncrement;
    unit = rGraph.unitsPerTick;
    while (yPos > 0) {
        context.moveTo(rGraph.centerX - rGraph.tickSize / 2, yPos);
        context.lineTo(rGraph.centerX + rGraph.tickSize / 2, yPos);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, rGraph.centerX - rGraph.tickSize / 2 - 3, yPos);
        unit += rGraph.unitsPerTick;
        yPos = Math.round(yPos - yPosIncrement);
    }

    // draw bottom tick marks
    yPos = rGraph.centerY + yPosIncrement;
    unit = -1 * rGraph.unitsPerTick;
    while (yPos < rGraph.canvas.height) {
        context.moveTo(rGraph.centerX - rGraph.tickSize / 2, yPos);
        context.lineTo(rGraph.centerX + rGraph.tickSize / 2, yPos);
        context.stroke();
        context.fillText(Math.round(unit * 100) / 100, rGraph.centerX - rGraph.tickSize / 2 - 3, yPos);
        unit -= rGraph.unitsPerTick;
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

function transformContext(rGraph) {
    const { context } = rGraph;

    // move context to center of canvas
    rGraph.context.translate(rGraph.centerX, rGraph.centerY);

    /*
    * stretch grid to fit the canvas window, and
    * invert the y scale so that that increments
    * as you move upwards
    */
    context.scale(rGraph.scaleX, -rGraph.scaleY);
}

function drawEquation(equation, color, thickness, rGraph) {
    const { context } = rGraph;
    context.save();
    context.save();
    transformContext(rGraph);

    // context.beginPath();
    // context.moveTo(rGraph.minX, equation(rGraph.minX));

    // let lastX = 0;

    /* for (let x = rGraph.minX + rGraph.iteration; x <= rGraph.maxX; x += rGraph.iteration) {
        if (Number.isNaN(equation(x))) {
            lastX = x;
        }
    } */

    // const realRootMultiplier = 1.01;
    // const realRoot = lastX * realRootMultiplier;

    let isPrevXInSolution = false;
    let isCurrentXInSolution = false;
    const startX = rGraph.minX + rGraph.iteration;
    for (let x = startX; x <= rGraph.maxX; x += rGraph.iteration) {
        if (Number.isNaN(equation(x))) {
            isCurrentXInSolution = false;
        } else {
            isCurrentXInSolution = true;
        }

        if (isCurrentXInSolution || isPrevXInSolution) {
            if (isCurrentXInSolution && isPrevXInSolution) {
                context.lineTo(x, equation(x));
            } else if (isCurrentXInSolution) {
                context.beginPath();
                if (x === startX) {
                    context.moveTo(x, equation(x));
                } else {
                    context.moveTo(x - rGraph.iteration, 0);
                }
                context.lineTo(x, equation(x));
            } else {
                context.lineTo(x, 0);
                context.restore();
                context.lineJoin = 'round';
                context.lineWidth = thickness;
                context.strokeStyle = color;
                context.stroke();
                context.save();
                transformContext(rGraph);
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
