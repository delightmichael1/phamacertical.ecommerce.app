import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Product from "@/components/Product";
import AppLayout from "@/layouts/AppLayout";
import { RxHamburgerMenu } from "react-icons/rx";
import { BiSolidComponent } from "react-icons/bi";
import Checkbox from "@/components/input/Checkbox";
import Dropdown from "@/components/dropdown/Dropdown";
import { categories, composites, products } from "@/utils/demodata";

type Props = {
  filter: Map<string, string>;
  setFilter: React.Dispatch<React.SetStateAction<Map<string, string>>>;
};

function Index() {
  const [filter, setFilter] = React.useState<Map<string, string>>(new Map());
  return (
    <AppLayout>
      <div className="w-full bg-background flex flex-col space-y-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full container mx-auto h-fit">
          <div className="w-full lg:w-1/4">
            <LeftSide filter={filter} setFilter={setFilter} />
          </div>
          <div className="w-full lg:w-3/4">
            <RightSide filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

const LeftSide: React.FC<Props> = (props) => {
  const handleCheckboxChange = (
    value: boolean,
    category: string,
    categoryValue: string
  ) => {
    if (value) {
      let filter = new Map(props.filter);
      filter.set(category, categoryValue);
      props.setFilter(filter);
    } else {
      let filter = new Map(props.filter);
      filter.delete(category);
      props.setFilter(filter);
    }
  };
  return (
    <div className="w-full flex flex-col space-y-6">
      <span className="text-lg font-semibold">Filter By</span>
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
        <div className="p-4 border-b border-strokedark flex items-center space-x-4 text-lg font-semibold">
          <RxHamburgerMenu className="w-6 h-6" />
          <h2>Categories</h2>
        </div>
        <div className="p-4">
          {categories.map((category) => (
            <div
              className="p-2 rounded-lg cursor-pointer hover:text-primary text-sm py-3"
              key={category.value}
            >
              <Checkbox
                label={category.name}
                checked={props.filter.has(category.name)}
                onChange={(value) =>
                  handleCheckboxChange(value, category.name, category.value)
                }
              />
            </div>
          ))}
        </div>
      </Card>
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
        <div className="p-4 border-b border-strokedark flex items-center space-x-4 text-lg font-semibold">
          <BiSolidComponent className="w-6 h-6" />
          <h2>Composition</h2>
        </div>
        <div className="p-4">
          {composites.map((composite) => (
            <div
              className="p-2 rounded-lg cursor-pointer hover:text-primary text-sm py-3"
              key={composite.value}
            >
              <Checkbox
                label={composite.name}
                checked={props.filter.has(composite.name)}
                onChange={(value) =>
                  handleCheckboxChange(value, composite.name, composite.value)
                }
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
    let filter = new Map(props.filter);
    filter.delete(name);
    props.setFilter(filter);
  };
  return (
    <div className="w-full flex flex-col space-y-4">
      <h1 className="text-4xl font-bold">The Phamarcetical Shop</h1>
      <div className="flex items-center justify-between space-x-4">
        <span>Showing {products.length} products</span>
        <div className="flex space-x-4 items-center">
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
          />
        </div>
      </div>
      {props.filter.size > 0 && (
        <div className="p-4 rounded-lg border border-strokedark bg-card flex flex-col space-y-4">
          <span>Active Filters</span>
          <div className="flex flex-wrap gap-4">
            {Array.from(props.filter.entries()).map(([key, value]) => (
              <div className="flex items-center space-x-2 text-sm px-2 py-1 rounded-full bg-primary/10">
                <span>{key}:</span>
                <span>{value}</span>
                <button
                  onClick={() => handlDelete(key)}
                  className="text-red-500 cursor-pointer"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <Product key={product.id} product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Index;
