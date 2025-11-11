import { useModal } from "./Modal";
import { Formik, Form } from "formik";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import { FaCity } from "react-icons/fa6";
import DropZone from "../input/DropZone";
import TextField from "../input/TextField";
import DateField from "../input/DatePicker";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import SelectField from "../input/SelectField";
import { HiNumberedList } from "react-icons/hi2";
import React, { useEffect, useState } from "react";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { BiCalendar, BiRename } from "react-icons/bi";
import { ProductValidationSchema } from "@/types/schema";
import { FiDollarSign, FiFileText } from "react-icons/fi";
import { MdBatchPrediction } from "react-icons/md";

function AddProduct() {
  const { closeModal } = useModal();
  const { secureAxios } = useAxios();
  const [height, setHeight] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    getCategories();
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getCategories = async () => {
    await secureAxios
      .get("/shop/categories?page=1")
      .then((res) => {
        if (res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.response?.data?.message ?? err.message,
          variant: "error",
        });
      });
  };

  const handleSubmit = async (values: any) => {
    if (!image) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "error",
      });
      return;
    }
    const data = {
      ...values,
      expiryDate: new Date(values.expiryDate).getTime(),
      image,
    };
    try {
      const response = await secureAxios.post("/shop/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.product)
        useAppStore.setState((state) => {
          state.products = [...state.products, response.data.product];
        });
      toast({
        description: response.data.message,
        variant: "success",
      });
      closeModal();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
      if (error.response && error.response.status === 401) {
        closeModal();
      }
    }
  };

  return (
    <div
      className="flex flex-col space-y-4 px-6 pb-10 w-full max-w-5xl h-full overflow-y-auto"
      style={{ maxHeight: `${0.8 * height}px` }}
    >
      <span className="mt-1 mb-10 font-bold text-2xl">Add Product</span>
      <Formik
        initialValues={{
          title: "",
          price: 0,
          category: "",
          description: "",
          expiryDate: "",
          quantity: 0,
          batchNumber: "",
        }}
        validationSchema={ProductValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex lg:flex-row flex-col items-center gap-6 w-full">
            <DropZone
              file={image}
              setFile={setImage}
              fileType="image"
              icon={RiUploadCloud2Fill}
              className="max-w-full aspect-square"
              // label="Upload product image"
            />
            <div className="flex flex-col gap-4 w-full lg:w-fit lg:min-w-md">
              <TextField
                label="Title"
                type="text"
                name="title"
                placeholder="Enter title here"
                icon={<BiRename size={20} />}
              />
              <TextField
                label="Price"
                type="number"
                name="price"
                placeholder="Enter price"
                icon={<FiDollarSign size={20} />}
              />
              <TextField
                label="Description"
                type="text"
                name="description"
                placeholder="Enter description"
                icon={<FiFileText size={20} />}
              />
              <TextField
                label="Quantity in stock"
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                icon={<HiNumberedList size={20} />}
              />
              <DateField
                label="Expiry date"
                type="date"
                name="expiryDate"
                minDate={new Date()}
                placeholder="Enter expiry date"
                icon={<BiCalendar size={20} />}
              />
              <SelectField
                label="Category"
                name="category"
                placeholder="Select category"
                icon={<FaCity size={20} />}
                options={categories.map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                    subOptions: category.subCategories?.map((subCategory) => {
                      return {
                        label: subCategory.name,
                        value: subCategory.id,
                      };
                    }),
                  };
                })}
              />
              <TextField
                label="Batch Number (Optional)"
                type="text"
                name="batchNumber"
                placeholder="Enter batch number"
                icon={<MdBatchPrediction size={20} />}
              />
              <Button
                isLoading={isSubmitting}
                type="submit"
                className="bg-primary w-full h-12"
              >
                Upload
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddProduct;
