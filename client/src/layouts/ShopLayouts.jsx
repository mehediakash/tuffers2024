import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import BradcumbShop from "../components/shop/BradcumbShop";
import { FiMinus, FiPlus } from "react-icons/fi";
import ApiContext from "../components/baseapi/BaseApi";
import { categoryList } from "../components/constants/index";

import * as Slider from "@radix-ui/react-slider";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Containar from "./Containar";
import axios from "axios";
import PriceFilter from "../components/shop/PriceFilter";
import SelectOption from "../components/shop/SelectOption";
import { IoFilter } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { resetColor, setColor } from "../redux/slices/colorSlice";

const colorList = [
  { name: "Brown" },
  { name: "Burgundy" },
  { name: "Charcoal" },
  { name: "Coral Red" },
  { name: "Creamy" },
];

const ShopLayouts = () => {
  const baseApi = useContext(ApiContext);
  const [categoryActive, setCategoryActive] = useState(true);
  const [allcategory, setAllCategory] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [allbrand, setAllBrand] = useState([]);
  const [brandActive, setBrandActive] = useState(true);
  const [colorActive, setColorActive] = useState(true); // Default sl
  const [subCategoryActive, setSubCategoryActive] = useState(true);
  const [mageSaleActive, setMageSaleActive] = useState(true);
  const [error, setError] = useState(null);
  const [colorList, setColorList] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const selectedColor = useSelector((state) => state?.colors?.selectedColor);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApi}/category`);
        setAllCategory(response.data.data.doc);
      } catch (err) {
        setError(err);
        console.error("Error fetching categories:", err);
      }
    };

    fetchData();
  }, [baseApi]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApi}/subCategory`);
        setAllSubCategory(response.data?.data?.doc);
      } catch (err) {
        setError(err);
        console.error("Error fetching categories:", err);
      }
    };

    fetchData();
  }, [baseApi]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApi}/brand`);
        setAllBrand(response.data.data.doc);
      } catch (err) {
        setError(err);
        console.error("Error fetching categories:", err);
      }
    };

    fetchData();
  }, [baseApi]);

  useEffect(() => {
    // Function to fetch color data from the API
    const fetchColors = async () => {
      try {
        const response = await axios.get(`${baseApi}/varient`);
        const data = response.data.data.doc;

        // Filter out variant objects that don't have options or have empty options
        const filteredData = data.filter(
          (item) => item.options && item.options.length > 0
        );

        // Extract unique colors
        const uniqueColors = [
          ...new Map(
            filteredData.map((item) => [item.colorName, item.colorCode])
          ).entries(),
        ];

        // Map to array of objects with both colorName and colorCode
        const colorList = uniqueColors.map(([name, code]) => ({
          name: name,
          code: code,
        }));

        setColorList(colorList);
        // console.log("colorList", colorList);
      } catch (error) {
        console.error("Error fetching color data:", error);
      }
    };

    fetchColors();
  }, [baseApi]);

  return (
    <div className="px-5 xl:px-0">
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        size={300}
        className="bla bla bla"
      >
        <div className="w-full pt-5 mb-20 h-screen scroll-smooth overflow-scroll">
          <div className="px-6 pb-4 border-b border-b-border">
            <h3 className="text-lg font-medium flex justify-between items-center ">
              <span>Filter</span>
              <span>
                <MdOutlineClose
                  onClick={() => toggleDrawer()}
                  className="text-xl cursor-pointer"
                />
              </span>
            </h3>
          </div>
          <div className=" z-50 ">
            {/* Price Filter Part Start */}
            <PriceFilter toggleDrawer={toggleDrawer} />
            {/* Mega Sale Filter Part Start */}
            <div className="Mega_Deals">
              <div className="border-x border-t border-x-border border-b border-b-border border-t-border">
                <div
                  onClick={() => setMageSaleActive(!categoryActive)}
                  className="flex justify-between cursor-pointer items-center px-6 py-5"
                >
                  <h3 className="text-lg font-medium">Mega Deals</h3>
                  <h3 className="text-2xl">
                    {mageSaleActive ? <FiMinus /> : <FiPlus />}
                  </h3>
                </div>
                <div
                  className={`transition-all duration-500 ease-linear overflow-hidden ${
                    mageSaleActive
                      ? "max-h-[400px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {mageSaleActive && (
                    <ul className="pb-4 px-6">
                      <li className="py-2 text-sm text-texthead hover:text-danger cursor-pointer">
                        <Link
                          onClick={() => toggleDrawer()}
                          to={"/shop/mega-sale"}
                        >
                          Mega Sale
                        </Link>
                      </li>
                      <li className="py-2 text-sm text-texthead hover:text-danger cursor-pointer">
                        <Link
                          onClick={() => toggleDrawer()}
                          to={"/shop/offer-sale"}
                        >
                          Offer Sale
                        </Link>
                      </li>
                      <li className="py-2 text-sm text-texthead hover:text-danger cursor-pointer">
                        <Link
                          onClick={() => toggleDrawer()}
                          to={"/shop/latest-sale"}
                        >
                          Latest Sale
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {/* Category Filter Part Start */}
            <div className="category">
              <div className="border-x border-t border-x-border border-b border-b-border border-t-border">
                <div
                  onClick={() => setCategoryActive(!categoryActive)}
                  className="flex justify-between cursor-pointer items-center px-6 py-5"
                >
                  <h3 className="text-lg font-medium">Categories</h3>
                  <h3 className="text-2xl">
                    {categoryActive ? <FiMinus /> : <FiPlus />}
                  </h3>
                </div>
                <div
                  className={`transition-all duration-500 ease-linear overflow-hidden ${
                    categoryActive
                      ? "max-h-[400px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {categoryActive && (
                    <ul className="pb-4 px-6">
                      {allcategory.map((item) => (
                        <li
                          onClick={() => toggleDrawer()}
                          className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                          key={item._id}
                        >
                          <Link to={`category/${item._id}`}>{item?.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Filter Part Start */}
            <div className="sub-category">
              <div className="border-x b border-x-border border-b border-b-border">
                <div
                  onClick={() => setSubCategoryActive(!subCategoryActive)}
                  className="flex justify-between cursor-pointer items-center px-6 py-5"
                >
                  <h3 className="text-lg font-medium">Sub Category</h3>
                  <h3 className="text-2xl">
                    {subCategoryActive ? <FiMinus /> : <FiPlus />}
                  </h3>
                </div>
                <div
                  className={`transition-all duration-500 ease-linear overflow-hidden ${
                    subCategoryActive
                      ? "max-h-[400px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {subCategoryActive && (
                    <ul className="pb-4 px-6">
                      {allSubCategory.map((item, index) => (
                        <li
                          onClick={() => toggleDrawer()}
                          className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                          key={index}
                        >
                          <Link to={`subcategory/${item?._id}`}>
                            {item?.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Filter Part Start */}
            <div className="brand">
              <div className="border-x b border-x-border border-b border-b-border">
                <div
                  onClick={() => setBrandActive(!brandActive)}
                  className="flex justify-between cursor-pointer items-center px-6 py-5"
                >
                  <h3 className="text-lg font-medium">Brand</h3>
                  <h3 className="text-2xl">
                    {brandActive ? <FiMinus /> : <FiPlus />}
                  </h3>
                </div>
                <div
                  className={`transition-all duration-500 ease-linear overflow-hidden ${
                    brandActive
                      ? "max-h-[400px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {brandActive && (
                    <ul className="pb-4 px-6">
                      {allbrand.map((item, index) => (
                        <li
                          onClick={() => toggleDrawer()}
                          className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                          key={index}
                        >
                          <Link to={`brand/${item?._id}`}>
                            {item?.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Color Filter Part Start */}
            <div className="px-6 pb-4 border-b border-b-border">
              <h3 className="text-lg font-medium flex justify-between items-center ">
                <span>Filter</span>
                <span>
                  <MdOutlineClose
                    onClick={() => toggleDrawer()}
                    className="text-xl cursor-pointer"
                  />
                </span>
              </h3>
            </div>
            <div className="max-h-screen z-50 overflow-scroll">
              {/* Price Filter Part Start */}
              <PriceFilter toggleDrawer={toggleDrawer} />
              {/* Category Filter Part Start */}
              <div className="category">
                <div className="border-x border-t border-x-border border-b border-b-border border-t-border">
                  <div
                    onClick={() => setCategoryActive(!categoryActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Categories</h3>
                    <h3 className="text-2xl">
                      {categoryActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      categoryActive
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {categoryActive && (
                      <ul className="pb-4 px-6">
                        {allcategory.map((item) => (
                          <li
                            onClick={() => toggleDrawer()}
                            className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                            key={item._id}
                          >
                            <Link to={`category/${item._id}`}>
                              {item?.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* subCategoryActive Filter Part Start */}
              <div className="sub-category">
                <div className="border-x b border-x-border border-b border-b-border">
                  <div
                    onClick={() => setSubCategoryActive(!subCategoryActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Sub Category</h3>
                    <h3 className="text-2xl">
                      {subCategoryActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      subCategoryActive
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {subCategoryActive && (
                      <ul className="pb-4 px-6">
                        {allSubCategory.map((item, index) => (
                          <li
                            onClick={() => toggleDrawer()}
                            className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                            key={index}
                          >
                            <Link to={`subcategory/${item?._id}`}>
                              {item?.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Filter Part Start */}
              <div className="brand">
                <div className="border-x b border-x-border border-b border-b-border">
                  <div
                    onClick={() => setBrandActive(!brandActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Brand</h3>
                    <h3 className="text-2xl">
                      {brandActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      brandActive
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {brandActive && (
                      <ul className="pb-4 px-6">
                        {allbrand.map((item, index) => (
                          <li
                            onClick={() => toggleDrawer()}
                            className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                            key={index}
                          >
                            <Link to={`brand/${item?._id}`}>{item?.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Filter Part Start */}
              {/* {location.pathname == "/shop" && ( */}
              <div className="Color">
                <div className="border-x b border-x-border border-b border-b-border">
                  <div
                    onClick={() => setColorActive(!colorActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Color</h3>
                    <h3 className="text-2xl">
                      {colorActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      colorActive
                        ? "max-h-[600px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {colorActive && (
                      <ul className="pb-4 px-6">
                        {colorList.map((item, index) => (
                          <li
                            onClick={() => dispatch(setColor(item?.name))}
                            className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                            key={index}
                          >
                            {item?.name}
                          </li>
                        ))}
                        <button
                          onClick={() => dispatch(resetColor())}
                          className="w-full py-2.5 rounded-md  text-sm bg-gray-100 text-center text-texthead mt-5 hover:text-white transition-all ease-linear duration-200 hover:bg-texthead"
                        >
                          Reset Color
                        </button>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </Drawer>
      <BradcumbShop />
      <div>
        <Containar>
          <div className="flex flex-wrap justify-between mt-14 mb-14">
            <div className="w-[22%] hidden xl:inline-block">
              {/* Mega Sale Filter Part Start */}
              <div className="Mega_Deals">
                <div className="border-x border-t border-x-border border-b border-b-border border-t-border">
                  <div
                    onClick={() => setMageSaleActive(!mageSaleActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Mega Deals</h3>
                    <h3 className="text-2xl">
                      {mageSaleActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      mageSaleActive
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {mageSaleActive && (
                      <ul className="pb-4 px-6">
                        <li className="py-2 text-sm text-texthead hover:text-danger cursor-pointer">
                          <Link to={"/shop/mega-sale"}>Mega Sale</Link>
                        </li>
                        <li className="py-2 text-sm text-texthead hover:text-danger cursor-pointer">
                          <Link to={"/shop/offer-sale"}>Offer Sale</Link>
                        </li>
                        <li className="py-2 text-sm text-texthead hover:text-danger cursor-pointer">
                          <Link to={"/shop/latest-sale"}>Latest Sale</Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {/* Category Filter Part Start */}
              <div className="category">
                <div className="border-x border-t border-x-border border-b border-b-border border-t-border">
                  <div
                    onClick={() => setCategoryActive(!categoryActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Categories</h3>
                    <h3 className="text-2xl">
                      {categoryActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      categoryActive
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {categoryActive && (
                      <ul className="pb-4 px-6">
                        {allcategory.map((item) => (
                          <li
                            className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                            key={item._id}
                          >
                            <Link to={`category/${item._id}`}>
                              {item?.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub Category Filter Part Start */}
              <div className="sub-category">
                <div className="border-x b border-x-border border-b border-b-border">
                  <div
                    onClick={() => setSubCategoryActive(!subCategoryActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Sub Category</h3>
                    <h3 className="text-2xl">
                      {subCategoryActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      subCategoryActive
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {subCategoryActive && (
                      <ul className="pb-4 px-6">
                        {allSubCategory.map((item, index) => (
                          <li
                            className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                            key={index}
                          >
                            <Link to={`subcategory/${item?._id}`}>
                              {item?.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Filter Part Start */}
              <div className="brand">
                <div className="border-x b border-x-border border-b border-b-border">
                  <div
                    onClick={() => setBrandActive(!brandActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Brand</h3>
                    <h3 className="text-2xl">
                      {brandActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      brandActive
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {brandActive && (
                      <ul className="pb-4 px-6">
                        {allbrand.map((item, index) => (
                          <li
                            className="py-2 text-sm text-texthead hover:text-danger cursor-pointer"
                            key={index}
                          >
                            <Link to={`brand/${item?._id}`}>{item?.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Filter Part Start */}
              {/* {location.pathname == "/shop" && ( */}
              <div className="Color">
                <div className="border-x b border-x-border border-b border-b-border">
                  <div
                    onClick={() => setColorActive(!colorActive)}
                    className="flex justify-between cursor-pointer items-center px-6 py-5"
                  >
                    <h3 className="text-lg font-medium">Color</h3>
                    <h3 className="text-2xl">
                      {colorActive ? <FiMinus /> : <FiPlus />}
                    </h3>
                  </div>
                  <div
                    className={`transition-all duration-500 ease-linear overflow-hidden ${
                      colorActive
                        ? "max-h-[600px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {colorActive && (
                      <ul className="pb-4 px-6 flex flex-wrap gap-2">
                        {colorList.map((item, index) => (
                          <li
                            onClick={() => dispatch(setColor(item?.name))}
                            style={{ backgroundColor: `${item?.code}` }} // Use the color code for background
                            className="py-2 text-sm w-7 h-7 rounded-full text-texthead hover:text-danger cursor-pointer"
                            key={index}
                          ></li>
                        ))}
                        <button
                          onClick={() => dispatch(resetColor())}
                          className="w-full py-2.5 rounded-md  text-sm bg-gray-100 text-center text-texthead mt-5 hover:text-white transition-all ease-linear duration-200 hover:bg-texthead"
                        >
                          Reset Color
                        </button>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {/* )} */}

              {/* Price Filter Part Start */}
              <PriceFilter />
            </div>
            <div className="w-full xl:w-[75.6%]">
              <div>
                <div className="flex select_option justify-between ">
                  <div className="flex items-center flex-wrap gap-x-10">
                    <div
                      className="flex items-center gap-x-2 text-base font-medium text-texthead cursor-pointer  xl:hidden"
                      onClick={toggleDrawer}
                    >
                      <IoFilter /> <span className="">Filter</span>
                    </div>
                    <h3 className="text-sm text-texthead mt-5 sm:mt-0">
                      Showing 20 Results
                    </h3>
                  </div>

                  <SelectOption />
                </div>
              </div>
              <Outlet />
            </div>
          </div>
        </Containar>
      </div>
    </div>
  );
};

export default ShopLayouts;
