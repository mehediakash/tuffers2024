import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Containar from "../../layouts/Containar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useInView, motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import ApiContext from "../baseapi/BaseApi";
import { PiShootingStarFill } from "react-icons/pi";

const Brand = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animation = useAnimation();
  const [data, setData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    getCZone();
  }, []);

  // useEffect(() => {
  //   getCArea(ZoneKey);
  // }, [ZoneKey]);

  const getCZone = async () => {
    try {
      const response = await axios.get(
        // `https://courier-api-sandbox.pathao.com/aladdin/api/v1/issue-token`,
        `https://api-hermes.pathao.com/aladdin/api/v1/issue-token`,
        {
          client_id: "zPdyrnWeQr",
          client_secret: "fkZAmYg70lauumpWscIL5MizKURkjaKL9sDOVBAe",
          username: "al.adal0021@gmail.com",
          password: "Ak2021@#",
          grant_type: "password",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      // You can handle the successful response here if needed
      console.log("Token received:", response.data);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error fetching token:", error);
    }
  };

  useEffect(() => {
    if (inView) {
      animation.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          delay: 0.3,
          ease: "easeIn",
        },
      });
    }
  }, [inView, animation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApi}/brand`);
        setData(response.data?.data.doc || []); // Fallback to empty array
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseApi]);

  return (
    <section ref={ref} className="py-14 lg:py-28 overflow-hidden bg-[#F6F7FB]">
      <Containar>
        <div className="px-2">
          <p className="flex justify-center items-center gap-2 text-[#12AEAD] text-sm">
            <PiShootingStarFill className="bg-[#12AEAD] font-bold text-2xl p-1 rounded-full text-white" />
            This Month
          </p>
          <h3 className="text-[24px]  text-center mr-3 lg:text-head text-texthead font-medium mt-1">
            Popular Brands
          </h3>
        </div>
        <motion.div
          animate={animation}
          initial={{ opacity: 0, y: 100 }}
          className="mt-10 relative "
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            loop={true}
            speed={1000}
            autoplay={{ delay: 1000, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next7",
              prevEl: ".swiper-button-prev7",
            }}
            breakpoints={{
              370: {
                slidesPerView: 2,
              },
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
              1280: {
                slidesPerView: 6,
              },
            }}
            className="mySwiper"
          >
            {data.length > 0 ? (
              data.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="w-[200px] h-[160px] border-border border hover:border-texthead">
                    <Link
                      className="flex justify-center object-cover w-full h-full"
                      to={`/shop/brand/${item?._id}`}
                    >
                      <img
                        className="object-cover w-full h-full"
                        alt="brand"
                        src={item?.photo}
                      />
                    </Link>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <p>No brands available</p>
            )}
          </Swiper>
          <div
            className={`swiper-button-next7 absolute right-1 z-20  top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]`}
          >
            <FaChevronRight className="text-xs" />
          </div>
          <div
            className={`swiper-button-prev7 absolute left-1 z-20  top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]`}
          >
            <FaChevronLeft className="text-xs" />
          </div>
        </motion.div>
      </Containar>
    </section>
  );
};

export default Brand;
