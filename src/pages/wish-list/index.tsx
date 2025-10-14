import React from "react";
import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import Button from "@/components/buttons/Button";
import WishList from "@/components/ui/WishList";

function Index() {
  const router = useRouter();

  return (
    <AppLayout>
      <WishList />
      <div className="container mx-auto mt-4">
        <Button className="text-black text-xs" onClick={() => router.push("/")}>
          <BiArrowBack />
          <span>Continue Shopping</span>
        </Button>
      </div>
    </AppLayout>
  );
}

export default Index;
