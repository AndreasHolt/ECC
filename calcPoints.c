#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>
#include <time.h>

typedef struct point {
    unsigned long x;
    unsigned long y;
} point;

void calcPoints(point* pointArr, unsigned long* numberOfPoints, unsigned long a, unsigned long b, unsigned long c, unsigned long d, unsigned long fieldOrder);
unsigned long Mod(unsigned long val, unsigned long mod);
void printPointsToJSON (point* pointArr, unsigned long numPoints, unsigned long fieldOrder);
void pointToJSON (char* buffer, int sizeOfBuffer, point* p);

int main (void) {
    unsigned long a = 118;
    unsigned long b = 0;
    unsigned long c = 0;
    unsigned long d = 0;
    unsigned long fieldOrder = 65537;
    unsigned long points = 0;
    point* pointArr = (point*)malloc(sizeof(point) * fieldOrder * 2);

    clock_t begin = clock();

    /* here, do your time-consuming job */
    calcPoints(pointArr, &points, a, b, c, d, fieldOrder);

    clock_t end = clock();
    double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
    printf("That took %lf seconds.", time_spent);

    //printPointsToJSON(pointArr, points, fieldOrder);

    free(pointArr);
    return EXIT_SUCCESS;
}

void calcPoints (point* pointArr, unsigned long* numberOfPoints, unsigned long a, unsigned long b, unsigned long c, unsigned long d, unsigned long fieldOrder) {
    *numberOfPoints = 0;
    for (unsigned long x = 0 ; x < fieldOrder ; x++) {
        unsigned long rightSide = Mod((x*x*x + a*x + b), fieldOrder);
        for (unsigned long y = 0 ; y < fieldOrder ; y++) {
            if (Mod((y*y), fieldOrder) == rightSide) {
                point newPoint;
                newPoint.x = x;
                newPoint.y = y;
                pointArr[*numberOfPoints] = newPoint;
                (*numberOfPoints)++;
                unsigned long oppositeY = Mod(fieldOrder - y, fieldOrder);    //Skal der ikke laves mod her?
                if (oppositeY == fieldOrder) {
                    break;
                }
                if(oppositeY != y && Mod((oppositeY*oppositeY), fieldOrder) == rightSide) {
                    point newPoint;
                    newPoint.x = x;
                    newPoint.y = oppositeY;
                    pointArr[*numberOfPoints] = newPoint;
                    (*numberOfPoints)++;
                    break;
                }
            }
        }
    }
    //this.points.push(new Point(Infinity, Infinity, 0, true));
}

unsigned long Mod(unsigned long val, unsigned long mod) {
    return ((val % mod) + mod) % mod;
}

void printPointsToJSON (point* pointArr, unsigned long numPoints, unsigned long fieldOrder) {
    int temp = (int)(floor(log10f(fieldOrder))+1);
    unsigned long stringLengthPerPoint = 14 + 2 * temp;// {"x":100,"y":100};
    unsigned long stringLength = 1 + stringLengthPerPoint * numPoints;
    char* pointString = (char*)malloc(sizeof(char) * stringLengthPerPoint);
    char* JSON = (char*)malloc(sizeof(char) * stringLength);
    JSON[0] = '\0';
    strcat(JSON, "[");
    for (unsigned long i = 0; i < numPoints; i++) {
        pointToJSON(pointString, stringLengthPerPoint, &(pointArr[i]));
        if (i == numPoints - 1) {
            pointString[strlen(pointString)-2] = '\0'; // removing the last two characters
        }
        strcat(JSON, pointString);
    }
    strcat(JSON, "]");
    FILE* filePointer = fopen("./points.json", "wb");
    fprintf(filePointer,JSON);

    free(pointString);
    free(JSON);
}

void pointToJSON (char* buffer, int sizeOfBuffer, point* p) {
    snprintf(buffer, sizeOfBuffer, "{\"x\":%ld,\"y\":%ld},", p->x, p->y);
}