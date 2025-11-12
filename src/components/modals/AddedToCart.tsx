import React from "react";
import Image from "next/image";
import Button from "../buttons/Button";
import { BiCart, BiChevronDown, BiChevronUp } from "react-icons/bi";
import useAppStore from "@/stores/AppStore";
import { GiCheckMark } from "react-icons/gi";
import usePersistedStore from "@/stores/PersistedStored";

interface Props {
  product: IProduct | null;
  closeModal: () => void;
}

function AddedToCart(props: Props) {
  const cart = usePersistedStore((state) => state.cart);
  const productInCart = cart.find((c) => c.id === props.product?.id);
  const productQuantity = productInCart ? productInCart.quantity ?? 1 : 0;

  return (
    <div className="flex flex-col space-y-10 w-full h-full overflow-y-auto">
      <h1>Added to cart</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Image
            src={props.product?.image ?? ""}
            alt={props.product!.title}
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-xl w-full max-w-[10rem] object-cover aspect-square"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm">{props.product?.title}</span>
            <span className="text-sm">${props.product?.price}</span>
            <div className="flex items-center space-x-4 mt-6 pl-3 border border-border rounded-lg overflow-hidden">
              <span className="text-sm">Quantity: {productQuantity}</span>
              <div className="flex flex-col divide-strokedark divide">
                <BiChevronUp
                  className="hover:bg-primary/20 p-1 w-8 h-6 cursor-pointer"
                  onClick={() =>
                    usePersistedStore.setState((state) => {
                      state.cart = state.cart.map((c) =>
                        c.id === props.product?.id
                          ? { ...c, quantity: (c.quantity ?? 0) + 1 }
                          : c
                      );
                    })
                  }
                />
                <BiChevronDown
                  onClick={() =>
                    usePersistedStore.setState((state) => {
                      state.cart = state.cart.map((c) =>
                        c.id === props.product?.id
                          ? {
                              ...c,
                              quantity: Math.max((c.quantity ?? 1) - 1, 1),
                            }
                          : c
                      );
                    })
                  }
                  className="hover:bg-primary/20 p-1 w-8 h-6 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="border-strokedark" />
        <div className="flex flex-col space-y-2">
          <span>
            There are{" "}
            {cart.reduce((acc, item) => acc + (item.quantity ?? 1), 0)} products
            in your cart
          </span>
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">Total:</span>
            <span className="font-bold text-sm">
              $
              {cart
                .reduce((acc, item) => {
                  const itemCost = item.price * (item.quantity ?? 1);
                  return acc + itemCost;
                }, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-2 mt-6">
          <Button
            className="flex flex-row items-center space-x-2 bg-primary"
            onClick={() => {
              useAppStore.setState((state) => {
                state.showCartConfirmDialog = false;
              });
              props.closeModal();
            }}
          >
            <BiCart />
            <span> Continue Shopping</span>
          </Button>
          <Button
            onClick={() => {
              props.closeModal();
              useAppStore.setState((state) => {
                state.showSideBar = {
                  value: "cart",
                  open: true,
                };
              });
            }}
            className="flex flex-row items-center space-x-2 bg-secondary"
          >
            <GiCheckMark />
            <span>Checkout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddedToCart;
