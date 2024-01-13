import { PpmPixel, PpmResolution } from "./types";


class PpmImage {

  public pixels: PpmPixel[][];

  constructor(
    public resolution: PpmResolution,
    public maxColorValue: number,
    inputPixels?: PpmPixel[][],
  ) {
    this.pixels = inputPixels || new Array(resolution.height).map(() => new Array(resolution.width).fill(0).map(() => ({red: 0, green: 0, blue: 0})));
  }

  static fromString(inputString: string): PpmImage {
    const commentsRegex: RegExp = /#.*?\r?\n/g;
    const whitespaceRegex: RegExp = /\s+/g;
    let formattedString: string = inputString.replace(commentsRegex, " ");
    formattedString = formattedString.replace(whitespaceRegex, ' ').trim();
    const numbers: number[] = formattedString.split(' ').slice(1).map((num: string) => parseInt(num));
    // process the numbers
    if (numbers.length < 2) {
      throw new Error("Malformed ppm string.");
    }
    const width: number = numbers.shift() || 0; // the zero is here because .shift() can return undefined
    const height: number = numbers.shift() || 0;
    const maxColorValue: number = numbers.shift() || 0;
    if (numbers.length % 3 != 0) {
      throw new Error("Malformed ppm string.");
    }
    const pixels: PpmPixel[][] = [];
    for (let i = 0; i <= numbers.length - 3; i += 3) {
      const row: number = Math.floor(i / width / 3);
      const pixel: PpmPixel = {red: numbers[i], green: numbers[i + 1], blue: numbers[i + 2]};
      if (!pixels[row]) {
        pixels[row] = [];
      }
      pixels[row].push(pixel);
    }
    return new PpmImage({width, height}, maxColorValue, pixels);
  }

  public getPixel(row: number, column: number): PpmPixel | undefined {
    if (this.pixels?.[row]) {
      return this.pixels[row][column];
    }
  }

  public setPixel(row: number, column: number, newPixel: PpmPixel): void {
    if (this.pixels?.[row]) {
      this.pixels[row][column] = newPixel;
    }
  }

  public clone(): PpmImage {
    const newImage: PpmImage = new PpmImage(this.resolution, this.maxColorValue);
    newImage.pixels = this.pixels?.map((row: PpmPixel[]) => row.map((pixel: PpmPixel) => ({...pixel})));
    return newImage;
  }

  public toString(): string {
    const {width, height} = this.resolution;
    const {pixels = [], maxColorValue} = this;
    return `P3 ${width} ${height} ${maxColorValue} ${pixels.flat(1).map((pixel: PpmPixel) => `${pixel.red} ${pixel.green} ${pixel.blue}`).join(" ")}`;
  }

}

export default PpmImage;