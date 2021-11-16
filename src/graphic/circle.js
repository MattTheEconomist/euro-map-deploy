import React, { useState, useEffect } from "react";
import * as d3 from "d3";

import { createPathCoordinates } from "./arrow";

export function drawCircle(svg, arrowStart) {
  const circleCoords = createPathCoordinates(arrowStart, "Germany");

  svg
    .append("circle")
    .attr("id", "arrowStartCircle")
    .attr("class", "startingCircle")
    .attr("cx", circleCoords.x1)
    .attr("cy", circleCoords.y1)
    .attr("r", 0)
    .attr("stroke-width", 0)
    .transition()
    .duration(1000)
    .attr("r", 7)
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("fill", "white");
}
