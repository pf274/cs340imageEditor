"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMotionBlurred = exports.convertToEmbossed = exports.convertToGrayscale = exports.convertToInverted = void 0;
const convertToInverted = (sourceImage) => {
    const newImage = {
        resolution: {
            width: sourceImage.resolution.width,
            height: sourceImage.resolution.height,
        },
        maxColorValue: sourceImage.maxColorValue,
        pixels: new Array(sourceImage.resolution.height).fill(0).map(() => new Array(sourceImage.resolution.width).fill(0).map(() => ({ red: 0, green: 0, blue: 0 })))
    };
    for (let rowIndex = 0; rowIndex < sourceImage.pixels.length; rowIndex++) {
        const row = sourceImage.pixels[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const inputPixel = row[colIndex];
            const outputPixel = newImage.pixels[rowIndex][colIndex];
            outputPixel.red = sourceImage.maxColorValue - inputPixel.red;
            outputPixel.green = sourceImage.maxColorValue - inputPixel.green;
            outputPixel.blue = sourceImage.maxColorValue - inputPixel.blue;
        }
    }
    return newImage;
};
exports.convertToInverted = convertToInverted;
const convertToGrayscale = (sourceImage) => {
    const newImage = {
        resolution: {
            width: sourceImage.resolution.width,
            height: sourceImage.resolution.height,
        },
        maxColorValue: sourceImage.maxColorValue,
        pixels: new Array(sourceImage.resolution.height).fill(0).map(() => new Array(sourceImage.resolution.width).fill(0).map(() => ({ red: 0, green: 0, blue: 0 })))
    };
    for (let rowIndex = 0; rowIndex < sourceImage.pixels.length; rowIndex++) {
        const row = sourceImage.pixels[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const inputPixel = row[colIndex];
            const outputPixel = newImage.pixels[rowIndex][colIndex];
            const average = Math.floor(Object.values(inputPixel).reduce((total, color) => total + color, 0) / 3);
            outputPixel.red = average;
            outputPixel.green = average;
            outputPixel.blue = average;
        }
    }
    return newImage;
};
exports.convertToGrayscale = convertToGrayscale;
const convertToEmbossed = (sourceImage) => {
    const newImage = {
        resolution: {
            width: sourceImage.resolution.width,
            height: sourceImage.resolution.height,
        },
        maxColorValue: sourceImage.maxColorValue,
        pixels: new Array(sourceImage.resolution.height).fill(0).map(() => new Array(sourceImage.resolution.width).fill(0).map(() => ({ red: 0, green: 0, blue: 0 })))
    };
    for (let rowIndex = 0; rowIndex < sourceImage.pixels.length; rowIndex++) {
        const row = sourceImage.pixels[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const inputPixel = sourceImage.pixels[rowIndex][colIndex];
            const outputPixel = newImage.pixels[rowIndex][colIndex];
            let v;
            if (rowIndex < 1 || colIndex < 1) {
                v = 128;
            }
            else {
                const comparePixel = sourceImage.pixels[rowIndex - 1][colIndex - 1];
                const differences = [
                    inputPixel.red - comparePixel.red,
                    inputPixel.green - comparePixel.green,
                    inputPixel.blue - comparePixel.blue,
                ];
                const magnitudes = differences.map((difference) => Math.abs(difference));
                const maxMagnitude = Math.max(...magnitudes);
                const maxIndex = magnitudes.indexOf(maxMagnitude);
                const maxDifference = differences[maxIndex];
                v = Math.min(Math.max(128 + maxDifference, 0), sourceImage.maxColorValue);
            }
            outputPixel.red = v;
            outputPixel.green = v;
            outputPixel.blue = v;
        }
    }
    return newImage;
};
exports.convertToEmbossed = convertToEmbossed;
const convertToMotionBlurred = (sourceImage, amount) => {
    const newImage = {
        resolution: {
            width: sourceImage.resolution.width,
            height: sourceImage.resolution.height,
        },
        maxColorValue: sourceImage.maxColorValue,
        pixels: new Array(sourceImage.resolution.height).fill(0).map(() => new Array(sourceImage.resolution.width).fill(0).map(() => ({ red: 0, green: 0, blue: 0 })))
    };
    for (let rowIndex = 0; rowIndex < sourceImage.pixels.length; rowIndex++) {
        const row = sourceImage.pixels[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const inputPixels = row.slice(colIndex, Math.min(row.length - 1, colIndex + amount));
            const outputPixel = newImage.pixels[rowIndex][colIndex];
            const total = { red: 0, green: 0, blue: 0 };
            inputPixels.forEach((inputPixel) => {
                total.red += inputPixel.red;
                total.green += inputPixel.green;
                total.blue += inputPixel.blue;
            });
            const averages = {
                red: total.red / inputPixels.length,
                green: total.green / inputPixels.length,
                blue: total.blue / inputPixels.length,
            };
            outputPixel.red = averages.red;
            outputPixel.green = averages.green;
            outputPixel.blue = averages.blue;
        }
    }
    return newImage;
};
exports.convertToMotionBlurred = convertToMotionBlurred;
//# sourceMappingURL=modifiers.js.map