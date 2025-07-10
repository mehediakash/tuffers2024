import React from "react";

const MapConatacts = () => {
  return (
    <div className="">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d472308.323704535!2d91.821282!3d22.357073!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd890692a17af%3A0x4470bb8733e7d825!2sYunusco%20City%20Centre%2C%20809%20CDA%20Ave%2C%20Chittagong%204000!5e0!3m2!1sen!2sbd!4v1735327573925!5m2!1sen!2sbd"
        className="w-full h-[180px] sm:h-[300px] lg:h-[500px]"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapConatacts;
