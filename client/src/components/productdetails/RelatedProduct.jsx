import React, { useContext, useEffect, useState } from "react";
import Containar from "../../layouts/Containar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Autoplay, Thumbs } from "swiper/modules";
import { Link } from "react-router-dom";
import {
  FaBangladeshiTakaSign,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { BsCartCheck } from "react-icons/bs";
import { motion } from "framer-motion";
import ProductItem from "../productitem/ProductItem";
import ApiContext from "../baseapi/BaseApi";

const RelatedProduct = ({ id }) => {
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState(null);
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseApi}/category/${id}/options`);
        const data = await response.json();
        let fetchedProducts = data?.data?.options.reverse() || [];

        const uniqueProducts = [];
        const seenProductIds = new Set();
        fetchedProducts.forEach((item) => {
          if (!seenProductIds.has(item.product._id)) {
            seenProductIds.add(item.product._id);
            uniqueProducts.push(item);
          }
        });

        const productsWithSizes = uniqueProducts.map((product) => {
          const sizes = product.variant?.sizes || [];
          return {
            ...product,
            sizes,
          };
        });

        setProductList(productsWithSizes);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      }
    };

    fetchProducts();
  }, [id, baseApi]);

  return (
    <section className="font-inter pt-10 md:pt-20 pb-20 md:pb-32 border-t border-t-border overflow-hidden px-5 xl:px-0">
      <Containar>
        <h4 className="text-3xl font-medium text-texthead">Related Products</h4>
        <div className="mt-5">
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : productList.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            <motion.div
              className="mt-12 W-full relative"
            >
              <Swiper
                modules={[Navigation, Autoplay]}
                slidesPerView={1}
                loop={true}
                speed={1000}
                autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
                navigation={{
                  nextEl: ".swiper-button-next3",
                  prevEl: ".swiper-button-prev3",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  370: {
                    slidesPerView: 2,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1280: {
                    slidesPerView: 5,
                  },
                }}
                className="mySwiper w-full group-edit"
              >
                {productList.map((item, index) => (
                  <SwiperSlide key={index}>
                    <Link
                      to={`/product/${item?.product?._id}`}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        window.location.reload(); // পেজ রিলোড করার জন্য
                      }}
                    >
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
                        classItem="w-full"
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-button-next3 absolute z-20 right-1 top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]">
                <FaChevronRight className="text-xs" />
              </div>
              <div className="swiper-button-prev3 absolute z-20 left-1 top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]">
                <FaChevronLeft className="text-xs" />
              </div>
            </motion.div>
          )}
        </div>
      </Containar>
    </section>
  );
};

export default RelatedProduct;
