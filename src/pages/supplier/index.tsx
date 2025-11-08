import Card from "@/components/ui/Card";
import React, { useEffect } from "react";
import { ApexOptions } from "apexcharts";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "@/components/toast/toast";
import DashboardLayout from "@/layouts/DashboardLayout";

function Index() {
  const { secureAxios } = useAxios();
  const [orderStats, setOrderStats] = React.useState<OrderStats>({
    acceptedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalOrders: 0,
    orderDistribution: [],
  });
  const [topSelling, setTopSelling] = React.useState<TopSelling[]>([]);

  useEffect(() => {
    fetchData();
    getAds();
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

  const getAds = async () => {
    try {
      const response = await secureAxios.get(`/shop/topselling`);
      if (response.data.topSelling) {
        setTopSelling(response.data.topSelling);
      } else {
        setTopSelling([]);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? err.message,
        variant: "error",
      });
    }
  };

  return (
    <DashboardLayout
      title="Dashboard"
      description="Account analysis"
      isSupplier
    >
      <div className="flex flex-col gap-4 mx-auto w-full h-full container">
        <div className="gap-4 grid grid-cols-2 lg:grid-cols-5">
          <Card className="flex flex-col justify-center items-center p-6 text-center">
            <h3 className="mb-4 text-lg">Total Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.totalOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6 text-center">
            <h3 className="mb-4 text-lg">Pending Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.pendingOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6 text-center">
            <h3 className="mb-4 text-lg">Accepted Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.acceptedOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6 text-center">
            <h3 className="mb-4 text-lg">Shipped Orders</h3>
            <div className="font-semibold text-xl">
              {orderStats.shippedOrders}
            </div>
          </Card>
          <Card className="flex flex-col justify-center items-center p-6 text-center">
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
              <h2 className="font-semibold text-lg">Top Selling Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="bg-gray-50 rounded-xl w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="p-3 font-semibold text-sm text-left">
                      Product ID
                    </th>
                    <th className="p-3 font-semibold text-sm text-left">
                      Name
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
                  {topSelling.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-gray-500 text-center">
                        No top selling products
                      </td>
                    </tr>
                  ) : (
                    topSelling.map((ad) => {
                      return (
                        <tr
                          key={ad.id}
                          className="hover:bg-gray-50 border-border border-b"
                        >
                          <td className="p-3">
                            <span className="font-mono font-medium text-sm">
                              {ad.id}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold">{ad.name}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold">{ad.quantity}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-green-600">
                              ${ad.totalPrice?.toFixed(2) ?? 0}
                            </span>
                          </td>
                        </tr>
                      );
                    })
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
