import Image from "next/image";
import debounce from "lodash.debounce";
import { BiPlus } from "react-icons/bi";
import React, { useState } from "react";
import Product from "@/components/Product";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/AppStore";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "@/components/toast/toast";
import Pagination from "@/components/Pagination";
import Button from "@/components/buttons/Button";
import useUserStore from "@/stores/useUserStore";
import Dropdown from "@/components/dropdown/Dropdown";
import { CardSkeleton } from "@/components/ui/Shimmer";
import { AnimatePresence, motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getDaysRemaining, isExpired } from "@/utils/constants";

function AdsDisplay() {
  const router = useRouter();
  const { secureAxios } = useAxios();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("All");
  const ads = useAppStore((state) => state.ads);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = React.useState<string[]>([]);
  const [sort, setSort] = useState<"Newest" | "Oldest">("Newest");

  const id = useUserStore((state) =>
    state.role.includes("super") ? state.id : state.administrator
  );

  const handleDelete = (name: string) => {
    setFilter(filter.filter((item) => item !== name));
  };

  const getAds = async () => {
    setIsLoading(true);
    let fxsort = -1;
    if (sort === "Newest") fxsort = -1;
    else if (sort === "Oldest") fxsort = 1;
    try {
      const response = await secureAxios.get(
        `/shop/hotdeals?page=${page}&limit=10&supplier=${id}&sort=${fxsort}${
          status !== "All" ? `&status=${status.toLowerCase()}` : ""
        }`
      );

      console.log(response);
      if (response.data.products) {
        useAppStore.setState((state) => {
          state.ads = response.data.products;
        });
        setPages(response.data.pages || 1);
      } else {
        useAppStore.setState((state) => {
          state.ads = [];
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? err.message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = React.useCallback(
    debounce(async () => {
      await getAds();
    }, 500),
    [page, sort, filter, status]
  );

  React.useEffect(() => {
    debouncedSearch();
    return debouncedSearch.cancel;
  }, [filter, page, sort, status]);

  return (
    <DashboardLayout
      title="My Advertisements"
      description="View and manage your active advertisements"
      isSupplier
    >
      <div className="flex lg:flex-row flex-col lg:space-x-4 space-y-4 lg:space-y-0 mx-auto w-full h-fit container">
        <div className="flex flex-col space-y-4 w-full h-full">
          <div className="flex justify-between items-center space-x-4 text-lg">
            <span>Showing {ads?.length ?? 0} advertisements</span>
            <div className="flex items-center space-x-4">
              <span>Sort by:</span>
              <Dropdown
                classNames={{
                  container: "w-56",
                  trigger:
                    "text-primary w-56 justify-between border border-primary px-4 py-2 rounded-lg text-sm",
                }}
                onClick={(value) => setSort(value as "Newest" | "Oldest")}
                options={["Newest", "Oldest"]}
              />
              <Dropdown
                classNames={{
                  container: "w-56",
                  trigger:
                    "text-primary w-56 justify-between border border-primary px-4 py-2 rounded-lg text-sm",
                }}
                onClick={(value) => setStatus(value as "Active" | "Stopped")}
                options={["All", "Active", "Stopped"]}
              />
            </div>
          </div>

          {filter.length > 0 && (
            <div className="flex flex-col space-y-4 bg-card p-4 rounded-lg">
              <span>Active Filters</span>
              <div className="flex flex-wrap gap-4">
                {filter.map((value) => (
                  <div
                    key={value}
                    className="flex items-center space-x-2 bg-primary/10 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{value}</span>
                    <button
                      onClick={() => handleDelete(value)}
                      className="text-red-500 cursor-pointer"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isLoading &&
              ads.map((ad, index) => {
                const daysRemaining = getDaysRemaining(ad.expiryDate);

                return (
                  <AnimatePresence key={ad.id}>
                    <motion.div
                      initial={{ opacity: 0.5, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.5, scale: 0.9 }}
                      transition={{ duration: 1, type: "spring" }}
                    >
                      <div className="relative">
                        {ad.status === "active" && (
                          <div
                            className={`absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-xs font-semibold ${
                              daysRemaining <= 3
                                ? "bg-yellow-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {`${daysRemaining} day${
                              daysRemaining !== 1 ? "s" : ""
                            } left`}
                          </div>
                        )}
                        <Product product={ad} id={ad.id} isSupplier isAd />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                );
              })}
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <AnimatePresence key={index}>
                  <motion.div
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.5, scale: 0.9 }}
                    transition={{ duration: 1, type: "spring" }}
                  >
                    <CardSkeleton />
                  </motion.div>
                </AnimatePresence>
              ))}
          </div>

          {!isLoading && ads.length === 0 && (
            <div className="flex flex-col justify-center items-center space-y-4 py-60 w-full h-full">
              <Image
                src="/svgs/empty-cart.svg"
                alt="empty cart"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-xl w-full max-w-[10rem] object-cover aspect-square"
              />
              <span className="font-bold text-xl">No advertisements found</span>
              <span className="text-gray-600 text-sm">
                Create your first advertisement to get started
              </span>
              <Button
                className="bg-primary w-full max-w-fit h-12 text-sm"
                onClick={() => router.push("/supplier/products")}
              >
                <BiPlus className="w-5 h-5" />
                <span>Create Advertisement</span>
              </Button>
            </div>
          )}

          {pages > 1 && (
            <Pagination
              pageNumber={page}
              setPageNumber={setPage}
              contentsLength={ads.length}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdsDisplay;
