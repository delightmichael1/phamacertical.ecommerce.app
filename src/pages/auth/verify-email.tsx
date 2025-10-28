import Image from "next/image";
import Lottie from "lottie-react";
import { BiHome } from "react-icons/bi";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BsMailbox } from "react-icons/bs";
import { useAxios } from "@/hooks/useAxios";
import AuthLayout from "@/layouts/AuthLayout";
import { toast } from "@/components/toast/toast";
import Button from "@/components/buttons/Button";
import NewtonLoader from "@/components/NewtonLoader";
import Error from "../../../public/lottie/error.json";
import { AnimatePresence, motion } from "framer-motion";
import Success from "../../../public/lottie/success.json";

function Verify() {
  const router = useRouter();
  const { axios } = useAxios();
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const { sid } = router.query;

    if (!sid) {
      router.replace("/auth/signin");
      return;
    }

    if (typeof sid === "string") {
      handleVerifyEmail(sid);
    }
  }, [router.isReady, router.query]);

  const handleVerifyEmail = async (id: string) => {
    setError("");
    setIsLoading(true);
    await axios
      .get("/user/verify-email/" + id)
      .then((response) => {
        toast({
          variant: "success",
          description: response.data.message,
        });
      })
      .catch((error) => {
        toast({
          variant: "error",
          description: error.response
            ? error.response.data.message
            : error.message,
        });
        setError(error.response ? error.response.data.message : error.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
        className="flex flex-col justify-center items-center gap-6 mx-auto w-full max-w-[30rem] h-full"
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-semibold text-2xl">Email Verification</h1>
          <p className="text-default-500 text-sm">
            PharmNex email verification
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                className="flex flex-col items-center py-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Image
                  src={"/svgs/loading.svg"}
                  alt="loading"
                  width={0}
                  sizes="100vw"
                  height={0}
                  className="w-40 h-fit"
                />
                <span className="text-default-500 text-sm">
                  Please wait while we verify your email.
                </span>
                <NewtonLoader />
              </motion.div>
            ) : error !== "" ? (
              <motion.div
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Lottie
                  className="w-40 h-fit"
                  animationData={Error}
                  loop={false}
                />
                <span className="text-default-500 text-sm">{error}</span>
                <Button
                  onClick={() => router.push("/settings")}
                  className="bg-primary mt-2 w-full h-10"
                >
                  <BsMailbox className="w-4 h-4" />
                  <span>Resend email</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Lottie
                  className="w-40 h-fit"
                  animationData={Success}
                  loop={false}
                />
                <span className="text-default-500 text-sm">
                  Email verified successfully.
                </span>
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="mt-2"
                >
                  <BiHome className="w-4 h-4" />
                  <span>Go to home</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

export default Verify;
