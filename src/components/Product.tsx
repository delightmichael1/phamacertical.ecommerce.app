import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import useAppStore from "@/stores/AppStore";
import { RiMenu4Fill } from "react-icons/ri";
import FlyingToCart from "./ui/FlyingToCart";
import { HiOutlineShoppingBag } from "react-icons/hi";
import AddedToCart from "./modals/AddedToCart";
import { useModal } from "./modals/Modal";

type Props = {
  id: string;
  width?: number;
  product: IProduct;
};

const Product: React.FC<Props> = ({ product, width, id }) => {
  const { openModal, closeModal } = useModal();
  const [showFlyingToCart, setShowFlyingToCart] = useState(false);

  const handleAddToCart = () => {
    setShowFlyingToCart(true);
    useAppStore.setState((state) => {
      if (state.cart.find((item) => item.id === product.id)) {
        state.cart.map((item) => {
          if (item.id === product.id) {
            if (!item.quantity) {
              item.quantity = 1;
            } else {
              item.quantity += 1;
            }
          }
        });
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    });
    setTimeout(() => {
      setShowFlyingToCart(false);
      openModal(<AddedToCart closeModal={closeModal} product={product} />);
    }, 1000);
  };

  return (
    <motion.div
      key={`${product.id}`}
      className="rounded-lg group shadow-sm p-4 hover:shadow-md w-full hover:shadow-black/30 transition-shadow duration-300 bg-white flex-shrink-0"
      style={
        width
          ? {
              width: `${width}px`,
              minWidth: `${width}px`,
            }
          : {}
      }
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-64 overflow-hidden rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-all"
          priority={true}
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            -{product.discount}%
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="w-10 h-10 p-2.5 text-primary rounded-full bg-white shadow-md cursor-pointer flex items-center justify-center hover:bg-gray-100 transition"
            title="Wishlist"
          >
            <FaRegHeart className="w-full h-full" />
          </div>
          <div
            className="w-10 h-10 p-2.5 text-primary rounded-full bg-white shadow-md cursor-pointer flex items-center justify-center hover:bg-gray-100 transition"
            title="Add to compare"
          >
            <RiMenu4Fill className="w-full h-full" />
          </div>
          <div
            className="w-10 h-10 p-2.5 text-primary rounded-full bg-white shadow-md cursor-pointer flex items-center justify-center hover:bg-gray-100 transition"
            title="Quick view"
          >
            <FiSearch className="w-full h-full" />
          </div>
        </div>
      </div>
      <h3 className="mt-4 font-semibold text-lg truncate">{product.name}</h3>
      <p className="text-sm text-gray-500 truncate">{product.category}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-gray-400 line-through text-sm">
          ${product.oldPrice.toFixed(2)}
        </span>
        <span className="text-primary font-bold">
          ${product.newPrice.toFixed(2)}
        </span>
      </div>
      <button
        id={"addToCart" + id}
        onClick={handleAddToCart}
        className="mt-3 text-primary hover:text-white rounded-full hover:bg-primary flex space-x-2 items-center duration-300 w-fit pr-8 cursor-pointer transition-colors"
      >
        <HiOutlineShoppingBag className="w-10 h-10 p-2 text-white rounded-full bg-primary" />
        <span className="text-sm font-medium">Add to Cart</span>
      </button>
      {showFlyingToCart && (
        <FlyingToCart
          productImage={product.image}
          buttonId={"addToCart" + id}
        />
      )}
    </motion.div>
  );
};

export default Product;
