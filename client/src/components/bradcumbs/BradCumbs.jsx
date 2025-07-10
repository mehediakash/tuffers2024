import React from "react";
import Containar from "../../layouts/Containar";

const BradCumbs = ({ title, className }) => {
  return (
    <section className={`py-7 sm:py-10 md:py-14 ${className ? className : ""}`}>
      <Containar className="flex flex-col items-center justify-center">
        <h3 className="text-[24px] uppercase md:text-[28px] text-center font-medium inline-block">
          {title} 
        </h3>
        <p className="font-bold text-danger">Tuffers Lifestyle Limited</p>
      </Containar>
    </section>
  );
};

export default BradCumbs;
