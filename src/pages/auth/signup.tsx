import React from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { Form, Formik } from "formik";
import { BiKey } from "react-icons/bi";
import { motion } from "framer-motion";
import { LuLock } from "react-icons/lu";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/buttons/Button";
import Checkbox from "@/components/input/Checkbox";
import TextField from "@/components/input/TextField";
import { AuthValidationSchema } from "@/types/schema";

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
      <Button
        isLoading={isSubmitting}
        type="submit"
        className="w-full bg-primary"
      >
        Sign up
      </Button>
      <p className="text-default-500 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary">
          Sign in
        </Link>
      </p>
    </>
  )
);

function Signup() {
  const { signup } = useAuth();
  const [rememberMe, setRememberMe] = React.useState(true);

  const handleSubmit = async (values: { code: string; password: string }) => {
    await signup(values, "email");
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
        className="w-full max-w-[30rem] mx-auto h-full flex flex-col items-center justify-center gap-6"
      >
        <span className="text-2xl font-bold">CREATE ACCOUNT</span>
        <Formik
          initialValues={{ code: "", password: "" }}
          validationSchema={AuthValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col items-center gap-6 w-full">
              <TextField
                label="Code"
                type="code"
                name="code"
                placeholder="Enter your code"
                icon={<BiKey size={20} />}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
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

export default Signup;
