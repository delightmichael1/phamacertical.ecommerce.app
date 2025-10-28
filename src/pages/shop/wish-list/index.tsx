import React from "react";
import ShopLayout from "@/layouts/ShopLayout";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import Button from "@/components/buttons/Button";
import WishList from "@/components/ui/WishList";

function Index() {
  const router = useRouter();

  return (
    <ShopLayout>
      <WishList />
      <div className="mx-auto mt-4 container">
        <Button
          className="text-black text-xs"
          onClick={() => router.push("/shop")}
        >
          <BiArrowBack />
          <span>Continue Shopping</span>
        </Button>
      </div>
    </ShopLayout>
  );
}

export default Index;
