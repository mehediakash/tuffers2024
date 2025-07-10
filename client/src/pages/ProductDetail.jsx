import React, { useContext, useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Containar from "../layouts/Containar";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdCheckCircleOutline } from "react-icons/md";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { socialList } from "../components/constants";
import FacebookPixel from '../components/facebookpixel/FacebookPixel'; // Import the FacebookPixel component

import RelatedProduct from "../components/productdetails/RelatedProduct";
import ParagraphtoList from "../components/productdetails/ParagraphtoList";
import axios from "axios";
import { addToCart } from "../redux/slices/cartSlices";
import RightPartProduct from "../components/productdetails/RightPartProduct";
import ApiContext from "../components/baseapi/BaseApi";
import youtube from "../../src/assets/productdetails/youtube.png";

const serviceList = [
  {
    icon: TbTruckDelivery,
    title: "Fast Delivery",
    // details: "Orders over $100",
  },
  {
    icon: RiSecurePaymentLine,
    title: "Secure Payment",
    details: "100% Secure Payment",
  },
  {
    icon: MdCheckCircleOutline,
    title: "Money Back Guarantee",
    // details: "Within 30 Days",
  },
  {
    icon: LiaHandsHelpingSolid,
    title: "24/7 Support",
    details: "Within 1 Business Day",
  },
];

