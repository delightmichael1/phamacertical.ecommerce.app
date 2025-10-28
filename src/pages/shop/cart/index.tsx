import React from "react";
import Cart from "@/components/ui/Cart";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import ShopLayout from "@/layouts/ShopLayout";
import Button from "@/components/buttons/Button";

function Index() {
  const router = useRouter();

  return (
    <ShopLayout>
      <Cart />
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
