import cn from "@/utils/cn";
import Image from "next/image";
import { toast } from "../toast/toast";
import { BsList } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { BiGridAlt } from "react-icons/bi";
import { useAxios } from "@/hooks/useAxios";
import { CardSkeleton } from "../ui/Shimmer";
import SearchInput from "../input/SearchInput";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import usePersistedStore from "@/stores/PersistedStored";
import { HiOutlineShoppingBag, HiShoppingBag } from "react-icons/hi";
import Pagination from "../Pagination";

interface ProductListingProps {
  page?: number;
  products: IProduct[];
  searchQuery?: string;
  isLoading?: boolean;
  type: "products" | "hotdeals";
}

type ViewMode = "grid" | "list";
type SortOption = "relevance" | "price-low" | "price-high" | "name";

const ProductListing: React.FC<ProductListingProps> = ({
  products,
  page,
  searchQuery = "",
  isLoading = false,
  type = "products",
}) => {
  const { secureAxios } = useAxios();
  const { cart, wishList } = usePersistedStore();
  const [pageNumber, setPageNumber] = useState(page ?? 1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [searchFilter, setSearchFilter] = useState<string>(searchQuery);
  const [isFetchingProducts, setIsFetchingProducts] = useState(isLoading);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchProducts, setSearchproducts] = useState<IProduct[]>(products);

  useEffect(() => {
    if (type === "hotdeals") getHotDeals();
  }, [pageNumber]);

  const getHotDeals = async () => {
    setIsFetchingProducts(true);
    await secureAxios
      .get(`/shop/hotdeals?page=${pageNumber}&limit=10`)
      .then((res) => {
        if (res.data.products) {
          setSearchproducts(res.data.products);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsFetchingProducts(false);
      });
  };

  const onSearch = async () => {
    setIsFetchingProducts(true);
    await secureAxios
      .get("/shop/products?search=" + searchFilter)
      .then((res) => {
        if (res.data.products) {
          setSearchproducts(res.data.products);
        } else {
          setSearchproducts([]);
        }
      })
      .catch((err) => {
        toast({
          description: err.response?.data?.message || err.message,
          variant: "error",
        });
      })
      .finally(() => setIsFetchingProducts(false));
  };

  const categories = [
    "all",
    ...Array.from(new Set(searchProducts.map((p) => p.category))),
  ];

  const filteredProducts = searchProducts.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    return !product.isDeleted;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const isInWishlist = (productId: string) => {
    return wishList.some((item) => item.id === productId);
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: IProduct) => {
    usePersistedStore.setState((state) => {
      const exists = state.wishList.find((item) => item.id === product.id);
      if (exists) {
        state.wishList = state.wishList.filter(
          (item) => item.id !== product.id
        );
      } else {
        state.wishList.push({ ...product, quantity: 1 });
      }
    });
  };

  const addToCart = (product: IProduct) => {
    usePersistedStore.setState((state) => {
      const exists = state.cart.find((item) => item.id === product.id);
      if (exists) {
        exists.quantity = (exists.quantity || 0) + 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4 mx-auto px-4 py-8 w-[40rem] md:w-[48rem] lg:w-[64rem] 2xl:w-[96rem] xl:w-[80rem] h-[90vh] overflow-y-hidden">
      <div className="flex flex-col space-y-4">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-gray-900 text-3xl">
            {type === "hotdeals"
              ? "Hot Deals"
              : searchFilter
              ? `Search Results for "${searchFilter}"`
              : "Products"}
          </h1>
          <p className="text-gray-600">
            {sortedProducts.length}{" "}
            {sortedProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>
        {type === "products" && (
          <SearchInput
            onClick={onSearch}
            value={searchFilter}
            className="text-black"
            isLoading={isFetchingProducts}
            onChange={setSearchFilter}
            classNames={{
              container: "bg-gray-100 shadow-md mb-6",
              overlay: "bg-gray-100",
            }}
          />
        )}

        <div className="bg-white shadow-sm mb-6 p-4 rounded-lg">
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <MdOutlineFilterList className="w-5 h-5 text-gray-600" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full font-medium text-sm transition-all duration-200",
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <BiGridAlt className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <BsList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 w-full text-center">
          <div className="mb-4 text-6xl">
            <IoSearch />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 text-2xl">
            No products found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No results for "${searchQuery}". Try adjusting your search.`
              : "Try changing your filters to see more products."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full overflow-y-auto"
                : "flex flex-col gap-4 h-full overflow-y-auto"
            )}
          >
            {isFetchingProducts
              ? [...Array(8)].map((_, i) => (
                  <CardSkeleton key={i} className="min-w-72" />
                ))
              : sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    {viewMode === "grid" ? (
                      <ProductCardGrid
                        product={product}
                        isInWishlist={isInWishlist(product.id)}
                        isInCart={isInCart(product.id)}
                        onToggleWishlist={() => toggleWishlist(product)}
                        onAddToCart={() => addToCart(product)}
                      />
                    ) : (
                      <ProductCardList
                        product={product}
                        isInWishlist={isInWishlist(product.id)}
                        isInCart={isInCart(product.id)}
                        onToggleWishlist={() => toggleWishlist(product)}
                        onAddToCart={() => addToCart(product)}
                      />
                    )}
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>
      )}
      <Pagination
        className="min-h-12"
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        contentsLength={searchProducts.length}
      />
    </div>
  );
};

// Grid View Card Component
const ProductCardGrid: React.FC<{
  product: IProduct;
  isInWishlist: boolean;
  isInCart: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}> = ({ product, isInWishlist, isInCart, onToggleWishlist, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-white shadow-md hover:shadow-xl rounded-lg min-w-72 overflow-hidden transition-all duration-300">
      {/* Image Section */}
      <div className="relative bg-gray-100 h-64 overflow-hidden">
        <Image
          src={imageError ? "/placeholder-product.png" : product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />

        {/* Wishlist Button */}
        <button
          onClick={onToggleWishlist}
          className="top-3 right-3 absolute bg-white shadow-md hover:shadow-lg p-2 rounded-full transition-all duration-200"
        >
          {isInWishlist ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          )}
        </button>

        {/* Category Badge */}
        <div className="bottom-3 left-3 absolute bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-gray-700 text-xs">
          {product.category}
        </div>

        {/* Low Stock Warning */}
        {product.quantity < 10 && product.quantity > 0 && (
          <div className="top-3 left-3 absolute bg-orange-500 px-3 py-1 rounded-full font-medium text-white text-xs">
            Only {product.quantity} left
          </div>
        )}

        {product.quantity === 0 && (
          <div className="top-3 left-3 absolute bg-red-500 px-3 py-1 rounded-full font-medium text-white text-xs">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-gray-900 hover:text-primary text-lg line-clamp-2 transition-colors">
          {product.title}
        </h3>

        <p className="mb-2 text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="mb-3 text-gray-500 text-xs">
          by {product.supplier.name}
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-primary text-2xl">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={product.quantity === 0}
          className={cn(
            "flex justify-center items-center gap-2 py-3 rounded-lg w-full font-semibold text-sm transition-all duration-200",
            product.quantity === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isInCart
              ? "bg-accent text-white hover:bg-accent/90"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isInCart ? (
            <>
              <HiShoppingBag className="w-5 h-5" />
              In Cart
            </>
          ) : (
            <>
              <HiOutlineShoppingBag className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// List View Card Component
const ProductCardList: React.FC<{
  product: IProduct;
  isInWishlist: boolean;
  isInCart: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}> = ({ product, isInWishlist, isInCart, onToggleWishlist, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex md:flex-row flex-col bg-white shadow-md hover:shadow-lg p-4 rounded-lg lg:min-w-2xl overflow-hidden transition-all duration-300">
      {/* Image Section */}
      <div className="relative flex-shrink-0 bg-gray-100 rounded-lg w-full md:w-48 h-48 overflow-hidden">
        <Image
          src={imageError ? "/placeholder-product.png" : product.image}
          alt={product.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />

        {/* Stock Badges */}
        {product.quantity < 10 && product.quantity > 0 && (
          <div className="top-2 left-2 absolute bg-orange-500 px-2 py-1 rounded-full font-medium text-white text-xs">
            Only {product.quantity} left
          </div>
        )}

        {product.quantity === 0 && (
          <div className="top-2 left-2 absolute bg-red-500 px-2 py-1 rounded-full font-medium text-white text-xs">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 justify-between mt-4 md:mt-0 md:ml-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 hover:text-primary text-xl transition-colors">
                {product.title}
              </h3>
              <span className="inline-block bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700 text-xs">
                {product.category}
              </span>
            </div>

            <button
              onClick={onToggleWishlist}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              {isInWishlist ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          <p className="mb-2 text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>

          <div className="text-gray-500 text-sm">
            Supplier: {product.supplier.name}
          </div>
        </div>

        {/* Price and Action Section */}
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mt-4">
          <span className="font-bold text-primary text-3xl">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={onAddToCart}
            disabled={product.quantity === 0}
            className={cn(
              "flex justify-center items-center gap-2 px-8 py-3 rounded-lg w-full md:w-auto font-semibold transition-all duration-200",
              product.quantity === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isInCart
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {isInCart ? (
              <>
                <HiShoppingBag className="w-5 h-5" />
                In Cart
              </>
            ) : (
              <>
                <HiOutlineShoppingBag className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
