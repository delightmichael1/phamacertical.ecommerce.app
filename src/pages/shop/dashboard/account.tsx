import Card from "@/components/ui/Card";
import DashboardLayout from "@/layouts/DashboardLayout";
import React from "react";

function Account() {
  return (
    <DashboardLayout title="Account" description="Manage your account">
      <div className="mx-auto w-full h-full container">
        <Card className="w-full h-full overflow-hidden">
          <div className="flex flex-col"></div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Account;
