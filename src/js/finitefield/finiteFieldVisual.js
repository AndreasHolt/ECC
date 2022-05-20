import { Mod } from './bits';
import { additiveXOR } from './gf2';

class FiniteField {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        // this.canvas.style.border = "1px solid";
        this.canvas.style.position = 'absolute';
        this.ctx = this.canvas.getContext('2d');
        this.lineSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        this.highlightSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // Alternativer
        this.pointStyle = 'fill: rgb(59, 129, 246); stroke: rgb(59, 129, 246); stroke-width: 5px;'; //
        this.operationPointStyle = 'fill: red; stroke: red; stroke-width: 5px;'; //
        this.intermediatePointStyle = 'fill: yellow; stroke: yellow; stroke-width: 5px;'; //
        this.resultPointStyle = 'fill: fuchsia; stroke: fuchsia; stroke-width: 5px;'; //
    }

    addCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        // Change svg size???
    }

    addCurve(curve) {
        this.curve = curve;
    }

    addLineSVG(svg) {
        this.lineSVG = svg;
    }

    addHighlightSVG(svg) {
        this.highlightSVG = svg;
    }

    createHTMLElement() {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.appendChild(this.canvas);
        wrapperDiv.appendChild(this.highlightSVG);
        wrapperDiv.appendChild(this.lineSVG);
        const svgStyle = `position: absolute; width: ${this.canvas.width}px; height: ${this.canvas.height}px; overflow: visible;`;
        this.lineSVG.setAttributeNS(null, 'style', `${svgStyle}z-index: 1;`);
        this.highlightSVG.setAttributeNS(null, 'style', `${svgStyle}z-index: 2;`);
        return wrapperDiv;
    }

    drawPointSvg(point, style, temp = false) {
        const pointSize = this.canvas.width / (this.curve.fieldOrder * 1.5);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        if (point.x === Infinity) {
            circle.setAttributeNS(null, 'cx', this.canvas.width);
            circle.setAttributeNS(null, 'cy', 0);
        } else {
            circle.setAttributeNS(null, 'cx', point.x * this.canvas.width / this.curve.fieldOrder);
            circle.setAttributeNS(null, 'cy', this.canvas.height - (point.y * this.canvas.height / this.curve.fieldOrder));
        }

        circle.setAttributeNS(null, 'r', pointSize); // (canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (canvas.height / (curve.fieldOrder * 1.2)) : 5)
        circle.setAttributeNS(null, 'style', `${style} pointerEvents: none;`);

        if (temp) {
            circle.setAttributeNS(null, 'class', 'temp');
        }

        this.highlightSVG.appendChild(circle);
    }

    drawLineSvg1(x1, x2, y1, y2, size, color = 'black') {
        // let svg = document.getElementById("lineSVG");
        const svgns = 'http://www.w3.org/2000/svg';
        const line = document.createElementNS(svgns, 'line');
        // let lines = document.querySelectorAll(".line");
        //
        // lines.forEach(line => {
        //    line.remove();
        // });

        line.setAttributeNS(null, 'x1', `${x1 * (this.canvas.width / size)}`);
        line.setAttributeNS(null, 'y1', `${this.canvas.height - y1 * (this.canvas.height / size)}`);
        line.setAttributeNS(null, 'x2', `${x2 * (this.canvas.width / size)}`);
        line.setAttributeNS(null, 'y2', `${this.canvas.height - y2 * (this.canvas.height / size)}`);
        const styleStr = `stroke:${color}`; // (this.canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (this.canvas.height / (curve.fieldOrder * 1.2)) : 5)
        line.setAttributeNS(null, 'style', styleStr);
        line.setAttributeNS(null, 'class', 'line');
        this.lineSVG.appendChild(line);
    }

    drawLineDirectGood(point, point3, options) {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
        const point1 = { x: point.x, y: point.y };
        const tempPoint = { x: point1.x, y: point1.y };
        let i = 0;

        if (options.prime == false && point3.x != 0) {
            point3.y = additiveXOR(point3.y, point3.x);
        } else if (options.prime == true) {
            point3.y = Mod(this.curve.fieldOrder - point3.y, this.curve.fieldOrder);
        }

        while (((tempPoint.x != point3.x) || (tempPoint.y != point3.y)) && i < 100) {
            tempPoint.x += 1;
            tempPoint.y += point3.alfa;

            if (tempPoint.x === this.curve.fieldOrder && tempPoint.y >= this.curve.fieldOrder) {
                this.drawLineSvg1(point1.x, (tempPoint.x - (tempPoint.y - this.curve.fieldOrder) * (1 / point3.alfa)), point1.y, this.curve.fieldOrder, this.curve.fieldOrder);
                point1.x = tempPoint.x - (tempPoint.y - this.curve.fieldOrder) * (1 / point3.alfa);
                point1.y = 0;
                this.drawLineSvg1(tempPoint.x - (tempPoint.y - this.curve.fieldOrder) * (1 / point3.alfa), this.curve.fieldOrder, 0, point1.y, this.curve.fieldOrder);
            } else if (tempPoint.x === this.curve.fieldOrder) {
                this.drawLineSvg1(point1.x, tempPoint.x, point1.y, tempPoint.y, this.curve.fieldOrder);
                point1.x = 0;
                point1.y = tempPoint.y;
            } else if (tempPoint.y >= this.curve.fieldOrder) {
                this.drawLineSvg1(point1.x, (tempPoint.x - (tempPoint.y - this.curve.fieldOrder) / point3.alfa), point1.y, this.curve.fieldOrder, this.curve.fieldOrder);
                point1.x = tempPoint.x - (tempPoint.y - this.curve.fieldOrder) / point3.alfa;
                point1.y = 0;
            }

            tempPoint.x = Mod(tempPoint.x, this.curve.fieldOrder);
            tempPoint.y = Mod(tempPoint.y, this.curve.fieldOrder);

            ++i;
        }

        this.drawLineSvg1(point1.x, tempPoint.x, point1.y, tempPoint.y, this.curve.fieldOrder);

        if (tempPoint.x === point3.x && tempPoint.y === point3.y) {
            console.log('is true');
            this.drawLineSvg1(tempPoint.x, point3.x, tempPoint.y, Mod(this.curve.fieldOrder - point3.y, this.curve.fieldOrder), this.curve.fieldOrder, 'green');
        }
    }

    drawLineDirect(point1, point2, newPoint, delay) {
        const alfa = (point2.y - point1.y) / (point2.x - point1.x);
        this.drawLineDirect_AUX(alfa, 0, this.curve.fieldOrder / 100, point1, newPoint, delay);
    }

    drawLineDirect_AUX(alfa, progress, speed, previousPoint, target, delay) {
        if (progress < this.curve.fieldOrder) {
            // console.log("Alfa: " + alfa);
            const newPoint = { x: Mod(previousPoint.x + speed, this.curve.fieldOrder), y: Mod(previousPoint.y + (alfa * speed), this.curve.fieldOrder) };
            const xDifference = newPoint.x - (previousPoint.x + (speed));
            const xMod = Math.abs(xDifference) > 0.00002;
            const yDifference = newPoint.y - (previousPoint.y + (alfa * speed));
            const yMod = Math.abs(yDifference) > 0.00002;

            const collideX = !xMod && (previousPoint.x - target.x) / (newPoint.x - target.x) < 0;
            const collideY = !yMod && (previousPoint.y - this.curve.inverseOfPoint(target).y) / (newPoint.y - this.curve.inverseOfPoint(target).y) < 0;
            const collide = collideX && collideY;
            console.log(`${collideX} ${collideY}`);
            // console.log(collide);

            if (collide || ((xMod || yMod) && (Math.abs(previousPoint.x - target.x) < speed || Math.abs(newPoint.x - target.x) < speed) && (Math.abs(previousPoint.y - this.curve.inverseOfPoint(target).y) < speed || Math.abs(newPoint.y - this.curve.inverseOfPoint(target).y) < speed))) {
                if ((xMod && yMod) === false) {
                    this.drawLineSvg1(previousPoint.x, target.x, previousPoint.y, this.curve.inverseOfPoint(target).y, this.curve.fieldOrder, 'black');
                    console.log('Hello');
                }
                this.drawLineSvg1(target.x, target.x, this.curve.inverseOfPoint(target).y, target.y, this.curve.fieldOrder, 'green');
            } else {
                if (xMod || yMod) {
                    if (xMod && yMod) {
                        this.drawLineSvg1(previousPoint.x, previousPoint.x + (speed), previousPoint.y, previousPoint.y + (alfa * speed), this.curve.fieldOrder, 'green');
                        this.drawLineSvg1(newPoint.x - (speed), newPoint.x, newPoint.y - (alfa * speed), this.curve.fieldOrder, 'black');
                    } else if (xMod) {
                        this.drawLineSvg1(previousPoint.x, previousPoint.x + (speed), previousPoint.y, newPoint.y, this.curve.fieldOrder, 'black');
                        this.drawLineSvg1(newPoint.x - (speed), newPoint.x, previousPoint.y, newPoint.y, this.curve.fieldOrder, 'black');
                    } else {
                        this.drawLineSvg1(previousPoint.x, newPoint.x, previousPoint.y, previousPoint.y + (alfa * speed), this.curve.fieldOrder, 'black');
                        this.drawLineSvg1(previousPoint.x, newPoint.x, newPoint.y - (alfa * speed), newPoint.y, this.curve.fieldOrder, 'black');
                    }
                } else {
                    this.drawLineSvg1(previousPoint.x, newPoint.x, previousPoint.y, newPoint.y, this.curve.fieldOrder, 'black');
                }
                setTimeout(() => { this.drawLineDirect_AUX(alfa, progress, speed, newPoint, target, delay); }, delay);
            }
        }
    }

    clearVisual() {
        this.lineSVG.querySelectorAll('*').forEach((element) => element.remove());
        this.highlightSVG.querySelectorAll('*').forEach((element) => element.remove());
    }

    pointText(point, string = '', coordinates = false, temp = true) {
        let text = string;
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        textElement.setAttributeNS(null, 'x', point.x * this.canvas.width / this.curve.fieldOrder);
        textElement.setAttributeNS(null, 'y', this.canvas.height - (point.y * this.canvas.height / this.curve.fieldOrder));
        if (temp) {
            textElement.setAttributeNS(null, 'class', 'temp');
        }

        if (coordinates) {
            text += `(${point.x}, ${point.y})`;
        }

        const textNode = document.createTextNode(text);

        textElement.appendChild(textNode);
        this.highlightSVG.appendChild(textElement);
    }
}

// class InteractibleFiniteField extends FiniteField {

// }

export default FiniteField;
