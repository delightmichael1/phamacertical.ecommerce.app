import React from "react";
import Link from "next/link";
import { Form, Formik } from "formik";
import { BiKey } from "react-icons/bi";
import { motion } from "framer-motion";
import { LuLock } from "react-icons/lu";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/buttons/Button";
import Checkbox from "@/components/input/Checkbox";
import TextField from "@/components/input/TextField";
import { SignInValidationSchema } from "@/types/schema";
import useAuthSession from "@/hooks/useAuthSession";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "@/components/toast/toast";
import useAppStore from "@/stores/AppStore";

const FormControls = React.memo(
  ({
    rememberMe,
    onRememberMeChange,
    isSubmitting,
  }: {
    rememberMe: boolean;
    onRememberMeChange: (value: boolean) => void;
    isSubmitting: boolean;
  }) => (
    <>
      <div className="flex justify-between items-center w-full">
        <Checkbox
          checked={rememberMe}
          onChange={onRememberMeChange}
          label="Remember me"
        />
        <Link href="/auth/forgot-password" className="text-sm">
          Forgot password?
        </Link>
      </div>
      <Button
        isLoading={isSubmitting}
        type="submit"
        className="bg-primary w-full h-10"
      >
        Sign in
      </Button>
      <p className="text-default-500 text-sm text-center">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary">
          Sign up
        </Link>
      </p>
    </>
  )
);

function Signin() {
  const { axios } = useAxios();
  const { signIn } = useAuthSession();
  const [rememberMe, setRememberMe] = React.useState(true);

  const handleSubmit = async (values: {
    id: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      const response = await axios.post("/user/signin", values);
      useAppStore.setState((state) => {
        state.accessToken = response.data.accessToken;
      });
      return response.data.refreshToken;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response
          ? error.response.data.message
          : error.message,
        variant: "error",
      });
      return "";
    }
  };

  const handleRememberMeChange = React.useCallback((value: boolean) => {
    setRememberMe(value);
  }, []);

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
        className="flex flex-col justify-center items-center gap-6 mx-auto w-full max-w-[30rem] h-full"
      >
        <span className="font-bold text-2xl">WELCOME BACK</span>
        <Formik
          initialValues={{ id: "", password: "", rememberMe: true }}
          validationSchema={SignInValidationSchema}
          onSubmit={(e) => signIn(() => handleSubmit(e), { replace: true })}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col items-center gap-6 w-full">
              <TextField
                label="Identification Number"
                type="text"
                name="id"
                placeholder="eg 123abc"
                className="bg-white/40"
                icon={<BiKey size={20} />}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                className="bg-white/40"
                placeholder="Enter your password"
                icon={<LuLock size={20} />}
              />
              <FormControls
                rememberMe={rememberMe}
                onRememberMeChange={handleRememberMeChange}
                isSubmitting={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </motion.div>
    </AuthLayout>
  );
}

export default Signin;
