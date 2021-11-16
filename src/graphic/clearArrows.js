import * as d3 from "d3";

export function clearArrowsAndCircles() {
  const arrowLines = d3.selectAll(".arrow");
  const circles = d3.selectAll(".startingCircle");

  arrowLines.transition().duration(800).style("opacity", 0);
  circles.transition().duration(800).style("opacity", 0);

  setTimeout(() => {
    arrowLines.remove();
    circles.remove();
  }, 1100);
}

export default clearArrowsAndCircles;
