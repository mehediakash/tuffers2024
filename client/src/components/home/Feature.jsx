import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Containar from "../../layouts/Containar";
import { Link, useNavigate } from "react-router-dom";
import TitleHead from "../titlehead/TitleHead";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa"; // Import a default fallback icon
import { IoImagesOutline } from "react-icons/io5"; // Import icons
import { MdDinnerDining } from "react-icons/md";
import { LiaDoveSolid } from "react-icons/lia";
import { BiHealth, BiLogoGraphql } from "react-icons/bi";
import ApiContext from "../baseapi/BaseApi";
import img1 from "../../assets/banner/man-01.png";
import img2 from "../../assets/banner/women-01.png";

const Feature = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();
  const baseApi = useContext(ApiContext);
  // console.log(baseApi)

  const categoryListPart = [
    {
      name: "Arts & Photography",
      icon: img1,
      bgColor: "#F7F7F7",
      iconColor: "#A201FD",
      link: "/",
    },
    {
      name: "Food & Drink",
      icon: img2,
      bgColor: "#F7F7F7",
      iconColor: "#F79400",
      link: "/",
    },
    {
      name: "Romance",
      icon: LiaDoveSolid,
      bgColor: "#F7F7F7",
      iconColor: "#F01101",
      link: "/",
    },
    {
      name: "Health",
      icon: BiHealth,
      bgColor: "#F7F7F7",
      iconColor: "#04CDEF",
      link: "/",
    },
    {
      name: "Biography",
      icon: BiLogoGraphql,
      bgColor: "#F7F7F7",
      iconColor: "#FF8E8E",
      link: "/",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseApi}/category`);
        const apiCategories = response.data.data.doc;

        // Create a new array combining categories and categoryListPart
        const combinedCategories = apiCategories.map((apiCategory, index) => {
          // Check if index is within bounds of categoryListPart
          if (index < categoryListPart.length) {
            return { ...apiCategory, ...categoryListPart[index] };
          }
          return apiCategory;
        });

        // If there are remaining items in categoryListPart, append them to the end

        setCategories(combinedCategories.slice(0, 5));
        // console.log(combinedCategories)
      } catch (error) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // console.log(categories)

  // if (loading) return <p>Loading...</p>; // Simple loading message
  if (error) return <p>{error}</p>; // Display error message if any

  return (
    <section className="pt-14 lg:pt-28 font-inter px-5 2xl:px-0">
      <Containar>
        <TitleHead titile="Shop Categories" subtitle="All Categories" />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className={`grid grid-cols-2 md:grid-cols-4 gap-x-1 md:gap-x-5  ${
            categories.length == 5 ? "lg:justify-between" : "lg:gap-x-5"
          } mt-10 gap-y-5`}
        >
          {categories.map((item, index) => {
            // const Icon = item.icon || FaExclamationTriangle; // Fallback icon
            return (
              <>
                <Link
                  to={`/shop/category/${item?._id}`}
                  key={index}
                  className="w-[100%] px-10 py-5"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <div className="flex items-center justify-center">
                    {typeof item.icon === "string" ? (
                      <img src={item.icon} alt={item.name} className="w-24" />
                    ) : (
                      <item.icon
                        style={{ color: item.iconColor }}
                        className="text-5xl text-center"
                      />
                    )}
                  </div>
                  <h2 className="text-center  lg:text-base xl:text-lg font-medium">
                    <span
                      onClick={() => navigate(`/shop/category/${item?._id}`)}
                    >
                      {item?.title}
                    </span>
                  </h2>
                  <h4 className="mt-2 text-center text-base text-gray-500">
                    <span
                      onClick={() => navigate(`/shop/category/${item?._id}`)}
                    >
                      {" "}
                      Shop Now
                    </span>
                  </h4>
                </Link>
              </>
            );
          })}
        </motion.div>
      </Containar>
    </section>
  );
};

export default Feature;
