import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { ImFire } from "react-icons/im";
import Card from "@/components/ui/Card";
import Product from "@/components/Product";
import { FaUserTag } from "react-icons/fa6";
import useAppStore from "@/stores/AppStore";
import ShopLayout from "@/layouts/ShopLayout";
import { categories } from "@/utils/demodata";
import useUserStore from "@/stores/useUserStore";
import { RxHamburgerMenu } from "react-icons/rx";
import Checkbox from "@/components/input/Checkbox";
import React, { useEffect, useState } from "react";
import Dropdown from "@/components/dropdown/Dropdown";
import { CardSkeleton } from "@/components/ui/Shimmer";
import useProductsRoutes from "@/hooks/useProductsRoutes";
import Courasel, { CarouselRef } from "@/components/ui/Carousel";

type Props = {
  filter: string[];
  suppliers: string[];
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  setSuppliers: React.Dispatch<React.SetStateAction<string[]>>;
};

function Index() {
  const [filter, setFilter] = React.useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);

  useEffect(() => {
    useAppStore.setState((state) => {
      state.showCartConfirmDialog = true;
    });
  }, []);

  return (
    <ShopLayout title={""} description={""}>
      <div className="flex flex-col space-y-8 w-full">
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
  const hotListRef = React.useRef<CarouselRef>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const products = useAppStore((state) => state.products);
  const [listContainerWidth, setListContainerWidth] = React.useState(0);

  const handleCheckboxChange = (value: boolean, category: string) => {
    if (value) {
      props.setFilter([...props.filter, category]);
    } else {
      props.setFilter(props.filter.filter((item) => item !== category));
    }
  };

  const handleSupplierCheckboxChange = (value: boolean, category: string) => {
    if (value) {
      props.setFilter([...props.filter, category]);
    } else {
      props.setFilter(props.filter.filter((item) => item !== category));
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      <Card
        className="bg-primary/70 p-0 text-white"
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
        </div>
      </Card>
      <Card
        className="bg-primary/70 p-0 text-white"
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
          <h2>Supliers</h2>
        </div>
        <div className="p-4">
          {suppliers.map((supplier, index) => (
            <div
              className="p-2 py-3 rounded-lg hover:text-primary text-sm cursor-pointer"
              key={index}
            >
              <Checkbox
                label={supplier.name}
                checked={props.suppliers.includes(supplier.name)}
                onChange={(value) =>
                  handleSupplierCheckboxChange(value, supplier.name)
                }
              />
            </div>
          ))}
        </div>
      </Card>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="bg-primary/70 p-0 text-white"
      >
        <div className="flex items-center space-x-4 p-4 border-strokedark border-b font-semibold text-lg">
          <ImFire className="w-6 h-6" />
          <h2>Hot Deals Day</h2>
        </div>
        <div className="p-4">
          <Courasel
            ref={hotListRef}
            itemsLength={products.length}
            isAutoSlide
            setListContainerWidth={setListContainerWidth}
          >
            <></>
          </Courasel>
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
    debounce(async (filter: string[], suppliers: string[]) => {
      if (id)
        getProducts(sort, page, filter, suppliers, setIsLoading, setPages);
    }, 500),
    [id, page, sort]
  );

  React.useEffect(() => {
    debouncedSearch(props.filter, props.suppliers);
    return debouncedSearch.cancel;
  }, [props.filter, debouncedSearch, id, page, sort]);

  const handlDelete = (name: string) => {
    props.setFilter(props.filter.filter((item) => item !== name));
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

export default Index;
