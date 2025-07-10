import React, { useEffect } from "react";
import BradCumbs from "../components/bradcumbs/BradCumbs";
import Containar from "../layouts/Containar";

const ShippingRates = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BradCumbs title={"Shipping Rates & Policies"} />
      <div className="bg-gray-50 py-10 px-4 sm:py-16 sm:px-6 lg:px-8">
        <Containar className="flex items-center justify-center">
          <div className="w-full max-w-3xl lg:max-w-6xl bg-white px-6 sm:px-10 py-10 sm:py-14 shadow-lg rounded-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-700">
                Welcome to tuffers . We offer shipping across the country and
                around the world when you order online. Each order can only be
                shipped to one address. If you need to send items to different
                addresses, please place separate orders and pay for them
                individually. Delivery times depend on where you want your items
                sent and the type of delivery you choose.
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 border-gray-200">
                  Shipping Costs
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 bg-gray-50">
                    <span className="text-gray-900 font-medium block">
                      Inside Chittagong
                    </span>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      <li>Order Time: 24 hours</li>
                      <li>Delivery Type: Regular</li>
                      <li>
                        Cost: BDT 80* (Free delivery for orders over BDT 5000)
                      </li>
                      <li>Delivery Time: 3-4 working days</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 bg-gray-50">
                    <span className="text-gray-900 font-medium block">
                      Inside Chittagong Urgent
                    </span>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      <li>Order Time: 24 hours</li>
                      <li>Delivery Type: Urgent</li>
                      <li>Cost: BDT 250</li>
                      <li>Delivery Time: Next day (24 hours)**</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 bg-gray-50">
                    <span className="text-gray-900 font-medium block">
                      Outside Chittagong
                    </span>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      <li>Order Time: 24 hours</li>
                      <li>Delivery Type: Regular</li>
                      <li>Cost: BDT 130</li>
                      <li>Delivery Time: 3-5 working days</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 bg-gray-50">
                    <span className="text-gray-900 font-medium block">
                      Worldwide
                    </span>
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      <li>Order Time: 24 hours</li>
                      <li>Delivery Type: Regular</li>
                      <li>Cost: Varies***</li>
                      <li>Delivery Time: Varies***</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 text-gray-700">
                  <p>
                    * Delivery within Dhaka is free for orders over BDT 5000. **
                    Urgent delivery is not available on Fridays and public
                    holidays. *** International delivery costs depend on the
                    destination country and the size or weight of the parcel.
                    Contact our service center for an estimate.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 border-gray-200">
                  Delivery Times
                </h3>
                <p className="mt-2 text-gray-700">
                  Standard shipping usually takes 3-4 business days. If you need
                  it faster, we have quicker shipping options available. Keep in
                  mind that delivery might be delayed during busy times or
                  holidays.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 border-gray-200">
                  Order Processing
                </h3>
                <p className="mt-2 text-gray-700">
                  We get your order ready for shipping within 1-2 business days.
                  After it’s shipped, you’ll get an email with a tracking number
                  so you can see where your package is.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 border-gray-200">
                  International Shipping
                </h3>
                <p className="mt-2 text-gray-700">
                  We do ship internationally! Shipping costs and delivery times
                  vary based on where you are. Note that any customs fees or
                  taxes are your responsibility.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 border-gray-200">
                  Problems with Your Order
                </h3>
                <p className="mt-2 text-gray-700">
                  If your order doesn’t arrive or arrives damaged, please
                  contact our customer service team. We’ll help you resolve the
                  issue as quickly as possible.
                </p>
              </div>

              <div className="mt-6 text-gray-700">
                <p>
                  Thank you for shopping with us! If you have any questions or
                  need assistance, feel free to get in touch.
                </p>
              </div>
            </div>
          </div>
        </Containar>
      </div>
    </>
  );
};

export default ShippingRates;
