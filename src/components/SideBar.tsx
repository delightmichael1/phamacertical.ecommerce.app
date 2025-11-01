import cn from "@/utils/cn";
import Card from "./ui/Card";
import Image from "next/image";
import Button from "./buttons/Button";
import { toast } from "./toast/toast";
import { FaXmark } from "react-icons/fa6";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@/hooks/useOutsideClick";
import usePersistedStore from "@/stores/PersistedStored";
import { BiChevronUp, BiChevronDown, BiTrash } from "react-icons/bi";

function SideBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const showSideBar = useAppStore((state) => state.showSideBar);
  useClickOutside(barRef, () => {
    useAppStore.setState({ showSideBar: { open: false, value: "" } });
  });
  return (
    <AnimatePresence>
      {showSideBar.open && (
        <motion.div
          ref={barRef}
          initial={{ x: "100%" }}
          whileInView={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 1, type: "spring" }}
          className="top-0 right-0 bottom-0 z-50 fixed bg-card backdrop-blur-2xl p-6 w-[26rem] overflow-y-auto"
        >
          <button
            onClick={() => {
              useAppStore.setState({
                showSideBar: { open: false, value: "" },
              });
            }}
            className="top-4 right-4 absolute flex justify-center items-center hover:bg-red-500/10 px-2 py-2 rounded-full w-10 max-w-10 h-10 hover:text-red-500 duration-300 cursor-pointer"
          >
            <FaXmark className="min-w-4 h-4" />
          </button>
          {showSideBar.value === "cart" && <Cart isCart />}
          {showSideBar.value === "wish-list" && <Cart />}
          {showSideBar.value === "notifications" && <Notifications />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Notifications() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="pb-4 border-strokedark border-b w-full">
        <h2 className="font-bold text-xl">Notifications</h2>
      </div>
    </div>
  );
}

type Props = {
  isCart?: boolean;
};

function Cart(props: Props) {
  const { secureAxios } = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const cart = usePersistedStore((state) => state.cart);
  const wishList = usePersistedStore((state) => state.wishList);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const data = props.isCart ? cart : wishList;

  const placeOrder = async () => {
    if (data.length === 0) return;
    const dataToSend = {
      items: data.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      })),
    };
    setIsLoading(true);
    await secureAxios
      .post("/shop/order", dataToSend)
      .then((res) => {
        let tempErrors: { id: string; message: string }[] = [];
        if (props.isCart) {
          usePersistedStore.setState((state) => {
            let newcart: IProduct[] = [];
            if (res.data.errors && res.data.errors.length > 0) {
              for (const err of res.data.errors) {
                const product = state.cart.find((item) => item.id === err.id);
                if (product) {
                  tempErrors.push(err);
                  newcart.push(product);
                }
              }
            }
            state.cart = newcart;
          });
        } else {
          usePersistedStore.setState((state) => {
            let newwishList: IProduct[] = [];
            if (res.data.errors && res.data.errors.length > 0) {
              for (const err of res.data.errors) {
                const product = state.wishList.find(
                  (item) => item.id === err.id
                );
                if (product) {
                  tempErrors.push(err);
                  newwishList.push(product);
                }
              }
            }
            state.wishList = newwishList;
          });
        }

        setErrors(tempErrors);
        toast({
          description: res.data.message,
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          description: error?.response?.data?.message ?? error.message,
          variant: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="pb-4 border-strokedark border-b w-full">
        <h2 className="font-bold text-xl">
          Shopping {props.isCart ? "Cart" : "WishList"}
        </h2>
      </div>
      <div className="flex flex-col space-y-6 w-full divide">
        {data.map((item) => (
          <div
            className={cn(
              "flex flex-col space-y-4 bg-card-2/50 p-4 rounded-xl w-full",
              errors.some((err) => err.id === item.id) && "bg-red-500/10"
            )}
          >
            <div key={item.id} className={"flex flex-col space-y-4 w-full"}>
              <div className="flex flex-1 items-center space-x-4 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="bg-primary/10 rounded-xl w-full max-w-[10rem] object-cover aspect-square"
                />
                <div className="flex flex-col space-y-2">
                  <span className="font-bold text-lg">{item.title}</span>
                  <span className="text-primary text-xl">${item.price}</span>
                  <span className="text-xs">{item.description}</span>
                </div>
              </div>
              <div className="flex justify-between items-center space-x-10 w-full">
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
            {errors.some((err) => err.id === item.id) && (
              <span className="text-red-500 text-sm capitalize">
                {errors.find((err) => err.id === item.id)?.message}
              </span>
            )}
          </div>
        ))}
        {data.length === 0 && (
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
      {data.length > 0 && (
        <Card className="space-y-4 bg-card-2/50 p-6 pb-10 w-full h-fit">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Items:</span>
            <span>
              {data
                .reduce((acc, item) => acc + (item.quantity ?? 1), 0)
                .toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total (tax excl.):</span>
            <span>
              $
              {data
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
              {data
                .reduce((acc, item) => {
                  const itemCost = item.price * (item.quantity ?? 1);
                  return acc + itemCost;
                }, 0)
                .toFixed(2)}
            </span>
          </div>
          <Button
            className="bg-primary mt-4 w-full h-10"
            disabled={data.length === 0}
            onClick={placeOrder}
            isLoading={isLoading}
          >
            Place order
          </Button>
        </Card>
      )}
    </div>
  );
}

export default SideBar;
