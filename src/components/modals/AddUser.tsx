import { useModal } from "./Modal";
import { Formik, Form } from "formik";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import { FaCity } from "react-icons/fa6";
import { BiRename } from "react-icons/bi";
import TextField from "../input/TextField";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { UserValidationSchema } from "@/types/schema";
import { MdOutlineMail, MdPhone } from "react-icons/md";

function AddUser() {
  const { closeModal } = useModal();
  const { secureAxios } = useAxios();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const response = await secureAxios.post("/admin/create-user", values);
      if (response.data)
        useAppStore.setState((state) => {
          state.users = [...state.users, response.data];
        });
      toast({
        description: "User added successfully",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
      return "";
    } finally {
      closeModal();
    }
  };

  return (
    <div
      className="flex flex-col items-center space-y-4 px-6 pb-10 w-full h-full overflow-y-auto"
      style={{ maxHeight: `${0.8 * height}px` }}
    >
      <span className="mt-1 mb-10 font-bold text-2xl">Add new user</span>
      <Formik
        initialValues={{
          city: "",
          email: "",
          phone: "",
          address: "",
          fullName: "",
        }}
        validationSchema={UserValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col items-center gap-6 w-full">
            <>
              <TextField
                label="Full Name"
                type="fullName"
                name="fullName"
                placeholder="Enter full name"
                icon={<BiRename size={20} />}
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                placeholder="Enter email address"
                icon={<MdOutlineMail size={20} />}
              />
              <TextField
                label="Phone"
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                icon={<MdPhone size={20} />}
              />
              <TextField
                label="City"
                type="text"
                name="city"
                placeholder="Enter city"
                icon={<FaCity size={20} />}
              />
              <TextField
                label="Address"
                type="text"
                name="address"
                placeholder="Enter address"
                icon={<IoLocationOutline size={20} />}
              />
            </>

            <Button
              isLoading={isSubmitting}
              type="submit"
              className="bg-primary w-full h-10"
            >
              Next
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddUser;
