import Image from "next/image";
import { v4 as uuid } from "uuid";
import debounce from "lodash.debounce";
import Card from "@/components/ui/Card";
import Product from "@/components/Product";
import useAppStore from "@/stores/AppStore";
import { useAxios } from "@/hooks/useAxios";
import { BiCalendar } from "react-icons/bi";
import { RiAddLargeLine } from "react-icons/ri";
import Button from "@/components/buttons/Button";
import useUserStore from "@/stores/useUserStore";
import { toast } from "@/components/toast/toast";
import Pagination from "@/components/Pagination";
import React, { useEffect, useState } from "react";
import { useModal } from "@/components/modals/Modal";
import CategoryCard from "@/components/CategoryCard";
import Dropdown from "@/components/dropdown/Dropdown";
import { CardSkeleton } from "@/components/ui/Shimmer";
import { AnimatePresence, motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import AddProduct from "@/components/modals/AddProduct";
import useProductsRoutes from "@/hooks/useProductsRoutes";
import DateFieldWithOnChange from "@/components/input/DatePickerWithOnChange";

type Props = {
  filter: ICategory[];
  subCategoryfilter: ISubCategory[];
  setFilter: React.Dispatch<React.SetStateAction<ICategory[]>>;
  setSubCategoryfilter: React.Dispatch<React.SetStateAction<ISubCategory[]>>;
};

function Index() {
  const [filter, setFilter] = React.useState<ICategory[]>([]);
  const [subCategoryfilter, setSubCategoryfilter] = React.useState<
    ISubCategory[]
  >([]);

  useEffect(() => {
    useAppStore.setState((state) => {
      state.showCartConfirmDialog = true;
    });
  }, []);

  return (
    <DashboardLayout
      title="Products"
      description="Manage your products"
      isSupplier
    >
      <div className="flex flex-col space-y-8 w-full">
        <div className="flex lg:flex-row flex-col lg:space-x-4 space-y-4 lg:space-y-0 mx-auto w-full h-fit container">
          <div className="w-full lg:w-1/4">
            <LeftSide
              filter={filter}
              setFilter={setFilter}
              setSubCategoryfilter={setSubCategoryfilter}
              subCategoryfilter={subCategoryfilter}
            />
          </div>
          <div className="w-full lg:w-3/4">
            <RightSide
              filter={filter}
              setFilter={setFilter}
              setSubCategoryfilter={setSubCategoryfilter}
              subCategoryfilter={subCategoryfilter}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const LeftSide: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col space-y-6 w-full">
      <CategoryCard
        categoryfilter={props.filter}
        setCategoryfilter={props.setFilter}
        setSubCategoryfilter={props.setSubCategoryfilter}
        subCategoryfilter={props.subCategoryfilter}
      />
    </div>
  );
};
const RightSide: React.FC<Props> = (props) => {
  const { secureAxios } = useAxios();
  const { openModal } = useModal();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { getProducts } = useProductsRoutes();
  const [isLoading, setIsLoading] = useState(false);
  const products = useAppStore((state) => state.products);
  const [sort, setSort] = useState<"Newest" | "Oldest">("Newest");
  const id = useUserStore((state) =>
    state.role.includes("super") ? state.id : state.administrator
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [endDate, setEndDate] = useState<string>("");
  const [isCreatingAd, setIsCreatingAd] = useState(false);

  const handlDelete = (id: string) => {
    props.setFilter(props.filter.filter((item) => item.id !== id));
  };

  const handlDeleteSubCategory = (subCategory: ISubCategory) => {
    props.setSubCategoryfilter(
      props.subCategoryfilter.filter((item) => item !== subCategory)
    );
  };

  const debouncedSearch = React.useCallback(
    debounce(async (filter: ICategory[]) => {
      if (id)
        getProducts(
          sort,
          page,
          filter.map((item) => item.id),
          [id],
          setIsLoading,
          setPages
        );
    }, 500),
    [id, page, sort]
  );

  React.useEffect(() => {
    debouncedSearch(props.filter);
    return debouncedSearch.cancel;
  }, [props.filter, debouncedSearch, id, page, sort]);

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleCreateAds = async () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product",
        variant: "error",
      });
      return;
    }

    if (!endDate) {
      toast({
        title: "Error",
        description: "Please select an end date",
        variant: "error",
      });
      return;
    }

    setIsCreatingAd(true);

    try {
      const promises = Array.from(selectedProducts).map((productId) =>
        secureAxios.post("/shop/hotdeals", {
          productId,
          expiryDate: new Date(endDate).getTime(),
        })
      );

      await Promise.all(promises);

      const data = {
        products: Array.from(selectedProducts),
        expiryDate: new Date(endDate).getTime(),
      };

      const response = await secureAxios.post("/shop/hotdeals", data);

      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });

      setSelectedProducts(new Set());
      setEndDate("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message ?? err.message,
        variant: "error",
      });
    } finally {
      setIsCreatingAd(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full h-full">
      <div className="flex justify-between items-center space-x-4 text-lg">
        <span>Showing {products?.length ?? 0} products</span>
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
          <Button
            className="bg-primary rounded-lg text-sm"
            onClick={() => openModal(<AddProduct />)}
          >
            <RiAddLargeLine className="w-4 h-4" />
            <span>Add New</span>
          </Button>
        </div>
      </div>
      {props.filter.length > 0 && (
        <div className="flex flex-col space-y-4 bg-card p-4 rounded-lg">
          <span>Active Filters</span>
          <div className="flex flex-wrap gap-4">
            {props.filter.map((value) => (
              <div className="flex items-center space-x-2 bg-primary/10 px-2 py-1 rounded-full text-sm">
                <span>{value.name}</span>
                <button
                  onClick={() => handlDelete(value.id)}
                  className="text-red-500 cursor-pointer"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {props.subCategoryfilter.length > 0 && (
        <div className="flex flex-col space-y-4 bg-card p-4 rounded-lg">
          <span>Active sub-category filters</span>
          <div className="flex flex-wrap gap-4">
            {props.subCategoryfilter.map((value) => (
              <div className="flex items-center space-x-2 bg-primary/10 px-2 py-1 rounded-full text-sm">
                <span>{value.name}</span>
                <button
                  onClick={() => handlDeleteSubCategory(value)}
                  className="text-red-500 cursor-pointer"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedProducts.size > 0 && (
        <Card className="bg-card p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {selectedProducts.size} product(s) selected
              </span>
              <button
                onClick={() => setSelectedProducts(new Set())}
                className="text-red-500 text-sm hover:underline cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-end space-x-4">
              <div className="flex flex-col flex-1 space-y-2">
                <label htmlFor="endDate" className="font-medium text-sm">
                  Advertisement End Date
                </label>
                <DateFieldWithOnChange
                  label="Expiry Date"
                  minDate={new Date()}
                  icon={<BiCalendar className="w-6 h-6 text-black" />}
                  onChange={(e) => setEndDate(e)}
                  classnames={{
                    input: "bg-transparent",
                  }}
                />
              </div>
              <Button
                className="bg-primary rounded-lg text-sm"
                onClick={handleCreateAds}
                disabled={isCreatingAd}
                isLoading={isCreatingAd}
              >
                Create Advertisements
              </Button>
            </div>
          </div>
        </Card>
      )}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!isLoading &&
          products.map((product, index) => (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5, scale: 0.9 }}
                transition={{ duration: 1, type: "spring" }}
                key={index}
              >
                <Product
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.has(product.id)}
                  onAdButtonClick={() => handleProductSelect(product.id)}
                  id={uuid()}
                  isSupplier
                />
              </motion.div>
            </AnimatePresence>
          ))}
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
      {!isLoading && products.length === 0 && (
        <div className="flex flex-col justify-center items-center space-y-4 w-full h-full">
          <Image
            src="/svgs/empty-cart.svg"
            alt="empty cart"
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-xl w-full max-w-[10rem] object-cover aspect-square"
          />
          <span className="font-bold text-xl">Your product list is empty</span>
        </div>
      )}
      {pages > 1 && (
        <Pagination
          pageNumber={page}
          setPageNumber={setPage}
          contentsLength={products.length}
        />
      )}
    </div>
  );
};

export default Index;
