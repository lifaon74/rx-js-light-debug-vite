import { createElement } from '@lifaon/rx-dom';

import { IDailyWeather, IHourlyWeather } from '../../api/get-weather/response.type';
import { fromEventTarget, mergeUnsubscribeFunctions } from '@lifaon/rx-js-light';
import { MM_PER_DAY_TO_METER_PER_SECOND } from '../units/converters';

// @ts-ignore
import sunURL from './assets/sun.svg';
// @ts-ignore
import cloudURL from './assets/cloud.svg';
// @ts-ignore
import waterDropURL from './assets/water-drop.svg';
// @ts-ignore
import snowflakeURL from './assets/snowflake.svg';
// @ts-ignore
import thunderboltURL from './assets/thunderbolt.svg';
// @ts-ignore
import windURL from './assets/wind.svg';
// @ts-ignore
import mistURL from './assets/mist.svg';
// @ts-ignore
import tornadoURL from './assets/tornado2.svg';
import { IWeatherStateId } from '../../api/get-weather/weather-state-id/weather-state-id.type';
import { createAndAwaitImage, createCanvasRenderingContext2D } from '../../../../misc/image/image-helpers';

/*---------------*/


/*-------------*/

function getSunImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(sunURL);
}

function getCloudImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(cloudURL);
}

function getWaterDropImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(waterDropURL);
}

function getSnowflakeURLImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(snowflakeURL);
}

function getThunderboltURLImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(thunderboltURL);
}

function getWindURLImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(windURL);
}

function getMistURLImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(mistURL);
}

function getTornadoURLImage(): Promise<HTMLImageElement> {
  return createAndAwaitImage(tornadoURL);
}


function modifyImageColor(
  image: HTMLImageElement,
  color: string,
  size: number,
): HTMLCanvasElement {
  const ctx: CanvasRenderingContext2D = createCanvasRenderingContext2D(size, size);
  ctx.scale(size, size);

  ctx.drawImage(image, 0, 0, 1, 1);

  ctx.globalCompositeOperation = 'source-in';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  return ctx.canvas;
}


async function generateSun(
  size: number,
  color: string = '#fcc21b',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getSunImage(), color, size);
}

async function generateCloud(
  size: number,
  color: string = '#dbdbdb',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getCloudImage(), color, size);
}

async function generateWaterDrop(
  size: number,
  // color: string = '#1a6ac1',
  color: string = '#52a0fa',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getWaterDropImage(), color, size);
}

async function generateSnowflake(
  size: number,
  color: string = '#939393',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getSnowflakeURLImage(), color, size);
}

async function generateThunderbolt(
  size: number,
  color: string = '#ffc023',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getThunderboltURLImage(), color, size);
}

async function generateWind(
  size: number,
  color: string = '#b6b6b6',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getWindURLImage(), color, size);
}

async function generateMist(
  size: number,
  color: string = '#5f5f5f',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getMistURLImage(), color, size);
}


async function generateTornado(
  size: number,
  color: string = '#3d3d3d',
): Promise<HTMLCanvasElement> {
  return modifyImageColor(await getTornadoURLImage(), color, size);
}


const clearThreshold: number = 0.1;
const lightCloudThreshold: number = 0.2;
const heavyCloudThreshold: number = 0.9;


const waterDropThreshold1 = 1 * MM_PER_DAY_TO_METER_PER_SECOND;
const waterDropThreshold2 = 5 * MM_PER_DAY_TO_METER_PER_SECOND;
const waterDropThreshold3 = 10 * MM_PER_DAY_TO_METER_PER_SECOND;
const waterDropThreshold4 = 20 * MM_PER_DAY_TO_METER_PER_SECOND;

const windThreshold1 = 8;
const windThreshold2 = 20;

async function drawSun(
  ctx: CanvasRenderingContext2D,
  weather: IWeatherData,
): Promise<void> {
  const image = await generateSun(ctx.canvas.width);

  // ctx.transform(1, 0, 0, 1, 0, 0);
  if (weather.clouds < clearThreshold) {
    ctx.drawImage(image, 0, 0, 1, 1);
  } else if (weather.clouds < lightCloudThreshold) {
    ctx.drawImage(image, 0, 0, 0.7, 0.7);
  } else if (weather.clouds < heavyCloudThreshold) {
    ctx.drawImage(image, 0, 0, 0.6, 0.6);
  } else {
    return;
    // dont draw sun
  }
}


async function drawCloud(
  ctx: CanvasRenderingContext2D,
  weather: IWeatherData,
): Promise<void> {
  const gray: number = (1 - (weather.clouds * 0.5)) * 255;
  const color: string = `rgb(${ gray }, ${ gray }, ${ gray })`;
  const image = await generateCloud(ctx.canvas.width, color);

  if (weather.clouds < clearThreshold) {
    // dont draw cloud
  } else if (weather.clouds < lightCloudThreshold) {
    ctx.drawImage(image, 0.3, 0.1, 0.7, 0.7);
  } else if (weather.clouds < heavyCloudThreshold) {
    ctx.drawImage(image, 0.2, 0, 0.8, 0.8);
  } else {
    ctx.drawImage(image, 0, -0.2, 1, 1);
  }
}

