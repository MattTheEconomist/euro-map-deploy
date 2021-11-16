import capitals from "../data/capitals.json";
import countryList from "../data/countryList";

import centroids from "../data/centroids.json";

import { europeProjection } from "../mapDataPrep/mapDrawFunctions";

const removeTheseCountries = [
  "Albania",
  "Macedonia",
  "Malta",
  "Cyprus",
  "Maldova",
  "Luxembourg",
  "Slovenia",
  "Moldova",
  "Switzerland",
  "Denmark",
  "Belgium",
];

const makeTheseSmaller = [
  "Portugal",
  "Switzerland",
  "Bosnia",
  "Denmark",
  "unitedKingdom",
  "Belgium",
  "Croatia",
  "Netherlands",
];

const boldThese = ["Greece", "Portugal"];

const centroidsFiltered = centroids.filter(
  (row) => !removeTheseCountries.includes(row.name)
);

export function drawCapitals(svg) {
  svg
    .selectAll("text")
    .data(centroidsFiltered)
    .enter()
    .append("text")
    .attr("x", function (d) {
      return europeProjection([d.longitude, d.latitude])[0];
    })
    .attr("y", function (d) {
      return europeProjection([d.longitude, d.latitude])[1];
    })
    .text((d) => {
      if (d.name === "unitedKingdom") {
        return "United Kingdom";
      }
      return d.name;
    })
    .style("font-size", (d) => {
      if (makeTheseSmaller.includes(d.name)) {
        return "6.5px";
      } else {
        return "8px";
      }
    })
    .attr("text-anchor", "middle");
}

export default drawCapitals;
