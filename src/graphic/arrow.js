import { europeProjection } from "../mapDataPrep/mapDrawFunctions";
import * as d3 from "d3";
import capitals from "../data/capitals.json";
import arrowHeadLength from "../mapDataPrep/graphDimensions";
import { drawCircle } from "./circle";

export function drawArrowDirection(svg, origin, tradePartners, tradeFlow) {
  const largestTradePartner = Object.keys(tradePartners)[0];

  let arrowStart;
  let arrowEnd;

  if (tradeFlow === "export") {
    arrowStart = origin;
    arrowEnd = largestTradePartner;
  }
  if (tradeFlow === "import") {
    arrowStart = largestTradePartner;
    arrowEnd = origin;
  }

  if (arrowStart === "UnitedKingdom") {
    arrowStart = "unitedKingdom";
  }

  if (arrowEnd === "UnitedKingdom") {
    arrowEnd = "unitedKingdom";
  }

  drawArrowParts(svg, arrowStart, arrowEnd, 3);

  drawCircle(svg, arrowStart);
}

export function drawArrowParts(svg, origin, dest, lineWidth) {
  const lineCoords = createPathCoordinates(origin, dest);


  const testCoords = createPathCoordinates("Ireland", "France");


  const arrowTopCoords = topArrowStartingCoordinates(origin, dest);

  const arrowBottomCoords = bottomArrowStartingCoordinates(origin, dest);

  drawArrowStem(svg, lineCoords, lineWidth);
  drawArrowHeadTop(svg, lineCoords, arrowTopCoords, lineWidth);
  drawArrowHeadBottom(svg, lineCoords, arrowBottomCoords, lineWidth);
}

function drawArrowStem(svg, lineCoords, lineWidth) {
  svg
    .append("line")
    .attr("id", "arrowStem")
    .attr("class", "arrow")
    .attr("x1", lineCoords.x1)
    .attr("y1", lineCoords.y1)
    .attr("x2", lineCoords.x1)
    .attr("y2", lineCoords.y1)
    .style("stroke", "black")
    .style("stroke-width", lineWidth)
    .style("stroke-linecap", "butt")
    .transition()
    .duration(2000)
    .attr("x2", lineCoords.x2)
    .attr("y2", lineCoords.y2);
}

function drawArrowHeadTop(svg, lineCoords, arrowTopCoords, lineWidth) {
  let arrowTopXDifference = arrowTopCoords.x1 - lineCoords.x2;
  let arrowTopYDifference = arrowTopCoords.y1 - lineCoords.y2;

  let arrowAngle = degreeRotationBetweenCoordinates(lineCoords);

  if (arrowAngle > 180) {
    arrowTopYDifference *= -1;
  }

  svg
    .append("line")
    .attr("id", "arrowHeadTop")
    .attr("class", "arrow")
    .attr("x1", lineCoords.x1 + arrowTopXDifference)
    .attr("y1", lineCoords.y1 + arrowTopYDifference)
    .attr("x2", lineCoords.x1)
    .attr("y2", lineCoords.y1)
    .style("stroke", "black")
    .style("stroke-width", lineWidth)
    .style("stroke-linecap", "square")
    .transition()
    .duration(2000)
    .attr("x1", arrowTopCoords.x1)
    .attr("y1", arrowTopCoords.y1)
    .attr("x2", lineCoords.x2)
    .attr("y2", lineCoords.y2);
}

function drawArrowHeadBottom(svg, lineCoords, arrowBottomCoords, lineWidth) {
  let arrowBottomXDiffernce = arrowBottomCoords.x1 - lineCoords.x2;
  let arrowBottomYDiffernce = arrowBottomCoords.y1 - lineCoords.y2;

  let arrowAngle = degreeRotationBetweenCoordinates(lineCoords);

  svg
    .append("line")
    .attr("id", "arrowHeadTop")
    .attr("class", "arrow")
    .attr("x1", lineCoords.x1 + arrowBottomXDiffernce)
    .attr("y1", lineCoords.y1 + arrowBottomYDiffernce)
    .attr("x2", lineCoords.x1)
    .attr("y2", lineCoords.y1)
    .style("stroke", "black")
    .style("stroke-width", lineWidth)
    .style("stroke-linecap", "square")
    .transition()
    .duration(2000)
    .attr("x1", arrowBottomCoords.x1)
    .attr("y1", arrowBottomCoords.y1)
    .attr("x2", lineCoords.x2)
    .attr("y2", lineCoords.y2);
}

function topArrowStartingCoordinates(orig, dest) {
  const lineCoords = createPathCoordinates(orig, dest);
  let arrowAngle = degreeRotationBetweenCoordinates(lineCoords);

  let alphaAngle = arrowAngle - 45;
  let betaAngle = 180 - 90 - alphaAngle;

  alphaAngle = degsToRags(alphaAngle);
  betaAngle = degsToRags(betaAngle);

  const verticalDistance = arrowHeadLength * Math.sin(alphaAngle);
  const horizontalDistance = arrowHeadLength * Math.sin(betaAngle);

  const startingX = lineCoords.x2 - horizontalDistance;
  const startingY = lineCoords.y2 - verticalDistance;

  return { x1: startingX, y1: startingY };
}

function bottomArrowStartingCoordinates(orig, dest) {
  const lineCoords = createPathCoordinates(orig, dest);
  const arrowAngle = degreeRotationBetweenCoordinates(lineCoords);

  let alphaAngle = arrowAngle + 45;
  let betaAngle = 180 - 90 - alphaAngle;

  alphaAngle = degsToRags(alphaAngle);
  betaAngle = degsToRags(betaAngle);

  const verticalDistance = arrowHeadLength * Math.sin(alphaAngle);
  const horizontalDistance = arrowHeadLength * Math.sin(betaAngle);

  const startingX = lineCoords.x2 - horizontalDistance;
  const startingY = lineCoords.y2 - verticalDistance;

  return { x1: startingX, y1: startingY };
}

function degreeRotationBetweenCoordinates(coordObj) {
  const yDiff = coordObj.y2 - coordObj.y1;
  const xDiff = coordObj.x2 - coordObj.x1;

  const radians = Math.atan2(yDiff, xDiff);

  return radsToDegs(radians);
}

export function createPathCoordinates(origRow, destRow) {
  origRow = capitals.filter((row) => row.country === origRow);
  destRow = capitals.filter((row) => row.country === destRow);

  origRow = origRow[0];
  destRow = destRow[0];

  if (typeof origRow === "undefined") {
    return null;
  }

  let coordinates = {};

  coordinates["x1"] = europeProjection([
    origRow.longitude,
    origRow.latitude,
  ])[0];
  coordinates["y1"] = europeProjection([
    origRow.longitude,
    origRow.latitude,
  ])[1];
  coordinates["x2"] = europeProjection([
    destRow.longitude,
    destRow.latitude,
  ])[0];
  coordinates["y2"] = europeProjection([
    destRow.longitude,
    destRow.latitude,
  ])[1];

  return coordinates;
}

function radsToDegs(rad) {
  return (rad * 180) / Math.PI;
}

function degsToRags(deg) {
  return (deg * Math.PI) / 180.0;
}

export default drawArrowDirection;
