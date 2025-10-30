import { useModal } from "./Modal";
import { Formik, Form } from "formik";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import { FaCity } from "react-icons/fa6";
import DropZone from "../input/DropZone";
import TextField from "../input/TextField";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import SelectField from "../input/SelectField";
import { HiNumberedList } from "react-icons/hi2";
import React, { useEffect, useState } from "react";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { BiCalendar, BiRename } from "react-icons/bi";
import { ProductValidationSchema } from "@/types/schema";
import { FiDollarSign, FiEdit2, FiFileText } from "react-icons/fi";
import { format } from "date-fns";
import Image from "next/image";

type Props = {
  selectedProduct: IProduct | undefined;
  closeModal: () => void;
};

function UpdateProduct(props: Props) {
  const { closeModal } = useModal();
  const { secureAxios } = useAxios();
  const [height, setHeight] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [isUpdateImage, setUpdateImage] = useState(false);
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
        console.log("Categories ", res.data);
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
    if (!props.selectedProduct) return;
    const data = {
      ...props.selectedProduct,
      ...values,
      expiryDate: new Date(values.expiryDate).getTime(),
    };
    if (image) {
      data.image = image;
    }
    try {
      const response = await secureAxios.put("/shop/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.product)
        useAppStore.setState((state) => {
          state.products = state.products.map((product) => {
            if (product.id === response.data.product.id) {
              return response.data.product;
            }
            return product;
          });
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
      className="flex flex-col items-center space-y-4 px-6 pb-10 w-full h-full overflow-y-auto"
      style={{ maxHeight: `${0.8 * height}px` }}
    >
      <span className="mt-1 mb-10 font-bold text-2xl">
        Update {props.selectedProduct?.title}
      </span>
      <Formik
        initialValues={{
          title: props.selectedProduct?.title || "",
          price: props.selectedProduct?.price || 0,
          category: props.selectedProduct?.category || "",
          description: props.selectedProduct?.description || "",
          expiryDate:
            format(
              new Date(props.selectedProduct?.expiryDate ?? ""),
              "yyyy-MM-dd"
            ) || "",
          quantity: props.selectedProduct?.quantity || 0,
        }}
        validationSchema={ProductValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col items-center gap-6 w-full">
            <>
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
              <TextField
                label="Expiry date"
                type="date"
                name="expiryDate"
                min={new Date().toISOString().split("T")[0]}
                placeholder="Enter expiry date"
                icon={<BiCalendar size={20} />}
              />
              <SelectField
                label="Category"
                name="category"
                icon={<FaCity size={20} />}
                options={categories.map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                  };
                })}
              />
            </>
            {isUpdateImage ? (
              <DropZone
                file={image}
                setFile={setImage}
                fileType="image"
                icon={RiUploadCloud2Fill}
                label="Upload product image"
              />
            ) : (
              <div className="group relative flex justify-center items-center rounded-xl w-full h-fit overflow-hidden">
                <Image
                  src={props.selectedProduct?.image ?? ""}
                  alt={props.selectedProduct?.title ?? ""}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full max-w-[15rem] object-cover aspect-square"
                />
                <div
                  onClick={() => setUpdateImage(true)}
                  className="top-0 left-0 absolute flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 w-full h-full text-white transition-all duration-300 cursor-pointer"
                >
                  <FiEdit2 size={20} />
                </div>
              </div>
            )}

            <Button
              isLoading={isSubmitting}
              type="submit"
              className="bg-primary w-full h-10"
            >
              Update
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UpdateProduct;
