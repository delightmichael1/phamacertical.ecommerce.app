import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { useModal } from "./modals/Modal";
import QuickView from "./modals/QuickView";
import { FaRegHeart } from "react-icons/fa";
import useAppStore from "@/stores/AppStore";
import FlyingToCart from "./ui/FlyingToCart";
import AddedToCart from "./modals/AddedToCart";
import { VscHeartFilled } from "react-icons/vsc";
import { HiOutlineShoppingBag } from "react-icons/hi";

type Props = {
  id: string;
  width?: number;
  product: IProduct;
  isSupplier?: boolean;
};

const Product: React.FC<Props> = (props) => {
  const { openModal, closeModal } = useModal();
  const wishList = useAppStore((state) => state.wishList);
  const [showFlyingToCart, setShowFlyingToCart] = useState(false);

  const handleAddToCart = () => {
    setShowFlyingToCart(true);
    useAppStore.setState((state) => {
      if (state.cart.find((item) => item.id === props.product.id)) {
        state.cart.map((item) => {
          if (item.id === props.product.id) {
            if (!item.quantity) {
              item.quantity = 1;
            } else {
              item.quantity += 1;
            }
          }
        });
      } else {
        state.cart.push({ ...props.product, quantity: 1 });
      }
    });
    setTimeout(() => {
      const show = useAppStore.getState().showCartConfirmDialog;
      setShowFlyingToCart(false);
      if (show)
        openModal(
          <AddedToCart closeModal={closeModal} product={props.product} />
        );
    }, 1000);
  };

  return (
    <motion.div
      key={`${props.product.id}`}
      className="group flex-shrink-0 bg-white shadow-sm hover:shadow-black/30 hover:shadow-md p-4 rounded-lg w-full transition-shadow duration-300"
      style={
        props.width
          ? {
              width: `${props.width}px`,
              minWidth: `${props.width}px`,
            }
          : {}
      }
      transition={{ duration: 0.3 }}
    >
      <div className="relative bg-gray-200 rounded-lg w-full h-64 overflow-hidden">
        <Image
          src={props.product.image}
          alt={props.product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          priority={true}
        />
        <div className="top-2 right-2 absolute flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {!props.isSupplier && (
            <div
              className="flex justify-center items-center bg-white hover:bg-gray-100 shadow-md p-2.5 rounded-full w-10 h-10 text-primary transition cursor-pointer"
              title="Wishlist"
              onClick={() => {
                useAppStore.setState((state) => {
                  if (
                    state.wishList.find((item) => item.id === props.product.id)
                  ) {
                    state.wishList = state.wishList.filter(
                      (prd) => prd.id !== props.product.id
                    );
                  } else {
                    state.wishList.push({ ...props.product, quantity: 1 });
                  }
                });
              }}
            >
              {wishList.some((prd) => prd.id === props.product.id) ? (
                <VscHeartFilled className="w-full h-full text-red-500" />
              ) : (
                <FaRegHeart className="w-full h-full" />
              )}
            </div>
          )}
          <button
            className="flex justify-center items-center bg-white hover:bg-gray-100 shadow-md p-2.5 rounded-full w-10 h-10 text-primary transition cursor-pointer"
            title="Quick view"
            onClick={() =>
              openModal(
                <QuickView
                  product={props.product}
                  onCloseDialog={closeModal}
                  isSupplier={props.isSupplier}
                />
              )
            }
          >
            <FiSearch className="w-full h-full" />
          </button>
        </div>
      </div>
      <p className="mt-4 text-gray-500 text-xs truncate">
        From {props.product.company}
      </p>
      <h3 className="font-semibold text-lg truncate">{props.product.name}</h3>
      <p className="text-gray-500 text-sm truncate">{props.product.category}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold text-primary">
          ${props.product.newPrice.toFixed(2)}
        </span>
      </div>
      {!props.isSupplier && (
        <button
          id={"addToCart" + props.id}
          onClick={handleAddToCart}
          className="flex items-center space-x-2 hover:bg-primary mt-3 pr-8 rounded-full w-fit text-primary hover:text-white transition-colors duration-300 cursor-pointer"
        >
          <HiOutlineShoppingBag className="bg-primary p-2 rounded-full w-10 h-10 text-white" />
          <span className="font-medium text-sm">Add to Cart</span>
        </button>
      )}
      {!props.isSupplier && showFlyingToCart && (
        <FlyingToCart
          productImage={props.product.image}
          buttonId={"addToCart" + props.id}
        />
      )}
    </motion.div>
  );
};

export default Product;
