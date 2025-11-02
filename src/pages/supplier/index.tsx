import Card from "@/components/ui/Card";
import { ApexOptions } from "apexcharts";
import useAppStore from "@/stores/AppStore";
import React, { useEffect, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import usePersistedStore from "@/stores/PersistedStored";

function Index() {
  const orders = usePersistedStore((state) => state.orders);
  const products = useAppStore((state) => state.products);

  const analytics = useMemo(() => {
    const totalProducts = products.length;
    const inStockProducts = products.filter((p) => p.quantity).length;
    const outOfStockProducts = totalProducts - inStockProducts;

    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const companyCount = products.reduce((acc, product) => {
      acc[product.supplier.id] = (acc[product.supplier.id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priceRanges = {
      "0-50": 0,
      "51-100": 0,
      "101-200": 0,
      "201-500": 0,
      "500+": 0,
    };

    products.forEach((product) => {
      const price = product.price;
      if (price <= 50) priceRanges["0-50"]++;
      else if (price <= 100) priceRanges["51-100"]++;
      else if (price <= 200) priceRanges["101-200"]++;
      else if (price <= 500) priceRanges["201-500"]++;
      else priceRanges["500+"]++;
    });

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      categoryCount,
      companyCount,
      priceRanges,
      totalOrders: orders.length,
    };
  }, [products, orders]);

  const categoryChartOptions: ApexOptions = {
    chart: { type: "donut" },
    colors: ["#3475eb", "#3475eb", "#3475eb", "#3475eb", "#3475eb"],
    labels: Object.keys(analytics.categoryCount),
    series: Object.values(analytics.categoryCount),
  };

  const priceRangeChartOptions: ApexOptions = {
    chart: { type: "bar" },
    colors: ["#3475eb", "#3475eb", "#3475eb", "#3475eb", "#3475eb"],
    xaxis: { categories: Object.keys(analytics.priceRanges) },
    series: [{ data: Object.values(analytics.priceRanges) }],
  };

  useEffect(() => {
    let categoryChart: any;
    let priceChart: any;
    let isMounted = true;

    (async () => {
      const ApexCharts = (await import("apexcharts")).default;

      const catEl = document.querySelector("#categorychart");
      const priceEl = document.querySelector("#pricechart");

      if (!catEl || !priceEl || !isMounted) return;

      const existingCatChart = (catEl as any)._apexChart;
      const existingPriceChart = (priceEl as any)._apexChart;

      if (existingCatChart) {
        existingCatChart.destroy();
      }
      if (existingPriceChart) {
        existingPriceChart.destroy();
      }

      catEl.innerHTML = "";
      priceEl.innerHTML = "";

      if (!isMounted) return;

      categoryChart = new ApexCharts(catEl, categoryChartOptions);
      priceChart = new ApexCharts(priceEl, priceRangeChartOptions);

      (catEl as any)._apexChart = categoryChart;
      (priceEl as any)._apexChart = priceChart;

      await categoryChart.render();
      await priceChart.render();
    })();

    return () => {
      isMounted = false;
      if (categoryChart) categoryChart.destroy();
      if (priceChart) priceChart.destroy();
    };
  }, [orders, categoryChartOptions, priceRangeChartOptions, products]);

  return (
    <DashboardLayout
      title="Dashboard"
      description="Product analytics and insights"
      isSupplier
    >
      <div className="flex flex-col space-y-6 mx-auto w-full container">
        {/* Stats Cards */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex flex-col space-y-2">
              <span className="text-gray-500 text-sm">Total Products</span>
              <span className="font-bold text-3xl">
                {analytics.totalProducts}
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col space-y-2">
              <span className="text-gray-500 text-sm">Total Categories</span>
              <span className="font-bold text-green-600 text-3xl">
                {Object.keys(analytics.categoryCount).length}
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col space-y-2">
              <span className="text-gray-500 text-sm">Pending Orders</span>
              <span className="font-bold text-3xl">0</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col space-y-2">
              <span className="text-gray-500 text-sm">Fulfilled Orders</span>
              <span className="font-bold text-blue-600 text-3xl">
                {analytics.totalOrders}
              </span>
            </div>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 font-bold text-xl">Product by Category</h3>
            <div id="categorychart" className="w-full h-fit"></div>
          </Card>
          <Card className="p-6">
            <h3 className="mb-4 font-bold text-xl">Price Distribution</h3>
            <div id="pricechart" className="w-full h-fit"></div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Index;
