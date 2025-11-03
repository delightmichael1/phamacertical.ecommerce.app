import cn from "@/utils/cn";
import Lottie from "lottie-react";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import React, { useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import Warning from "../../../public/lottie/error.json";

type Props = {
  closeModal: () => void;
  product: IProduct | null;
};

function StopAd(props: Props) {
  const { secureAxios } = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  const handleStopAd = async () => {
    setIsLoading(true);
    if (!props.product) return;
    const data = {
      id: props.product.id,
      status: "stopped",
    };
    try {
      const response = await secureAxios.put("/shop/hotdeals", data);
      useAppStore.setState((state) => {
        state.ads = state.ads.map((ad) => {
          if (ad.id === props.product?.id) {
            return {
              ...ad,
              status: "stopped",
              expiryDate: new Date().getTime().toString(),
            };
          }
          return ad;
        });
      });
      toast({
        description: response.data.message,
        variant: "success",
      });
      props.closeModal();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
      if (error.response && error.response.status === 401) {
        props.closeModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 py-10 w-full h-full overflow-y-auto">
      <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
      <span>You are about to stop this ad.</span>
      <span>Press continue to stop {props.product?.title} now.</span>
      <div className="flex items-center space-x-2 w-full">
        {!isLoading && (
          <Button className="w-full text-black" onClick={props.closeModal}>
            Cancel
          </Button>
        )}
        <Button
          isLoading={isLoading}
          className={cn("bg-red-500 w-full max-w-1/2", isLoading && "ml-auto")}
          onClick={async () => {
            await handleStopAd();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default StopAd;