const ProductDetail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userChoice, setUserChoiceColor] = useState("");
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const baseApi = useContext(ApiContext);
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Inside useEffect that fetches product data

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseApi}/product/${id}`);
      const productData = response.data.data.doc;
      setData(productData);

      // Automatically select the first available color and size when data is fetched
      if (productData.variants && productData.variants.length > 0) {
        const firstValidVariant = productData.variants.find(
          (variant) => variant.options && variant.options.length > 0
        );

        if (firstValidVariant) {
          setSelectedColor(firstValidVariant);
          setUserChoiceColor(firstValidVariant.colorCode);
          setSelectedSize(firstValidVariant.options[0].size);
        }
      }
 if (window.fbq && productData) {
        const selectedVariant = productData.variants?.[0]?.options?.[0];
        window.fbq("track", "ViewContent", {
          content_name: productData.name,
          content_category: productData.category?.title || "Uncategorized",
          content_ids: [productData._id],
          content_type: "product",
          value: selectedVariant?.salePrice || selectedVariant?.price || 0,
          currency: "BDT",
        })}

        console.log(productData)
      // One-time reload logic
      const hasReloaded = sessionStorage.getItem("hasReloaded");
      if (!hasReloaded) {
        sessionStorage.setItem("hasReloaded", "true");
        window.location.reload();
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);



  const handleAddToCart = () => {
    // Find the full option object for the selected size
    const selectedOption = selectedColor?.options.find(
      (option) => option.size === selectedSize
    );

    // console.log("selectedOption",selectedOption?._id)

    const item = {
      ...data,
      id,
      quantity,
      colorOptionId: selectedOption?._id, // Include the color option ID
      selectedOption,
      selectedColor, // Include the full selected option object
    };
    // console.log("item", item);

       // Facebook Pixel - AddToCart
    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: data.name,
        content_ids: [data._id],
        content_type: "product",
        value: selectedOption?.salePrice || selectedOption?.price || 0,
        currency: "BDT",
        quantity,
      });
    }
if (window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      category_name: data?.category?.title || "Uncategorized",
      content_ids: [data?._id],
      content_name: data?.name,
      content_type: "product",
      contents: [
        {
          id: data?._id,
          quantity: quantity,
          item_price: data.value,
        },
      ],
      currency: "BDT",
      event_day: new Date().getDate(),
      event_hour: new Date().getHours(),
      event_month: new Date().getMonth() + 1,
      event_url: window.location.href,
      landing_page: window.location.pathname,
      num_items: quantity,
      page_title: document.title,
      post_id: data?._id,
      post_type: "product",
      traffic_source: document.referrer || "direct",
      user_role: "customer", // Adjust based on auth if needed
    
    });
  }

    

    dispatch(addToCart(item));
    setQuantity(1);
  };

  const handleSelectColorChange = (color) => {
    setUserChoiceColor(color);
  };

  const handleColorChange = (variant) => {
    setSelectedColor(variant);
    setUserChoiceColor(variant.colorCode);

    // Automatically select the first size for the newly selected color
    if (variant.options && variant.options.length > 0) {
      setSelectedSize(variant.options[0].size);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const renderSizes = () => {
    if (!selectedColor || !selectedColor.options) {
      return null; // Or return a placeholder, e.g., "No sizes available"
    }

    return selectedColor.options.map((option) => (
      <button
        key={option._id}
        onClick={() => handleSizeChange(option.size)}
        className={`${
          selectedSize === option.size
            ? "bg-texthead text-white"
            : "bg-gray-200"
        } px-2 py-1 rounded text-sm`}
      >
        {option.size}
      </button>
    ));
  };

  const renderPrice = () => {
    if (selectedSize) {
      const selectedOption = selectedColor.options.find(
        (option) => option.size === selectedSize
      );
      if (selectedOption) {
        return (
          <div>
            {selectedOption.salePrice ? (
              <div className="flex text-2xl items-center gap-x-1 text-green-600">
                ৳ {selectedOption.salePrice}
                <div className="flex text-xl items-center gap-x-0.5 text-danger line-through">
                  {selectedOption?.price}
                </div>
              </div>
            ) : (
              <div className="flex text-2xl items-center gap-x-1 text-green-600">
                ৳ {selectedOption.price}
              </div>
            )}
          </div>
        );
      }
    }
    return "Select a size";
  };

  const renderDiscount = () => {
    if (selectedSize) {
      const selectedOption = selectedColor.options.find(
        (option) => option.size === selectedSize
      );

      if (selectedOption) {
        return (
          <>
            <div className="absolute right-4 top-4 z-10">
              {selectedOption?.freeShipping && (
                <h3 className="px-3 bg-green-600 text-white py-1 shadow-xl rounded-md">
                  Free Shipping
                </h3>
              )}
            </div>

            {selectedOption?.discountValue > 0 && (
              <div className="absolute left-4 top-4 z-10">
                <h3 className="px-3 bg-danger text-white py-1 shadow-xl rounded-md">
                  {selectedOption.discountType == "percent" ? (
                    <>{selectedOption?.discountValue} %</>
                  ) : (
                    <> ৳ {selectedOption?.discountValue} </>
                  )}
                </h3>
              </div>
            )}
          </>
        );
      }
    }
  };
  const renderDetails = () => {
    // console.log("selectedColor1", selectedColor?.details?.length);

    if (selectedColor?.details?.length > 0) {
      return <ParagraphtoList paragraph={selectedColor?.details} />;
    }
  };

  const photos = data?.photos || [];

  // Helper function to detect YouTube links
  const isYouTubeLink = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };



  return (
    <>
          <FacebookPixel pixelId="1039710810972873" />

      <section className="border-b border-b-border px-5 xl:px-0">
        <Containar>
          <div className="">
            <h4 className="flex flex-wrap items-center gap-x-2 text-sm py-7">
              <span className="cursor-pointer hover:text-danger text-texthead transition-all ease-linear duration-200">
                <Link to={"/"}>Home</Link>
              </span>{" "}
              <span>
                <FaChevronRight className="w-[5px] mt-0.5" />
              </span>{" "}
              <Link
                className="hover:text-danger text-texthead transition-all ease-linear duration-200"
                to={"/shop"}
              >
                Shop
              </Link>{" "}
              <span>
                <FaChevronRight className="w-[5px] mt-0.5" />
              </span>{" "}
              <span>{data?.name}</span>
            </h4>
          </div>
        </Containar>
      </section>

      <section className="font-inter pt-10 xl:pt-16">
        <Containar>
          <div className="grid xl:gap-x-8 grid-cols-12">
            <div className="col-span-12 xl:col-span-12">
              {loading ? ( 
                <div className="animate-pulse flex flex-wrap justify-between">
                  {/* Image loader */}
                  <div className="w-full relative md:w-[50%] lg:w-[50%] xl:w-[40%] bg-gray-200 h-[590px] rounded-lg mb-4"></div>

                  {/* Details loader */}
                  <div className="w-full md:w-[45%] lg:w-[45%] xl:w-[55%] px-5 lg:px-0">
                    <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-x-3 mt-4 md:mt-10">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mt-6 md:mt-10"></div>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex mt-10 gap-x-8">
                      <div className="h-[60px] w-24 bg-gray-200 rounded"></div>
                      <div className="h-[60px] w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-between">
                  <div className="w-full relative md:w-[50%] lg:w-[50%] xl:w-[45%] product_Details">
                    {renderDiscount()}
                    <PhotoProvider>
                      {photos.length > 0 && (
                        <>
                          <Swiper
                            style={{
                              "--swiper-navigation-color": "#fff",
                              "--swiper-navigation-size": "25px",
                            }}
                            loop={true}
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2 w-full max-h-[590px] flex"
                          >
                            {/* Map through the photos array and conditionally render YouTube videos or images */}
                            {photos.map((item, index) => (
                              <SwiperSlide key={index}>
                                {isYouTubeLink(item) ? (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <iframe
                                      width="100%"
                                      height="315"
                                      src={item}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      title={`YouTube Video ${index}`}
                                    ></iframe>
                                  </div>
                                ) : (
                                  <PhotoView src={item}>
                                    <img
                                      className="w-full object-cover"
                                      src={item}
                                    />
                                  </PhotoView>
                                )}
                              </SwiperSlide>
                            ))}
                          </Swiper>

                          <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper max-h-[180px]"
                          >
                            {photos.map((item, index) => (
                              <SwiperSlide key={index}>
                                {isYouTubeLink(item) ? (
                                  <img
                                    className="w-full object-contain"
                                    src={youtube} // Thumbnail for YouTube video
                                    alt="YouTube Thumbnail"
                                  />
                                ) : (
                                  <img
                                    className="w-full object-fill"
                                    src={item}
                                  />
                                )}
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </>
                      )}
                    </PhotoProvider>
                  </div>

                  <div className="w-full md:w-[45%] lg:w-[45%] xl:w-[50%] px-5 lg:px-0">
                    <h2 className="text-3xl mt-10 md:mt-0 leading-[46px] font-medium">
                      {data?.name}
                    </h2>
                    <p className="text-sm mt-3 md:mt-5">by tuffers</p>
                    <div className="flex gap-x-3 mt-6 md:mt-10">
                      <p>{renderPrice()}</p>
                    </div>
                    {/* <div className="flex gap-x-3 mt-6 md:mt-10">
                    <div className="flex text-2xl items-center gap-x-1 text-green-600">
                      
                      {data?.discountValue > 0
                        ? Math.ceil(data?.salePrice)
                        : data?.price}
                    </div>
                    {(data?.discountValue > 0 || data?.discountValue > 0) && (
                      <div className="flex text-xl items-center gap-x-0.5 text-danger line-through">
                        {data?.price}
                      </div>
                    )}
                  </div> */}
                    {data?.description && (
                      <p className="mt-6 md:mt-10">{data?.description}</p>
                    )}

                    {data.variants?.length > 0 && (
                      <div className="mt-4 md:mt-7">
                        <h3 className="text-xl font-medium text-texthead">
                          Colors
                        </h3>

                        <ul className="mt-4 flex flex-wrap gap-2">
                          {data.variants
                            ?.filter(
                              (variant) =>
                                variant.options && variant.options.length > 0
                            )
                            .map((item, index) => (
                              <li
                                onClick={() => {
                                  handleColorChange(item);
                                  handleSelectColorChange(item.colorCode);
                                }}
                                key={index}
                              >
                                <button
                                  style={{ backgroundColor: item.colorCode }}
                                  className={`w-10 h-10  text-sm  ${
                                    userChoice === item.colorCode
                                      ? "shadow-2xl rounded-full border-[#12AEAD] border"
                                      : "bg-gray-200 border-[1px]  border-[#12AEAD] text-texthead  "
                                  }`}
                                ></button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold">Sizes</h2>
                      <div className="flex space-x-2 mt-2">{renderSizes()}</div>
                    </div>

                    <div className="flex mt-10 gap-x-8">
                      <div className="h-[60px] inline-block">
                        <div className="h-full border flex border-border">
                          <button
                            onClick={() => {
                              quantity > 1 && setQuantity(quantity - 1);
                            }}
                            className="w-[60px] h-full flex items-center cursor-pointer justify-center"
                            disabled={quantity === 1}
                          >
                            <FaMinus />
                          </button>
                          <div className="flex items-center justify-center">
                            {quantity}
                          </div>
                          <button
                            onClick={() => {
                              setQuantity(quantity + 1);
                            }}
                            className="w-[60px] h-full flex items-center justify-center"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-10">
                      <button
                        onClick={() => {
                          handleAddToCart(data);
                          navigate("/checkout");
                        }}
                        className="h-[60px] bg-texthead text-white hover:bg-red-500 duration-200 w-full xl:w-[200px]"
                      >
                        <h2 className="text-lg text-center font-medium">
                          Buy Now
                        </h2>
                      </button>
                      <button className="h-[60px] xl:ml-5 mt-5 xl:mt-0 bg-white text-black border border-black hover:bg-black hover:text-white hover:border-none duration-200 w-full xl:w-[200px]">
                        <h2
                          onClick={() => handleAddToCart(data)}
                          className="text-lg text-center font-medium"
                        >
                          Add to cart
                        </h2>
                      </button>
                    </div>

                    <ul className="mt-8 mb-8 lg:mb-0 lg:mt-16 flex items-center gap-x-5 lg:hidden xl:flex ">
                      {socialList.map((item, index) => {
                        let Icon = item.logo;
                        return (
                          <Link
                            key={index}
                            className="text-texthead"
                            to={item.link}
                          >
                            <li
                              className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:bg-danger transition-all ease-linear duration-200 hover:text-white"
                              key={index}
                            >
                              <Icon />
                            </li>
                          </Link>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="col-span-12 xl:col-span-3 mt-10 md:mt-0">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ) : (
                <ul>
                  <RightPartProduct />
                  <li className="mt-8 flex flex-wrap xl:block border-x border-x-border">
                    {serviceList.map((item, index) => {
                      let Icon = item.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-x-5 border-y border-y-border py-5 w-full sm:w-[50%] xl:w-full px-[30px]"
                        >
                          <h2 className="text-5xl text-danger">
                            <Icon />
                          </h2>
                          <div>
                            <h3 className="text-base text-texthead font-medium">
                              {item?.title}
                            </h3>
                            <p>{item?.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </li>
                </ul>
              )}
            </div> */}
          </div>
        </Containar>
      </section>
      <div className="px-5 xl:px-0">{renderDetails()}</div>
      {/* {console.log("data", data)} */}
      <RelatedProduct id={data?.category?._id} />
    </>
  );
};

export default ProductDetail;
