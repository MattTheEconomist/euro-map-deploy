import countryList from "../data/countryList";
import React from "react";

const CountrySelect = (props) => {
  const {
    handleOriginChange,
    origin,
    tradeFlow,
    tradeFlowToExport,
    tradeFlowToImport,
  } = props;

  const countryListSorted = countryList.sort((a, b) => (a > b ? 1 : -1));

  countryListSorted.splice(-1, 1, "United Kingdom");

  const optionsHtml = countryListSorted.map((el, ind) => (
    <option key={ind}>{el}</option>
  ));

  const originSelect = document.getElementById("originSelect");

  const initialLoadState = origin ? false : true;

  const highlightClass = initialLoadState ? "highlightSelect" : "none";

  return (
    <div id="countrySelectContainer" style={{ minWidth: 500 }}>
      <h3> Change Country Selected </h3>
      <select
        id="originSelect"
        className={highlightClass}
        onChange={handleOriginChange}
        value={origin}
      >
        {optionsHtml}
      </select>

      <TradeFlowButton
        btnType="Import"
        tradeFlow={tradeFlow}
        tradeFlowToExport={tradeFlowToExport}
        tradeFlowToImport={tradeFlowToImport}
        initialLoadState={initialLoadState}
      />

      <TradeFlowButton
        btnType="Export"
        tradeFlow={tradeFlow}
        tradeFlowToExport={tradeFlowToExport}
        tradeFlowToImport={tradeFlowToImport}
        initialLoadState={initialLoadState}
      />
      {/* <div className={highlightClass}></div> */}
    </div>
  );
};

const TradeFlowButton = (props) => {
  const {
    btnType,
    tradeFlow,
    tradeFlowToExport,
    tradeFlowToImport,
    initialLoadState,
  } = props;

  const btnTypeLower = btnType.toLowerCase();

  const clickFunction =
    btnType === "Import" ? tradeFlowToImport : tradeFlowToExport;

  let btnId = tradeFlow === btnTypeLower ? "activeBtn" : "passiveBtn";

  if (initialLoadState) {
    btnId = "passiveBtn";
  }

  const btnText =
    tradeFlow === btnTypeLower
      ? `Currently Showing ${btnType}s`
      : `Show ${btnType}s Instead`;

  return (
    <button
      id={btnId}
      className="tradeFlowBtn"
      disabled={initialLoadState}
      onClick={clickFunction}
    >
      {btnText}
    </button>
  );
};

export default CountrySelect;
