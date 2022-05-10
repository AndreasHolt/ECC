import {Mod } from "./bits.js";

class FiniteField {
    constructor () {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 400;
        this.canvas.height = 400;
        //this.canvas.style.border = "1px solid";
        this.canvas.style.position = "absolute";
        this.ctx = this.canvas.getContext("2d");
        this.lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      
        this.highlightSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                          //Alternativer
        this.pointStyle = "fill: rgb(59, 129, 246); stroke: rgb(59, 129, 246); stroke-width: 1px;";         //
        this.operationPointStyle = "fill: red; stroke: red; stroke-width: 1px;";                            //
        this.intermediatePointStyle = "fill: yellow; stroke: yellow; stroke-width: 1px;";                   //
        this.resultPointStyle = "fill: fuchsia; stroke: fuchsia; stroke-width: 1px;";                       // 
    }

    addCanvas (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        //Change svg size???
    }
    addCurve (curve) {
        this.curve = curve;
    }
    addLineSVG (svg) {
        this.lineSVG = svg;
    }
    addHighlightSVG (svg) {
        this.highlightSVG = svg;
    }
    createHTMLElement () {
        let wrapperDiv = document.createElement("div");
        wrapperDiv.appendChild(this.canvas);
        wrapperDiv.appendChild(this.highlightSVG);
        wrapperDiv.appendChild(this.lineSVG);
        let svgStyle = `position: absolute; width: ${this.canvas.width}px; height: ${this.canvas.height}px; overflow: visible;`;
        this.lineSVG.setAttributeNS(null, "style", svgStyle + "z-index: 1;");
        this.highlightSVG.setAttributeNS(null, "style", svgStyle + "z-index: 2;");
        return wrapperDiv;
    }
    drawLineSvg1 (x1, x2, y1, y2, size, color = "black") {
        //let svg = document.getElementById("lineSVG");
        var svgns = "http://www.w3.org/2000/svg";
        var line = document.createElementNS(svgns, 'line');
        //let lines = document.querySelectorAll(".line");
    //
        //lines.forEach(line => {
        //    line.remove();
        //});
    
    
        line.setAttributeNS(null, 'x1', `${x1 * (this.canvas.width / size)}`);
        line.setAttributeNS(null, 'y1', `${this.canvas.height - y1 * (this.canvas.height / size)}`);
        line.setAttributeNS(null, 'x2', `${x2 * (this.canvas.width / size)}`);
        line.setAttributeNS(null, 'y2', `${this.canvas.height - y2 * (this.canvas.height / size)}`); 
        let styleStr = "stroke:" + color;                                                          //(this.canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (this.canvas.height / (curve.fieldOrder * 1.2)) : 5)
        line.setAttributeNS(null, 'style', styleStr);
        line.setAttributeNS(null, 'class', "line");
        this.lineSVG.appendChild(line);
    }
    drawLineDirectGood (point, point3, options) {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        let point1 = {x: point.x, y: point.y};
        let tempPoint = {x: point1.x, y: point1.y};
        let i = 0;
    
        if (options.prime == false && point3.x != 0) {
            point3.y = additiveXOR(point3.y, point3.x);
        } else if (options.prime == true) {
            point3.y = Mod(this.curve.fieldOrder - point3.y, this.curve.fieldOrder);
        }
    
        while(((tempPoint.x != point3.x) || (tempPoint.y != point3.y)) && i < 100) {
            tempPoint.x += 1;
            tempPoint.y += point3.alfa;
    
            if (tempPoint.x === this.curve.fieldOrder && tempPoint.y >= this.curve.fieldOrder) {
                this.drawLineSvg1(point1.x, (tempPoint.x - (tempPoint.y - this.curve.fieldOrder) * (1 / point3.alfa)), point1.y, this.curve.fieldOrder, this.curve.fieldOrder);
                point1.x = tempPoint.x - (tempPoint.y - curve.fieldOrder) * (1 / point3.alfa);
                point1.y = 0;
                this.drawLineSvg1(tempPoint.x - (tempPoint.y - this.curve.fieldOrder) * (1 / point3.alfa), this.curve.fieldOrder, 0, point1.y, this.curve.fieldOrder);
            } else if (tempPoint.x === this.curve.fieldOrder) {
                this.drawLineSvg1(point1.x, tempPoint.x, point1.y, tempPoint.y, curve.fieldOrder);
                point1.x = 0;
                point1.y = tempPoint.y;
            } else if (tempPoint.y >= this.curve.fieldOrder) {
                this.drawLineSvg1(point1.x, (tempPoint.x - (tempPoint.y- this.curve.fieldOrder) / point3.alfa), point1.y, this.curve.fieldOrder, this.curve.fieldOrder);
                point1.x = tempPoint.x - (tempPoint.y - this.curve.fieldOrder) / point3.alfa;
                point1.y = 0;
            }
    
            tempPoint.x = Mod(tempPoint.x, this.curve.fieldOrder);
            tempPoint.y = Mod(tempPoint.y, this.curve.fieldOrder);
    
            ++i;
        }
    
        this.drawLineSvg1(point1.x, tempPoint.x, point1.y, tempPoint.y, this.curve.fieldOrder);
    
        if (tempPoint.x === point3.x && tempPoint.y === point3.y) {
            console.log("is true");
            this.drawLineSvg1(tempPoint.x, point3.x, tempPoint.y, Mod(this.curve.fieldOrder - point3.y, this.curve.fieldOrder), this.curve.fieldOrder, "green");
        }
    }
}

class InteractibleFiniteField extends FiniteField {
    
}


export {FiniteField};