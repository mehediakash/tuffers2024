import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Containar from "../../layouts/Containar";
import ProductItem from "../productitem/ProductItem";
import { Link } from "react-router-dom";
import ApiContext from "../baseapi/BaseApi";

const SaleFeature = () => {
  const baseApi = useContext(ApiContext); // Use context for base API URL
  const filterlist = [
    { name: "Featured", active: true },
    { name: "On Sale", active: false },
    { name: "Most Viewed", active: false },
  ];

  const apiUrls = {
    Featured: `${baseApi}/option`, // All products
    "On Sale": `${baseApi}/option?sort=saleNumber`, // Products on sale
    "Most Viewed": `${baseApi}/option?sort=visitCount`, // Most viewed products
  };

  const [select, setSelect] = useState(filterlist);
  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    fetchData("Featured");
  }, []);

  const fetchData = async (filterName) => {
    const apiUrl = apiUrls[filterName] || apiUrls["Featured"];
    try {
      const response = await axios.get(apiUrl);
      const fetchedProducts = response.data.data.doc; // Adjust according to API response structure

      // Remove duplicates based on product ID
      const uniqueProducts = [];
      const seenProductIds = new Set();
      fetchedProducts.forEach((item) => {
        if (!seenProductIds.has(item.product._id)) {
          seenProductIds.add(item.product._id);
          uniqueProducts.push(item);
        }
      });

      // Collect all sizes for each product
      const productsWithSizes = uniqueProducts.map((product) => {
        const sizes = product.variant?.sizes || [];
        return {
          ...product,
          sizes, // Add sizes to the product object if needed
        };
      });

      setCurrentList(productsWithSizes.reverse().slice(0, 12));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelect = (name) => {
    const updatedList = select.map((item) =>
      item.name === name
        ? { ...item, active: true }
        : { ...item, active: false }
    );
    setSelect(updatedList);
    fetchData(name);
  };

  return (
    <div className="pt-14 lg:pt-28 font-inter">
      <Containar>
        <h2 className="text-center text-[26px] lg:text-head text-texthead font-medium">
          Featured Products
        </h2>
        <div className="mt-7 lg:mt-10 w-full flex justify-center">
          <ul className="flex gap-x-10 lg:gap-x-20">
            {select.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item?.name)}
                className={`${
                  item.active
                    ? 'text-base font-medium text-texthead relative before:content-[""] before:absolute before:-bottom-3.5 before:left-0 before:w-full before:h-[1px] before:bg-texthead cursor-pointer '
                    : 'text-base text-paracolor font-medium hover:text-texthead cursor-pointer relative before:content-[""] before:absolute before:-bottom-3.5 before:right-0 before:w-0 hover:before:left-0 transition-all before:transition-all  before:ease-linear before:duration-200  hover:before:w-full before:h-[1px] before:bg-texthead'
                }`}
              >
                {item?.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-y-5 mt-12 lg:mt-14">
          {currentList.map((item, index) => (
            <ProductItem
              key={item?._id}
              product={item}
              image={item?.product?.photos}
              id={item?.product?._id}
              subtitle={item?.brand?.title}
              title={item?.product?.name}
              categoryId={item?.category?._id}
              brandId={item?.brand?._id}
              categoryName={item?.category?.title}
              discount={item?.discountValue}
              discountType={item?.discountType}
              discountPercent={item?.discountPercent}
              priceAfterDiscount={item?.salePrice}
              offerprice={item?.price - item?.discount}
              freeShipping={item?.freeShipping}
              regularprice={item?.price}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <Link
            to={"/shop"}
            className="mt-12 bg-gray-100 px-14 py-3 font-medium text-base rounded-md hover:bg-danger hover:text-white transition-all ease-linear duration-200"
          >
            Show All
          </Link>
        </div>
      </Containar>
    </div>
  );
};

export default SaleFeature;
