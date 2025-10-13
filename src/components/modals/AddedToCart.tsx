import React from "react";
import Image from "next/image";
import Button from "../buttons/Button";
import { BiCart } from "react-icons/bi";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/AppStore";
import { GiCheckMark } from "react-icons/gi";

interface Props {
  product: IProduct | null;
  closeModal: () => void;
}

function AddedToCart(props: Props) {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);

  return (
    <div className="flex flex-col space-y-10">
      <h1>Added to cart</h1>
      <div className="flex space-y-4 flex-col">
        <div className="flex items-center space-x-4">
          <Image
            src={props.product?.image ?? ""}
            alt={props.product!.name}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full max-w-[10rem] aspect-square object-cover rounded-xl"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{props.product?.name}</span>
            <span className="text-sm">${props.product?.newPrice}</span>
            <span className="text-sm">Quantity: {props.product?.quantity}</span>
          </div>
        </div>
        <hr className="border-strokedark" />
        <div className="flex flex-col space-y-2">
          <span>
            There are{" "}
            {cart.reduce((acc, item) => acc + (item.quantity ?? 1), 0)} products
            in your cart
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Total:</span>
            <span className="text-sm font-bold">
              $
              {cart
                .reduce((acc, item) => {
                  const itemCost = item.newPrice * (item.quantity ?? 1);
                  return acc + itemCost;
                }, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 justify-end mt-6">
          <Button
            className=" bg-primary flex flex-row space-x-2 items-center"
            onClick={props.closeModal}
          >
            <BiCart />
            <span> Continue Shopping</span>
          </Button>
          <Button
            onClick={() => {
              router.push("/cart");
              props.closeModal();
            }}
            className=" bg-secondary flex flex-row space-x-2 items-center"
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
