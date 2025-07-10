import React, { useState, useEffect, useRef, useContext } from "react";
import Containar from "../../layouts/Containar";
import { Link } from "react-router-dom";
import ProductItem from "../productitem/ProductItem";
import { useInView, motion, useAnimation } from "framer-motion";
import ApiContext from "../baseapi/BaseApi";
import axios from "axios";
import { FaLuggageCart } from "react-icons/fa";
const NewRelease = () => {
  const baseApi = useContext(ApiContext);
  const [currentList, setCurrentList] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [banners, setBanners] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsToShow, setProductsToShow] = useState(20); // State to control the number of products shown

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animation = useAnimation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/category`);
        const categories = data.data.doc.reverse().slice(0, 4);
        setCategory(categories);

        if (categories.length > 0) {
          const firstCategoryId = categories[0]._id;
          setSelectedCategory(firstCategoryId);
          const { data: variantData } = await axios.get(
            `${baseApi}/category/${firstCategoryId}/options`
          );
          // setCurrentList(variantData.data?.options?.reverse().slice(0, 8));
          const fetchedProducts = variantData.data?.options; // Adjust according to API response structure

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

          setCurrentList(productsWithSizes.reverse().slice(0, 8));
          // console.log("currentList", currentList);
        }
      } catch (err) {
        setError("Error fetching categories");
        // console.error(err);
      }
    };

    fetchCategories();
  }, [baseApi]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/banner`);
        const filteredBanners = data.data.doc.filter(
          (banner) => banner.bannerType === "New Release"
        );
        setBanners(filteredBanners.pop()); // Get the last banner
      } catch (err) {
        setError("Error fetching banners");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [baseApi]);

  useEffect(() => {
    if (inView) {
      animation.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 1,
          delay: 0.3,
          ease: "easeIn",
        },
      });
    }
  }, [inView, animation]);

 const handleSelect = async (id) => {
  setSelectedCategory(id);
  try {
    const { data } = await axios.get(`${baseApi}/category/${id}/options`);
    const fetchedProducts = data.data?.options;

    // Remove duplicates based on product._id
    const uniqueProducts = [];
    const seenProductIds = new Set();
    fetchedProducts.forEach((item) => {
      if (item?.product?._id && !seenProductIds.has(item.product._id)) {
        seenProductIds.add(item.product._id);
        uniqueProducts.push(item);
      }
    });

    // Collect all sizes (if needed)
    const productsWithSizes = uniqueProducts.map((product) => {
      const sizes = product.variant?.sizes || [];
      return {
        ...product,
        sizes,
      };
    });

    setCurrentList(productsWithSizes.reverse());
    setProductsToShow(8); // Reset pagination
  } catch (err) {
    setError("Error fetching category variants");
  }
};

  const handleViewMore = () => {
    setProductsToShow((prevCount) => prevCount + 8); // Show 20 more products
  };

  return (
    <section ref={ref} className="py-14 lg:pt-20 overflow-hidden bg-backcolor">
      <Containar>
        <div className="bg-white py-5">
          <div className="flex flex-wrap justify-between items-center">
            <div className="px-2">
              <p className="flex items-center gap-2 text-[#12AEAD] text-sm">
                <FaLuggageCart className="bg-[#12AEAD] font-bold text-2xl p-1 rounded-full text-white" />
                This Month
              </p>
              <h3 className="text-[24px] mr-3 lg:text-head text-texthead font-medium mt-1">
                New Releases
              </h3>
            </div>

            <ul className="flex gap-x-5 lg:gap-x-10 mt-2">
              {category.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelect(item._id)}
                  className={`${
                    selectedCategory === item._id
                      ? 'text-base font-medium text-texthead relative before:content-[""] before:absolute before:-bottom-3 before:left-0 before:w-full before:h-[1px] before:bg-[#BE1E2D] cursor-pointer'
                      : 'text-base font-medium text-paracolor relative before:content-[""] before:absolute before:-bottom-3 before:right-0 before:w-0 before:h-[1px] before:bg-texthead cursor-pointer hover:before:left-0 hover:before:w-full before:transition-all before:ease-linear before:duration-200 hover:text-[#BE1E2D] transition-all ease-linear duration-200'
                  }`}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-x-5 mt-10 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2">
            <div className="col-span-1">
              {banners && (
                <div className="hidden  md:block border border-border">
                  <div className="sticky  top-5">
                    <Link to="/shop">
                      <img
                        className=" h-[800px] object-fit"
                        src={banners.photo}
                        alt="New Release"
                      />
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <motion.div
              // animate={animation}
              // initial={{ opacity: 0, x: 100 }}
              className="grid grid-cols-2 gap-y-2 lg:col-span-3 xl:grid-cols-4 sm:grid-cols-2"
            >
              {currentList.slice(0, productsToShow).map((item) => (
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
                  freeShipping={item?.freeShipping}
                  regularprice={item?.price}
                />
              ))}
            </motion.div>
          </div>

          {/* View More Button */}
          {productsToShow < currentList.length && (
            <div className="flex justify-center mt-8">
              <Link to="/shop">
                <button
                  onClick={handleViewMore}
                  className="px-4 py-2 text-white bg-[#BE1E2D] rounded hover:bg-opacity-50"
                >
                  Show All
                </button>
              </Link>
            </div>
          )}
        </div>
      </Containar>
    </section>
  );
};

export default NewRelease;
