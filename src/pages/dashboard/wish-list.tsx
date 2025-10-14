import WishList from "@/components/ui/WishList";
import DashboardLayout from "@/layouts/DashboardLayout";
import React from "react";

function Wishlist() {
  return (
    <DashboardLayout title="Wish List" description="Manage wish list">
      <WishList />
    </DashboardLayout>
  );
}

export default Wishlist;
