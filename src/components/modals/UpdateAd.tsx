import Image from "next/image";
import { format } from "date-fns";
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
import { AddValidationSchema, ProductValidationSchema } from "@/types/schema";
import { FiDollarSign, FiEdit2, FiFileText } from "react-icons/fi";
import DateField from "../input/DatePicker";

type Props = {
  selectedProduct: IProduct | undefined;
  closeModal: () => void;
};

function UpdateAd(props: Props) {
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
      id: props.selectedProduct.id,
      status: props.selectedProduct.status,
      expiryDate: new Date(values.expiryDate).getTime(),
    };
    try {
      const response = await secureAxios.put("/shop/hotdeals", data);
      useAppStore.setState((state) => {
        state.ads = state.ads.map((ad) => {
          if (ad.id === props.selectedProduct?.id) {
            return {
              ...ad,
              expiryDate: data.expiryDate.toString(),
            };
          }
          return ad;
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

  console.log(
    format(new Date(props.selectedProduct?.expiryDate ?? ""), "yyyy-MM-dd") ||
      ""
  );

  return (
    <div
      className="flex flex-col items-start space-y-4 px-6 pb-10 w-full h-full overflow-y-auto"
      style={{ maxHeight: `${0.8 * height}px` }}
    >
      <span className="mt-1 mb-10 font-bold text-2xl">
        Update {props.selectedProduct?.title} Ad
      </span>
      <Formik
        initialValues={{
          expiryDate:
            format(
              new Date(props.selectedProduct?.expiryDate ?? ""),
              "yyyy-MM-dd"
            ) || "",
        }}
        validationSchema={AddValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col items-center gap-6 w-full">
            <DateField
              label="Expiry date"
              type="date"
              name="expiryDate"
              minDate={new Date()}
              placeholder="Enter expiry date"
              icon={<BiCalendar size={20} />}
            />
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

export default UpdateAd;
