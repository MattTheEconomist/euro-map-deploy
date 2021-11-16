import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { geoJsonUrl, europeProjection } from "../mapDataPrep/mapDrawFunctions";
import drawCapitals from "./capitals";
import colorByCountry, { paintCountries } from "./colorByCountry";
import AlertBox from "./AlertBox";

const EuroMap = (props) => {
  const [geoMap, setGeoMap] = useState({});
  const [nonEUCountryName, setNonEUCountryName] = useState("");

  const { originChangeFromGraphic, origin, toggleEUSelected, nonEUCountry } =
    props;

  //   draw map functions
  useEffect(() => {
    fetch(geoJsonUrl).then((response) => {
      response.json().then((geoData) => {
        setGeoMap(geoData);
        drawMap(geoData);
      });
    });
  }, []);

  useEffect(() => {
    drawMap(geoMap);
    drawCapitals(svg);
  }, [geoMap]);

  useEffect(() => {
    drawCapitals(svg);
  }, []);

  const svg = d3.select("#europeMap");

  function drawMap(geoData) {
    let pathGenerator = d3.geoPath().projection(europeProjection);

    svg
      .selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("stroke", "black")
      .attr("class", "countryPath")
      .attr("id", function (d) {
        const countryName = d.properties.name;
        if (countryName === "Czech Republic") {
          return "Czechia";
        }
        if (countryName === "United Kingdom") {
          return "unitedKingdom";
        } else {
          return countryName;
        }
      })
      .attr("fill", "hsl(186, 0%, 50%)");

    const countries = d3.selectAll(".countryPath");

    countries.on("click", function () {
      originChangeFromGraphic(this.id);
      setNonEUCountryName(this.id);
    });
  }

  return (
    <>
      <svg id="europeMap" viewBox="0 -100 700 450"></svg>

      <AlertBox
        orgin={origin}
        toggleEUSelected={toggleEUSelected}
        nonEUCountry={nonEUCountry}
        nonEUCountryName={nonEUCountryName}
      />
    </>
  );
};

export default EuroMap;
