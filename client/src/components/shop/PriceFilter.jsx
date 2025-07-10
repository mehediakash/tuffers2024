import React, { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import * as Slider from "@radix-ui/react-slider";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { setPriceRange } from "../../redux/slices/priceRangeSlice";

const PriceFilter = ({toggleDrawer}) => {
  const [priceActive, setPriceActive] = useState(true);
  const dispatch = useDispatch();
  const priceRange = useSelector((state) => state.priceRange);
  const [sliderValue, setSliderValue] = React.useState([priceRange.minPrice, priceRange.maxPrice]);



  const handleSliderChange = (value) => {
    setSliderValue(value);
  };
  const handleFilterClick = () => {
    // This will trigger the useEffect to fetch filtered and sorted data
    dispatch(setPriceRange(sliderValue));
    // window.scrollTo(0, 0);
  };

  return (
    <div className="Price scroll-smooth">
      <div className="border-x b border-x-border border-b border-b-border">
        <div
          onClick={() => setPriceActive(!priceActive)}
          className="flex justify-between cursor-pointer items-center px-6 py-5"
        >
          <h3 className="text-lg font-medium">Filter by price</h3>
          <h3 className="text-2xl">{priceActive ? <FiMinus /> : <FiPlus />}</h3>
        </div>
        <div
          className={`transition-all duration-500 ease-linear overflow-hidden ${
            priceActive ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-10 mt-1">
            <form>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-7"
                value={sliderValue}
                max={300000}
                min={0}
                step={1}
                onValueChange={handleSliderChange}
                minStepsBetweenThumbs={0}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[5px]">
                  <Slider.Range className="absolute bg-texthead rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-5 h-5 cursor-e-resize bg-texthead shadow-[0_2px_10px] shadow-blackA4 rounded-[10px] focus:outline-none border-[2px] border-white"
                  aria-label="Volume"
                />
                <Slider.Thumb
                  className="block w-5 h-5 cursor-e-resize bg-texthead shadow-[0_2px_10px] shadow-blackA4 rounded-[10px] focus:outline-none border-[2px] border-white"
                  aria-label="Volume"
                />
              </Slider.Root>
            </form>
            <div className="mt-4 flex gap-x-3 items-center">
              <button
                onClick={()=>{
                  handleFilterClick()
                  toggleDrawer()
                } }
                className="px-5 py-1.5 text-white bg-danger"
              >
                <span >Filter</span>
              </button>
              <div>
                <h4 className="text-sm text-texthead flex gap-x-0.5">
                  Price:{" "}
                  <span className="flex items-center pl-0.5">
                    <FaBangladeshiTakaSign />
                    {sliderValue[0]}
                  </span>{" "}
                  -{" "}
                  <span className="flex items-center">
                    <FaBangladeshiTakaSign />
                    {sliderValue[1]}
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
