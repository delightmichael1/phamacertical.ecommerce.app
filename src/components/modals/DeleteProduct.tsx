import cn from "@/utils/cn";
import Lottie from "lottie-react";
import Button from "../buttons/Button";
import React, { useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import Warning from "../../../public/lottie/error.json";
import { toast } from "../toast/toast";

type Props = {
  closeModal: () => void;
  product: IProduct | null;
};

function DeleteProduct(props: Props) {
  const { secureAxios } = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  const deleteProduct = async () => {
    setIsLoading(true);
    try {
      const response = await secureAxios.delete(
        `/shop/product/${props.product?.id}`
      );
      toast({
        description: response.data.message,
        variant: "success",
      });
      useAppStore.setState((state) => {
        state.products = state.products.filter(
          (product) => product.id !== props.product?.id
        );
      });
      props.closeModal();
    } catch (error: any) {
      toast({
        description: error?.response?.data?.message || error.message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 py-10 w-full h-full overflow-y-auto">
      <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
      <span>You are about to delete product.</span>
      <span>Press continue to delete product {props.product?.title}</span>
      <div className="flex items-center space-x-2 w-full">
        <Button
          className="w-full text-black"
          onClick={props.closeModal}
          isLoading={isLoading}
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          className={cn("bg-red-500 w-full max-w-1/2", isLoading && "ml-auto")}
          onClick={async () => {
            await deleteProduct();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default DeleteProduct;
