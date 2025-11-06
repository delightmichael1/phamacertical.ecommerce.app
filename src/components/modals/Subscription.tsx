import cn from "@/utils/cn";
import Lottie from "lottie-react";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import React, { useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import Warning from "../../../public/lottie/error.json";

type Props = {
  user: IUser;
  closeModal: () => void;
};

function Subscription(props: Props) {
  const { secureAxios } = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  const onSubscribe = async () => {
    setIsLoading(true);
    await secureAxios
      .put("/admin/subscription", { userId: props.user.id })
      .then((res) => {
        toast({
          description: res.data.message,
          variant: "success",
        });
        props.closeModal();
      })
      .catch((error) => {
        toast({
          description: error?.response?.data?.message || error.message,
          variant: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col items-center space-y-4 px-6 pb-10 w-full h-full overflow-y-auto">
      <span className="py-2 w-full font-semibold text-xl">Subscription</span>
      <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
      <span>You are about to add a new subscription.</span>
      <span>
        Press continue to add a new subscription for {props.user.branchName}.
      </span>
      <div className="flex items-center space-x-2 w-full">
        {!isLoading && (
          <Button className="w-full text-black" onClick={props.closeModal}>
            Cancel
          </Button>
        )}
        <Button
          isLoading={isLoading}
          className={cn("bg-red-500 w-full max-w-1/2", isLoading && "ml-auto")}
          onClick={onSubscribe}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default Subscription;
