import React from "react";
import UpperHeader from "./UpperHeader";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

const header = () => {
  return (
    <>
      {/* <UpperHeader /> */}
      <Navbar/>
      <MobileNavbar/>
    </>
  );
};

export default header;
