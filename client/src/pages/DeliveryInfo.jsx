// src/components/DeliveryInfo.js

import React, { useEffect } from "react";
import BradCumbs from "../components/bradcumbs/BradCumbs";
import { Link } from "react-router-dom";
import Containar from "../layouts/Containar";

const DeliveryInfo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <BradCumbs title={"Delivery Information"} />
      <div className=" bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <Containar className={" flex items-center justify-center"}>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Delivery Info</h1>
            <p className="mb-4">
              Here’s what you need to know about getting your order from tuffers
              :
            </p>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">How We Ship</h2>
              <p className="mb-4">
                We use reliable carriers to make sure your order arrives safely.
                You’ll get a tracking number once your order is on its way, so
                you can check where it is anytime.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Times</h2>
              <p className="mb-4">
                For standard shipping, it usually takes about 3-5 business days.
                If you choose expedited shipping, it’ll be quicker. Delivery
                times can be longer during busy times or holidays.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Locations</h2>
              <p className="mb-4">
                We ship to most places, but if you’re outside our regular
                delivery areas, we’ll let you know if we can’t deliver to you.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>
              <p className="mb-4">
                After we ship your order, you’ll get an email with a tracking
                link. You can use this link to see where your package is and
                when it’s expected to arrive.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Issues with Delivery
              </h2>
              <p>
                If there’s a problem with your delivery, like it’s late or
                damaged, please contact us right away. We’ll help you sort it
                out as quickly as possible.
              </p>
            </div>
            <p className="mt-6">
              Thanks for choosing tuffers ! If you have any questions about your
              delivery, feel free to reach out to us.
            </p>
          </div>
        </Containar>
      </div>
    </>
  );
};

export default DeliveryInfo;
