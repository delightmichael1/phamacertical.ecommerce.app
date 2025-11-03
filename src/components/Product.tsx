import Image from "next/image";
import { useState } from "react";
import StopAd from "./modals/StopAd";
import { motion } from "framer-motion";
import UpdateAd from "./modals/UpdateAd";
import { useModal } from "./modals/Modal";
import QuickView from "./modals/QuickView";
import { FaRegHeart } from "react-icons/fa";
import useAppStore from "@/stores/AppStore";
import FlyingToCart from "./ui/FlyingToCart";
import AddedToCart from "./modals/AddedToCart";
import { LiaBuysellads } from "react-icons/lia";
import { VscHeartFilled } from "react-icons/vsc";
import { BsStop, BsTrash3 } from "react-icons/bs";
import { FiEdit2, FiSearch } from "react-icons/fi";
import UpdateProduct from "./modals/UpdateProduct";
import DeleteProduct from "./modals/DeleteProduct";
import { HiOutlineShoppingBag } from "react-icons/hi";
import usePersistedStore from "@/stores/PersistedStored";

type Props = {
  id: string;
  width?: number;
  product: IProduct;
  isOrder?: boolean;
  isSupplier?: boolean;
  classNames?: {
    base?: string;
    image?: string;
    title?: string;
    price?: string;
    quantity?: string;
    button?: string;
  };
  isAd?: boolean;
  isSelected?: boolean;
  onAdButtonClick?: (value: string) => void;
};

const Product: React.FC<Props> = (props) => {
  const { openModal, closeModal } = useModal();
  const wishList = usePersistedStore((state) => state.wishList);
  const [showFlyingToCart, setShowFlyingToCart] = useState(false);

  const handleAddToCart = () => {
    setShowFlyingToCart(true);
    usePersistedStore.setState((state) => {
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
      className="group flex-shrink-0 bg-white p-4 rounded-lg w-full transition-shadow duration-300"
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
      <div className="relative bg-gray-200 rounded-lg w-full aspect-square overflow-hidden">
        <Image
          src={props.product.image}
          alt={props.product.title}
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
                usePersistedStore.setState((state) => {
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
          {props.isSupplier && !props.isOrder && (
            <button
              className="flex justify-center items-center bg-white hover:bg-gray-100 shadow-md p-2.5 rounded-full w-10 h-10 text-primary transition cursor-pointer"
              title="Edit"
              onClick={() =>
                openModal(
                  props.isAd ? (
                    <UpdateAd
                      selectedProduct={props.product}
                      closeModal={closeModal}
                    />
                  ) : (
                    <UpdateProduct
                      selectedProduct={props.product}
                      closeModal={closeModal}
                    />
                  )
                )
              }
            >
              <FiEdit2 className="w-full h-full" />
            </button>
          )}
          {props.isSupplier && !props.isAd && !props.isOrder && (
            <button
              className="flex justify-center items-center bg-white hover:bg-gray-100 shadow-md p-2.5 rounded-full w-10 h-10 text-primary transition cursor-pointer"
              title="Delete"
              onClick={() =>
                openModal(
                  <DeleteProduct
                    product={props.product}
                    closeModal={closeModal}
                  />
                )
              }
            >
              <BsTrash3 className="w-full h-full" />
            </button>
          )}
          {props.isSupplier && props.isAd && !props.isOrder && (
            <button
              className="flex justify-center items-center bg-white hover:bg-gray-100 shadow-md p-2.5 rounded-full w-10 h-10 text-primary transition cursor-pointer"
              title="Stop ad"
              onClick={() =>
                openModal(
                  <StopAd product={props.product} closeModal={closeModal} />
                )
              }
            >
              <BsStop className="w-full h-full" />
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 text-gray-500 text-xs truncate">
        From {props.product.supplier.name}
      </p>
      <h3 className="font-semibold text-lg truncate">{props.product.title}</h3>
      <p className="text-gray-500 text-sm truncate">{props.product.category}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold text-primary">
          ${props.product.price.toFixed(2)}
        </span>
      </div>
      {props.isOrder && (
        <div className="pt-5">
          <span className="bg-primary mt-10 px-4 py-1 rounded-full font-bold text-white text-sm">
            Quantity: {props.product.quantity}
          </span>
        </div>
      )}
      {props.isAd && (
        <div className="pt-5">
          <span
            className={`${
              props.product.status === "active" ? "bg-green-500" : "bg-red-500"
            } mt-10 px-4 py-1 rounded-full font-bold text-white text-sm`}
          >
            {props.product.status}
          </span>
        </div>
      )}
      {!props.isSupplier && !props.isOrder && (
        <button
          id={"addToCart" + props.id}
          onClick={handleAddToCart}
          className="flex items-center space-x-2 hover:bg-primary mt-3 pr-8 rounded-full w-fit text-primary hover:text-white transition-colors duration-300 cursor-pointer"
        >
          <HiOutlineShoppingBag className="bg-primary p-2 rounded-full w-8 h-8 text-white" />
          <span className="font-medium text-sm">Add to Cart</span>
        </button>
      )}
      {props.isSupplier && !props.isOrder && !props.isAd && (
        <button
          onClick={() =>
            props.onAdButtonClick && props.onAdButtonClick(props.product.id)
          }
          className="flex items-center space-x-2 hover:bg-primary mt-3 pr-8 rounded-full w-fit text-primary hover:text-white transition-colors duration-300 cursor-pointer"
        >
          <LiaBuysellads className="bg-primary p-2 rounded-full w-8 h-8 text-white" />
          <span className="font-medium text-sm">
            {props.isSelected ? "Remove from" : "Add to"} Ads
          </span>
        </button>
      )}
      {!props.isSupplier && !props.isOrder && showFlyingToCart && (
        <FlyingToCart
          productImage={props.product.image}
          buttonId={"addToCart" + props.id}
        />
      )}
    </motion.div>
  );
};

export default Product;
