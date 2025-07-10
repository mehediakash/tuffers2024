import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ApiContext from "../baseapi/BaseApi";
import { useParams } from "react-router-dom";
import ProductItem from "../productitem/ProductItem";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { resetColor } from "../../redux/slices/colorSlice";
import SkeletonLoader from "../skeletonLoader/SkeletonLoader";

const CategoryShop = () => {
  const baseApi = useContext(ApiContext);
  const { categoryId } = useParams(); // Get the category ID from route parameters
  const dispatch = useDispatch();
  const [allCategoryShop, setAllCategoryShop] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 20; // Number of products per page
  const { minPrice, maxPrice } = useSelector((state) => state.priceRange);
  const selectedSortOption = useSelector(
    (state) => state.sort.selectedSortOption
  );
  const selectedColor = useSelector((state) => state.colors.selectedColor);

  // Determine the sort parameter based on the selected sort option
  const getSortParameter = () => {
    switch (selectedSortOption) {
      case "popularity":
        return "-visitCount";
      case "low-to-high":
        return "price";
      case "discount":
        return "-discount";
      case "discount-percent":
        return "-discountPercent";
      case "high-to-low":
        return "-price";
      case "latest":
      default:
        return null;
    }
  };

  // Fetch products from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sortParam = getSortParameter();
        const params = {
          "price[lt]": maxPrice,
          "price[gt]": minPrice,
          ...(sortParam && { sort: sortParam }),
        };

        const response = await axios.get(
          `${baseApi}/category/${categoryId}/options`,
          { params }
        );
        let fetchedProducts = response.data.data.options;

        // Remove duplicates based on product ID
      const uniqueProducts = [];
      const seenProductIds = new Set();
      fetchedProducts.forEach((item) => {
        if (!seenProductIds.has(item.product._id)) {
          seenProductIds.add(item.product._id);
          uniqueProducts.push(item);
        }
      });

      // Collect all sizes for each product
      const productsWithSizes = uniqueProducts.map((product) => {
        const sizes = product.variant?.sizes || [];
        return {
          ...product,
          sizes, // Add sizes to the product object if needed
        };
      });

        // Filter products by selected color
        const filteredProducts = selectedColor
        ? productsWithSizes.filter(
            (product) =>
              product.variant?.colorName.toLowerCase() === selectedColor.toLowerCase()
          )
        : productsWithSizes;




        setAllCategoryShop(filteredProducts.reverse());
        setTotalPages(Math.ceil(response.data.results / productsPerPage)); // Assuming the API provides total products
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    baseApi,
    categoryId,
    minPrice,
    maxPrice,
    selectedSortOption,
    selectedColor,
    currentPage,
  ]);

  useEffect(() => {
    dispatch(resetColor());
  }, [categoryId, dispatch]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const paginatedProducts = allCategoryShop.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (error) return <div>{error}</div>; // Show error message

  return (
    <div>
      <div className="grid grid-cols-2 gap-y-4 xl:gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <SkeletonLoader/>
        ) : paginatedProducts.length === 0 ? (
          <div>No products available.</div>
        ) : (
          paginatedProducts.map((item) => (
            <ProductItem
              key={item?._id}
              product={item}
              image={item?.product?.photos}
              id={item?.product?._id}
              subtitle={item?.brand?.title}
              title={item?.product?.name}
              categoryId={item?.category?._id}
              brandId={item?.brand?._id}
              categoryName={item?.category?.title}
              discount={item?.discountValue}
              discountType={item?.discountType}
              discountPercent={item?.discountPercent}
              priceAfterDiscount={item?.salePrice}
              offerprice={item?.price - item?.discount}
              freeShipping={item?.freeShipping}
              regularprice={item?.price}
            />
          ))
        )}
      </div>
      {allCategoryShop.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          getPageNumbers={getPageNumbers}
        />
      )}
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
  result,
}) => {
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-28 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 border rounded-full flex items-center justify-center ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500"
            : "bg-texthead text-white hover:bg-danger"
        } transition-colors`}
      >
        <FaChevronLeft />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-10 h-10 border rounded-full flex items-center justify-center ${
            number === currentPage
              ? "bg-danger text-white"
              : "bg-white text-texthead hover:bg-red-100"
          } transition-colors`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 border rounded-full flex items-center justify-center ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500"
            : "bg-texthead text-white hover:bg-danger"
        } transition-colors`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default CategoryShop;
