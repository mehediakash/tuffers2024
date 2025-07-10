import React from "react";
import about from "../../assets/banner/breadcrumb.webp";
import BradCumbs from "../bradcumbs/BradCumbs";

const AboutBanner = () => {
  return (
    <div className="w-full relative">
      <BradCumbs title={"About Us"} className="absolute text-white left-[30%] top-20"/>
      <img className="w-full h-full object-cover object-center" src={about} />
    </div>
  );
};

export default AboutBanner;
