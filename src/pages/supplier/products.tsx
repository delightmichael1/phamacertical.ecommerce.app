import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import React, { useEffect } from "react";
import Product from "@/components/Product";
import useAppStore from "@/stores/AppStore";
import { RxHamburgerMenu } from "react-icons/rx";
import Checkbox from "@/components/input/Checkbox";
import Dropdown from "@/components/dropdown/Dropdown";
import { categories, products } from "@/utils/demodata";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/buttons/Button";
import { RiAddLargeLine } from "react-icons/ri";

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
      <div className="flex flex-col space-y-8 bg-background w-full">
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
          {categories.map((category) => (
            <div
              className="p-2 py-3 rounded-lg hover:text-primary text-sm cursor-pointer"
              key={category.value}
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
    </div>
  );
};
const RightSide: React.FC<Props> = (props) => {
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
            options={[
              "Newest",
              "Oldest",
              "Price: Low to High",
              "Price: High to Low",
            ]}
          />
          <Button className="bg-primary rounded-lg text-sm">
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
        {products.map((product) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <Product
              key={product.id}
              product={product}
              id={uuid()}
              isSupplier
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Index;
