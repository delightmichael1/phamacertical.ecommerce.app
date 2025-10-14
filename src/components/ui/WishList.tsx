import React from "react";
import Card from "./Card";
import Image from "next/image";
import router from "next/router";
import Button from "../buttons/Button";
import useAppStore from "@/stores/AppStore";
import { BiChevronUp, BiChevronDown, BiTrash } from "react-icons/bi";

function WishList() {
  const wishList = useAppStore((state) => state.wishList);

  return (
    <div className="flex lg:flex-row flex-col space-y-4 lg:space-y-0 lg:space-x-4 container mx-auto">
      <Card className="w-3/4 p-0">
        <div className="p-4 border-b border-strokedark w-full">
          <h1 className="text-xl font-bold">Shopping Wish List</h1>
        </div>
        <div className="flex flex-col p-4 w-full space-y-6 divide">
          {wishList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full max-w-[10rem] aspect-square object-cover rounded-xl"
                />
                <div className="flex flex-col space-y-2">
                  <span className="text-lg font-bold">{item.name}</span>
                  <span className="text-xl text-primary">${item.newPrice}</span>
                  <span className="text-xs">{item.description}</span>
                </div>
              </div>
              <div className="flex items-center space-x-10">
                <div className="flex border border-strokedark rounded-lg divider divider-strokedark overflow-hidden">
                  <input
                    type="number"
                    value={
                      item.quantity?.toString().replace(/[^0-9]/g, "") ?? 1
                    }
                    onChange={(e) => {
                      useAppStore.setState((state) => {
                        state.wishList.map((item) => {
                          if (item.id === item.id) {
                            item.quantity = Number(e.target.value);
                          }
                        });
                      });
                    }}
                    className="w-16 p-2 px-4 outline-none"
                  />
                  <div className="flex flex-col divide divide-strokedark">
                    <BiChevronUp
                      className="w-8 h-6 hover:bg-primary/20 cursor-pointer p-1"
                      onClick={() =>
                        useAppStore.setState((state) => {
                          state.wishList.map((wishList) => {
                            if (wishList.id === item.id) {
                              if (wishList.quantity) {
                                wishList.quantity += 1;
                              } else {
                                wishList.quantity = 1;
                              }
                            }
                          });
                        })
                      }
                    />
                    <BiChevronDown
                      onClick={() =>
                        useAppStore.setState((state) => {
                          state.wishList.map((wishList) => {
                            if (
                              wishList.id === item.id &&
                              wishList.quantity &&
                              wishList.quantity > 1
                            ) {
                              wishList.quantity -= 1;
                            }
                          });
                        })
                      }
                      className="w-8 h-6 hover:bg-primary/20 cursor-pointer p-1"
                    />
                  </div>
                </div>
                <BiTrash
                  className="w-8 h-8 hover:bg-primary/20 cursor-pointer p-1 rounded-full duration-300 hover:text-red-500"
                  onClick={() =>
                    useAppStore.setState((state) => {
                      state.wishList = state.wishList.filter(
                        (itx) => itx.id !== item.id
                      );
                    })
                  }
                />
              </div>
            </div>
          ))}
          {wishList.length === 0 && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10 px-4">
              <Image
                src="/svgs/empty-cart.svg"
                alt="empty wish list"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full max-w-[20rem] aspect-square object-cover rounded-xl"
              />
              <span className="text-2xl font-bold">
                Your wish list is empty
              </span>
            </div>
          )}
        </div>
      </Card>
      <Card className="w-1/4 p-6 h-fit pb-10">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Items:</span>
          <span>
            {wishList
              .reduce((acc, item) => acc + (item.quantity ?? 1), 0)
              .toFixed(0)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Total (tax excl.):</span>
          <span>
            $
            {wishList
              .reduce((acc, item) => {
                const itemCost = item.newPrice * (item.quantity ?? 1);
                return acc + itemCost;
              }, 0)
              .toFixed(2)}
          </span>
        </div>
        <hr className="border-strokedark my-4" />
        <div className="flex items-center justify-between font-bold">
          <span className="text-gray-500">Total (tax inc.):</span>
          <span>
            $
            {wishList
              .reduce((acc, item) => {
                const itemCost = item.newPrice * (item.quantity ?? 1);
                return acc + itemCost;
              }, 0)
              .toFixed(2)}
          </span>
        </div>
        <Button
          className="w-full mt-4 bg-primary"
          disabled={wishList.length === 0}
          onClick={() => {
            if (wishList.length > 0) {
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

export default WishList;
