"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class grayscale {
    modifyPixel(pixel) {
        const average = Math.floor(Object.values(pixel).reduce((total, color) => total + color, 0) / Object.keys(pixel).length);
        return {
            red: average,
            green: average,
            blue: average
        };
    }
}
exports.default = grayscale;
//# sourceMappingURL=grayscale.js.map