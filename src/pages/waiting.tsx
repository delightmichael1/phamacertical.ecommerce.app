import React from "react";
import Lottie from "lottie-react";
import { BiArrowBack } from "react-icons/bi";
import Button from "@/components/buttons/Button";
import useAuthSession from "@/hooks/useAuthSession";
import Security from "../../public/lottie/cybersecurity.json";

function Waiting() {
  const { signOut } = useAuthSession();

  return (
    <div className="flex flex-col justify-center items-center space-y-10 p-4 w-full h-full">
      <Lottie
        animationData={Security}
        loop={true}
        className="w-full max-w-60 h-fit"
      />
      <span className="max-w-xl font-semibold text-primary text-xl text-center">
        Your account is being verified. We will send you an email shortly when
        it is approved.
      </span>
      <Button
        className="bg-primary w-full max-w-60 h-12 text-sm"
        onClick={() => signOut()}
      >
        <BiArrowBack className="w-5 h-5" />
        <span>Go To Sign In</span>
      </Button>
    </div>
  );
}

export default Waiting;
