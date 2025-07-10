import React from "react";
import Containar from "../../../layouts/Containar";
import logo from "../../../assets/logos/logowhite.png";
import { Link } from "react-router-dom";

const BottomFooter = () => {
  return (
    <footer className="font-inter py-5 bg-[#2B3445] px-10">
      <Containar>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            ©2025 tuffers, All rights reserved. Developed by
            <span className="text-white mx-2">
              <Link target="_blanck" to={"https://www.facebook.com/Div.akash"}>
                MD. Mehedi Hasan Akash
              </Link>
            </span>
          </p>
          <Link className="flex items-baseline" to={"/"}>
            <div className="w-14">
              <img className="w-full" src={logo} />
            </div>
          </Link>
        </div>
      </Containar>
    </footer>
  );
};

export default BottomFooter;
