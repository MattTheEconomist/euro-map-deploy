import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import summaryData from "../data/summaryData.json";

import {
  findTradePartnersExport,
  findTradePartnersImport,
} from "../mapDataPrep/findTradePartners";

import { colorByCountry } from "./colorByCountry";

import ForceBlocksTooltip from "./forceBlocksTooltip";

export function ForceBlocks(props) {
  const { origin, tradeFlow, originChangeFromGraphic } = props;

  const [tooltipStyles, setTooltipStyles] = useState({});
  const [blockHovered, setBlockHovered] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    createBlocks(tradeFlow);
    reDrawBlocks(tradeFlow);
  }, [origin, tradeFlow]);

  function generateRow(idx) {
    let rowPx = 45;
    let totalRows = 5;
    let thisRow = 3;

    if (idx > 9 && idx <= 14) {
      rowPx = 35;
      thisRow = 2;
      return thisRow * rowPx;
    }

    if (idx > 14) {
      rowPx = 30;
      return thisRow * rowPx;
    }

    return Math.floor(idx / totalRows) * rowPx;
  }

  function generateCol(idx) {
    let columnPx = 50;
    let totalColumns = 5;

    if (idx > 14) {
      totalColumns = 20;
      columnPx = 20;
      return (idx - 15) * columnPx + 27;
    }

    return (idx % totalColumns) * columnPx + 25;
  }

  function createBlocks(tradeFlow) {
    const svg = d3.select("#blockSvg");

    const keyString =
      tradeFlow === "import" ? "countryTotalImports" : "countryTotalExports";

    const summaryDataSorted = summaryData.sort(
      (a, b) => b[keyString] - a[keyString]
    );

    const tradeVolumes = summaryDataSorted.map((row) => row[keyString]);

    let countryNames = summaryDataSorted.map((row) => row.Partner);

    countryNames = countryNames.map(
      (el) => el.charAt(0).toUpperCase() + el.slice(1)
    );

    const colorObj = generateColorObj(tradeFlow, origin);

    const blockScale = d3
      .scaleLinear()
      .domain([0, d3.max(tradeVolumes)])
      .range([7, 40]);

    svg
      .selectAll(".block")
      .data(tradeVolumes)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        return generateCol(i);
      })
      .attr("y", (d, i) => {
        return generateRow(i);
      })
      .attr("width", (d) => {
        return blockScale(d);
      })
      .attr("height", (d) => {
        return blockScale(d);
      })
      .attr("fill", (d, i) => {
        const thisCountryName = countryNames[i];

        const originForMatch = origin.toLowerCase();

        if (originForMatch === "unitedkingdom") {
          originForMatch = "unitedKingdom";
        }

        if (originForMatch === thisCountryName) {
          return "green";
        }

        return colorObj[thisCountryName];
      })
      .attr("class", "block")
      .attr("id", (d, i) => `${countryNames[i]}Block`)
      .on("click", function () {
        const thisId = this.id;
        let countryName = thisId.replace("Block", "");

        if (countryName === "UnitedKingdom") {
          countryName = "unitedKingdom";
        }

        console.log("fc blocks", countryName);

        originChangeFromGraphic(countryName);
      })
      .on("mouseover", function () {
        setTooltipStyles({
          ...tooltipStyles,
          toolX: this.x.baseVal.value,
          toolY: this.y.baseVal.value,
          visibility: "visible",
        });

        const currentBlock = d3.select(this);
        let currentBlockID = currentBlock._groups[0][0].attributes.id.nodeValue;
        setIsHovering(true);
        setBlockHovered(currentBlockID);
      })
      .on("mouseout", () => {
        setTooltipStyles({
          ...tooltipStyles,
          visibility: "hidden",
        });

        setBlockHovered("");
        setIsHovering(false);
      });
  }

  function reDrawBlocks(tradeFlow) {
    const keyString =
      tradeFlow === "import" ? "countryTotalImports" : "countryTotalExports";

    const summaryDataSorted = summaryData.sort(
      (a, b) => b[keyString] - a[keyString]
    );

    const tradeVolumes = summaryDataSorted.map((row) => row[keyString]);

    let countryNames = summaryDataSorted.map((row) => row.Partner);
    countryNames = countryNames.map(
      (el) => el.charAt(0).toUpperCase() + el.slice(1)
    );

    const colorObj = generateColorObj(tradeFlow, origin);

    const blockScale = d3
      .scaleLinear()
      .domain([0, d3.max(tradeVolumes)])
      .range([5, 40]);

    d3.selectAll(".block")
      .transition()
      .duration(1000)
      .attr("width", (d) => {
        return blockScale(d);
      })
      .attr("height", (d) => {
        return blockScale(d);
      })
      .attr("fill", function (d, i) {
        const currentBlock = d3.select(this);
        let currentBlockID = currentBlock._groups[0][0].attributes.id.nodeValue;

        const thisCountryName = currentBlockID.slice(0, -5);

        let originForComparison = origin;

        if (originForComparison === "unitedKingdom") {
          originForComparison = "UnitedKingdom";
        }

        if (originForComparison === thisCountryName) {
          return "green";
        }

        return colorObj[thisCountryName];
      });
  }

  function generateColorObj(tradeFlow, origin) {
    const tradePartnersFull = createTradeData(origin, tradeFlow);

    const colorObj = colorByCountry(tradePartnersFull);
    return colorObj;
  }

  function createTradeData(origin, tradeFlow) {
    let tradePartnersFull =
      tradeFlow === "export"
        ? findTradePartnersExport(origin)
        : findTradePartnersImport(origin);

    return tradePartnersFull;
  }

  let titleText = "Export Share";

  if (origin) {
    titleText = ` ${origin}'s share of all EU ${
      tradeFlow.charAt(0).toUpperCase() + tradeFlow.slice(1)
    }s`;
  }

  return (
    <div id="forceBlocksContainer" style={{ maxHeight: "200px" }}>
      <h3 id="forceBlocksTitle">{titleText}</h3>
      <svg id="blockSvg" height={400}></svg>
      <ForceBlocksTooltip
        isHovering={isHovering}
        tooltipStyles={tooltipStyles}
        blockHovered={blockHovered}
        tradeFlow={tradeFlow}
      />
    </div>
  );
}

export default ForceBlocks;
