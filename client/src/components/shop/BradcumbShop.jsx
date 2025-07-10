import React, { useState, useEffect, useContext } from "react";
import Containar from "../../layouts/Containar";
import { FaChevronRight } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ApiContext from "../baseapi/BaseApi";

const BradcumbShop = () => {
  const location = useLocation();
  const path = location.pathname;
  const segments = path.split("/").filter(Boolean);
  const [title, setTitle] = useState("");
  const baseApi = useContext(ApiContext); // Use context for base API URL

  const isShopOnly = segments.length === 1 && segments[0] === "shop";
  const lastSegment = segments[segments.length - 1]; // Get the last segment (ID or offer-sale)
  let apiUrl;

  if (segments.includes("category")) {
    apiUrl = `${baseApi}/category/${lastSegment}`;
  } else if (segments.includes("subcategory")) {
    apiUrl = `${baseApi}/subcategory/${lastSegment}`;
  } else if (segments.includes("brand")) {
    apiUrl = `${baseApi}/brand/${lastSegment}`;
  }

  useEffect(() => {
    if (apiUrl) {
      axios
        .get(apiUrl)
        .then((response) => {
          const dataTitle = response.data.data.doc?.title || "";
          setTitle(dataTitle);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else if (!isShopOnly) {
      setTitle(lastSegment); // Set title to last segment for non-API paths like "offer-sale"
    }
  }, [apiUrl, isShopOnly, lastSegment]);

  return (
    <section className="border-b border-b-border">
      <Containar>
        <div>
          <h4 className="flex items-center gap-x-2 text-sm leading-3 py-7">
            <span className="cursor-pointer hover:text-danger text-texthead transition-all ease-linear duration-200">
              <Link to="/">Home</Link>
            </span>{" "}
            <span>
              <FaChevronRight className="w-[5px] mt-1" />
            </span>{" "}
            <span>Shop</span>{" "}
            {!isShopOnly && title && (
              <>
                <span>
                  <FaChevronRight className="w-[5px] mt-1" />
                </span>{" "}
                <span className="capitalize">{title}</span>
              </>
            )}
          </h4>
        </div>
      </Containar>
    </section>
  );
};

export default BradcumbShop;
