"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class invert {
    modifyPixel(pixel, maximumValue) {
        return {
            red: maximumValue - pixel.red,
            green: maximumValue - pixel.green,
            blue: maximumValue - pixel.blue
        };
    }
}
exports.default = invert;
//# sourceMappingURL=invert.js.map