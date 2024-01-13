import { convertToEmbossed, convertToGrayscale, convertToInverted, convertToMotionBlurred } from "./modifiers";
import { Modifier, PpmImage, PpmPixel } from "./types";
import fs, { writeFileSync } from 'fs';

const commentsRegex: RegExp = /#.*?\r?\n/g;
const whitespaceRegex: RegExp = /\s+/g;

function main(): void {
  console.log(process.argv);
  const sourceImagePath: string = process.argv[2];
  const outputImagePath: string = process.argv[3];
  const commandType: string = process.argv[4];
  // prepare source image data
  const sourceImage: PpmImage | undefined = getPpm(sourceImagePath);
  if (!sourceImage) {
    showUsage();
    return;
  }
  let modifiedImage: PpmImage | undefined;
  // process command
  switch (commandType) {
    case 'grayscale':
    case 'greyscale':
      modifiedImage = convertToGrayscale(sourceImage);
      break;
    case 'invert':
      modifiedImage = convertToInverted(sourceImage);
      break;
    case 'emboss':
      modifiedImage = convertToEmbossed(sourceImage);
      break;
    case 'motionblur':
      if (!process.argv[5]) {
        showUsage();
        return;
      }
      modifiedImage = convertToMotionBlurred(sourceImage, parseInt(process.argv[5]));
      break;
    default:
      showUsage();
      return;
  }
  const success: boolean = savePpmImage(modifiedImage, outputImagePath);
  if (!success) {
    showUsage();
  } else {
    console.log(`Image successfully modified and saved to '${outputImagePath}'`);
  }
}

function getPpm(sourcePath: string): PpmImage | undefined {
  const loadedPpmImage: PpmImage = {
    resolution: {
      width: 0,
      height: 0,
    },
    pixels: [],
    maxColorValue: 0,
  }
  try {
    // load the file
    const result: Buffer = fs.readFileSync(sourcePath);
    const resultString: string = result.toString();
    let formattedString: string = resultString.replace(commentsRegex, " ");
    formattedString = formattedString.replace(whitespaceRegex, ' ').trim();
    const numbers: number[] = formattedString.split(' ').slice(1).map((num: string) => parseInt(num));
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
    for (let i = 0; i <= numbers.length - 3; i+= 3) {
      const row: number = Math.floor(i / loadedPpmImage.resolution.width / 3);
      const pixel: PpmPixel = {red: numbers[i], green: numbers[i + 1], blue: numbers[i + 2]};
      loadedPpmImage.pixels[row].push(pixel);
    }
    return loadedPpmImage;
  } catch (err: any) {
    console.log(`Error getting Ppm image: ${err.message}`);
  }
}

function savePpmImage(imageToSave: PpmImage, destination: string): boolean {
  try {
    const {width, height} = imageToSave.resolution;
    const {pixels, maxColorValue} = imageToSave;
    const outputString: string = `P3 ${width} ${height} ${maxColorValue} ${pixels.flat(1).map((pixel: PpmPixel) => `${pixel.red} ${pixel.green} ${pixel.blue}`).join(" ")}`;
    const outputBuffer: Buffer = Buffer.from(outputString);
    writeFileSync(destination, outputBuffer);
    return true;
  } catch (err: any) {
    console.log(`Error saving modified image: ${err.message}`);
    return false;
  }
}

function showUsage(): void {
  console.log('Usage:\n\tnode ./main.js <inputFilePath> <outputFilePath> (grayscale|invert|emboss|motionblur) {motionBlurLength}');
}

main();