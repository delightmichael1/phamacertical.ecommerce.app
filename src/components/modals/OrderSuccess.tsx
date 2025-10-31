import React from "react";
import Lottie from "lottie-react";
import Button from "../buttons/Button";
import { useRouter } from "next/router";
import Success from "../../../public/lottie/success.json";
import { GoDot, GoDotFill } from "react-icons/go";

type Props = {
  errors?: string[];
  closeModal: () => void;
};

function OrderSuccess(props: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center space-y-4 p-6 pt-2 pb-10 w-full h-full overflow-y-auto">
      <span>Sucess</span>
      <Lottie animationData={Success} loop={false} className="w-40 h-fit" />
      <span>Your order has been successfully placed.</span>
      {props.errors && props.errors.length > 0 && (
        <li className="flex flex-col space-y-2 bg-red-500/10 p-4 border-2 border-red-500/60 rounded-xl w-full">
          <span>However</span>
          {props.errors.map((error) => (
            <div className="flex space-x-2">
              <GoDotFill />
              <span className="text-xs">{error}</span>
            </div>
          ))}
        </li>
      )}
      <div className="flex items-center space-x-2 w-full">
        <Button
          className="bg-primary w-full h-10 text-white"
          onClick={() => {
            props.closeModal();
            router.push("/shop");
          }}
        >
          Go to Shop
        </Button>
      </div>
    </div>
  );
}

export default OrderSuccess;
