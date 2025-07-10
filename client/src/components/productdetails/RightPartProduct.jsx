import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import ApiContext from "../baseapi/BaseApi";
import axios from "axios";

const RightPartProduct = () => {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseApi}/option`);
        const fetchedProducts = response.data.data.doc.reverse(); // Adjust according to API response structure
  
        // Remove duplicates based on product ID
        const uniqueProducts = [];
        const seenProductIds = new Set();
        fetchedProducts.forEach((item) => {
          if (!seenProductIds.has(item.product._id)) {
            seenProductIds.add(item.product._id);
            uniqueProducts.push(item);
          }
        });
  
        // Set the product list with unique products
        setProductList(uniqueProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching products. Please try again later.");
      }
    };
  
    fetchProducts();
  }, [baseApi]);

  return (
    <ul className="border border-border py-3 flex flex-wrap justify-between xl:block px-5 xl:px-0">
      {/* {error && <li>{error}</li>} */}
      {productList.length === 0 ? (
        <li>No products available</li>
      ) : (
        productList.slice(0, 3).map((item) => (
          <li
            key={item.id}
            className="flex w-full md:w-[47%] xl:w-full gap-x-4 px-[30px] py-5"
          >
            <Link
              to={`/productdetail/${item?._id}`}
              className="w-[20%]"
              onClick={() => {
                window.scrollTo(0, 0);
                window.location.reload(); // পেজ রিলোড করার জন্য
              }}
            >
              <img
                className="w-full  object-contain"
                src={item?.product?.photos[0] || []}
                alt={item?.title || "Product Image"}
              />
            </Link>
            <div className="w-[70%]">
              <Link
                to={`/productdetail/${item?.product._id}`}
                className="text-sm font-normal inline-block -pt-1 text-texthead hover:text-danger"
                onClick={() => {
                  window.scrollTo(0, 0);
                  window.location.reload(); // পেজ রিলোড করার জন্য
                }}
              >
                {item?.product?.name}
              </Link>
              <div className="flex gap-x-0.5 items-center text-base mt-2">
                {item?.salePrice > 0 ? (
                  <div className="flex gap-x-3">
                    <div className="flex text-sm items-center gap-x-1 text-red-500">
                      ৳ {item.salePrice}
                    </div>
                    <div className="flex text-xs items-center gap-x-0.5 line-through ">
                      ৳ {item.price}
                    </div>
                  </div>
                ) : (
                  <div className="flex text-sm items-center gap-x-1 text-red-500">
                    ৳ {item.price}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default RightPartProduct;
