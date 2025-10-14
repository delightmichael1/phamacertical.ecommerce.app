import React from "react";
import Cart from "@/components/ui/Cart";
import DashboardLayout from "@/layouts/DashboardLayout";

function CartPage() {
  return (
    <DashboardLayout title="Cart" description="Manage cart list">
      <Cart />
    </DashboardLayout>
  );
}

export default CartPage;
