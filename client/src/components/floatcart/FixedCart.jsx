import React from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FixedCart = () => {
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate total items and total price
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      (item?.selectedOption?.discountValue > 0
        ? item?.selectedOption?.salePrice
        : item?.selectedOption?.price) *
        item.quantity,
    0
  );

  return (
    <div className="fixed font-inter cursor-pointer bg-bestdealbg border border-danger rounded-md right-6 top-[60%] text-texthead -translate-y-1/2 z-50 shadow-lg">
      <Link
        to={"/checkout"}
        className="flex flex-col rounded-md justify-center px-2"
      >
        <h2 className="text-xl text-center flex justify-center pt-2">
          <HiOutlineShoppingBag />
        </h2>
        <h4 className="text-sm font-inter text-center">{totalItems}</h4>
        <h4 className="text-xs font-inter text-center uppercase">items</h4>
      </Link>
      <h4 className="flex items-center rounded-b-md mt-0.5 w-full text-white gap-x-0.5 justify-center px-4 py-0.5 bg-danger">
        ৳ <span className="text-xs ml-1">{totalPrice.toFixed(0)}</span>
      </h4>
    </div>
  );
};

export default FixedCart;
