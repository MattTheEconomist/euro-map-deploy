import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { drawArrowDirection } from "./graphic/arrow";
import CountrySelect from "./controlPanel/countrySelect";
import EuroMap from "./graphic/europeMap";
import clearArrowsAndCircles from "./graphic/clearArrows";
import {
  findTradePartnersExport,
  findTradePartnersImport,
} from "./mapDataPrep/findTradePartners";
import calculateArrowWidth from "./graphic/arrowWidths";
import colorByCountry, { paintCountries } from "./graphic/colorByCountry";
import BarGraph from "./graphic/BarGraph";
import ForceBlocks from "./graphic/forceBlocks";
import countryList from "./data/countryList";
import Title from "./graphic/Title";

const Source = () => {
  const [origin, setOrigin] = useState("");
  const [tradeFlow, setTradeFlow] = useState("export");
  const [nonEUCountry, setNonEUCountry] = useState(false);

  const svg = d3.select("#europeMap");

  useEffect(() => {
    d3.selectAll(".countryPath").attr("fill", "grey");

    if (origin) {
      clearArrowsAndCircles();

      const tradePartners =
        tradeFlow === "export"
          ? findTradePartnersExport(origin)
          : findTradePartnersImport(origin);

      const colorObj = colorByCountry(tradePartners);

      paintCountries(colorObj, origin);

      drawArrowDirection(svg, origin, tradePartners, tradeFlow);
    }
  }, [origin, tradeFlow]);

  function handleOriginChange(e) {
    const originSelected = e.target.value;

    if (originSelected === "United Kingdom") {
      setOrigin("unitedKingdom");
    } else {
      setOrigin(originSelected);
    }
  }

  function toggleEUSelected() {
    setNonEUCountry(false);
  }

  function originChangeFromGraphic(countryName) {
    console.log(countryName);

    if (countryName === "unitedKingdom") {
      setOrigin(countryName);
    } else if (countryList.includes(countryName)) {
      setOrigin(countryName);
      setNonEUCountry(false);
    } else {
      setNonEUCountry(true);
    }
  }

  function tradeFlowToImport() {
    if (tradeFlow === "export") {
      setTradeFlow("import");
    }
  }

  function tradeFlowToExport() {
    if (tradeFlow === "import") {
      setTradeFlow("export");
    }
  }

  return (
    <>
      <Title origin={origin} tradeFlow={tradeFlow} />

      <div id="mapAndGraphContainer">
        <div id="graphContainer">
          <CountrySelect
            handleOriginChange={handleOriginChange}
            origin={origin}
            tradeFlow={tradeFlow}
            tradeFlowToExport={tradeFlowToExport}
            tradeFlowToImport={tradeFlowToImport}
          />
          <BarGraph origin={origin} tradeFlow={tradeFlow} />
          <ForceBlocks
            origin={origin}
            tradeFlow={tradeFlow}
            originChangeFromGraphic={originChangeFromGraphic}
          />
        </div>
        <div
          id="mapContainer"
          style={{
            maxWidth: "1200px",
            minWidth: "1200px",
          }}
        >
          <EuroMap
            origin={origin}
            originChangeFromGraphic={originChangeFromGraphic}
            toggleEUSelected={toggleEUSelected}
            nonEUCountry={nonEUCountry}
          />
        </div>
      </div>
    </>
  );
};

export default Source;
