/// <reference types="cypress" />
/* eslint-disable no-undef */

// import {
//     Graph, drawXAxis, drawYAxis, drawEquation, transformContext,
// } from '../../src/js/graph';
import {
    movePoint, moveSection, mouseToGraph, graphToCoords, coordsToGraph, getPointPlacement, addCalculatedPoint, logicPointAddition, drawLine, addPointOnClick,
} from '../../src/js/graphHelpers';
// import { myGraph } from '../../src/js/script';

const myGraph = {
    canvas: {},
    minX: -10,
    minY: -10,
    maxX: 10,
    maxY: 10,
    parameterA: -5,
    parameterB: 15,
    unitsPerTick: 2,
    axisColor: 'rgb(155,163,175)',
    font: '10pt Calibri',
    tickSize: 20,
    context: {},
    rangeX: 20,
    rangeY: 20,
    unitX: 37.55,
    unitY: 19.5,
    iteration: 0.02,
    scaleX: 37.55,
    scaleY: 19.5,
    pointSize: 4,
    svgID: 'pointSVG',
    offsetTop: 122,
    offsetLeft: 265,
    centerY: 195,
    centerX: 375.5,
};

describe('Unit Test Application Code', () => {
    // const { add, divide, multiply, subtract } = math

    before(() => {
        // check if the import worked correctly
        // expect(moveSection, 'moveSection').to.be.a('function');
        cy.visit('http://localhost:3000/');
    });

    context('graphHelpers.js', () => {
        it('mouseToGraph X coordinate', () => {
            expect(mouseToGraph(myGraph, 1, 2).x).to.eq(-264);
        });

        it('mouseToGraph X coordinate', () => {
            expect(mouseToGraph(myGraph, 1, 2).y).to.eq(-120);
        });
    });

    // before(() => {
    //   // check if the import worked correctly
    //   expect(add, 'add').to.be.a('function')
    // })

    // context('math.js', function () {
    //   it('can add numbers', function () {
    //     expect(add(1, 2)).to.eq(3)
    //   })

    //   it('can subtract numbers', function () {
    //     expect(subtract(5, 12)).to.eq(-7)
    //   })

    //   it('can divide numbers', function () {
    //     expect(divide(27, 9)).to.eq(3)
    //   })

    //   it('can muliple numbers', function () {
    //     expect(multiply(5, 4)).to.eq(20)
    //   })
    // })

    // context('fizzbuzz.js', function () {
    //   function numsExpectedToEq (arr, expected) {
    //     // loop through the array of nums and make
    //     // sure they equal what is expected
    //     arr.forEach((num) => {
    //       expect(fizzbuzz(num)).to.eq(expected)
    //     })
    //   }

    //   it('returns "fizz" when number is multiple of 3', function () {
    //     numsExpectedToEq([9, 12, 18], 'fizz')
    //   })

    //   it('returns "buzz" when number is multiple of 5', function () {
    //     numsExpectedToEq([10, 20, 25], 'buzz')
    //   })

    //   it('returns "fizzbuzz" when number is multiple of both 3 and 5', function () {
    //     numsExpectedToEq([15, 30, 60], 'fizzbuzz')
    //   })
    // })
});
