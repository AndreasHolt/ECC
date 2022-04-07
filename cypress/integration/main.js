/// <reference types="cypress" />
/* eslint-disable no-undef */
import {
    movePoint, moveSection, mouseToGraph, graphToCoords, coordsToGraph, getPointPlacement,
    addCalculatedPoint, logicPointAddition, drawLine, addPointOnClick,
} from '../../src/js/graphHelpers';

import { calculateAddition } from '../../src/js/realsAddition';

import { calculateDouble } from '../../src/js/realsDoubling';

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
    before(() => {
        // check if the import worked correctly
        // expect(moveSection, 'moveSection').to.be.a('function');
        cy.visit('http://localhost:3000/');
    });

    // context('Performance', () => {
    //     it('Check page load time', () => {
    //         cy.visit('http://localhost:3000/', {
    //             onBeforeLoad: (win) => {
    //                 win.performance.mark('start-loading');
    //             },
    //             onLoad: (win) => {
    //                 win.performance.mark('end-loading');
    //             },
    //         }).its('performance').then((p) => {
    //             p.measure('pageLoad', 'start-loading', 'end-loading');
    //             const measure = p.getEntriesByName('pageLoad')[0];

    //             assert.isAtMost(measure.duration, 2000);
    //         });
    //     });
    // });

    context('Interface', () => {
        context('Point Addition', () => {
            it('Point Addition button exist', () => {
                cy.get('#pointAddition');
            });

            it('Point Addition button click', () => {
                cy.get('#pointAddition').click();
            });

            it('Point Addition button disabled', () => {
                // This test depends on pointAddition to be clicked above
                cy.get('#pointAddition').should('be.disabled');
                cy.get('#pointDoubling').should('not.be.disabled');
                cy.get('#pointMultiplication').should('not.be.disabled');
            });
        });

        context('Point Doubling', () => {
            it('Point Doubling button exist', () => {
                cy.get('#pointDoubling');
            });

            it('Point Doubling button click', () => {
                cy.get('#pointDoubling').click();
            });

            it('Point Doubling button disabled', () => {
                // This test depends on pointDoubling to be clicked above
                cy.get('#pointAddition').should('not.be.disabled');
                cy.get('#pointDoubling').should('be.disabled');
                cy.get('#pointMultiplication').should('not.be.disabled');
            });
        });

        // Point Multiplication button
        context('Point Multiplication', () => {
            it('Point Multiplication button exist', () => {
                cy.get('#pointMultiplication');
            });

            it('Point Multiplication button click', () => {
                cy.get('#pointMultiplication').click();
            });

            it('Point Multiplication button disabled', () => {
                // This test depends on pointMultiplication to be clicked above
                cy.get('#pointAddition').should('not.be.disabled');
                cy.get('#pointDoubling').should('not.be.disabled');
                cy.get('#pointMultiplication').should('be.disabled');
            });
        });

        context('ECC Graph', () => {
            it('Graph exists', () => {
                cy.get('#myCanvas');
            });

            // TODO get click to work
            it('Graph click center', () => {
                const center = coordsToGraph(myGraph, 0, 0);

                cy.get('#pointAddition').click();
                cy.wait(1000);
                cy.get('#layer2').click(center.x, center.y, { force: true });
            });
        });
    });

    context('graphHelpers.js', () => {
        // moveSection
        it('moveSection is function', () => {
            expect(moveSection, 'moveSection').to.be.a('function');
        });

        // mouseToGraph
        it('mouseToGraph is function', () => {
            expect(mouseToGraph, 'mouseToGraph').to.be.a('function');
        });

        it('mouseToGraph X coordinate', () => {
            expect(mouseToGraph(myGraph, 1, 2).x).to.eq(-264);
        });

        it('mouseToGraph Y coordinate', () => {
            expect(mouseToGraph(myGraph, 1, 2).y).to.eq(-120);
        });

        // movePoint
        it('movePoint is function', () => {
            expect(movePoint, 'movePoint').to.be.a('function');
        });

        // coordsToGraph
        it('coordsToGraph is function', () => {
            expect(coordsToGraph, 'coordsToGraph').to.be.a('function');
        });

        it('coordsToGraph X coordinate', () => {
            expect(coordsToGraph(myGraph, 1, 2).x).to.eq(413.05);
        });

        it('coordsToGraph Y coordinate', () => {
            expect(coordsToGraph(myGraph, 1, 2).y).to.eq(234);
        });

        // getPointPlacement
        it('getPointPlacement is function', () => {
            expect(getPointPlacement, 'getPointPlacement').to.be.a('function');
        });

        // TODO Unable to run due to getAttribute might be another way to run it
        // it('getPointPlacement point position', () => {
        //     expect(getPointPlacement(myGraph, 99).x).to.eq(413.05);
        // });

        // logicPointAddition
        it('logicPointAddition is function', () => {
            expect(logicPointAddition, 'logicPointAddition').to.be.a('function');
        });

        // TODO Unable to run due to getAttribute might be another way to run it
        // it('logicPointAddition point position', () => {
        //     expect(logicPointAddition(myGraph, 99).x).to.eq(413.05);
        // });

        // drawLine
        it('drawLine is function', () => {
            expect(drawLine, 'drawLine').to.be.a('function');
        });

        // addCalculatedPoint
        it('addCalculatedPoint is function', () => {
            expect(addCalculatedPoint, 'addCalculatedPoint').to.be.a('function');
        });

        // addPointOnClick
        it('addPointOnClick is function', () => {
            expect(addPointOnClick, 'addPointOnClick').to.be.a('function');
        });
    });

    context('ECC calculations', () => {
        it('calculateAddition x coordinate', () => {
            const point1 = [0.8388814913448736, -3.3757861359141805];
            const point2 = [-1.7177097203728364, 4.303533459549233];

            expect(calculateAddition(myGraph, point1, point2)[0]).to.eq(9.90124534636108);
        });

        it('calculateAddition y coordinate', () => {
            const point1 = [0.8388814913448736, -3.3757861359141805];
            const point2 = [-1.7177097203728364, 4.303533459549233];

            expect(calculateAddition(myGraph, point1, point2)[1]).to.eq(-30.596715322433464);
        });

        it('calculateDouble x coordinate', () => {
            const point1 = [-1.2916111850865513, -4.393553613618751];
            expect(calculateDouble(myGraph, point1)[0]).to.eq(2.5832226658830533);
        });

        it('calculateDouble y coordinate', () => {
            const point1 = [-1.2916111850865513, -4.393553613618751];
            expect(calculateDouble(myGraph, point1)[1]).to.eq(4.395660718021738);
        });

        it('test y coordinate', () => {
        });
        // [ -1.2916111850865513, -4.393553613618751 ]
    });
});
