import React, { useEffect, useState, useContext } from "react";
import { FaMinus } from "react-icons/fa6";
import Containar from "../../layouts/Containar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { TiArrowBackOutline } from "react-icons/ti";
import { deleteFromCart, resetCart ,updateQuantity} from "../../redux/slices/cartSlices";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import axios from "axios";
import { FiDelete } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { city } from "../constants";
import ApiContext from "../baseapi/BaseApi";
import FacebookPixel from "../facebookpixel/FacebookPixel";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
const districts = [
  "ঢাকা", "চট্টগ্রাম" , "কুমিল্লা", "রাজশাহী", "খুলনা", "বরিশাল", "রংপুর", "ময়মনসিংহ", "সিলেট", "নোয়াখালী", "ফেনী", "কক্সবাজার", "বান্দরবান", "রাঙ্গামাটি", "খাগড়াছড়ি", "লক্ষ্মীপুর", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ", "গাজীপুর", "নরসিংদী", "মানিকগঞ্জ", "রাজবাড়ী", "মাদারীপুর", "শরীয়তপুর", "গোপালগঞ্জ", "বাগেরহাট", "ঝিনাইদহ", "মাগুরা", "কুষ্টিয়া", "চুয়াডাঙ্গা", "মেহেরপুর", "নড়াইল", "যশোর", "সাতক্ষীরা", "পটুয়াখালী", "ভোলা", "ঝালকাঠি", "পিরোজপুর", "বরগুনা", "দিনাজপুর", "ঠাকুরগাঁও", "পঞ্চগড়", "নীলফামারী", "লালমনিরহাট", "কুড়িগ্রাম", "গাইবান্ধা", "বগুড়া", "নওগাঁ", "জয়পুরহাট", "চাঁপাইনবাবগঞ্জ", "সিরাজগঞ্জ", "টাঙ্গাইল", "নেত্রকোণা", "শেরপুর", "জামালপুর", "কিশোরগঞ্জ", "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ"
];
  // const [zone, setZone] = useState();
  const baseApi = useContext(ApiContext);
  // const [cityList, setCityList] = useState([]);

const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    district: "",
    streetAddress: "",
    shipping: "outsideDhaka",
    payment: "cod",
    couponCode: "",
  });

  console.log("formData", formData);

  const handleCouponCode = async () => {
    if (formData.couponCode.trim() === "") {
      setCouponError("Coupon code cannot be empty");
      setCouponDiscount(0);
      formData.couponCode = "";
      return;
    }

    try {
      const response = await axios.get(
        `${baseApi}/coupon/${formData.couponCode}`
      );
      // console.log(response);
      if (response.data.status == "success") {
        setCouponDiscount(response.data.data.coupon.discountPercent);
        setCouponError("");
      } else {
        setCouponError("Invalid coupon code");
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error("Error fetching coupon", error);
      setCouponError("Coupon code not found");
      setCouponDiscount(0);
    }
  };

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const hasFreeShipping = cartItems.some((item) => item.freeShipping);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        (couponDiscount > 0
          ? item?.selectedOption?.price
          : item?.selectedOption.discountValue > 0
          ? Math.ceil(item?.selectedOption?.salePrice)
          : item?.selectedOption?.price) *
          item.quantity,
      0
    );
  };

  // Calculate shipping cost
