import React, { useEffect } from "react";
import useAppStore from "@/stores/AppStore";
import DashboardLayout from "@/layouts/DashboardLayout";
import SupplierProducts from "@/components/SupplierProducts";

function Index() {
  useEffect(() => {
    useAppStore.setState((state) => {
      state.showCartConfirmDialog = true;
    });
  }, []);

  return (
    <DashboardLayout
      title="Products"
      description="Manage your products"
      isSupplier
    >
      <SupplierProducts isSupplier />
    </DashboardLayout>
  );
}

export default Index;
