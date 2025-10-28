import Button from "@/components/buttons/Button";
import TextField from "@/components/input/TextField";
import { toast } from "@/components/toast/toast";
import { useAxios } from "@/hooks/useAxios";
import AuthLayout from "@/layouts/AuthLayout";
import { ResetPasswordValidationSchema } from "@/types/schema";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { LuMail } from "react-icons/lu";

function ResetPassword() {
  const router = useRouter();
  const { axios } = useAxios();
  const [sid, setsid] = React.useState("");

  useEffect(() => {
    if (!router.isReady) return;

    const { sid } = router.query;

    if (!sid) {
      router.replace("/auth/signin");
      return;
    }

    if (typeof sid === "string") {
      setsid(sid);
    } else {
      setsid("");
    }
  }, [router.isReady, router.query]);

  const handleSubmit = React.useCallback(
    async (values: { password: string }, actions: any) => {
      const data = { ...values, sid };
      await axios
        .post("/user/reset-password", data)
        .then((response) => {
          toast({
            title: "Success",
            variant: "success",
            description: response.data.message,
          });
          actions.resetForm();
          router.replace("/auth/signin");
        })
        .catch((error) => {
          toast({
            title: "Error",
            variant: "error",
            description: error.response
              ? error.response.data.message
              : error.message,
          });
        });
    },
    [axios, router]
  );
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
        className="flex flex-col justify-center items-center gap-6 mx-auto w-full max-w-[30rem] h-full"
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-semibold text-2xl">Reset Password</h1>
          <p className="text-default-500 text-sm">Enter your new password.</p>
        </div>
        <div className="w-full">
          <Formik
            initialValues={{ password: "" }}
            validationSchema={ResetPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col items-center gap-4">
                <TextField
                  label="Password"
                  type="password"
                  className="bg-white/40"
                  name="password"
                  placeholder="Enter your password"
                  icon={<LuMail size={20} className="text-default-500" />}
                />
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  className="bg-primary w-full h-10"
                >
                  Reset Password
                </Button>
                <Link href="/auth/signin" className="max-w-fit text-primary">
                  Back to Sign In
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

export default ResetPassword;
