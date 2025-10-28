import React from "react";
import Card from "@/components/ui/Card";
import useAppStore from "@/stores/AppStore";
import Dropdown from "@/components/dropdown/Dropdown";
import DashboardLayout from "@/layouts/DashboardLayout";
import SearchInput from "@/components/input/SearchInput";
import Image from "next/image";

function Orders() {
  const orders = useAppStore((state) => state.orders);

  return (
    <DashboardLayout title="Orders" description="Manage my orders list">
      <div className="flex w-full h-full container mx-auto flex-col space-y-4">
        <Card className="w-full h-full overflow-y-auto">
          <div className="flex items-center justify-between">
            <SearchInput />
            <div className="flex space-x-4 items-center">
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
            <div className="w-full h-[90%] flex flex-col space-y-4 items-center justify-center">
              <Image
                src="/svgs/empty-cart.svg"
                alt="empty cart"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full max-w-[20rem] aspect-square object-cover rounded-xl"
              />
              <span className="text-2xl font-bold">
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
