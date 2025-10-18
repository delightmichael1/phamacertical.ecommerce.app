import Image from "next/image";
import Button from "../buttons/Button";
import useAppStore from "@/stores/AppStore";
import React, { useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { toast } from "../toast/toast";

interface Props {
  product: IProduct | null;
  onCloseDialog: () => void;
  isSupplier?: boolean;
}

function QuickView(props: Props) {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    setSelectedProduct(props.product);
  }, []);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    useAppStore.setState((state) => {
      if (state.cart.find((item) => item.id === selectedProduct?.id)) {
        state.cart.map((item) => {
          if (item.id === selectedProduct?.id) {
            if (!item.quantity) {
              item.quantity = 1;
            } else {
              item.quantity += 1;
            }
          }
        });
      } else {
        state.cart.push({ ...selectedProduct, quantity: 1 });
      }
    });
    toast({
      description:
        (selectedProduct.quantity ? selectedProduct.quantity : 1) +
        " items added to cart",
      variant: "success",
    });
    props.onCloseDialog();
  };

  return (
    <div className="gap-8 grid grid-cols-2 p-4 pt-6 w-full max-w-[60rem]">
      <Image
        src={selectedProduct?.image ?? ""}
        alt={selectedProduct?.name ?? ""}
        width={0}
        height={0}
        sizes="100vw"
        className="bg-gray-300 rounded-xl w-full object-cover aspect-square"
      />
      <div className="flex flex-col space-y-4 w-full">
        <span>{selectedProduct?.company}</span>
        <h2 className="font-bold text-2xl">{selectedProduct?.name}</h2>
        <p className="text-sm">{selectedProduct?.description}</p>
        <span className="font-bold text-primary text-xl">
          ${selectedProduct?.newPrice}
        </span>
        {!props.isSupplier && (
          <div className="flex border border-strokedark rounded-lg w-fit overflow-hidden divider divider-strokedark">
            <input
              type="number"
              value={
                selectedProduct?.quantity?.toString().replace(/[^0-9]/g, "") ??
                1
              }
              onChange={(e) => {
                if (selectedProduct)
                  setSelectedProduct({
                    ...selectedProduct,
                    quantity: Number(e.target.value),
                  });
              }}
              className="p-2 px-4 outline-none w-16"
            />
            <div className="flex flex-col divide-strokedark divide">
              <BiChevronUp
                className="hover:bg-primary/20 p-1 w-8 h-6 cursor-pointer"
                onClick={() => {
                  if (selectedProduct)
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: selectedProduct.quantity
                        ? selectedProduct.quantity + 1
                        : 1,
                    });
                }}
              />
              <BiChevronDown
                onClick={() => {
                  if (selectedProduct)
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity:
                        selectedProduct.quantity && selectedProduct.quantity > 1
                          ? selectedProduct.quantity - 1
                          : 1,
                    });
                }}
                className="hover:bg-primary/20 p-1 w-8 h-6 cursor-pointer"
              />
            </div>
          </div>
        )}
        {!props.isSupplier && (
          <div className="flex items-center space-x-2">
            <Button className="bg-primary" onClick={handleAddToCart}>
              <HiOutlineShoppingBag className="w-5 h-5" />
              <span>Add to cart</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickView;
