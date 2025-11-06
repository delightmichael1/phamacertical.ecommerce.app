import cn from "@/utils/cn";
import Image from "next/image";
import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { ImFire } from "react-icons/im";
import Card from "@/components/ui/Card";
import Product from "@/components/Product";
import { FaUserTag } from "react-icons/fa6";
import useAppStore from "@/stores/AppStore";
import { useAxios } from "@/hooks/useAxios";
import ShopLayout from "@/layouts/ShopLayout";
import useUserStore from "@/stores/useUserStore";
import { toast } from "@/components/toast/toast";
import Pagination from "@/components/Pagination";
import { RxHamburgerMenu } from "react-icons/rx";
import Checkbox from "@/components/input/Checkbox";
import React, { useEffect, useState } from "react";
import Dropdown from "@/components/dropdown/Dropdown";
import { CardSkeleton } from "@/components/ui/Shimmer";
import useProductsRoutes from "@/hooks/useProductsRoutes";
import Courasel, { CarouselRef } from "@/components/ui/Carousel";

type Props = {
  filter: ICategory[];
  suppliers: ICategory[];
  setFilter: React.Dispatch<React.SetStateAction<ICategory[]>>;
  setSuppliers: React.Dispatch<React.SetStateAction<ICategory[]>>;
};

