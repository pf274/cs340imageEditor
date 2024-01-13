import PpmImage from "./PpmImage";
import { convertToEmbossed, convertToGrayscale, convertToInverted, convertToMotionBlurred } from "./modifiers";
import { PpmPixel } from "./types";
import fs, { writeFileSync } from 'fs';

function main(): void {
  console.log(process.argv);
  const sourceImagePath: string = process.argv[2];
  const outputImagePath: string = process.argv[3];
  const commandType: string = process.argv[4];
  // prepare source image data
  const sourceImage: PpmImage | undefined = getPpmFromFile(sourceImagePath);
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
  const success: boolean = savePpmImageToFile(modifiedImage, outputImagePath);
  if (success) {
    console.log(`Image successfully modified and saved to '${outputImagePath}'`);
  } else {
    showUsage();
  }
}

function getPpmFromFile(sourcePath: string): PpmImage | undefined {
  try {
    const result: Buffer = fs.readFileSync(sourcePath);
    const resultString: string = result.toString();
    return PpmImage.fromString(resultString);
  } catch (err: any) {
    console.log(`Error getting Ppm image: ${err.message}`);
  }
}

function savePpmImageToFile(imageToSave: PpmImage, destination: string): boolean {
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