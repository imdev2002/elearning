import getPixels from 'get-pixels';
import { createWriteStream } from 'fs';
import rgb2hex from 'rgb2hex';

const commonUtil = {
  generateRandomString: (length = 5) => {
    const chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  },
  convertPngToSvg: (image: string, output: string) => {
    getPixels(image, function (err: any, pixels: any) {
      const svgStream = createWriteStream(output);
      if (err) return console.log('Bad pixels path');

      const shape = pixels.shape.slice();
      const width = shape[0];
      const height = shape[1];

      svgStream.write(
        '<?xml version="1.0" encoding="utf-8" ?>\n' +
          '<svg baseProfile="full" ' +
          'version="1.1" ' +
          'height="' +
          height +
          'px" ' +
          'width="' +
          width +
          'px" ' +
          'xmlns="http://www.w3.org/2000/svg" ' +
          'xmlns:ev="http://www.w3.org/2001/xml-events" ' +
          'xmlns:xlink="http://www.w3.org/1999/xlink">\n',
      );

      let c = 0;
      for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
          const r = pixels.data[c];
          const g = pixels.data[c + 1];
          const b = pixels.data[c + 2];
          const a = pixels.data[c + 3];

          // If colour data is found, draw a rect.
          if (r !== 0 && g !== 0 && b !== 0) {
            const rgbStr = 'rgb(' + r + ',' + g + ',' + b + ')';
            const hexObj = rgb2hex(rgbStr);
            const rectStr =
              '<rect fill="' +
              hexObj.hex +
              '" height="1px" width="1px" x="' +
              j +
              '" y="' +
              i +
              '" />\n';
            svgStream.write(rectStr);
          }

          c += 4;
        }
      }

      svgStream.end('</svg>');
    });
  },
};
export default commonUtil;
