"use client";

import React from "react";
import Link from "next/link";
import { Form, Formik } from "formik";
import { LuMail } from "react-icons/lu";

import { useRouter } from "next/navigation";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "@/components/toast/toast";
import Button from "@/components/buttons/Button";
import TextField from "@/components/input/TextField";
import AuthenticationLayout from "@/layouts/AuthLayout";
import { ForgotPasswordValidationSchema } from "@/types/schema";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const router = useRouter();
  const { axios } = useAxios();

  const handleSubmit = React.useCallback(
    async (values: { email: string }, actions: any) => {
      await axios
        .post("/user/forgot-password", values)
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
    <AuthenticationLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
        className="flex flex-col justify-center items-center gap-6 mx-auto w-full max-w-[30rem] h-full"
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-semibold text-2xl">Forgot Password</h1>
          <p className="text-default-500 text-sm">
            Enter your email address to reset your password.
          </p>
        </div>
        <div className="w-full">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col items-center gap-4">
                <TextField
                  label="Email"
                  className="bg-white/40"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
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
    </AuthenticationLayout>
  );
}
