import Card from "@/components/ui/Card";
import { TbTrash } from "react-icons/tb";
import { ApexOptions } from "apexcharts";
import { useAxios } from "@/hooks/useAxios";
import { CiMenuKebab } from "react-icons/ci";
import Button from "@/components/buttons/Button";
import { toast } from "@/components/toast/toast";
import Pagination from "@/components/Pagination";
import { MdAdd, MdModeEdit } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useModal } from "@/components/modals/Modal";
import { IoAdd, IoEyeOutline } from "react-icons/io5";
import DashboardLayout from "@/layouts/DashboardLayout";
import CategoryModal from "@/components/modals/Category";
import { TableRowSkeleton } from "@/components/ui/Shimmer";
import DeleteCategory from "@/components/modals/DeleteCategory";
import FxDropdown, { DropdownItem } from "@/components/dropdown/FxDropDown";

function Index() {
  const { secureAxios } = useAxios();
  const { openModal, closeModal } = useModal();
  const [catePages, setCatePages] = useState(1);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalCategoriesPages, setTotalCategoriesPages] = useState(1);
  const [topSelling, setTopSelling] = React.useState<TopSelling[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [dashboardStats, setDashboardStats] = React.useState<DashboardStats>({
    acceptedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalOrders: 0,
    orderDistribution: [],
    activeUsers: 0,
    expiredSubscriptions: 0,
    pendingUsers: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    totalRetailers: 0,
  });

  useEffect(() => {
    if (catePages > 1) getCategories();
  }, [catePages]);

  useEffect(() => {
    getAdminData();
  }, []);

  useEffect(() => {
    let orderChart: any;
    let userChart: any;
    let distributionChart: any;
    let isMounted = true;

    (async () => {
      const ApexCharts = (await import("apexcharts")).default;

      const distributionEl = document.querySelector("#distributionChart");
      if (
        distributionEl &&
        isMounted &&
        dashboardStats.orderDistribution.length > 0
      ) {
        const existingChart = (distributionEl as any)._apexChart;
        if (existingChart) existingChart.destroy();
        distributionEl.innerHTML = "";

        distributionChart = new ApexCharts(
          distributionEl,
          orderDistributionOptions
        );
        (distributionEl as any)._apexChart = distributionChart;
        await distributionChart.render();
      }

      const orderEl = document.querySelector("#orderChart");
      if (orderEl && isMounted) {
        const existingChart = (orderEl as any)._apexChart;
        if (existingChart) existingChart.destroy();
        orderEl.innerHTML = "";

        orderChart = new ApexCharts(orderEl, ordersPieChartOptions);
        (orderEl as any)._apexChart = orderChart;
        await orderChart.render();
      }

      const userEl = document.querySelector("#userChart");
      if (userEl && isMounted) {
        const existingChart = (userEl as any)._apexChart;
        if (existingChart) existingChart.destroy();
        userEl.innerHTML = "";

        userChart = new ApexCharts(userEl, usersPieChartOptions);
        (userEl as any)._apexChart = userChart;
        await userChart.render();
      }
    })();

    return () => {
      isMounted = false;
      if (orderChart) orderChart.destroy();
      if (userChart) userChart.destroy();
      if (distributionChart) distributionChart.destroy();
    };
  }, [dashboardStats]);

  const declinedUsers =
    dashboardStats.totalUsers -
    dashboardStats.activeUsers -
    dashboardStats.pendingUsers;

  const orderDistributionOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#3475eb"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dashboardStats.orderDistribution.map((item) => item.month),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Orders",
        style: {
          fontSize: "12px",
        },
      },
    },
    series: [
      {
        name: "Orders",
        data: dashboardStats.orderDistribution.map((item) => item.orders),
      },
    ],
    tooltip: {
      y: {
        formatter: (val) => `${val} orders`,
      },
    },
  };

  const ordersPieChartOptions: ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ["#10b981", "#3475eb", "#f59e0b", "#ef4444"],
    labels: ["Accepted", "Shipped", "Pending", "Cancelled"],
    series: [
      dashboardStats.acceptedOrders,
      dashboardStats.shippedOrders,
      dashboardStats.pendingOrders,
      dashboardStats.cancelledOrders,
    ],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Orders",
              fontSize: "14px",
              formatter: () => dashboardStats.totalOrders.toString(),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} orders`,
      },
    },
  };

  const usersPieChartOptions: ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ["#10b981", "#f59e0b", "#ef4444"],
    labels: ["Active", "Pending", "Declined"],
    series: [
      dashboardStats.activeUsers,
      dashboardStats.pendingUsers,
      declinedUsers > 0 ? declinedUsers : 0,
    ],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Users",
              fontSize: "14px",
              formatter: () => dashboardStats.totalUsers.toString(),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} users`,
      },
    },
  };

  const getAdminData = async () => {
    await secureAxios
      .get("/admin/dashboard")
      .then((res) => {
        getTopSelling();
        setDashboardStats(res.data);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.response?.data?.message ?? err.message,
          variant: "error",
        });
      });
  };

  const getCategories = async () => {
    setIsFetchingCategories(true);
    await secureAxios
      .get(`/shop/categories?page=${catePages}&limit=5`)
      .then((res) => {
        if (res.data.categories) {
          setCategories(res.data.categories);
          setTotalCategoriesPages(res.data.pages);
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.response?.data?.message ?? err.message,
          variant: "error",
        });
      })
      .finally(() => {
        setIsFetchingCategories(false);
      });
  };

  const getTopSelling = async () => {
    try {
      const response = await secureAxios.get(`/shop/topselling`);
      getCategories();
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

  const stats = [
    {
      title: "Total Users",
      value: dashboardStats.totalUsers,
    },
    {
      title: "Total Suppliers",
      value: dashboardStats.totalSuppliers,
    },
    {
      title: "Total Retailers",
      value: dashboardStats.totalRetailers,
    },
    {
      title: "Total Products",
      value: dashboardStats.totalProducts,
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders,
    },
  ];

  return (
    <DashboardLayout
      isAdmin
      title="Dashboard"
      description="Manage your dashboard"
    >
      <div className="flex flex-col gap-4 mx-auto pb-10 w-full container">
        {/* Stats Cards */}
        <div className="gap-4 grid grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="flex flex-col justify-center items-center gap-2 p-4"
            >
              <div className="text-muted-foreground text-sm">{stat.title}</div>
              <div className="font-bold text-primary text-2xl">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="mb-4 font-bold text-xl">Order Status</h3>
            {dashboardStats.totalOrders > 0 ? (
              <div id="orderChart" className="w-full h-fit"></div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No orders data available
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-bold text-xl">User Status</h3>
            {dashboardStats.totalUsers > 0 ? (
              <div id="userChart" className="w-full h-fit"></div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No users data available
              </div>
            )}
          </Card>

          <Card className="flex flex-col space-y-4 p-6 w-full">
            <div className="flex justify-between items-center space-x-2">
              <h2 className="font-semibold text-lg">Top Selling Products</h2>
            </div>
            <div className="flex flex-col space-y-2 overflow-x-auto">
              {topSelling.length === 0 ? (
                <div className="flex justify-center items-center w-full h-64">
                  <span className="p-8 text-gray-500 text-center">
                    No top selling products
                  </span>
                </div>
              ) : (
                topSelling.map((ad) => {
                  return (
                    <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="bg-warning rounded-full w-3 h-3"></div>
                        <span className="text-sm">{ad.name}</span>
                      </div>
                      <span className="font-semibold">{ad.quantity} units</span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 font-bold text-xl">Order Distribution</h3>
            {dashboardStats.orderDistribution.length > 0 ? (
              <div id="distributionChart" className="w-full h-fit"></div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No data available
              </div>
            )}
          </Card>
          <Card className="p-6 py-4">
            <div className="flex justify-between items-center space-x-4">
              <h3 className="mb-4 font-bold text-xl">Categories</h3>
              <Button
                className="bg-primary rounded-xl"
                onClick={() =>
                  openModal(
                    <CategoryModal
                      type="add"
                      onDone={getCategories}
                      closeModal={closeModal}
                    />
                  )
                }
              >
                <MdAdd className="w-5 h-5" />
                <span>Add Category</span>
              </Button>
            </div>
            <div className="flex flex-col space-y-3 pt-5 pb-20 overflow-x-auto">
              <table className="bg-gray-50 rounded-xl w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="p-3 font-semibold text-sm text-left">
                      Category ID
                    </th>
                    <th className="p-3 font-semibold text-sm text-left">
                      Name
                    </th>
                    <th className="p-3 font-semibold text-sm text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {isFetchingCategories ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRowSkeleton key={i} columns={3} />
                    ))
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-gray-500 text-center">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        getCategories={getCategories}
                      />
                    ))
                  )}
                </tbody>
              </table>
              {totalCategoriesPages > 1 && (
                <Pagination
                  className="flex ml-auto"
                  pageNumber={catePages}
                  limit={5}
                  variant="primary"
                  setPageNumber={setCatePages}
                  contentsLength={categories.length}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

const CategoryRow = ({
  category,
  getCategories,
}: {
  category: ICategory;
  getCategories: () => Promise<void>;
}) => {
  const { openModal, closeModal } = useModal();

  const actions = [
    {
      name: "View sub-categories",
      icon: IoEyeOutline,
      description: "View sub-categories of " + category.name,
      onClick: () =>
        openModal(
          <CategoryModal
            type="add"
            isChild
            parentId={category.id}
            onDone={getCategories}
            closeModal={closeModal}
          />
        ),
    },
    {
      name: "Add sub-category",
      icon: IoAdd,
      description: "Add a sub-category to " + category.name,
      onClick: () =>
        openModal(
          <CategoryModal
            type="add"
            isChild
            parentId={category.id}
            onDone={getCategories}
            closeModal={closeModal}
          />
        ),
    },
    {
      name: "Update details",
      icon: MdModeEdit,
      description: "Update " + category.name + " details",
      onClick: () =>
        openModal(
          <CategoryModal
            type="edit"
            onDone={getCategories}
            category={category}
            closeModal={closeModal}
          />
        ),
    },
    {
      name: "Delete category",
      icon: TbTrash,
      description: "Delete " + category.name + " from store.",
      onClick: () =>
        openModal(
          <DeleteCategory
            closeModal={closeModal}
            onDone={getCategories}
            category={category}
          />
        ),
    },
  ];

  return (
    <tr key={category.id} className="hover:bg-gray-50 border-border border-b">
      <td className="p-3">
        <span className="font-mono font-medium text-sm">{category.id}</span>
      </td>
      <td className="p-3">
        <span className="font-semibold">{category.name}</span>
      </td>
      <td className="relative flex justify-end items-end p-3">
        <span className="font-semibold">
          <FxDropdown
            align="right"
            trigger={
              <div className="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2.5 text-primary">
                <CiMenuKebab size={20} />
              </div>
            }
            classnames={{
              dropdown: "w-72",
            }}
          >
            {actions.map((action, index) => (
              <DropdownItem key={index} onClick={action.onClick}>
                <div className="flex items-center space-x-3">
                  <action.icon className="w-5 h-5 text-gray-500" />
                  <div className="flex flex-col">
                    <span>{action.name}</span>
                    {/* <span className="text-gray-500 text-xxs">
                      {action.description}
                    </span> */}
                  </div>
                </div>
              </DropdownItem>
            ))}
          </FxDropdown>
        </span>
      </td>
    </tr>
  );
};

export default Index;
