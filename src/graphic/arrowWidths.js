import * as d3 from "d3";

export function calculateArrowWidth(tradeVolume) {
  // const maxVol = 141316785159;
  // const maxVol = 1413167;
  let minVol = 410666;
  minVol = minVol / 100;
  const maxVol = minVol * 1000000;
  const widthScaleFunc = d3
    .scaleLinear()
    .domain([maxVol, minVol])
    .range([1, 8]);

  return 3;
  // return widthScaleFunc(tradeVolume);
}

export default calculateArrowWidth;
