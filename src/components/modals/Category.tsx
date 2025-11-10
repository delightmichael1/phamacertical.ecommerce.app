import { Formik, Form } from "formik";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import { BiRename } from "react-icons/bi";
import TextField from "../input/TextField";
import { useAxios } from "@/hooks/useAxios";
import React, { useEffect, useState } from "react";
import { CategoryValidationSchema } from "@/types/schema";

type Props = {
  category?: any;
  isChild?: boolean;
  parentId?: string;
  onDone?: () => void;
  type: "add" | "edit";
  closeModal: () => void;
};

function CategoryModal(props: Props) {
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
      const method = props.type === "add" ? "post" : "put";
      if (props.isChild) {
        values.parent = props.parentId;
      }
      const data =
        props.type === "add" ? values : { ...values, id: props.category.id };
      const response = await secureAxios[method]("/admin/categories", data);
      toast({
        description: response.data.message,
        variant: "success",
      });
      props.onDone && props.onDone();
      props.closeModal();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
      return "";
    }
  };

  return (
    <div
      className="flex flex-col items-start space-y-4 px-6 pb-10 w-full h-full overflow-y-auto"
      style={{ maxHeight: `${0.8 * height}px` }}
    >
      <span className="mt-1 mb-10 font-bold text-2xl">
        {props.type === "add" ? "Add new" : "Update"}{" "}
        {props.isChild ? "sub-category" : "category"}
      </span>
      <Formik
        initialValues={{
          name: props.category ? props.category.name : "",
        }}
        validationSchema={CategoryValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col items-center gap-6 w-full">
            <>
              <TextField
                label="Category Name"
                type="text"
                name="name"
                placeholder="Enter category name"
                icon={<BiRename size={20} />}
              />
            </>

            <Button
              isLoading={isSubmitting}
              type="submit"
              className="bg-primary w-full h-10"
            >
              {props.type === "add" ? "Add" : "Update"} Category
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CategoryModal;
