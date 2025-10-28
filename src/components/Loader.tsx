import Image from "next/image";
import React from "react";

interface Props {}

function Loader(props: Props) {
  return (
    <div className="spinner">
      <div className="spinner1"></div>
    </div>
  );
}

export default Loader;