function Index() {
  const [filter, setFilter] = React.useState<ICategory[]>([]);
  const [suppliers, setSuppliers] = useState<ICategory[]>([]);

  useEffect(() => {
    useAppStore.setState((state) => {
      state.showCartConfirmDialog = true;
    });
  }, []);

  return (
    <ShopLayout title={""} description={""}>
      <div className="flex flex-col space-y-8 w-full h-full">
        <div className="flex lg:flex-row flex-col lg:space-x-4 space-y-4 lg:space-y-0 mx-auto w-full h-fit container">
          <div className="w-full lg:w-1/4">
            <LeftSide
              filter={filter}
              setFilter={setFilter}
              suppliers={suppliers}
              setSuppliers={setSuppliers}
            />
          </div>
          <div className="w-full lg:w-3/4">
            <RightSide
              filter={filter}
              setFilter={setFilter}
              suppliers={suppliers}
              setSuppliers={setSuppliers}
            />
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

const LeftSide: React.FC<Props> = (props) => {
  const { secureAxios } = useAxios();
  const [pages, setPages] = useState(1);
  const [catePages, setCatePages] = useState(1);
  const [suppliers, setSuppliers] = useState<ICategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalSuppliersPages, setTotalSuppliersPages] = useState(1);
  const [totalCategoriesPages, setTotalCategoriesPages] = useState(1);
  const [isFetchingSuppliers, setIsFetchingSuppliers] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  useEffect(() => {
    getSuppliers();
  }, [pages]);

  useEffect(() => {
    getCategories();
  }, [catePages]);

  const handleCheckboxChange = (value: boolean, category: ICategory) => {
    if (value) {
      props.setFilter([...props.filter, category]);
    } else {
      props.setFilter(props.filter.filter((item) => item !== category));
    }
  };

  const handleSupplierCheckboxChange = (
    value: boolean,
    category: ICategory
  ) => {
    if (value) {
      props.setSuppliers([...props.suppliers, category]);
    } else {
      props.setSuppliers(props.suppliers.filter((item) => item !== category));
    }
  };

  const getCategories = async () => {
    setIsFetchingCategories(true);
    await secureAxios
      .get("/shop/categories?page=" + catePages)
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

  const getSuppliers = async () => {
    setIsFetchingSuppliers(true);
    await secureAxios
      .get("/shop/suppliers?page=" + pages)
      .then((res) => {
        if (res.data.suppliers) {
          setSuppliers(res.data.suppliers);
          setTotalSuppliersPages(res.data.pages);
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
        setIsFetchingSuppliers(false);
      });
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      <HotDealsCard />
      <Card
        className="bg-primary p-0 text-white"
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
                checked={props.filter.includes(category)}
                onChange={(value) => handleCheckboxChange(value, category)}
                classNames={{
                  label: "group-hover:text-gray-200",
                  checkbox: "bg-primary-light",
                }}
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
          {totalCategoriesPages > 1 && (
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
      <Card
        className="bg-primary p-0 text-white"
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
          <FaUserTag className="w-6 h-6" />
          <h2>Suppliers</h2>
        </div>
        <div className="p-4">
          {suppliers.map((supplier, index) => (
            <div
              className="p-2 py-3 rounded-lg hover:text-primary text-sm cursor-pointer"
              key={index}
            >
              <Checkbox
                label={supplier.name}
                checked={props.suppliers.includes(supplier)}
                onChange={(value) =>
                  handleSupplierCheckboxChange(value, supplier)
                }
                classNames={{
                  label: "group-hover:text-gray-200",
                  checkbox: "bg-primary-light",
                }}
              />
            </div>
          ))}
          {suppliers.length === 0 && (
            <div className="flex flex-col justify-center items-center space-y-4 px-4 py-10">
              <Image
                src={"/svgs/empty-cart.svg"}
                alt="No Data"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full max-w-40 h-fit"
              />
              <span>No Suppliers</span>
            </div>
          )}
          {totalSuppliersPages > 1 && (
            <div className="flex justify-end">
              <Pagination
                pageNumber={pages}
                contentsLength={suppliers.length}
                setPageNumber={setPages}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
const RightSide: React.FC<Props> = (props) => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { getProducts } = useProductsRoutes();
  const id = useUserStore((state) => state.id);
  const [isLoading, setIsLoading] = useState(true);
  const products = useAppStore((state) => state.products);
  const [sort, setSort] = useState<"Newest" | "Oldest">("Newest");

  const debouncedSearch = React.useCallback(
    debounce(async (filter: ICategory[], suppliers: ICategory[]) => {
      if (id)
        getProducts(
          sort,
          page,
          filter.map((item) => item.id),
          suppliers.map((item) => item.id),
          setIsLoading,
          setPages
        );
    }, 500),
    [id, page, sort]
  );

  React.useEffect(() => {
    debouncedSearch(props.filter, props.suppliers);
    return debouncedSearch.cancel;
  }, [props.filter, props.suppliers, debouncedSearch, id, page, sort]);

  const handlDelete = (category: ICategory) => {
    props.setFilter(props.filter.filter((item) => item !== category));
  };

  const handlDeleteSupplier = (suppier: ICategory) => {
    props.setSuppliers(props.suppliers.filter((item) => item !== suppier));
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex justify-between items-center space-x-4 text-lg">
        <span>Showing {products.length} products</span>
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
      {props.suppliers.length > 0 && (
        <div className="flex flex-col space-y-4 bg-card p-4 rounded-lg">
          <span>Active Suppliers</span>
          <div className="flex flex-wrap gap-4">
            {props.suppliers.map((value) => (
              <div className="flex items-center space-x-2 bg-primary/10 px-2 py-1 rounded-full text-sm">
                <span>{value.name}</span>
                <button
                  onClick={() => handlDeleteSupplier(value)}
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
          products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <Product key={product.id} product={product} id={uuid()} />
            </motion.div>
          ))}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
      </div>
    </div>
  );
};

const HotDealsCard = () => {
  const { secureAxios } = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const hotListRef = React.useRef<CarouselRef>(null);
  const [hotDealsPage, setHotDealsPage] = useState(1);
  const [hotTotalDealsPages, setHotTotalDealsPages] = useState(1);
  const [hotDeals, setHotDeals] = useState<IProduct[]>([]);
  const [currentHotDealIndex, setCurrentHotDealIndex] = useState(0);
  const [listContainerWidth, setListContainerWidth] = React.useState(0);

  useEffect(() => {
    getHotDeals();
  }, [hotDealsPage]);

  useEffect(() => {
    if (currentHotDealIndex % 10 === 0.8 && hotDealsPage < hotTotalDealsPages) {
      setHotDealsPage(hotDealsPage + 1);
    }
  }, [currentHotDealIndex]);

  const getHotDeals = async () => {
    setIsLoading(true);
    await secureAxios
      .get(`/shop/hotdeals?page=${hotDealsPage}&limit=10`)
      .then((res) => {
        if (res.data.products) {
          setHotDeals([...hotDeals, ...res.data.products]);
          setHotTotalDealsPages(res.data.pages);
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
        setIsLoading(false);
      });
  };

  return (
    hotDeals.length > 0 && (
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="bg-primary p-0 text-white"
      >
        <div className="flex items-center space-x-4 p-4 border-strokedark border-b font-semibold text-lg">
          <ImFire className="w-6 h-6" />
          <h2>Hot Deals Day</h2>
        </div>
        <div className="p-4 text-black">
          <Courasel
            isAutoSlide
            ref={hotListRef}
            itemsLength={hotDeals.length}
            setCurrentIndex={setCurrentHotDealIndex}
            setListContainerWidth={setListContainerWidth}
          >
            {hotDeals.map((product) => (
              <Product
                id={product.id}
                key={product.id}
                product={product}
                width={listContainerWidth}
              />
            ))}
          </Courasel>
        </div>
      </Card>
    )
  );
};

export default Index;
