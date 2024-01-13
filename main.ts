import { convertToEmbossed, convertToGrayscale, convertToInverted, convertToMotionBlurred } from "./modifiers";
import { Modifier, PpmImage, PpmPixel } from "./types";
import fs, { writeFileSync } from 'fs';

const commentsRegex: RegExp = /#.*?\r?\n/g;
const whitespaceRegex: RegExp = /\s+/g;

function main(): void {
  console.log(process.argv);
  const sourceImagePath: string = process.argv[2];
  const imageName: string = sourceImagePath.split("/").pop() || "newImage.ppm";
  const keyImagePath: string = process.argv[3];
  const commandType: string = process.argv[4];
  // prepare source image data
  const sourceImage: PpmImage = getPpm(sourceImagePath);
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
        throw new Error('Missing motion blur amount argument');
      }
      modifiedImage = convertToMotionBlurred(sourceImage, parseInt(process.argv[5]));
      break;
    default:
      throw new Error('Invalid command type.');
  }
  savePpmImage(modifiedImage, `./Images/output_images/${imageName}`);
}

function getPpm(imageName: string): PpmImage {
  let newPpmImage: PpmImage = {
    resolution: {
      width: 0,
      height: 0,
    },
    pixels: [],
    maxColorValue: 0,
  }
  try {
    // load the file
    const result: Buffer = fs.readFileSync(`./Images/${imageName}`);
    const resultString: string = result.toString();
    let formattedString: string = resultString.replace(commentsRegex, " ");
    formattedString = formattedString.replace(whitespaceRegex, ' ').trim();
    const numbers: number[] = formattedString.split(' ').slice(1).map((num: string) => parseInt(num));
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
    for (let i = 0; i <= numbers.length - 3; i+= 3) {
      const row: number = Math.floor(i / newPpmImage.resolution.width / 3);
      const pixel: PpmPixel = {red: numbers[i], green: numbers[i + 1], blue: numbers[i + 2]};
      newPpmImage.pixels[row].push(pixel);
    }
  } catch (err: any) {
    console.log(`Error getting Ppm image: ${err.message}`);
  }
  return newPpmImage;
}

function savePpmImage(imageToSave: PpmImage, destination: string): void {
  const {width, height} = imageToSave.resolution;
  const {pixels, maxColorValue} = imageToSave;
  const outputString: string = `P3 ${width} ${height} ${maxColorValue} ${pixels.flat(1).map((pixel: PpmPixel) => `${pixel.red} ${pixel.green} ${pixel.blue}`).join(" ")}`;
  const outputBuffer: Buffer = Buffer.from(outputString);
  writeFileSync(destination, outputBuffer);
}

main();