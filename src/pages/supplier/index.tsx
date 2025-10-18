import Card from "@/components/ui/Card";
import { ApexOptions } from "apexcharts";
import useAppStore from "@/stores/AppStore";
import React, { useEffect, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { products } from "@/utils/demodata";
import { StarRating } from "@/components/StarRating";

function Index() {
  const dxproducts = useAppStore((state) => state.products);
  const orders = useAppStore((state) => state.orders);

  useEffect(() => {
    useAppStore.setState((state) => {
      state.products = products;
    });
  }, []);

  const analytics = useMemo(() => {
    const totalProducts = dxproducts.length;
    const inStockProducts = dxproducts.filter((p) => p.inStock).length;
    const outOfStockProducts = totalProducts - inStockProducts;

    const categoryCount = dxproducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRatedProducts = [...dxproducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const companyCount = dxproducts.reduce((acc, product) => {
      acc[product.company] = (acc[product.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priceRanges = {
      "0-50": 0,
      "51-100": 0,
      "101-200": 0,
      "201-500": 0,
      "500+": 0,
    };

    dxproducts.forEach((product) => {
      const price = product.newPrice;
      if (price <= 50) priceRanges["0-50"]++;
      else if (price <= 100) priceRanges["51-100"]++;
      else if (price <= 200) priceRanges["101-200"]++;
      else if (price <= 500) priceRanges["201-500"]++;
      else priceRanges["500+"]++;
    });

    // Average discount
    const avgDiscount =
      dxproducts.reduce((sum, p) => sum + p.discount, 0) / totalProducts || 0;

    // Average rating
    const avgRating =
      dxproducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts || 0;

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      categoryCount,
      topRatedProducts,
      companyCount,
      priceRanges,
      avgDiscount,
      avgRating,
      totalOrders: orders.length,
    };
  }, [dxproducts, orders]);

  const categoryChartOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: Object.keys(analytics.categoryCount),
    series: Object.values(analytics.categoryCount),
  };

  const priceRangeChartOptions: ApexOptions = {
    chart: { type: "bar" },
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
  }, [orders, categoryChartOptions, priceRangeChartOptions, dxproducts]);

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
              <span className="text-gray-500 text-sm">Average Rating</span>
              <span className="font-bold text-3xl">
                {analytics.avgRating.toFixed(1)}
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col space-y-2">
              <span className="text-gray-500 text-sm">Total Orders</span>
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

        {/* Top Rated Products */}
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-xl">Top Rated Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-strokedark border-b">
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Rating</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topRatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 border-strokedark border-b"
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="rounded w-12 h-12 object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">
                      <span className="font-semibold">${product.newPrice}</span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center">
                        <StarRating rating={product.rating} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Index;
