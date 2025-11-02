import Card from "@/components/ui/Card";
import React, { useEffect } from "react";
import { ApexOptions } from "apexcharts";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/toast/toast";
import Button from "@/components/buttons/Button";
import DashboardLayout from "@/layouts/DashboardLayout";
import usePersistedStore from "@/stores/PersistedStored";

function Index() {
  const router = useRouter();
  const { secureAxios } = useAxios();
  const cart = usePersistedStore((state) => state.cart);
  const [orderStats, setOrderStats] = React.useState<OrderStats>({
    acceptedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalOrders: 0,
    orderDistribution: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let priceChart: any;
    let isMounted = true;

    (async () => {
      const ApexCharts = (await import("apexcharts")).default;

      const catEl = document.querySelector("#pricechart");

      if (!catEl || !isMounted) return;

      const existingCatChart = (catEl as any)._apexChart;

      if (existingCatChart) {
        existingCatChart.destroy();
      }

      catEl.innerHTML = "";

      if (!isMounted) return;

      priceChart = new ApexCharts(catEl, priceChartOptions);

      (catEl as any)._apexChart = priceChart;

      await priceChart.render();
    })();

    return () => {
      isMounted = false;
      if (priceChart) priceChart.destroy();
    };
  }, [orderStats]);

  const priceChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#3475eb"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: orderStats.orderDistribution.map((item) => item.month),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Orders",
      },
    },
    series: [
      {
        name: "Orders",
        data: orderStats.orderDistribution.map((item) => item.orders),
      },
    ],
    tooltip: {
      y: {
        formatter: (val) => `${val} orders`,
      },
    },
  };

  const fetchData = async () => {
    try {
      const response = await secureAxios.get("/shop/dashboard");
      setOrderStats(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
    }
  };

  return (
    <DashboardLayout title="Dashboard" description="Account analysis">
      <div className="flex flex-col gap-4 mx-auto w-full h-full container">
        <div className="gap-4 grid grid-cols-2 lg:grid-cols-5">
          <Card className="flex flex-col justify-center items-center p-6">
            <h3 className="mb-4 text-lg">Total Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.totalOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6">
            <h3 className="mb-4 text-lg">Pending Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.pendingOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6">
            <h3 className="mb-4 text-lg">Accepted Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.acceptedOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6">
            <h3 className="mb-4 text-lg">Shipped Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.shippedOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6">
            <h3 className="mb-4 text-lg">Cancelled Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.cancelledOrders}
            </div>
          </Card>
        </div>
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 font-bold text-xl">Order Distribution</h3>
            {orderStats.orderDistribution.length > 0 ? (
              <div id="pricechart" className="w-full h-fit"></div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No data available
              </div>
            )}
          </Card>
          <Card className="flex flex-col space-y-4 p-6 w-full">
            <div className="flex justify-between items-center space-x-2">
              <h2 className="font-semibold text-lg">Your Cart</h2>
              <Button
                className="text-black"
                onClick={() => router.push("/shop/dashboard/cart")}
              >
                View all
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="bg-gray-50 rounded-xl w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="p-3 font-semibold text-sm text-left">
                      Product ID
                    </th>
                    <th className="p-3 font-semibold text-sm text-left">
                      Category
                    </th>
                    <th className="p-3 font-semibold text-sm text-left">
                      Quantity
                    </th>
                    <th className="p-3 font-semibold text-sm text-left">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-gray-500 text-center">
                        Your cart is empty
                      </td>
                    </tr>
                  ) : (
                    cart.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 border-border border-b"
                      >
                        <td className="p-3">
                          <span className="font-mono font-medium text-sm">
                            {order.id}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{order.category}</td>
                        <td className="p-3">
                          <span className="font-semibold">
                            {order.quantity}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-green-600">
                            ${order.price.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Index;
