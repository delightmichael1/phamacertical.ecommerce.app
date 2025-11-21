import Image from "next/image";
import { toast } from "../toast/toast";
import React, { useEffect } from "react";
import { useAxios } from "@/hooks/useAxios";
import { ApexOptions } from "apexcharts";

interface Props {
  productId: string;
  closeModal: () => void;
}

type Analysis = {
  product: string;
  city: string;
  orderCount: number;
  totalQuantity: number;
};

function ProductAnalysis(props: Props) {
  const { secureAxios } = useAxios();
  const [city, setCity] = React.useState("");
  const [height, setHeight] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [productAnalysis, setProductAnalysis] = React.useState<Analysis[]>([]);

  const graphOptions: ApexOptions = {
    series: [
      {
        name: "Order Count",
        data: productAnalysis.map((item) => item.orderCount),
      },
      {
        name: "Total quantity",
        data: productAnalysis.map((item) => item.totalQuantity),
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: productAnalysis.map((item) => item.city.capitalize()),
    },
    yaxis: {
      title: {
        text: "Orders",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val;
        },
      },
    },
  };

  useEffect(() => {
    let analysisChart: any;
    let isMounted = true;

    (async () => {
      const ApexCharts = (await import("apexcharts")).default;

      const catEl = document.querySelector("#analysisChart");

      if (!catEl || !isMounted) return;

      const existingCatChart = (catEl as any)._apexChart;

      if (existingCatChart) {
        existingCatChart.destroy();
      }

      catEl.innerHTML = "";

      if (!isMounted) return;

      analysisChart = new ApexCharts(catEl, graphOptions);

      (catEl as any)._apexChart = analysisChart;

      await analysisChart.render();
    })();

    return () => {
      isMounted = false;
      if (analysisChart) analysisChart.destroy();
    };
  }, [productAnalysis]);

  React.useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getProductAnalysis();
  }, [props.productId, city]);

  const getProductAnalysis = async () => {
    setIsLoading(true);
    await secureAxios
      .get(`/shop/orders-count?product=${props.productId}&city=${city}`)
      .then((res) => {
        setProductAnalysis(res.data.productOrderCount);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.response?.data?.message ?? err.message,
          variant: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      style={{ maxHeight: `${0.8 * height}px` }}
      className="flex flex-col items-center space-y-4 px-6 pb-10 w-full lg:w-[60rem] h-full overflow-y-auto"
    >
      <span className="mt-1 mb-10 font-bold text-2xl">Product Analysis</span>
      <div className="flex flex-col space-y-4 mt-4 w-full">
        <div id="analysisChart" />
      </div>
    </div>
  );
}

export default ProductAnalysis;