async function drawRainOrSnow(
  ctx: CanvasRenderingContext2D,
  weather: IWeatherData,
): Promise<void> {
  const isSnow: boolean = weather.snow >= weather.rain;

  const image = isSnow
    ? await generateSnowflake(ctx.canvas.width)
    : await generateWaterDrop(ctx.canvas.width);

  const quantity: number = isSnow ? weather.snow : weather.rain;

  const getWaterDropCount = () => {
    return (quantity < waterDropThreshold1)
      ? 0
      : (
        (quantity < waterDropThreshold2)
          ? 1
          : (
            (quantity < waterDropThreshold3)
              ? 2
              : (
                (quantity < waterDropThreshold4)
                  ? 3
                  : 4
              )
          )
      );
  };

  const count: number = getWaterDropCount();

  const drawDrops = () => {
    const width: number = 0.2;
    const margin: number = 0.025;
    const dropWidth: number = width + (margin * 2);
    const totalWidth: number = dropWidth * count;
    const offset = 0.5 - (totalWidth / 2) + margin;
    for (let i = 0; i < count; i++) {
      ctx.drawImage(image, (i * dropWidth) + offset, 0, width, 0.2);
    }
  };

  ctx.save();

  if (weather.clouds < clearThreshold) {
    ctx.transform(0, 0, 0, 0, 0, 0);
  } else if (weather.clouds < lightCloudThreshold) {
    ctx.transform(0.7, 0, 0, 0.7, 0.3, 0.7);
  } else if (weather.clouds < heavyCloudThreshold) {
    ctx.transform(0.7, 0, 0, 0.7, 0.225, 0.7);
  } else {
    ctx.transform(1, 0, 0, 1, 0, 0.7);
  }

  drawDrops();
  ctx.restore();
}

async function drawWind(
  ctx: CanvasRenderingContext2D,
  weather: IWeatherData,
): Promise<void> {

  if (weather.wind.speed < windThreshold1) {
    // no wind
    return;
  }

  ctx.save();


  if (weather.clouds < clearThreshold) {
    ctx.transform(1, 0, 0, 1, 0, 0);
  } else if (weather.clouds < lightCloudThreshold) {
    ctx.transform(0.4, 0, 0, 0.4, 0.45, 0.6);
  } else if (weather.clouds < heavyCloudThreshold) {
    ctx.transform(0.5, 0, 0, 0.5, 0.325, 0.55);
  } else {
    ctx.transform(0.6, 0, 0, 0.6, 0.2, 0.4);
  }

  if (weather.wind.speed < windThreshold2) {
    const image = await generateWind(ctx.canvas.width);
    ctx.drawImage(image, 0, 0.2, 1, 0.6);
  } else {
    const image = await generateTornado(ctx.canvas.width);
    ctx.drawImage(image, 0, 0, 1, 1);
  }

  ctx.restore();
}


async function drawThunder(
  ctx: CanvasRenderingContext2D,
  weather: IWeatherData,
): Promise<void> {

  if (!weather.state.some((state: IWeatherStateId) => ((200 <= state) && (state < 300)))) {
    // no thunder
    return;
  }

  ctx.save();


  if (weather.clouds < clearThreshold) {
    ctx.transform(0, 0, 0, 0, 0, 0);
  } else if (weather.clouds < lightCloudThreshold) {
    ctx.transform(0.4, 0, 0, 0.4, 0.45, 0.55);
  } else if (weather.clouds < heavyCloudThreshold) {
    ctx.transform(0.5, 0, 0, 0.5, 0.35, 0.5);
  } else {
    ctx.transform(0.6, 0, 0, 0.6, 0.2, 0.4);
  }

  const image = await generateThunderbolt(ctx.canvas.width);
  ctx.drawImage(image, 0, 0, 1, 1);

  ctx.restore();
}


async function drawWeather(
  ctx: CanvasRenderingContext2D,
  weather: IWeatherData,
): Promise<void> {
  // weather.clouds = 0.9;
  // weather.wind.speed = 10;
  // weather.state = [200];

  await drawSun(ctx, weather);
  await drawThunder(ctx, weather);
  await drawCloud(ctx, weather);
  await drawWind(ctx, weather);
  await drawRainOrSnow(ctx, weather);
}

/*---------------*/

export type IWeatherData =
  IDailyWeather
  | IHourlyWeather
  ;

/*---------------*/

export async function generateWeatherImage(
  weather: IWeatherData,
  size: number,
): Promise<HTMLCanvasElement> {
  const ctx: CanvasRenderingContext2D = createCanvasRenderingContext2D(size, size);
  ctx.canvas.style.border = '2px solid black';
  ctx.scale(size, size);

  // const weather: IDailyWeather = {
  //   'date': 1625828400000,
  //   'clouds': 0.27,
  //   'dewPoint': 286.47,
  //   'humidity': 0.66,
  //   'moon': {
  //     'phase': 980,
  //     'rise': 1625799420000,
  //     'set': 1625858940000
  //   },
  //   'probabilityOfPrecipitation': 0.98,
  //   'pressure': 102400,
  //   'rain': 4.513888888888889e-9 * 0, // 0.39
  //   'snow': 0,
  //   'sun': {
  //     'rise': 1625802799000,
  //     'set': 1625858863000
  //   },
  //   'temperature': {
  //     'morning': 285.54,
  //     'day': 293,
  //     'evening': 294.4,
  //     'night': 287.97,
  //     'min': 284.57,
  //     'max': 294.88
  //   },
  //   'ultravioletIndex': 4.9,
  //   'wind': {
  //     'direction': 24,
  //     'speed': 2.16,
  //     'gust': 2.84
  //   },
  //   'state': [
  //     500
  //   ]
  // };

  // document.body.appendChild(ctx.canvas);
  await drawWeather(ctx, weather);

  return ctx.canvas;
}
