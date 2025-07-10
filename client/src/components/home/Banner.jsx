import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/effect-fade";
import axios from "axios";
import ApiContext from "../baseapi/BaseApi";

const Banner = () => {
  const [bannerList, setBannerList] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(`${baseApi}/banner`);
        const banners = response.data.data.doc.filter(
          (item) => item?.bannerType === "Main Banner"
        );
        setBannerList(banners);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBannerData();
  }, [baseApi]);

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  if (loading)
    return (
      <div className="max-w-screen-xl mx-auto">
        <div className="relative banner-part animate-pulse">
          <div className="w-full lg:h-[500px] bg-[#12AEAD] opacity-20"></div>{" "}
        </div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section
      className="font-inter block"
      // style={{ backgroundImage: `url(${bgbanner})` }}
    >
      <div className=" mx-auto">
        <section className="relative banner-part">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            // effect="fade"
            speed={1000}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{
              el: ".custom-pagination",
              clickable: true,
            }}
            onSlideChange={handleSlideChange}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
            }}
            className="mySwiper"
          >
            {bannerList.map((item, i) => (
              <SwiperSlide key={item?._id}>
                <div className="overflow-hidden relative">
                  {currentSlide === i && (
                    <div className="w-full lg:h-[80vh]">
                      <motion.img
                        key={i}
                        className="w-full max-h-[80vh] object-cover cursor-pointer"
                        src={item?.photo}
                        alt="banner"
                        onClick={() => navigate(item?.link)}
                      />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-pagination absolute right-5 bottom-0 md:bottom-0 rotate-90"></div>
        </section>
      </div>
    </section>
  );
};

export default Banner;
