export type PpmImage = {
  resolution: PpmResolution,
  pixels: PpmPixel[][],
  maxColorValue: number
}

export type PpmResolution = {
  width: number,
  height: number,
}

export type PpmPixel = {
  red: number,
  green: number,
  blue: number
}

export type Modifier = (image: PpmImage, ...args: any[]) => PpmImage;