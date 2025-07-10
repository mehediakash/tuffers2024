import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Containar from "../../layouts/Containar";
import { FaLuggageCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ApiContext from "../baseapi/BaseApi";

const BestDealWeek = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${baseApi}/banner`);
        const filteredBanners = response.data.data.doc.filter(
          (banner) => banner.bannerType === "Deals of the Week"
        );
        setBanners(filteredBanners);
        // console.log(banners)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [baseApi]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pt-14 lg:pt-20 pb-28 lg:pb-32 mt-14 lg:mt-28 bg-[#F6F7FB] font-inter bestdealweek">
      <Containar>
        <div className="px-2">
          <p className="flex items-center gap-2 text-[#12AEAD] text-sm">
            <FaLuggageCart className="bg-[#12AEAD] font-bold text-2xl p-1 rounded-full text-white" />
            This Month
          </p>
          <h3 className="text-[24px] mr-3 lg:text-head text-texthead font-medium mt-1">
            Deals of the week
          </h3>
        </div>
        <div className="mt-10 bg-white relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            slidesPerView={1}
            speed={1000}
            loop={true}
            autoplay={{ delay: 2000, pauseOnMouseEnter: true }}
            pagination={{
              el: ".custom-pagination1",
              clickable: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next6",
              prevEl: ".swiper-button-prev2",
            }}
            breakpoints={{
              370: {
                slidesPerView: 1,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
            className="mySwiper"
          >
            {banners.map((item) => (
              <SwiperSlide key={item?._id}>
                <div className="w-full xl:h-[408px] border hover:border-texthead transition-all ease-linear duration-150 border-border hover:drop-shadow-md">
                  <Link className="w-full h-full" to="/shop">
                    <img
                      className="w-full h-full"
                      src={item?.photo}
                      alt={item?.title || "Banner Image"}
                    />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-pagination1"></div>
          <div className="swiper-button-next6 absolute z-20 right-1 top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]">
            <FaChevronRight className="text-xs" />
          </div>
          <div className="swiper-button-prev2 absolute z-20 left-1 top-1/2 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]">
            <FaChevronLeft className="text-xs" />
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default BestDealWeek;
