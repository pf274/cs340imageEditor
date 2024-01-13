"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const modifiers_1 = require("./modifiers");
const fs_1 = __importStar(require("fs"));
const commentsRegex = /#.*?\r?\n/g;
const whitespaceRegex = /\s+/g;
function main() {
    console.log(process.argv);
    const sourceImagePath = process.argv[2];
    const imageName = sourceImagePath.split("/").pop() || "newImage.ppm";
    const keyImagePath = process.argv[3];
    const commandType = process.argv[4];
    // prepare source image data
    const sourceImage = getPpm(sourceImagePath);
    let modifiedImage;
    // process command
    switch (commandType) {
        case 'grayscale':
        case 'greyscale':
            modifiedImage = (0, modifiers_1.convertToGrayscale)(sourceImage);
            break;
        case 'invert':
            modifiedImage = (0, modifiers_1.convertToInverted)(sourceImage);
            break;
        case 'emboss':
            modifiedImage = (0, modifiers_1.convertToEmbossed)(sourceImage);
            break;
        case 'motionblur':
            if (!process.argv[5]) {
                throw new Error('Missing motion blur amount argument');
            }
            modifiedImage = (0, modifiers_1.convertToMotionBlurred)(sourceImage, parseInt(process.argv[5]));
            break;
        default:
            throw new Error('Invalid command type.');
    }
    savePpmImage(modifiedImage, `./Images/output_images/${imageName}`);
}
function getPpm(imageName) {
    let newPpmImage = {
        resolution: {
            width: 0,
            height: 0,
        },
        pixels: [],
        maxColorValue: 0,
    };
    try {
        // load the file
        const result = fs_1.default.readFileSync(`./Images/${imageName}`);
        const resultString = result.toString();
        let formattedString = resultString.replace(commentsRegex, " ");
        formattedString = formattedString.replace(whitespaceRegex, ' ').trim();
        const numbers = formattedString.split(' ').slice(1).map((num) => parseInt(num));
        // process the numbers
        if (numbers.length < 2) {
            throw new Error("Malformed ppm file data.");
        }
        newPpmImage.resolution.width = numbers.shift() || 0; // the zero is here because .shift() can return undefined
        newPpmImage.resolution.height = numbers.shift() || 0; // the zero is here because .shift() can return undefined
        newPpmImage.pixels = new Array(newPpmImage.resolution.height).fill(0).map(() => []);
        newPpmImage.maxColorValue = numbers.shift() || 0;
        if (numbers.length % 3 != 0) {
            throw new Error("Malformed ppm file data.");
        }
        for (let i = 0; i <= numbers.length - 3; i += 3) {
            const row = Math.floor(i / newPpmImage.resolution.width / 3);
            const pixel = { red: numbers[i], green: numbers[i + 1], blue: numbers[i + 2] };
            newPpmImage.pixels[row].push(pixel);
        }
    }
    catch (err) {
        console.log(`Error getting Ppm image: ${err.message}`);
    }
    return newPpmImage;
}
function savePpmImage(imageToSave, destination) {
    const { width, height } = imageToSave.resolution;
    const { pixels, maxColorValue } = imageToSave;
    const outputString = `P3 ${width} ${height} ${maxColorValue} ${pixels.flat(1).map((pixel) => `${pixel.red} ${pixel.green} ${pixel.blue}`).join(" ")}`;
    const outputBuffer = Buffer.from(outputString);
    (0, fs_1.writeFileSync)(destination, outputBuffer);
}
main();
//# sourceMappingURL=main.js.map