const getShippingCost = () => {
  if (hasFreeShipping) return 0;
  if (!formData.district) return 0;

  return formData.district === "চট্টগ্রাম" ? 80 : 130;
};


  // Calculate total cost
  const calculateTotalCost = () => {
    const subtotal = calculateSubtotal();
    const discount = (couponDiscount / 100) * subtotal; // Calculate discount
    const shippingCost = getShippingCost();
    const total = subtotal - discount + shippingCost; // Apply discount to subtotal and add shipping cost
    return Math.ceil(total);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Parse JSON values for area, zone, and district
   setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "district") {
        updated.shipping = value === "চট্টগ্রাম" ? "insideDhaka" : "outsideDhaka";
      }
      return updated;
    });
    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    // Update cityKey and zoneKey if district or zone changes



    // Clear specific error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error message for the current field
    }));
  };

  // console.log(cityKey);

  const validate = () => {
    const newErrors = {};

    // Ensure all required fields are filled
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{11,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be at least 11 digits";
    }
    if (!formData.district) newErrors.district = "জেলা নির্বাচন করুন";
    if (!formData.streetAddress)
      newErrors.streetAddress = "Street Address is required";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
console.log(cartItems)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("ফর্মের সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন। বিশেষ করে জেলা নির্বাচন করুন।");
      return;
    }

    if (validate()) {
      // Proceed only if validation is successful
      setIsLoading(true);
      try {
        // Prepare order data
        const orderData = {
          name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
       
          streetAddress: formData.streetAddress,
          shippingCost: getShippingCost(),
          products: cartItems.map((item) => ({
            option: item.colorOptionId,
            quantity: item.quantity,
            userSelectedColor: item.userChoiceColor || "", // Include userSelectedColor if needed
          })),
          ...(formData.couponCode.trim() && { coupon: formData.couponCode }),
        };

        console.log("orderData", orderData);

        // Determine the API endpoint
        const apiEndpoint = formData.couponCode.trim()
          ? `${baseApi}/order/withCoupon`
          : `${baseApi}/order`;

        // Post data to API
        const response = await axios.post(apiEndpoint, orderData);

        // Handle successful response
        dispatch(resetCart());

if (window.fbq) {
  const subtotal = calculateSubtotal();
  const total = calculateTotalCost();
  const timestamp = new Date();
  const contents = cartItems.map(item => ({
    id: item.productId || item._id,
    quantity: item.quantity,
    item_price: item?.selectedOption?.price || 0,
  }));

  window.fbq('track', 'Purchase', {
    content_type: 'product',
    content_ids: contents.map(c => c.id),
    contents,
    value: total,
    currency: 'BDT',
    num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    order_id: response.data?.order?._id || "",
    coupon_used: formData.couponCode || "none",
    event_url: window.location.href,
    landing_page: document.referrer,
    page_title: document.title,
    event_day: timestamp.getDate(),
    event_hour: timestamp.getHours(),
    event_month: timestamp.getMonth() + 1,
    category_name: cartItems[0]?.category.title || "",
    content_name: cartItems[0]?.name || "",
    traffic_source: "organic",
    user_role: "customer",

   
  });
}

        navigate("/thankyou");
      } catch (error) {
        setIsLoading(false); // Stop loading
        console.error("Error submitting order", error);
        setCouponError(
          error.response?.data?.message ||
            "An error occurred while placing the order"
        );
      }
    }



  };


  const handleReset = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      shipping: "",
      payment: "cod",
      couponCode: "", // Reset coupon code
     
      streetAddress: "",
     
    });
    setErrors({});
  };

  

  return (
    <section className="pb-20 font-inter bg-[#FEF6F6]">

 {formData.email && formData.phoneNumber && (
  <FacebookPixel
    pixelId="1039710810972873"
    userData={{
      email: formData.email,
      phone: formData.phoneNumber,
      firstName: formData.fullName,
      streetAddress: formData.streetAddress,
      country: "BD",
    }}
  />
)}




{console.log(formData.streetAddress)}
      {cartItems.length > 0 ? (
        <Containar>
          <div>
            <div className="grid grid-cols-12  md:gap-x-8">
              <div className="col-span-12  lg:order-1 lg:col-span-8  ">
                <div className="bg-white pt-8 pb-12 px-6 shadow-md">
                  <h2 className="text-texthead uppercase text-lg font-medium">
                    Billing & Shipping

                  </h2>
                  <div className="mt-7">
                    <form onSubmit={handleSubmit}>
                      <div className="w-full flex items-start flex-wrap justify-between">
                        <div className="w-full">
                          <label htmlFor="Name ( আপনার নাম ) *">Name ( আপনার নাম ) *</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.fullName
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Name ( আপনার নাম ) *"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full flex items-start flex-wrap justify-between mt-5">
                        <div className="w-full lg:w-[49%]">
                           <label htmlFor="Name ( আপনার নাম ) *">Mobile Number ( মোবাইল নাম্বার ) *</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.phoneNumber
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder=" Mobile Number ( মোবাইল নাম্বার ) *"
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>
                        <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          {/* Replace here into dropdown into District (জেলা) hrer will be show all bangladeshes জেলা in bangla. also when i select outside Chattogram  jela in the add the Shipping cost 130 taka othewise inside Chattogram add to shiping cost 80 taka */}

                          <label htmlFor="Name ( আপনার নাম ) *">   District (জেলা) *</label>
                       
                          <select
        name="district"
        value={formData.district}
        onChange={handleChange}
        className="w-full h-12 px-3 border mt-2 border-border"
      >
        <option value="">জেলা নির্বাচন করুন *</option>
        {districts.map((district) => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>
      {errors.district && (
        <p className="text-red-500 text-sm mt-0.5">{errors.district}</p>
      )}
{errors.district && (
  <p className="text-red-500 text-sm mt-0.5">{errors.district}</p>
)}

                        </div>
                      </div>

                      <h2 className="text-texthead text-lg font-medium my-5">
                        Full Address ( সম্পূর্ণ ঠিকানা )  *
                      </h2>

                      <div className="w-full flex items-start flex-wrap justify-between ">
                        
                        <div className="w-full   lg:mt-0">
                          <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.streetAddress
                                ? "border-red-500"
                                : "border-border"
                            }`}
                              placeholder="House No, Road, Union, Upazila, Zila"

                          />
                          {errors.streetAddress && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.streetAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="w-full flex items-start flex-wrap justify-between md:mt-10">
                        {hasFreeShipping ? (
                          <div className="self-center px-5 rounded-md py-2 shadow-lg text-xs bg-green-600 text-white flex items-center gap-x-0.5">
                            <h3 className="text-xl">Free Shipping</h3>
                          </div>
                        ) : (
                          ""
                          // <div className="w-full lg:w-[49%]">
                          //   <h4 className="text-[15px] font-medium mb-5">
                          //     Shipping *
                          //   </h4>
                          //   <div className="flex flex-wrap gap-x-10  items-start">
                          //     <label className="flex items-start text-sm font-medium gap-x-1 cursor-pointer">
                          //       <input
                          //         className="mt-1"
                          //         name="shipping"
                          //         id="shippingInsideDhaka"
                          //         type="radio"
                          //         value="insideDhaka"
                          //         checked={formData.shipping === "insideDhaka"}
                          //         onChange={handleChange}
                          //         required={hasFreeShipping ? false : true}
                          //       />
                          //       <div>
                          //         <h3>Inside of Chattogram</h3>
                          //         <h4 className="mt-2 sm:mt-5 flex items-center gap-x-0.5">
                          //           ৳ 80tk
                          //         </h4>
                          //       </div>
                          //     </label>
                          //     <label className="flex items-start text-sm font-medium gap-x-1 cursor-pointer ">
                          //       <input
                          //         className="mt-1"
                          //         name="shipping"
                          //         id="shippingOutsideDhaka"
                          //         type="radio"
                          //         value="outsideDhaka"
                          //         checked={formData.shipping === "outsideDhaka"}
                          //         onChange={handleChange}
                          //         required={hasFreeShipping ? false : true}
                          //       />
                          //       <div>
                          //         <h3>Outside of Chattogram</h3>
                          //         <h4 className="mt-2 sm:mt-5 flex items-center gap-x-0.5">
                          //           ৳ 130tk
                          //         </h4>
                          //       </div>
                          //     </label>
                          //   </div>
                          //   {errors.shipping && (
                          //     <p className="text-red-500 text-sm mt-2">
                          //       {errors.shipping}
                          //     </p>
                          //   )}
                          // </div>
                        )}

                        
                      </div>
                      <div className="md:mt-16 mt-5  flex gap-4">
                        {/* <button
                          type="button"
                          onClick={handleReset}
                          disabled={isLoading}
                          className="px-10 bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200"
                        >
                          Reset
                        </button> */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 flex items-center text-white justify-center font-medium hover:bg-green-600 transition-all ease-linear duration-200 bg-danger cursor-pointer"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                                ></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Confime Order"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-span-12  lg:order-2 mt-5 lg:mt-0 lg:col-span-4">
                <div className="pt-3 bg-white shadow-md border border-texthead">
                  <div className="py-5 border-b border-b-border">
                    <h2 className="px-6 capitalize text-texthead text-lg font-medium">
                      Your Order Overview
                    </h2>
                    <ul className="mt-5">
  {cartItems.map((item) => (
    <li
      key={item?._id}
      className="px-6 flex items-center justify-between text-sm py-3"
    >
      <span className="w-[70%]">
        <span className="text-xs text-gray-400">
          Product ID: {item?._id.slice(0, 6)}
        </span>
        <br />
        <h3>
          <Link
            to={`/productdetail/${item?._id}`}
            className="text-texthead cursor-pointer hover:text-danger transition-all ease-linear duration-200"
          >
            {item?.name}
          </Link>{" "}
        </h3>
        <div className="flex items-center mt-2">
          <button
            type="button"
            onClick={() => {
              if (item.quantity > 1) {
                dispatch(
                  updateQuantity({
                    id: item._id,
                    colorOptionId: item?.selectedOption?._id,
                    quantity: item.quantity - 1,
                  })
                );
              }
            }}
            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center">
            {item?.quantity}
          </span>
          <button
            type="button"
            onClick={() => {
              if (item.quantity < 20) {
                dispatch(
                  updateQuantity({
                    id: item._id,
                    colorOptionId: item?.selectedOption?._id,
                    quantity: item.quantity + 1,
                  })
                );
              }
            }}
            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            disabled={item.quantity >= 20}
          >
            +
          </button>
        </div>
        {item?.userChoiceColor &&
          item?.userChoiceColor.length > 0 && (
            <h4 className="text-xs mt-1">
              Color:{" "}
              <span className="capitalize w-4 h-4">
                {item?.userChoiceColor}
              </span>
            </h4>
          )}
      </span>
      <span className="flex items-center gap-x-1 ">
        {couponDiscount > 0 ? (
          <span className="flex items-center text-sm font-medium text-texthead">
            {" "}
            ৳{" "}
            <span className="sub-price">
              {" "}
              {item?.selectedOption?.price}{" "}
            </span>
          </span>
        ) : (
          <>
            <span className="flex items-center text-sm font-medium text-texthead">
              {" "}
              <span className=" mr-1">৳</span>
              <span className="sub-price">
                {(item?.selectedOption?.discountValue > 0
                  ? Math.ceil(
                      item?.selectedOption?.salePrice
                    )
                  : item?.selectedOption?.price) *
                  item?.quantity}
              </span>
            </span>
            {item?.selectedOption?.discountValue > 0 && (
              <del className="line-through text-normal text-danger">
                {" "}
                {item?.selectedOption?.discountValue > 0 &&
                  item?.selectedOption?.price *
                    item?.quantity}
              </del>
            )}
          </>
        )}

        <span
          onClick={() =>
            dispatch(
              deleteFromCart({
                id: item._id,
                colorOptionId: item?.selectedOption?._id,
                selectedSize: item?.selectedSize,
              })
            )
          }
          className="text-danger cursor-pointer text-lg"
        >
          <MdOutlineDeleteForever />
        </span>
      </span>
    </li>
  ))}
</ul>
<div className="w-full mt-7 sm:mt-0  px-5">
                          <h4 className="text-[15px] font-medium mb-2 sm:mb-5">
                            Coupons Codes
                          </h4>
                          <input
                            type="text"
                            name="couponCode"
                            value={formData.couponCode}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.couponCode
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Enter your coupon code"
                          />
                          <button
                            type="button"
                            onClick={handleCouponCode}
                            className="mt-2 bg-texthead hover:bg-texthead transition-all ease-linear duration-200 text-white px-4 py-2 rounded"
                          >
                            Apply Coupon
                          </button>
                          {couponError && (
                            <p className="text-red-500 text-sm mt-2">
                              {couponError}
                            </p>
                          )}

                          {couponDiscount > 0 && !couponError && (
                            <p className="text-green-600 text-sm mt-2">
                              Coupon applied! Discount: {couponDiscount}%
                            </p>
                          )}
                        </div>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="py-10 border-b border-b-border">
                      <ul className=" px-6 flex items-center justify-between text-base">
                        <li>Coupon Discount</li>
                        <li className="flex items-center gap-x-0.5">
                          <FaMinus className="mr-1" /> {couponDiscount} %
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="py-10 border-b border-b-border">
                    <ul className=" px-6 flex items-center justify-between text-base">
                      <li>Subtotal</li>
                      <li className="flex items-center gap-x-0.5">
                        <span className="mr-1">৳</span>
                        <span className="sub-price">
                          {couponDiscount > 0
                            ? Math.ceil(
                                calculateSubtotal() -
                                  calculateSubtotal() * (couponDiscount / 100)
                              )
                            : calculateSubtotal()}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="py-10 border-b border-b-border">
                    <h2 className="px-6 capitalize text-texthead text-lg font-medium">
                      Delivery Charge
                    </h2>
                    <div className="mt-7 px-6 text-sm flex justify-between items-center">
                      <div className="flex items-start text-base font-normal gap-x-1">
                        <input
                          className="mt-1"
                          name="payment"
                          id="paymentCOD"
                          type="radio"
                          value="cod"
                          checked={formData.payment === "cod"}
                          onChange={handleChange}
                          required
                        />
                        <div>
                          <h3>Cash on delivery</h3>
                        </div>
                      </div>
                      <div className="flex items-start text-base font-normal gap-x-1">
                        <h3 className="flex items-center gap-x-1 text-sm">
                          <span className="mr-1">৳</span> {getShippingCost()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="py-10 border-b border-b-border flex justify-between">
                    <h2 className="px-6 capitalize text-texthead text-lg font-medium">
                      Total Cost
                    </h2>
                    <h2 className="px-6 capitalize text-green-600 text-lg font-medium flex items-center gap-x-1">
                      <span className="mr-1">৳</span> {calculateTotalCost()}
                    </h2>
                  </div>

                  <div className="py-10 border-b border-b-border">
                    <p className="px-6 text-sm font-normal">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our{" "}
                      <Link to={"/privacy"} className="text-danger">
                        privacy policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => navigate("/cart")}
                    className="py-5 w-full flex items-center justify-center border-black border text-black hover:text-white duration-200 font-medium hover:bg-black"
                  >
                    <span className="flex items-center gap-x-1">
                      <TiArrowBackOutline /> View Cart
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Containar>
      ) : (
        <div className="">
          <div className="flex justify-center items-center">
            <HiOutlineShoppingBag className="text-[240px]" />
          </div>
          <h2 className="text-center text-2xl font-medium mt-5">
            Your Cart is currently empty.
          </h2>
          <div className="flex justify-center items-center mt-6 pb-10">
            <Link
              className="text-lg bg-texthead hover:bg-black transition-all ease-linear duration-200 font-medium px-16 py-4 text-white"
              to={"/shop"}
            >
              Return to shop
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default CheckoutForm;
