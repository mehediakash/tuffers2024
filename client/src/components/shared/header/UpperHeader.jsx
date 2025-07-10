import React from "react";
import { FaMapLocation } from "react-icons/fa6";

import Containar from "../../../layouts/Containar";
import { Link } from "react-router-dom";

const UpperHeader = () => {
  return (
    <header className="bg-white text-gray-700">
      <div className="border-b py-4">
        <Containar>
          <div className="mx-auto">
            <div className="flex flex-col xl:flex-row justify-center xl:justify-between items-center text-sm space-y-2 xl:space-y-0">
              {/* Left Section */}
              <div className="flex flex-col xl:flex-row justify-center items-center space-y-2 xl:space-y-0 xl:space-x-4">
                <a
                  href="https://maps.app.goo.gl/PfC4wwsKArgprE1R8"
                  className="flex items-center hover:text-gray-900"
                  target="_blank"
                >
                  <FaMapLocation className="mr-1" />
                  Find stores
                </a>
                <div className="flex gap-2 text-sm">
                  <a
                    href="tel:+8801810688090"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-red-500 font-medium"
                  >
                    01810688090
                  </a>

                  <span>|</span>
                  <a
                    href="https://www.facebook.com/tuffersbd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B7BE5] hover:underline hover:text-[#0B7BE5]"
                  >
                    Facebook
                  </a>
                  {/* <span>|</span>
                  <a
                    href="https://www.instagram.com/tuffersbd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DF2883] hover:underline hover:text-[#DF2883]"
                  >
                    Instagram
                  </a> */}
                  <span>|</span>
                  <a
                    href="https://www.youtube.com/channel/Tuffers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F70000] hover:underline hover:text-[#F70000]"
                  >
                    Youtube
                  </a>
                  <span>|</span>
                  <a
                    href="https://www.tiktok.com/@tuffersbd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0073AF] hover:underline hover:text-[#0073AF]"
                  >
                    TikTok
                  </a>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex space-x-4">
                <Link
                  to="mailto:contact@tuffersbd.com"
                  className="hover:text-gray-900 hover:underline duration-200"
                >
                  contact@tuffersbd.com
                </Link>
           
              </div>
            </div>
          </div>
        </Containar>
      </div>
    </header>
  );
};

export default UpperHeader;
