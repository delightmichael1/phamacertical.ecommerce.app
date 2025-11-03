import cn from "@/utils/cn";
import Lottie from "lottie-react";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import React, { useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import { BiCalendar } from "react-icons/bi";
import Warning from "../../../public/lottie/error.json";
import DateFieldWithOnChange from "../input/DatePickerWithOnChange";
import SelectFieldWithOnChange from "../input/SelectFieldWithOnChange";
import { TbStatusChange } from "react-icons/tb";

type Props = {
  orderId: string;
  closeModal: () => void;
  type: "accepted" | "cancelled" | "update";
};

function OrderModal(props: Props) {
  const { secureAxios } = useAxios();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");

  const updateOrder = async () => {
    setIsLoading(true);
    const id =
      typeof props.orderId === "string" ? props.orderId : props.orderId[0];
    const data = {
      id: id,
      deliveryDate: new Date(deliveryDate).getTime(),
      status: props.type === "update" ? status : props.type,
    };
    await secureAxios
      .put("/shop/order", data)
      .then((res) => {
        toast({
          description: res.data.message,
          variant: "success",
        });
        props.closeModal();
      })
      .catch((error) => {
        console.log(error);
        toast({
          description: error?.res?.response?.data?.message || error.message,
          variant: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 py-10 w-full h-full overflow-y-auto">
      {props.type === "update" && (
        <>
          <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
          <span>You are about to update this order.</span>
          <span>Add delivery date and press continue to accept.</span>
          <SelectFieldWithOnChange
            label="Status"
            icon={<TbStatusChange className="w-6 h-6 text-black" />}
            onChange={(value) => setStatus(value)}
            placeholder="Select Status"
            options={[
              { label: "Accepted", value: "accepted" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Shipped", value: "shipped" },
            ]}
          />
          <DateFieldWithOnChange
            icon={<BiCalendar className="w-6 h-6 text-black" />}
            label="Delivery Date"
            minDate={new Date()}
            onChange={(value) => setDeliveryDate(value)}
          />
        </>
      )}
      {props.type === "accepted" && (
        <>
          <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
          <span>You are about to accept this order.</span>
          <span>Add delivery date and press continue to accept.</span>
          <DateFieldWithOnChange
            icon={<BiCalendar className="w-6 h-6 text-black" />}
            label="Delivery Date"
            minDate={new Date()}
            onChange={(value) => setDeliveryDate(value)}
          />
        </>
      )}
      {props.type === "cancelled" && (
        <>
          <Lottie animationData={Warning} loop={false} className="w-40 h-fit" />
          <span>You are about to reject this order.</span>
          <span>Press continue to reject.</span>
        </>
      )}
      <div className="flex items-center space-x-2 w-full">
        {!isLoading && (
          <Button className="w-full text-black" onClick={props.closeModal}>
            Cancel
          </Button>
        )}
        <Button
          isLoading={isLoading}
          className={cn("bg-red-500 w-full max-w-1/2", isLoading && "ml-auto")}
          onClick={() => {
            updateOrder();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default OrderModal;
