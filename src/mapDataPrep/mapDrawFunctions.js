import { mapHeight, mapWidth } from "./graphDimensions";
import * as d3 from "d3";

const geoJsonUrl =
  "https://gist.githubusercontent.com/spiker830/3eab0cb407031bf9f2286f98b9d0558a/raw/7edae936285e77be675366550e20f9166bed0ed5/europe_features.json";

const europeProjection = d3
  .geoMercator()
  .center([13, 52])
  // .center([300, 52])
  // .scale([mapWidth / 1.5])
  .scale([mapWidth / 1.4])
  .translate([mapWidth / 2.2, mapHeight / 5]);

const pathGenerator = d3.geoPath().projection(europeProjection);

export { geoJsonUrl, europeProjection, pathGenerator };
