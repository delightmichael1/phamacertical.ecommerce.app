import Image from "next/image";
import Card from "@/components/ui/Card";
import React, { useMemo, useState } from "react";
import Dropdown from "@/components/dropdown/Dropdown";
import DashboardLayout from "@/layouts/DashboardLayout";
import SearchInput from "@/components/input/SearchInput";
import usePersistedStore from "@/stores/PersistedStored";
import { formatDate, getStatusBadgeClass } from "@/utils/constants";

function Orders() {
  const orders = usePersistedStore((state) => state.orders);
  const [sortBy, setSortBy] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");

  const analytics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgOrderValue = totalRevenue / totalOrders || 0;

    return {
      totalOrders,
      totalRevenue,
      statusCount,
      avgOrderValue,
      pending: statusCount["pending"] || 0,
      processing: statusCount["processing"] || 0,
      completed: statusCount["completed"] || 0,
      cancelled: statusCount["cancelled"] || 0,
    };
  }, [orders]);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Sort orders
    switch (sortBy) {
      case "Newest":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "Oldest":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "Price: Low to High":
        filtered.sort((a, b) => a.total - b.total);
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => b.total - a.total);
        break;
    }

    return filtered;
  }, [orders, searchQuery, sortBy]);

  return (
    <DashboardLayout
      title="Orders"
      description="Manage my orders list"
      isSupplier
    >
      <div className="flex flex-col space-y-4 mx-auto w-full h-full container">
        {orders.length > 0 && (
          <>
            {/* Analytics Cards */}
            <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
              <Card className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-xs">Total Orders</span>
                  <span className="font-bold text-2xl">
                    {analytics.totalOrders}
                  </span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-xs">Total Revenue</span>
                  <span className="font-bold text-green-600 text-2xl">
                    ${analytics.totalRevenue.toFixed(2)}
                  </span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-xs">Avg Order</span>
                  <span className="font-bold text-2xl">
                    ${analytics.avgOrderValue.toFixed(2)}
                  </span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-gray-500 text-xs">Completed</span>
                  <span className="font-bold text-blue-600 text-2xl">
                    {analytics.completed}
                  </span>
                </div>
              </Card>
            </div>

            {/* Status Overview */}
            <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Pending</span>
                  <span className="font-bold text-yellow-600 text-xl">
                    {analytics.pending}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Processing</span>
                  <span className="font-bold text-blue-600 text-xl">
                    {analytics.processing}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Completed</span>
                  <span className="font-bold text-green-600 text-xl">
                    {analytics.completed}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Cancelled</span>
                  <span className="font-bold text-red-600 text-xl">
                    {analytics.cancelled}
                  </span>
                </div>
              </Card>
            </div>
          </>
        )}

        <div className="w-full h-full overflow-y-auto">
          {orders.length === 0 ? (
            <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90%]">
              <Image
                src="/svgs/empty-cart.svg"
                alt="empty cart"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-xl w-full max-w-[20rem] object-cover aspect-square"
              />
              <span className="font-bold text-2xl">
                Your order list is empty
              </span>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
                <SearchInput />
                <div className="flex items-center space-x-4">
                  <span>Sort by:</span>
                  <Dropdown
                    classNames={{
                      container: "w-56",
                      trigger:
                        "text-primary w-56 justify-between border border-primary px-4 py-2 rounded-lg",
                    }}
                    options={[
                      "Newest",
                      "Oldest",
                      "Price: Low to High",
                      "Price: High to Low",
                    ]}
                    // onSelect={(option) => setSortBy(option)}
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-strokedark border-b">
                      <th className="p-3 font-semibold text-sm text-left">
                        Order ID
                      </th>
                      <th className="p-3 font-semibold text-sm text-left">
                        Customer
                      </th>
                      <th className="p-3 font-semibold text-sm text-left">
                        Date
                      </th>
                      <th className="p-3 font-semibold text-sm text-left">
                        Items
                      </th>
                      <th className="p-3 font-semibold text-sm text-left">
                        Total
                      </th>
                      <th className="p-3 font-semibold text-sm text-left">
                        Status
                      </th>
                      <th className="p-3 font-semibold text-sm text-left">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-8 text-gray-500 text-center"
                        >
                          No orders found matching your search
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 border-strokedark border-b"
                        >
                          <td className="p-3">
                            <span className="font-mono font-medium text-sm">
                              {order.id}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {order.customerName}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {order.customerEmail}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            {formatDate(order.date)}
                          </td>
                          <td className="p-3 text-sm">
                            {order.items.length} item
                            {order.items.length > 1 ? "s" : ""}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-green-600">
                              ${order.total.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm capitalize">
                              {order.paymentMethod}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              {/* {filteredAndSortedOrders.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-strokedark border-t">
                  <span className="text-gray-600 text-sm">
                    Showing {filteredAndSortedOrders.length} of {orders.length}{" "}
                    orders
                  </span>
                </div>
              )} */}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Orders;
