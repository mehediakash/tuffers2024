import React, { useEffect, useState, useContext } from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { menusList, socialList } from "../../constants";
import axios from "axios";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

import { IoCallOutline } from "react-icons/io5";

import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../../redux/slices/cartSlices";
import Search from "./Search";
import { MdKeyboardArrowRight, MdOutlineClose } from "react-icons/md";
import MobileSearch from "./MobileSearch";
import { TiArrowBackOutline } from "react-icons/ti";
import { PiPercentBold } from "react-icons/pi";
import logo from "../../../assets/logos/logoblack.png";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import ApiContext from "../../baseapi/BaseApi";
import Containar from "../../../layouts/Containar";
const Navbar = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [categoryActive, setCategoryActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const baseApi = useContext(ApiContext);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  const cartItems = useSelector((state) => state.cart.items);

  const toggleDrawer1 = () => {
    setIsOpenCart((prevState) => !prevState);
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseApi}/category`);
        setCategories(response.data.data.doc);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleDelete = (id) => {};

  const calculateSubtotal = () => {
    return cartItems
      .reduce(
        (total, item) =>
          total +
          item?.quantity *
            (item?.selectedOption?.discountValue > 0
              ? Math.ceil(item?.selectedOption?.salePrice)
              : item?.selectedOption?.price),
        0
      )
      .toFixed(0);
  };

  const setHandleClick = async (id) => {
    const response = await axios.get(`${baseApi}/category/${id}`);
    setData(response.data.data.doc);
    setCategoryActive(!categoryActive);
    fetchCategoryById(id);
  };
  return (
    <>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        size={windowWidth > 400 ? 400 : 300}
        lockBackgroundScroll={true}
        className="bla bla bla"
      >
        <div className="font-inter h-screen overflow-scroll ">
          <div className="py-4 px-7 flex justify-between items-center bg-gray-200">
            <Link className="flex items-baseline" to="/">
              <div className="mb-2 mt-3 w-20 xl:w-40 ">
                <img className="w-full " src={logo} />
              </div>
            </Link>
            <div onClick={() => toggleDrawer()}>
              <MdOutlineClose className="text-xl text-texthead cursor-pointer " />
            </div>
          </div>
          <div className="px-7 bg-gray-200">
            <MobileSearch toggleDrawer={toggleDrawer} />
          </div>
          <div className="border-t  border-t-border py-7 block sm:hidden">
            <h2 className="text-lg font-medium  text-texthead flex items-center justify-between  pb-5 px-7">
              Menu
              <MdOutlineClose
                onClick={() => toggleDrawer()}
                className="text-xl cursor-pointer"
              />
            </h2>
            <ul className=" flex flex-col">
              {menusList.map((item, index) => (
                <li key={index}>
                  <Link
                    className="py-3 px-8 block transition-all ease-linear duration-200 hover:bg-bestdealbg text-base font-medium  text-texthead "
                    onClick={() => toggleDrawer()}
                    to={item?.link}
                  >
                    {item?.name}
                  </Link>{" "}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-t-border ">
            <h2 className="text-lg font-medium text-texthead  items-center justify-between hidden  pb-5 ">
              Categories
            </h2>
            <ul className=" flex  flex-col min-h-[500px] relative overflow-hidden">
              {categories.map((category) => (
                <li
                  className="py-3.5 px-7 cursor-pointer hover:bg-bestdealbg transition-all ease-linear duration-300 flex items-center justify-between "
                  key={category._id}
                  onClick={() => setHandleClick(category._id)}
                >
                  <h4
                    className="text-base font-medium  text-texthead "
                    // onClick={() => toggleDrawer()}
                    // to={`/shop/category/${category?._id}`}
                  >
                    {category?.title}
                  </h4>{" "}
                  <h4>
                    <MdKeyboardArrowRight className="text-xl" />
                  </h4>
                </li>
              ))}
              <li
                className={`absolute ${
                  categoryActive ? "left-0" : "left-full "
                }   transition-all duration-300 ease-in-out top-0 w-full min-h-[500px] bg-white z-20`}
              >
                <div>
                  <div className="">
                    <h4
                      onClick={() => setCategoryActive(false)}
                      className="font-medium py-3.5 px-7 text-base text-texthead flex gap-x-2 items-center cursor-pointer bg-bestdealbg"
                    >
                      <span>
                        <MdKeyboardArrowRight className="text-xl rotate-180" />
                      </span>
                      {data?.title}
                    </h4>
                    <ul className="mt-3">
                      {data?.subCategories?.map((item, index) => {
                        return (
                          <li
                            className="hover:bg-bestdealbg hover:bg-opacity-60 transition-all ease-linear duration-200"
                            key={index}
                          >
                            {" "}
                            <Link
                              onClick={() => {
                                toggleDrawer();
                                setCategoryActive(false);
                              }}
                              className="py-3.5 px-9 inline-block "
                              to={`/shop/subcategory/${item?._id}`}
                            >
                              {item?.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className=" border-t flex justify-center border-t-border">
            <ul className="flex items-center gap-x-5 py-7 ">
              {socialList.map((item, index) => {
                const Icon = item?.logo;
                return (
                  <li key={index}>
                    <Link
                      className="flex items-center justify-center w-10 h-10 border border-border rounded-md hover:bg-danger text-texthead transition-all ease-linear duration-200 hover:text-white"
                      to={item?.link}
                    >
                      <Icon />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Drawer>
      <Drawer
        open={isOpenCart}
        onClose={toggleDrawer1}
        direction="right"
        className="bla bla bla"
        size={600}
      >
        <div className="font-inter max-h-screen">
          <div className="flex justify-between items-center py-6 px-10 border-b border-b-border">
            <div className="flex items-center gap-x-5 ">
              <HiOutlineShoppingBag className="text-2xl" />
              <h3 className="text-base font-medium">
                Your shopping bag ({cartItems.length})
              </h3>
            </div>
            <div
              onClick={() => {
                toggleDrawer1();
              }}
              className="flex gap-x-2 items-center cursor-pointer group "
            >
              <h3 className="text-gray-600 group-hover:text-danger transition-all ease-linear duration-200 font-medium text-base">
                Close
              </h3>
              <IoClose className="text-gray-700 text-2xl group-hover:text-danger transition-all ease-linear duration-200 " />
            </div>
          </div>
          <div className="h-[460px] overflow-y-scroll">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="px-7 py-5 flex justify-between border-b border-b-border"
                    >
                      <div className=" flex gap-x-5">
                        <div className="w-[100px]  relative">
                          <Link
                            to={`/productdetail/${item._id}`}
                            onClick={() => toggleDrawer1()}
                            className="w-full h-full"
                          >
                            {item && item.photos && item.photos.length > 0 ? (
                              <img
                                className="w-full h-full object-cover"
                                src={item.photos[0]}
                                alt={item?.name}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <p>No Image Available</p>
                              </div>
                            )}
                          </Link>
                          {item?.selectedOption?.discountValue > 0 && (
                            <p className="text-xs cursor-pointer absolute right-2 -top-0.5 mt-2 px-2 text-white rounded-md py-0.5 bg-danger inline-block">
                              {item?.selectedOption?.discountType ==
                              "amount" ? (
                                <span className="flex font-bold items-center gap-x-0.5">
                                  ৳ {item?.selectedOption?.discountValue}
                                </span>
                              ) : (
                                <span className="flex font-bold items-center gap-x-0.5">
                                  {item?.selectedOption?.discountValue}{" "}
                                  <PiPercentBold />
                                </span>
                              )}
                            </p>
                          )}
                        </div>

                        <div>
                          <h4
                            onClick={() => {
                              toggleDrawer1();
                              navigate(`/shop/brand/${item?.brand?._id}`);
                            }}
                            className="text-xs uppercase  cursor-pointer"
                          >
                            {item?.brand?.title}
                          </h4>

                          <Link
                            to={`/productdetail/${item?._id}`}
                            onClick={() => toggleDrawer1()}
                            className="text-sm font-medium cursor-pointer hover:text-danger transition-all ease-linear duration-200"
                          >
                            {item?.name}
                          </Link>
                          {item?.selectedColor ? (
                            <div className="text-sm  font-normal capitalize flex items-center gap-x-3">
                              <div className="flex items-center gap-x-0.5">
                                <div className="mr-1 text-xs">Color:</div>
                                <div
                                  style={{
                                    backgroundColor:
                                      item?.selectedColor?.colorCode,
                                  }}
                                  className="w-3 h-3 rounded-full"
                                ></div>
                              </div>
                              <div className="flex items-center gap-x-0.5">
                                <div className="text-xs">Size:</div>
                                <div className="px-1 py-0.5 rounded-sm text-xs text-texthead ">
                                  {" "}
                                  {item?.selectedOption?.size}
                                </div>
                              </div>
                           
                            </div>
                          ) : (
                            <p className="text-sm mt-3 font-normal ">
                              <Link
                                onClick={() => {
                                  toggleDrawer1();
                                }}
                                to={`/shop/category/${item?.category?._id}`}
                              >
                                {item?.category?.title}
                              </Link>
                            </p>
                          )}
                          <p className=" mt-2 flex items-center gap-x-1 text-xs">
                            {item?.quantity} ×{" "}
                            {item?.selectedOption?.discountValue > 0 ? (
                              <span className="flex items-center gap-x-2 text-xs text-texthead">
                                <span className="flex items-center gap-x-0.5">
                                  {" "}
                                  ৳ {Math.ceil(item?.selectedOption?.salePrice)}
                                </span>
                                <del className="flex items-center gap-x-0.5">
                                  {" "}
                                  {item?.selectedOption?.price.toFixed(0)}
                                </del>
                              </span>
                            ) : (
                              <span className="flex items-center gap-x-0.5 text-xs text-texthead">
                                ৳ {item?.selectedOption?.price.toFixed(0)}
                              </span>
                            )}
                          </p>
                          <p className="text-xs mt-3 px-1 py-0.5 rounded-md bg-gray-300 text-texthead font-medium inline-block  ">
                            <span className="flex items-center gap-x-1">
                              <span className="mr-1"> ৳</span>
                              {item?.selectedOption?.discountValue > 0
                                ? Math.ceil(item?.selectedOption?.salePrice) *
                                  item?.quantity
                                : item?.selectedOption?.price.toFixed(0) *
                                  item?.quantity}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="">
                        <IoClose
                          className="text-gray-700 text-2xl mt-2 group-hover:text-danger transition-all ease-linear duration-200 cursor-pointer"
                          onClick={() =>
                            dispatch(
                              deleteFromCart({
                                id: item._id,
                                colorOptionId: item?.selectedOption?._id,
                                selectedSize: item?.selectedSize, 
                              })
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="px-10 py-7  text-center">
                <h2 className="text-9xl mt-10 flex justify-center">
                  <HiOutlineShoppingBag />
                </h2>
                <h2 className="text-3xl mt-10">Your cart is empty</h2>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-y-5 px-10 py-7">
            {cartItems.length > 0 ? (
              <>
                <div className="flex justify-between px-10">
                  <h3 className="text-base font-medium">Subtotal</h3>
                  <h3 className="text-base text-green-600 font-medium flex items-center gap-x-1">
                    ৳ {calculateSubtotal()}
                  </h3>
                </div>
                <Link
                  onClick={toggleDrawer1}
                  className="text-base text-center rounded-sm font-medium text-texthead w-full py-5 border border-texthead hover:bg-texthead transition-all ease-linear duration-150 hover:text-white"
                  to={"/cart"}
                >
                  View Cart
                </Link>
                <Link
                  onClick={toggleDrawer1}
                  className="text-base text-center rounded-sm font-medium hover:text-texthead w-full py-5 border border-texthead bg-texthead hover:bg-white text-white transition-all ease-linear duration-150"
                  to={"/checkout"}
                >
                  Checkout
                </Link>
              </>
            ) : (
              <Link
                onClick={toggleDrawer1}
                className="text-base text-center rounded-sm font-medium text-texthead w-full py-5 border border-texthead hover:bg-texthead transition-all ease-linear duration-150 hover:text-white flex gap-x-2 justify-center items-center"
                to={"/shop"}
              >
                <div className="flex items-center gap-x-2">
                  <TiArrowBackOutline className="text-xl" />
                  Back to Shop
                </div>
              </Link>
            )}
          </div>
        </div>
      </Drawer>
      <nav className="mx-auto font-inter shadow-sm bg-[#F7F7F7] md:px-0 px-4">
      
          <Containar className="">
              <div className="border-b ">
            <div className="mx-auto">
              <div className="flex py-5 flex-wrap justify-between items-center">
            <div
                  onClick={toggleDrawer}
                  className=" group md:hidden flex items-center gap-x-2 bg-danger text-white px-2 lg:px-5 py-2 rounded cursor-pointer"
                >
                  <HiOutlineMenuAlt1 className="text-xl lg:text-3xl group-hover:scale-110 duration-200" />
                  <span className="text-sm lg:text-base">Categories</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
            
                  <Search />

                 
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  <Link to="/" className="flex items-center">
                    <img src={logo} alt="" className="w-24 lg:w-40" />
                  </Link>
                </div>
<div className="flex gap-x-4">



                <a
                    href="tel:+8801810688090"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-red-500 font-medium"
                  >
                    <IoCallOutline size={25}/>
                  </a>

              
                  <Link
                    to={"/checkout"}
                    className="flex items-center hover:text-red-500 duration-200 group"
                  >
                    
                    <FiShoppingBag size={24} className="text-lg cursor-pointer group-hover:scale-110 duration-200" />
                    <span className="ml-1">({totalQuantity})</span>
                  </Link>

               </div>
              </div>
              <div>

              </div>
            </div> 
            </div>    
{/* i Need to here category and subcategory  hover dropdown effect with icon and smooth transition */}
            {/* i Need to here category and subcategory hover dropdown effect with icon and smooth transition */}
            

            




          </Containar>
          <div className="hidden bg-danger md:flex gap-x-8 justify-center items-center py-3 relative ">
  <Link to={"/"} className="uppercase cursor-pointer text-white hover:text-white transition-colors duration-200">Home</Link>
  {categories.slice(0, 6).map((category) => (
    <div key={category._id} className="group relative">
      <div className="flex items-center gap-x-1 cursor-pointer text-white hover:text-white transition-colors duration-200">
         <Link
              key={category._id}
              to={`/shop/category/${category._id}`}
              
            >
        <span className="font-medium uppercase text-sm">{category.title}</span></Link>
        {category.subCategories?.length > 0 && (
          <MdKeyboardArrowRight className="text-lg transform group-hover:rotate-90 transition-transform duration-200" />
        )}
      </div>
      
      {/* Subcategory Dropdown */}
      
      {category.subCategories?.length > 0 && (
        <div className="absolute uppercase left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          {category.subCategories.map((subcategory) => (
            <Link
              key={subcategory._id}
              to={`/shop/subcategory/${subcategory._id}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-danger transition-colors duration-200 flex items-center"
            >
              <MdKeyboardArrowRight className="mr-2 text-sm opacity-70" />
              {subcategory.slug}
              {console.log(subcategory)}
            </Link>
          ))}
        </div>
      )}
    </div>
  ))}
</div> 
      </nav>
    </>
  );
};

export default Navbar;
