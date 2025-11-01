import Image from "next/image";
import { v4 as uuid } from "uuid";
import debounce from "lodash.debounce";
import Card from "@/components/ui/Card";
import Product from "@/components/Product";
import useAppStore from "@/stores/AppStore";
import { RiAddLargeLine } from "react-icons/ri";
import Button from "@/components/buttons/Button";
import { RxHamburgerMenu } from "react-icons/rx";
import useUserStore from "@/stores/useUserStore";
import React, { useEffect, useState } from "react";
import Checkbox from "@/components/input/Checkbox";
import { useModal } from "@/components/modals/Modal";
import Dropdown from "@/components/dropdown/Dropdown";
import { CardSkeleton } from "@/components/ui/Shimmer";
import { AnimatePresence, motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import AddProduct from "@/components/modals/AddProduct";
import useProductsRoutes from "@/hooks/useProductsRoutes";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "@/components/toast/toast";
import Pagination from "@/components/Pagination";

type Props = {
  filter: string[];
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
};

function Index() {
  const [filter, setFilter] = React.useState<string[]>([]);

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
            <LeftSide filter={filter} setFilter={setFilter} />
          </div>
          <div className="w-full lg:w-3/4">
            <RightSide filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const LeftSide: React.FC<Props> = (props) => {
  const { secureAxios } = useAxios();
  const [catePages, setCatePages] = useState(1);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setIsFetchingCategories(true);
    await secureAxios
      .get("/shop/categories?page=" + catePages)
      .then((res) => {
        console.log("Categories ", res.data);
        if (res.data.categories) {
          setCategories(res.data.categories);
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

  const handleCheckboxChange = (value: boolean, category: string) => {
    if (value) {
      props.setFilter([...props.filter, category]);
    } else {
      props.setFilter(props.filter.filter((item) => item !== category));
    }
  };
  return (
    <div className="flex flex-col space-y-6 w-full">
      <Card
        className="p-0"
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: {
            duration: 1,
            type: "spring",
          },
        }}
      >
        <div className="flex items-center space-x-4 p-4 border-strokedark border-b font-semibold text-lg">
          <RxHamburgerMenu className="w-6 h-6" />
          <h2>Categories</h2>
        </div>
        <div className="p-4">
          {categories.map((category, index) => (
            <div
              className="p-2 py-3 rounded-lg hover:text-primary text-sm cursor-pointer"
              key={index}
            >
              <Checkbox
                label={category.name}
                checked={props.filter.includes(category.name)}
                onChange={(value) => handleCheckboxChange(value, category.name)}
              />
            </div>
          ))}
          {categories.length === 0 && (
            <div className="flex flex-col justify-center items-center space-y-4 px-4 py-10">
              <Image
                src={"/svgs/empty-cart.svg"}
                alt="No Data"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full max-w-40 h-fit"
              />
              <span>No Categories</span>
            </div>
          )}
          {!isFetchingCategories && (
            <div className="flex justify-end">
              <Pagination
                pageNumber={catePages}
                contentsLength={categories.length}
                setPageNumber={setCatePages}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
const RightSide: React.FC<Props> = (props) => {
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

  const handlDelete = (name: string) => {
    props.setFilter(props.filter.filter((item) => item !== name));
  };

  const debouncedSearch = React.useCallback(
    debounce(async (filter: string[]) => {
      if (id) getProducts(sort, page, filter, [id], setIsLoading, setPages);
    }, 500),
    [id, page, sort]
  );

  React.useEffect(() => {
    debouncedSearch(props.filter);
    return debouncedSearch.cancel;
  }, [props.filter, debouncedSearch, id, page, sort]);

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
        <div className="flex flex-col space-y-4 bg-card p-4 border border-strokedark rounded-lg">
          <span>Active Filters</span>
          <div className="flex flex-wrap gap-4">
            {props.filter.map((value) => (
              <div className="flex items-center space-x-2 bg-primary/10 px-2 py-1 rounded-full text-sm">
                <span>{value}</span>
                <button
                  onClick={() => handlDelete(value)}
                  className="text-red-500 cursor-pointer"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
            className="rounded-xl w-full max-w-[20rem] object-cover aspect-square"
          />
          <span className="font-bold text-2xl">Your product list is empty</span>
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
