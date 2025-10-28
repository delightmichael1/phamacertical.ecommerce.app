import React from "react";
import Card from "./Card";
import Image from "next/image";
import router from "next/router";
import Button from "../buttons/Button";
import useAppStore from "@/stores/AppStore";
import { BiChevronDown, BiChevronUp, BiTrash } from "react-icons/bi";
import usePersistedStore from "@/stores/PersistedStored";

function Cart() {
  const cart = usePersistedStore((state) => state.cart);

  return (
    <div className="flex lg:flex-row flex-col lg:space-x-4 space-y-4 lg:space-y-0 mx-auto container">
      <Card className="p-0 w-3/4">
        <div className="p-4 border-strokedark border-b w-full">
          <h1 className="font-bold text-xl">Shopping Cart</h1>
        </div>
        <div className="flex flex-col space-y-6 p-4 w-full divide">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center w-full"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="rounded-xl w-full max-w-[10rem] object-cover aspect-square"
                />
                <div className="flex flex-col space-y-2">
                  <span className="font-bold text-lg">{item.title}</span>
                  <span className="text-primary text-xl">${item.price}</span>
                  <span className="text-xs">{item.description}</span>
                </div>
              </div>
              <div className="flex items-center space-x-10">
                <div className="flex border border-strokedark rounded-lg overflow-hidden divider divider-strokedark">
                  <input
                    type="number"
                    value={
                      item.quantity?.toString().replace(/[^0-9]/g, "") ?? 1
                    }
                    onChange={(e) => {
                      usePersistedStore.setState((state) => {
                        state.cart.map((item) => {
                          if (item.id === item.id) {
                            item.quantity = Number(e.target.value);
                          }
                        });
                      });
                    }}
                    className="p-2 px-4 outline-none w-16"
                  />
                  <div className="flex flex-col divide-strokedark divide">
                    <BiChevronUp
                      className="hover:bg-primary/20 p-1 w-8 h-6 cursor-pointer"
                      onClick={() =>
                        usePersistedStore.setState((state) => {
                          state.cart.map((cart) => {
                            if (cart.id === item.id) {
                              if (cart.quantity) {
                                cart.quantity += 1;
                              } else {
                                cart.quantity = 1;
                              }
                            }
                          });
                        })
                      }
                    />
                    <BiChevronDown
                      onClick={() =>
                        usePersistedStore.setState((state) => {
                          state.cart.map((cart) => {
                            if (
                              cart.id === item.id &&
                              cart.quantity &&
                              cart.quantity > 1
                            ) {
                              cart.quantity -= 1;
                            }
                          });
                        })
                      }
                      className="hover:bg-primary/20 p-1 w-8 h-6 cursor-pointer"
                    />
                  </div>
                </div>
                <BiTrash
                  className="hover:bg-primary/20 p-1 rounded-full w-8 h-8 hover:text-red-500 duration-300 cursor-pointer"
                  onClick={() =>
                    usePersistedStore.setState((state) => {
                      state.cart = state.cart.filter(
                        (itx) => itx.id !== item.id
                      );
                    })
                  }
                />
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col justify-center items-center space-y-4 px-4 py-10">
              <Image
                src="/svgs/empty-cart.svg"
                alt="empty cart"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-xl w-full max-w-[20rem] object-cover aspect-square"
              />
              <span className="font-bold text-2xl">Your cart is empty</span>
            </div>
          )}
        </div>
      </Card>
      <Card className="p-6 pb-10 w-1/4 h-fit">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Items:</span>
          <span>
            {cart
              .reduce((acc, item) => acc + (item.quantity ?? 1), 0)
              .toFixed(0)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Total (tax excl.):</span>
          <span>
            $
            {cart
              .reduce((acc, item) => {
                const itemCost = item.price * (item.quantity ?? 1);
                return acc + itemCost;
              }, 0)
              .toFixed(2)}
          </span>
        </div>
        <hr className="my-4 border-strokedark" />
        <div className="flex justify-between items-center font-bold">
          <span className="text-gray-500">Total (tax inc.):</span>
          <span>
            $
            {cart
              .reduce((acc, item) => {
                const itemCost = item.price * (item.quantity ?? 1);
                return acc + itemCost;
              }, 0)
              .toFixed(2)}
          </span>
        </div>
        <Button
          className="bg-primary mt-4 w-full"
          disabled={cart.length === 0}
          onClick={() => {
            if (cart.length > 0) {
              router.push("#");
            }
          }}
        >
          Proceed to checkout
        </Button>
      </Card>
    </div>
  );
}

export default Cart;
