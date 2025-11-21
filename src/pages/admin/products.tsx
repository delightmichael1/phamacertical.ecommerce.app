import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import SupplierProducts from "@/components/SupplierProducts";

function Index() {
  return (
    <DashboardLayout
      title="Products"
      description="Manage platform products"
      isAdmin
    >
      <SupplierProducts isSupplier={false} />
    </DashboardLayout>
  );
}

export default Index;
