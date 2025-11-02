"use client";
import { useRouter } from "next/router";
import Product from "@/components/Product";
import { useAxios } from "@/hooks/useAxios";
import Dropdown from "@/components/dropdown/Dropdown";
import React, { use, useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import SearchInput from "@/components/input/SearchInput";
import { CardSkeleton } from "@/components/ui/Shimmer";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "@/components/Pagination";
import FxDropdown, { DropdownItem } from "@/components/dropdown/FxDropDown";
import { MdMenu } from "react-icons/md";
import { useModal } from "@/components/modals/Modal";
import AcceptOrderModal from "@/components/modals/Order";

function Order() {
  const router = useRouter();
  const { id } = router.query;
  const { secureAxios } = useAxios();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState("Newest");
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderProducts, setOrderProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    if (!id) {
      router.back();
    } else {
      getOrder();
    }
  }, [sort, page, id]);

  const getOrder = async () => {
    setIsLoading(true);
    let fxSort = -1;
    if (sort === "Newest") fxSort = -1;
    else if (sort === "Oldest") fxSort = 1;
    await secureAxios
      .get(`/shop/orders/${id}?page=${page}&limit=20&sort=${fxSort}`)
      .then((res) => {
        setOrderProducts(res.data.products);
        setPages(res.data.pages);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <DashboardLayout isSupplier title="Order" description={"Id: #" + id}>
      <div className="flex flex-col space-y-4 mx-auto container">
        <div className="flex justify-between items-center">
          <SearchInput onChange={(e) => setSearchQuery(e)} />
          <div className="flex items-center space-x-4">
            <span>Sort by:</span>
            <Dropdown
              classNames={{
                container: "w-56",
                trigger:
                  "text-primary w-56 justify-between border border-primary px-4 py-2 rounded-lg",
              }}
              options={["Newest", "Oldest"]}
              onClick={(e) => setSort(e)}
            />
            <FxDropdown
              align="right"
              trigger={
                <div className="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2.5 border border-primary rounded-lg text-primary">
                  <MdMenu />
                </div>
              }
              classnames={{
                dropdown: "w-48",
              }}
            >
              <DropdownItem
                onClick={() =>
                  openModal(
                    <AcceptOrderModal
                      orderId={id as string}
                      closeModal={closeModal}
                      type={"approve"}
                    />
                  )
                }
              >
                Approve
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  openModal(
                    <AcceptOrderModal
                      orderId={id as string}
                      closeModal={closeModal}
                      type={"reject"}
                    />
                  )
                }
              >
                Decline
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  openModal(
                    <AcceptOrderModal
                      orderId={id as string}
                      closeModal={closeModal}
                      type={"update"}
                    />
                  )
                }
              >
                Update
              </DropdownItem>
            </FxDropdown>
          </div>
        </div>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-4">
          {!isLoading &&
            orderProducts
              .filter((product) => {
                return product.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              })
              .map((product, index) => {
                return (
                  <Product
                    isOrder
                    key={index}
                    isSupplier={true}
                    product={product}
                    id={product.id}
                  />
                );
              })}
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.5, scale: 0.9 }}
                  transition={{ duration: 1, type: "spring" }}
                >
                  <CardSkeleton key={index} />
                </motion.div>
              </AnimatePresence>
            ))}
        </div>
        {pages > 1 && (
          <Pagination
            contentsLength={orderProducts.length}
            pageNumber={page}
            setPageNumber={setPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Order;
