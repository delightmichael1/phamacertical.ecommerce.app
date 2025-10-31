import React from "react";
import Card from "@/components/ui/Card";
import DashboardLayout from "@/layouts/DashboardLayout";

const tabs = ["Profile", "Security", "Billing", "Notifications"];

function Account() {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  return (
    <DashboardLayout title="Account" description="Manage your account">
      <div className="mx-auto w-full h-full container">
        <Card className="w-full h-full overflow-hidden">
          <div className="flex lg:flex-row flex-col lg:space-x-4 space-y-4 lg:space-y-0 divider-border w-full h-full">
            <div className="flex flex-col space-y-4 p-2 rounded-xl w-60">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`${
                    activeTab === tab ? "bg-primary text-white" : "text-primary"
                  } py-2 px-6 text-sm rounded-lg duration-300 cursor-pointer w-fit`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex border-border border-l w-full h-full overflow-y-auto"></div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Account;
