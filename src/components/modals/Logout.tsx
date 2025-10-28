import cn from "@/utils/cn";
import Lottie from "lottie-react";
import Button from "../buttons/Button";
import React, { useState } from "react";
import Warning from "../../../public/lottie/error.json";
import useAuthSession from "@/hooks/useAuthSession";

type Props = {
  closeModal: () => void;
};

function Logout(props: Props) {
  const { signOut } = useAuthSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 p-6 py-10 w-full h-full overflow-y-auto">
      <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
      <span>You are about to logout.</span>
      <span>Press continue to logout now.</span>
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
            signOut();
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
