import { createCanvasRenderingContext2D } from '../../examples/misc/media/image/image-helpers';
import { parseCSSColorOrThrow } from '../../examples/misc/css/color/parse-css-color';
import { IColor } from '../../examples/misc/css/color/color.type';
import { colorToHSLAColor } from '../../examples/misc/css/color/to/color-to-hsla-color';
import { IHSLAColor } from '../../examples/misc/css/color/colors/hsla/hsla-color.type';
import { hslaColorToHSLAString } from '../../examples/misc/css/color/colors/hsla/to/string/hsla-color-to-hsla-string';
import { lightenHSLAColor } from '../../examples/misc/css/color/colors/hsla/operations/lighten-hsla-color';

interface IGenerateLogoOptions {
  color: IColor;
  bottomTextContent: string;
  bottomTextScale?: number;
}

function generateLogo(
  {
    color,
    bottomTextContent,
    bottomTextScale = 1,
  }: IGenerateLogoOptions,
): void {
  const scale: number = 1;

  const hslaColor: IHSLAColor = colorToHSLAColor(color);

  const ctx: CanvasRenderingContext2D = createCanvasRenderingContext2D(256 * scale, 256 * scale);
  ctx.canvas.style.border = '2px solid black';
  document.body.appendChild(ctx.canvas);

  const createPolygonPath = (
    steps: number,
    radius: number,
  ): Path2D => {
    const path: Path2D = new Path2D();

    for (let i = 0; i <= steps; i++) {
      const angle: number = (i / steps) * Math.PI * 2;
      const x: number = Math.cos(angle) * radius;
      const y: number = Math.sin(angle) * radius;
      if (i === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    return path;
  };

  const fillPolygon = (
    steps: number,
    radius: number,
  ): void => {
    ctx.fill(createPolygonPath(steps, radius));
  };

  const strokePolygon = (
    steps: number,
    radius: number,
  ): void => {
    ctx.stroke(createPolygonPath(steps, radius));
  };

  ctx.translate(
    (ctx.canvas.width / 2),
    (ctx.canvas.height / 2),
  );

  const steps: number = 6;
  const radius: number = Math.min(ctx.canvas.width / 2, ctx.canvas.height / 2);


  // ctx.lineCap = 'round';
  // ctx.lineJoin = 'round';
  // ctx.lineWidth = radius * 0.25;
  // ctx.strokeStyle = hslaColorToHSLAString(hslaColor);
  // strokePolygon(steps, radius * 0.875);

  ctx.fillStyle = hslaColorToHSLAString(hslaColor);
  fillPolygon(steps, radius);

  ctx.fillStyle = hslaColorToHSLAString(lightenHSLAColor(hslaColor, 0.2));
  fillPolygon(steps, radius * 0.75);


  // top text
  {
    const textContent: string = 'LiRX';
    // const textContent: string = 'LIRX';

    const fontSize: number = radius * 0.4;
    ctx.fillStyle = '#fafafa';
    ctx.font = `900 ${fontSize}px Arial`;

    const size: TextMetrics = ctx.measureText(textContent);
    ctx.fillText(textContent, -(size.width / 2), -radius * 0.1);
  }

  // bottom text
  {
    const textContent: string = bottomTextContent;

    const fontSize: number = radius * 0.4 * bottomTextScale;
    // ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
    ctx.fillStyle = `#fafafad5`;
    ctx.font = `900 ${fontSize}px Arial`;

    const size: TextMetrics = ctx.measureText(textContent);
    ctx.fillText(textContent, -(size.width / 2), +radius * 0.35);
  }

  ctx.canvas.toBlob(
    (blob: Blob | null) => {
      if (blob !== null) {
        window.open(URL.createObjectURL(blob), '_blank');
      }
    },
    'image/png',
  );
  // window.open(ctx.canvas.toDataURL('image/png'), '_blank');
}

/*------------------*/

export function renderLogo(): void {

  // parseCSSColorOrThrow

  // generateLogo({
  //   color: parseCSSColorOrThrow('#ec4b26'),
  //   bottomTextContent: 'core',
  // });

  // generateLogo({
  //   // color: parseCSSColorOrThrow('#ff782f'),
  //   color: parseCSSColorOrThrow('#2e73da'),
  //   bottomTextContent: 'dom',
  // });
  //
  // generateLogo({
  //   // color: parseCSSColorOrThrow('#2da92f'),
  //   color: parseCSSColorOrThrow('#3ca13e'),
  //   bottomTextContent: 'router',
  //   bottomTextScale: 0.8,
  // });

  // generateLogo({
  //   color: parseCSSColorOrThrow('#2edac0'),
  //   bottomTextContent: 'i18n',
  // });

  // generateLogo({
  //   color: parseCSSColorOrThrow('#da8a2e'),
  //   bottomTextContent: 'store',
  //   bottomTextScale: 0.8,
  // });
}

