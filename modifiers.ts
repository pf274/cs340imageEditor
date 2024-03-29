import PpmImage from "./PpmImage";
import { Modifier, PpmPixel } from "./types";

export const convertToInverted: Modifier = (sourceImage): PpmImage => {
  const newImage: PpmImage = sourceImage.clone();
  const {width: numCols, height: numRows} = sourceImage.resolution;
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const row: PpmPixel[] = sourceImage.pixels[rowIndex];
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const inputPixel: PpmPixel = row[colIndex];
      const outputPixel: PpmPixel = newImage.pixels[rowIndex][colIndex];
      outputPixel.red = sourceImage.maxColorValue - inputPixel.red;
      outputPixel.green = sourceImage.maxColorValue - inputPixel.green;
      outputPixel.blue = sourceImage.maxColorValue - inputPixel.blue;
    }
  }
  return newImage;
}

export const convertToGrayscale: Modifier = (sourceImage): PpmImage => {
  const newImage: PpmImage = sourceImage.clone();
  const {width: numCols, height: numRows} = sourceImage.resolution;
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const row: PpmPixel[] = sourceImage.pixels[rowIndex];
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const inputPixel: PpmPixel = row[colIndex];
      const outputPixel: PpmPixel = newImage.pixels[rowIndex][colIndex];
      const average: number = Math.floor(Object.values(inputPixel).reduce((total, color) => total + color, 0) / 3);
      outputPixel.red = average;
      outputPixel.green = average;
      outputPixel.blue = average;
    }
  }
  return newImage;
}

export const convertToEmbossed: Modifier = (sourceImage): PpmImage => {
  const newImage: PpmImage = sourceImage.clone();
  const {width: numCols, height: numRows} = sourceImage.resolution;
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const inputPixel: PpmPixel = sourceImage.pixels[rowIndex][colIndex];
      const outputPixel: PpmPixel = newImage.pixels[rowIndex][colIndex];
      let v: number;
      if (rowIndex < 1 || colIndex < 1) {
        v = 128;
      } else {
        const comparePixel: PpmPixel = sourceImage.pixels[rowIndex - 1][colIndex - 1];
        const differences: number[] = [
          inputPixel.red - comparePixel.red,
          inputPixel.green - comparePixel.green,
          inputPixel.blue - comparePixel.blue,
        ];
        const magnitudes: number[] = differences.map((difference) => Math.abs(difference));
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
}

export const convertToMotionBlurred: Modifier = (sourceImage, amount: number): PpmImage => {
  const newImage: PpmImage = sourceImage.clone();
  const {width: numCols, height: numRows} = sourceImage.resolution;
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const row: PpmPixel[] = sourceImage.pixels[rowIndex];
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const inputPixels: PpmPixel[] = row.slice(colIndex, Math.min(numCols, colIndex + amount));
      const outputPixel: PpmPixel = newImage.pixels[rowIndex][colIndex];
      const total = {red: 0, green: 0, blue: 0};
      inputPixels.forEach((inputPixel) => {
        total.red += inputPixel.red;
        total.green += inputPixel.green;
        total.blue += inputPixel.blue; 
      })
      const averages = {
        red: Math.floor(total.red / inputPixels.length),
        green: Math.floor(total.green / inputPixels.length),
        blue: Math.floor(total.blue / inputPixels.length),
      }
      outputPixel.red = averages.red;
      outputPixel.green = averages.green;
      outputPixel.blue = averages.blue;
    }
  }
  return newImage;
}