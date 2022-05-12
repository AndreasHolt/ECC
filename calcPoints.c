#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>

typedef struct point {
    long x;
    long y;
} point;

void calcPoints(point* pointArr, long* numberOfPoints, long a, long b, long c, long d, long fieldOrder);
long Mod(long val, long mod);
void printPointsToJSON (point* pointArr, long numPoints, long fieldOrder);
void pointToJSON (char* buffer, int sizeOfBuffer, point* p);

int main (void) {
    long a = 118;
    long b = 0;
    long c = 0;
    long d = 0;
    long fieldOrder = 65537;
    long points = 0;
    point* pointArr = (point*)malloc(sizeof(point) * fieldOrder * 2);
    calcPoints(pointArr, &points, a, b, c, d, fieldOrder);

    //printPointsToJSON(pointArr, points, fieldOrder);

    free(pointArr);
    return EXIT_SUCCESS;
}

void calcPoints (point* pointArr, long* numberOfPoints, long a, long b, long c, long d, long fieldOrder) {
    *numberOfPoints = 0;
    for (long x = 0 ; x < fieldOrder ; x++) {
        long rightSide = Mod((x*x*x + a*x + b), fieldOrder);
        for (long y = 0 ; y < fieldOrder ; y++) {
            if (Mod((y*y), fieldOrder) == rightSide) {
                point newPoint;
                newPoint.x = x;
                newPoint.y = y;
                pointArr[*numberOfPoints] = newPoint;
                (*numberOfPoints)++;
                long oppositeY = Mod(fieldOrder - y, fieldOrder);    //Skal der ikke laves mod her?
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
        if (x%100==0)
        printf("x: %ld", x);
    }
    //this.points.push(new Point(Infinity, Infinity, 0, true));
}

long Mod(long val, long mod) {
    return ((val % mod) + mod) % mod;
}

void printPointsToJSON (point* pointArr, long numPoints, long fieldOrder) {
    int temp = (int)(floor(log10f(fieldOrder))+1);
    long stringLengthPerPoint = 14 + 2 * temp;// {"x":100,"y":100};
    long stringLength = 1 + stringLengthPerPoint * numPoints;
    char* pointString = (char*)malloc(sizeof(char) * stringLengthPerPoint);
    char* JSON = (char*)malloc(sizeof(char) * stringLength);
    JSON[0] = '\0';
    strcat(JSON, "[");
    for (long i = 0; i < numPoints; i++) {
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