import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlices";
import axios from "axios";
import ApiContext from "../baseapi/BaseApi";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import SkeletonLoader from "../skeletonLoader/SkeletonLoader";
import { BsFillBagCheckFill } from "react-icons/bs";

const ProductItem = ({
  image = [],
  product,
  discount,
  subtitle,
  title,
  categoryName,
  offerprice,
  regularprice,
  classItem,
  categoryId,
  brandId,
  discountType,
  discountPercent,
  priceAfterDiscount,
  id,
  slug,
  freeShipping,
}) => {
  const dispatch = useDispatch();
  const baseApi = useContext(ApiContext);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalCart, setShowModalCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null); // State for selected size
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setShowModalCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleFetchOptionData = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${baseApi}/product/${item?.product?._id}/options`
      );
      setOptions(response.data.data?.options);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch options. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleFetchOptionDataCart = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${baseApi}/product/${item?.product?._id}/options`
      );
      setOptions(response.data.data?.options);
      setShowModalCart(true);
    } catch (err) {
      setError("Failed to fetch options. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // console.log("product", product);
  const handleAddToCart = () => {
    const selectedOption = options.find(
      (option) => option.size === selectedSize
    );
    if (!selectedOption) return;

    const item = {
      ...product?.product,
      id: product?.product?._id,
      slug: product?.product?.slug,
      quantity: 1,
      photos: product?.product?.photos,
      name: product?.product?.name,
      colorOptionId: selectedOption?._id,
      // _id:product?._id,
      selectedOption: {
        _id: selectedOption?._id,
        sku: selectedOption?.sku,
        size: selectedOption?.size,
        price: selectedOption?.price,
        salePrice: selectedOption?.salePrice,
        stock: selectedOption?.stock,
        discountType: selectedOption?.discountType,
        discountValue: selectedOption?.discountValue,
        visitCount: selectedOption?.visitCount,
        saleNumber: selectedOption?.saleNumber,
        freeShipping: selectedOption?.freeShipping,
      },
      selectedColor: selectedOption?.variant,
    };

    dispatch(addToCart(item));
    setShowModal(false); // Close the modal after adding to cart
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseModalCart = () => {
    setShowModalCart(false);
  };
  // mb-0 lg:mb-7
  return (
    <>
      <div className="max-w-xs border border-gray-200 rounded-lg overflow-hidden shadow-lg mx-1 ">
        <Link to={`/productdetail/${product?.product?.slug}/${id}`}>
          <img
            className="w-full object-contain mx-auto transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 "
            src={[image[0]]}
            alt="product"
          />
        </Link>

        <div className="lg:px-4 pb-4 text-center mt-5">
          <h3 className="text-xs">
            <Link
              to={`/shop/brand/${brandId}`}
              className="uppercase block text-xs text-danger mt-2 h-3"
            >
              {subtitle}
            </Link>
          </h3>
          <h2 className="font-semibold h-8">
            {" "}
            <Link
              to={`/productdetail/${product?.product?.slug}/${id}`}
              className="text-base leading-5 inline-block font-medium text-gray-900 mt-1 text-ellipsis overflow-hidden break-words"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {title}
            </Link>
          </h2>
          <div className="flex justify-center items-center mt-2">
            <span className="text-lg font-semibold text-gray-900">
              <span className="">৳</span>
              {priceAfterDiscount
                ? Math.ceil(priceAfterDiscount)
                : regularprice}
            </span>
            {priceAfterDiscount > 0 && (
              <span className="text-sm text-[#12AEAD] line-through ml-2">
                <span className="mr-1">৳</span>
                {regularprice}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-around p-1 gap-x-2 border-t border-gray-200 relative">
          {/* Eye Icon with Tooltip */}
          <Link
            // onClick={() => handleFetchOptionData(product)}
             to={`/productdetail/${product?.product?.slug}/${id}`}
            className="relative  group duration-200 cursor-pointer bg-danger text-white hover:text-white w-1/2 flex justify-center py-3"
          >
            <button className="flex items-center justify-center  border-l-red-600 border-e-red-100">
           
            Order now
            </button>
            <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs font-semibold px-2 w-[90px] text-center py-2 rounded">
              Buy Now
              <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-2 h-2 bg-black rotate-45"></span>
            </span>
          </Link>
          {/* Eye Icon with Tooltip */}
          {/* <Link
            to={`/productdetail/${product?.product?.slug}/${id}`}
            className="border-r border-l relative group duration-200 cursor-pointer hover:bg-red-500 text-gray-500 hover:text-white w-1/2 flex justify-center py-3"
          >
            <button className="flex items-center justify-center">
              <FaEye className="text-lg" />
            </button>
            <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs font-semibold px-2 w-[90px] text-center py-2 rounded">
              View Details
              <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-2 h-2 bg-black rotate-45"></span>
            </span>
          </Link> */}
          {/* Shopping Cart Icon with Tooltip */}
          <Link
            // onClick={() => handleFetchOptionDataCart(product)}
              to={`/productdetail/${product?.product?.slug}/${id}`}
            className="relative  group duration-200 cursor-pointer border-danger border hover:bg-danger text-gray-500 hover:text-white w-1/2 flex justify-center py-3"
          >
            <button className="flex items-center justify-center">
         Add to Cart
            </button>
            <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs font-semibold px-2 w-[90px] text-center py-2 rounded">
              Add to Cart
              <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-2 h-2 bg-black rotate-45"></span>
            </span>
          </Link>
          {/* Buy now model */}
          {showModal && (
            <div className="absolute inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center">
              <div
                ref={modalRef}
                className="bg-white absolute bottom-0 p-4 w-96 max-w-full rounded shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4">Select Size</h3>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <ul className="flex gap-x-1 items-center">
                    {options.map((option) => (
                      <li
                        key={option._id}
                        className={`py-1 px-2 border ${
                          selectedSize === option.size
                            ? "border-danger text-danger"
                            : ""
                        } cursor-pointer`}
                        onClick={() => handleSizeClick(option.size)}
                      >
                        {option.size}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex gap-x-1">
                  <button
                    className="px-2 py-0.5 text-sm bg-texthead text-white rounded"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-2 text-sm py-0.5 bg-danger text-white rounded flex items-center ${
                      !selectedSize ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (selectedSize) {
                        handleAddToCart();
                        navigate("/checkout");
                      }
                    }}
                    disabled={!selectedSize}
                  >
                    Confirm
                    <TiTick className="text-xl group-hover:scale-125 duration-200" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* add to cart model */}
          {showModalCart && (
            <div className="absolute inset-0 z-30 bg-red bg-opacity-30 flex justify-center items-center">
              <div
                ref={modalRef}
                className="bg-white absolute bottom-0 p-4 w-full max-w-full rounded shadow-lg "
              >
                <h3 className="text-sm font-semibold mb-4">Select Size</h3>
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <ul className="flex gap-x-1 items-center">
                    {options.map((option) => (
                      <li
                        key={option._id}
                        className={`py-1 px-2 border ${
                          selectedSize === option.size
                            ? "border-danger text-danger"
                            : ""
                        } cursor-pointer`}
                        onClick={() => handleSizeClick(option.size)}
                      >
                        {option.size}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex gap-x-2">
                  <button
                    className="px-2 py-0.5 text-sm bg-texthead text-white rounded"
                    onClick={handleCloseModalCart}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-2 text-sm py-0.5 bg-danger text-white rounded flex items-center ${
                      !selectedSize ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      setShowModalCart(false);
                      handleAddToCart();
                    }}
                    disabled={!selectedSize}
                  >
                    Confirm
                    <TiTick className="text-xl group-hover:scale-125 duration-200" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductItem;
