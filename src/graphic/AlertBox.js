export const AlertBox = (props) => {
  const { toggleEUSelected, nonEUCountry, nonEUCountryName } = props;

  const alertTtext = `No Data! ${nonEUCountryName} is not in the EU`;

  let alertStyles = {
    top: "-38em",
    left: "30em",
    backgroundColor: "#d12e6a",
    fontSize: "1.1em",
    width: "300px",
    height: "100px",
    position: "relative",
    boxShadow: ".2em .4em black",
    borderRadius: "1em",
    paddingTop: "2rem",
    visibility: "hidden",
  };

  if (nonEUCountry) {
    alertStyles.visibility = "visible";
  } else {
    alertStyles.visibility = "hidden";
  }

  return (
    <div style={alertStyles}>
      {alertTtext}

      <br />

      <button
        style={{
          width: "75px",
          height: "30px",
          fontSize: "1em",
          marginTop: "2rem",
          borderRadius: ".5em",
        }}
        onClick={() => toggleEUSelected()}
      >
        Okay
      </button>
    </div>
  );
};

export default AlertBox;
