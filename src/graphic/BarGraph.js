import * as d3 from "d3";
import React, { useState, useEffect } from "react";
import { barGraphDims } from "../mapDataPrep/graphDimensions";
import {
  findTradePartnersExport,
  findTradePartnersImport,
} from "../mapDataPrep/findTradePartners";

import { colorByCountry } from "./colorByCountry";

export function BarGraph(props) {
  const { origin, tradeFlow } = props;

  const {
    height,
    width,
    barHeight,
    barMarginBetween,
    marginTop,
    barStartLeft,
    svgHeight,
    euroTextXStart,
  } = barGraphDims;

  useEffect(() => {
    const tradePartnersFull = createTradeData(origin, tradeFlow);
    const tradePartnersTop = createAbbrevData(tradePartnersFull);
    const barData = createPortionBarData(tradePartnersTop);
    drawCountryNames(tradePartnersFull, origin);
    drawAxis();
    createBars(barData);
    reDrawBars(barData, tradePartnersFull, origin);
  }, []);

  useEffect(() => {
    const tradePartnersFull = createTradeData(origin, tradeFlow);
    const tradePartnersTop = createAbbrevData(tradePartnersFull);

    const barData = createPortionBarData(tradePartnersTop);

    drawAxis();
    drawCountryNames(tradePartnersFull, origin);
    reDrawBars(barData, tradePartnersFull, origin);
  }, [origin, tradeFlow]);

  // global stuffs
  const svg = d3.select("#graphSvg");

  const xScale = d3.scaleLinear().domain([0, 0.6]).range([0, width]);

  // call deez

  function createAbbrevData(tradePartnersFull) {
    const allCountries = Object.keys(tradePartnersFull);
    const allVolumes = Object.values(tradePartnersFull);

    let rez = {};

    for (let i = 0; i < 7; i++) {
      rez[allCountries[i]] = allVolumes[i];
    }

    return rez;
  }

  function createPortionBarData(tradePartnersTop) {
    const tradeVolumes = Object.values(tradePartnersTop);
    const totalTrade = tradeVolumes.reduce((a, b) => a + b, 0);

    const unroundedData = tradeVolumes.map((el) => el / totalTrade);

    const portionBarData = unroundedData.map((el) => parseFloat(el.toFixed(3)));

    return portionBarData;
  }

  function createTradeData(origin, tradeFlow) {
    let tradePartnersFull =
      tradeFlow === "export"
        ? findTradePartnersExport(origin)
        : findTradePartnersImport(origin);

    return tradePartnersFull;
  }

  function drawCountryNames(tradePartnersFull, origin) {
    d3.selectAll(".barLabels").remove();

    const allCountries = Object.keys(tradePartnersFull);

    let topSevenCountries = [];

    for (let i = 0; i < 7; i++) {
      let currentCountry = allCountries[i];
      if (currentCountry === "UnitedKingdom") {
        currentCountry = "U.K.";
      }

      topSevenCountries.push(currentCountry);
    }

    let svg = d3.select("#graphSvg");

    svg
      .selectAll(".barLabels")
      .data(topSevenCountries)
      .enter()
      .append("text")
      .text((d) => {
        if (origin) {
          return d;
        } else {
          return "";
        }
      })
      .attr("x", 10)
      .attr("y", (d, i) => i * (barHeight + barMarginBetween) + marginTop + 10)
      .attr("class", "barLabels")
      .attr("stroke", "white")
      .attr("font-weight", 15);
  }

  function reDrawBars(barData, tradePartnersFull, origin) {
    const colorObj = colorByCountry(tradePartnersFull);

    const colorValues = Object.values(colorObj);

    svg
      .selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
      .attr("x", barStartLeft)
      .attr("y", (d, i) => i * (barHeight + barMarginBetween) + marginTop)
      .attr("height", barHeight)
      .attr("class", "bar");

    d3.selectAll(".bar")
      .transition()
      .duration(1500)
      .attr("width", (d) => {
        return xScale(d);
      })
      .attr("fill", (d, i) => {
        return colorValues[i];
      });

    const textData = ["Euros"];

    for (let i = 0; i < 7; i++) {
      const currentTradeValue = Object.values(tradePartnersFull)[i];

      textData.push(formatTradeValue(currentTradeValue));
    }

    d3.selectAll(".dataTable").remove();

    svg
      .selectAll(".dataTable")
      .data(textData)
      .enter()
      .append("text")
      .attr("x", euroTextXStart)
      .attr("y", (d, i) => i * (barHeight + barMarginBetween) + 22)
      .text((d) => {
        if (origin) {
          return d;
        } else {
          return "";
        }
      })
      .attr("class", "dataTable")
      .attr("stroke", "white")
      .attr("font-weight", 15);
  }

  function formatTradeValue(tradeValue) {
    let formattedValue = tradeValue / 1000000000;
    let trailingLetter;

    if (formattedValue > 1) {
      trailingLetter = "B";
    } else {
      formattedValue = tradeValue / 1000000;
      trailingLetter = "M";
    }

    formattedValue = formattedValue.toFixed(1);

    return `${formattedValue}${trailingLetter}`;
  }

  function createBars(barData) {
    const svg = d3.select("#graphSvg");

    svg
      .selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
      .attr("x", barStartLeft)
      .attr("y", (d, i) => i * (barHeight + barMarginBetween) + marginTop)
      .attr("width", (d) => {
        return xScale(d);
      })
      .attr("height", barHeight)
      .attr("class", "bar");
  }

  function drawAxis() {
    const svg = d3.select("#graphSvg");

    d3.select("#barGraphAxis").remove();

    const axisData = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];

    const formatPercent = d3.format(".0%");

    const x_axis = d3
      .axisBottom()
      .scale(xScale)
      .ticks(6)
      .tickFormat(formatPercent);

    svg
      .append("g")
      // .attr("transform", `translate (${barStartLeft}, ${marginTop - 20})`)
      .attr("transform", `translate (${barStartLeft}, ${160})`)
      .attr("id", "barGraphAxis")
      .call(x_axis);
  }

  return (
    <div style={{ width: "550px" }}>
      <h2 id="barGraphTitle"></h2>
      <BarTitle origin={origin} tradeFlow={tradeFlow} />
      <svg
        id="graphSvg"
        height={svgHeight}
        // width={550}
        // width="550px"
      ></svg>
    </div>
  );
}

function BarTitle(props) {
  const { origin, tradeFlow } = props;

  function upDateBarTitle(origin, tradeFlow) {
    let rezTitle;
    if (tradeFlow === "export") {
      rezTitle = `${origin} Exports to`;
    }

    if (tradeFlow === "import") {
      rezTitle = `${origin} Imports from`;
    }

    return rezTitle;
  }

  return <h4>{upDateBarTitle(origin, tradeFlow)}</h4>;
}

export default BarGraph;
