import cn from "@/utils/cn";
import Lottie from "lottie-react";
import useAuth from "@/hooks/useAuth";
import Button from "../buttons/Button";
import React, { useState } from "react";
import Warning from "../../../public/lottie/error.json";

type Props = {
  closeModal: () => void;
};

function Logout(props: Props) {
  const { signout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-6 flex items-center justify-center w-full flex-col space-y-4 py-10">
      <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
      <span>You are about to logout.</span>
      <span>Press continue to logout now.</span>
      <div className="flex items-center w-full space-x-2">
        {!isLoading && (
          <Button className="text-black w-full" onClick={props.closeModal}>
            Cancel
          </Button>
        )}
        <Button
          isLoading={isLoading}
          className={cn("bg-red-500 w-full max-w-1/2", isLoading && "ml-auto")}
          onClick={async () => {
            await signout(setIsLoading);
            props.closeModal();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default Logout;
