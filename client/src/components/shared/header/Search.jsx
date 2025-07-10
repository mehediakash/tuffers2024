import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ApiContext from "../../baseapi/BaseApi";
import { FiSearch } from "react-icons/fi";
const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showList, setShowList] = useState(false); // State to control visibility of the list
  const baseApi = useContext(ApiContext);
  const searchRef = useRef(); // Create a ref for the entire search input and list container

  // Function to fetch products from the API
  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseApi}/search`, {
        params: { query },
      });

      // Ensure the data structure is as expected
      const variants = response.data?.data?.products || [];
      setProducts(variants);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Ensure products is always an array
      setLoading(false);
    }
  };

  // Fetch products when the search query changes
  useEffect(() => {
    if (search.length > 0) {
      fetchProducts(search);
      setShowList(true); // Show the product list when search is active
    } else {
      setProducts([]);
      setShowList(false); // Hide the product list when search is empty
    }
  }, [search]);

  // Filter products based on the search query and price condition
  useEffect(() => {
    setFilteredProducts(
      products
        .filter(
          (product) => product?.variants[0]?.options[0]?.price > 0 // Ensure price > 0
        )
        .filter((product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase())
        )
    );
  }, [products, search]);

  // Function to handle product click
  const handleProductClick = () => {
    setSearch(""); // Clear the search input
    setShowList(false); // Hide the list after clicking a product
  };

  // Handle clicks outside of the search input and product list
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowList(false); // Hide the list if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative lg:inline-block hidden ">
      <input
        placeholder="Search products..."
        className="px-4 py-2 outline-none w-full text-sm text-gray-600"
        // className="w-[300px] lg:w-[350px] xl:w-[480px] bg-inputbg hover:border-texthead transition-all ease-linear duration-200 px-14 py-2.5 border outline-none border-border"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* <CiSearch className="text-xl absolute left-4 top-1/2 -translate-y-1/2" /> */}
      <button className="bg-danger text-white px-4 py-2 absolute right-0 top-1/2 -translate-y-1/2">
        <FiSearch />
      </button>
      {search && showList && (
        <ul className="absolute w-full z-20 bg-white border border-border mt-2 max-h-60 overflow-y-auto">
          {filteredProducts.length > 0
            ? filteredProducts.map((product, index) => (
                <li
                  key={index}
                  className={`px-4 py-4 ${
                    filteredProducts.length === index + 1
                      ? "border-none"
                      : "border-b border-b-border"
                  } hover:bg-gray-200 cursor-pointer`}
                  onClick={handleProductClick}
                >
                  <Link
                    className="flex items-center gap-x-2.5"
                    to={`/productdetail/${product._id}`}
                  >
                    <div className="w-10 h-10">
                      <img
                        className="w-full h-full object-contain"
                        src={product?.photos[0]}
                        alt={product?.title}
                      />
                    </div>
                    <div>
                      {/* <h3 className="text-sm">{product?.name}</h3> */}
                      <h3 className="text-sm">
                        {" "}
                        {product?.name?.length > 20
                          ? `${product.name.substring(0, 20)}...`
                          : product.name}
                      </h3>
                      <p className="flex items-center gap-x-1 mt-0.5 text-red-500">
                        <span className="text-sm">৳</span>
                        <span className="text-xs">
                          {product?.variants[0]?.options[0]?.price}
                        </span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            : !loading && <li className="px-4 py-2">No products found</li>}
        </ul>
      )}
    </div>
  );
};

export default Search;
