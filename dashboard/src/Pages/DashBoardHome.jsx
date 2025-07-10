import React, { useState, useEffect } from "react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { TbBasketCancel } from "react-icons/tb";
import { MdOutlineSell } from "react-icons/md";

import { Alert, Calendar } from "antd";
import axios from "../Components/Axios";
import dayjs from "dayjs";
import CountUp from "react-countup";

const Home = () => {
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    // Fetch Total Delivered Orders
    const fetchTotalOrders = async () => {
      try {
        const response = await axios.get("/order");
        const deliveredOrders = response.data.data.doc.filter((order) =>
          dayjs(order.createdAt).isSame(value, "month")
        );
        setTotalOrders(deliveredOrders.length);
        // console.log(response);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    // Fetch Total Products
    const fetchTotalProducts = async () => {
      try {
        const response = await axios.get("/varient");
        setTotalProducts(response.data.data.doc.length);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    // Fetch Total Sales
    const fetchTotalSales = async () => {
      try {
        const response = await axios.get("/order");
        const salesThisMonth = response.data.data.doc
          .filter((order) => dayjs(order.createdAt).isSame(value, "month"))
          .reduce((acc, order) => acc + order.totalCost, 0);
        setTotalSales(salesThisMonth);
      } catch (error) {
        console.error("Error fetching total sales:", error);
      }
    };

    fetchTotalOrders();
    fetchTotalProducts();
    fetchTotalSales();
  }, [value]);

  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="flex gap-x-5 md:flex-row flex-col justify-evenly py-10 gap-y-5">
        <div className="text-black font-semibold text-base bg-[#DBEAFE] p-5 md:w-[20%] rounded-md text-center flex items-center gap-x-2 md:justify-center flex-col">
          <div className="bg-[#2A68BC] p-3 rounded-full">
            <LiaFileInvoiceSolid size="25" className="text-white" />
          </div>
          <h2>Total Order</h2>
          <h3 className="font-bold text-xl">
            <CountUp end={totalOrders} duration={2} separator="," />
          </h3>
          <p>From the running month</p>
        </div>

        <div className="text-black font-semibold text-base bg-[#F3E8FF] p-5 md:w-[20%] rounded-md text-center flex items-center gap-x-2 justify-center flex-col">
          <div className="bg-[#2A68BC] p-3 rounded-full">
            <TbBasketCancel size="25" className="text-white" />
          </div>
          <h2>Total Product</h2>
          <h3 className="font-bold text-xl">
            <CountUp end={totalProducts} duration={2} separator="," />
          </h3>
          <p>From the running month</p>
        </div>

        <div className="text-black font-semibold text-base bg-[#D2F4EE] p-5 md:w-[20%] rounded-md text-center flex items-center gap-x-2 justify-center flex-col">
          <div className="bg-[#2A68BC] p-3 rounded-full">
            <MdOutlineSell size="25" className="text-white" />
          </div>
          <h2>Total Sales</h2>
          <h3 className="font-bold text-xl">
            <CountUp end={totalSales} duration={2} separator="," /> Taka
          </h3>
          <p>From the running month</p>
        </div>
      </div>
      <Alert
        message={`You selected date: ${selectedValue?.format("YYYY-MM-DD")}`}
      />
      <div className="mt-6">
        <Calendar
          value={value}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
        />
      </div>
    </>
  );
};

export default Home;
