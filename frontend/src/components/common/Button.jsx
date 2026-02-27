import React from "react";
import "../../styles/common.css";

const Button = ({ text, variant = "primary", onClick, type="button" }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export default Button;