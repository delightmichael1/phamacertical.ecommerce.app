import React from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/dropdown/Dropdown";
import DashboardLayout from "@/layouts/DashboardLayout";
import SearchInput from "@/components/input/SearchInput";
import usePersistedStore from "@/stores/PersistedStored";

function Orders() {
  const orders = usePersistedStore((state) => state.orders);

  return (
    <DashboardLayout title="Orders" description="Manage my orders list">
      <div className="flex flex-col space-y-4 mx-auto w-full h-full container">
        <Card className="w-full h-full overflow-y-auto">
          <div className="flex justify-between items-center">
            <SearchInput />
            <div className="flex items-center space-x-4">
              <span>Sort by:</span>
              <Dropdown
                classNames={{
                  container: "w-56",
                  trigger:
                    "text-primary w-56 justify-between border border-primary px-4 py-2 rounded-lg",
                }}
                options={[
                  "Newest",
                  "Oldest",
                  "Price: Low to High",
                  "Price: High to Low",
                ]}
              />
            </div>
          </div>
          {orders.length === 0 && (
            <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90%]">
              <Image
                src="/svgs/empty-cart.svg"
                alt="empty cart"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-xl w-full max-w-[20rem] object-cover aspect-square"
              />
              <span className="font-bold text-2xl">
                Your order list is empty
              </span>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Orders;
