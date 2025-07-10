import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg p-4 max-w-xs animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-300 rounded"></div>

      {/* Subtitle Placeholder */}
      <div className="mt-4 w-3/4 h-4 bg-gray-300 rounded"></div>

      {/* Title Placeholder */}
      <div className="mt-2 w-full h-6 bg-gray-300 rounded"></div>

      {/* Price Placeholder */}
      <div className="mt-4 w-1/2 h-6 bg-gray-300 rounded"></div>

      {/* Button Placeholder */}
      <div className="mt-4 flex space-x-2">
        <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
        <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
        <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
