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
    const outputImagePath = process.argv[3];
    const commandType = process.argv[4];
    // prepare source image data
    const sourceImage = getPpm(sourceImagePath);
    if (!sourceImage) {
        showUsage();
        return;
    }
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
                showUsage();
                return;
            }
            modifiedImage = (0, modifiers_1.convertToMotionBlurred)(sourceImage, parseInt(process.argv[5]));
            break;
        default:
            showUsage();
            return;
    }
    const success = savePpmImage(modifiedImage, outputImagePath);
    if (!success) {
        showUsage();
    }
    else {
        console.log(`Image successfully modified and saved to '${outputImagePath}'`);
    }
}
function getPpm(sourcePath) {
    const loadedPpmImage = {
        resolution: {
            width: 0,
            height: 0,
        },
        pixels: [],
        maxColorValue: 0,
    };
    try {
        // load the file
        const result = fs_1.default.readFileSync(sourcePath);
        const resultString = result.toString();
        let formattedString = resultString.replace(commentsRegex, " ");
        formattedString = formattedString.replace(whitespaceRegex, ' ').trim();
        const numbers = formattedString.split(' ').slice(1).map((num) => parseInt(num));
        // process the numbers
        if (numbers.length < 2) {
            throw new Error("Malformed ppm file data.");
        }
        loadedPpmImage.resolution.width = numbers.shift() || 0; // the zero is here because .shift() can return undefined
        loadedPpmImage.resolution.height = numbers.shift() || 0; // the zero is here because .shift() can return undefined
        loadedPpmImage.pixels = new Array(loadedPpmImage.resolution.height).fill(0).map(() => []);
        loadedPpmImage.maxColorValue = numbers.shift() || 0;
        if (numbers.length % 3 != 0) {
            throw new Error("Malformed ppm file data.");
        }
        for (let i = 0; i <= numbers.length - 3; i += 3) {
            const row = Math.floor(i / loadedPpmImage.resolution.width / 3);
            const pixel = { red: numbers[i], green: numbers[i + 1], blue: numbers[i + 2] };
            loadedPpmImage.pixels[row].push(pixel);
        }
        return loadedPpmImage;
    }
    catch (err) {
        console.log(`Error getting Ppm image: ${err.message}`);
    }
}
function savePpmImage(imageToSave, destination) {
    try {
        const { width, height } = imageToSave.resolution;
        const { pixels, maxColorValue } = imageToSave;
        const outputString = `P3 ${width} ${height} ${maxColorValue} ${pixels.flat(1).map((pixel) => `${pixel.red} ${pixel.green} ${pixel.blue}`).join(" ")}`;
        const outputBuffer = Buffer.from(outputString);
        (0, fs_1.writeFileSync)(destination, outputBuffer);
        return true;
    }
    catch (err) {
        console.log(`Error saving modified image: ${err.message}`);
        return false;
    }
}
function showUsage() {
    console.log('Usage:\n\tnode ./main.js <inputFilePath> <outputFilePath> (grayscale|invert|emboss|motionblur) {motionBlurLength}');
}
main();
//# sourceMappingURL=main.js.map