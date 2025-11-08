import Card from "./ui/Card";
import Image from "next/image";
import Pagination from "./Pagination";
import { toast } from "./toast/toast";
import Checkbox from "./input/Checkbox";
import { useAxios } from "@/hooks/useAxios";
import { RxHamburgerMenu } from "react-icons/rx";
import React, { useEffect, useState } from "react";

interface Props {
  categoryfilter: ICategory[];
  setCategoryfilter: React.Dispatch<React.SetStateAction<ICategory[]>>;
}

function CategoryCard(props: Props) {
  const { secureAxios } = useAxios();
  const [catePages, setCatePages] = useState(1);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalCategoriesPages, setTotalCategoriesPages] = useState(1);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

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

  return (
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
          <CategoryWithSubs
            key={index}
            category={category}
            categoryfilter={props.categoryfilter}
            setCategoryfilter={props.setCategoryfilter}
          />
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
  );
}

type IProps = {
  category: ICategory;
  categoryfilter: ICategory[];
  setCategoryfilter: React.Dispatch<React.SetStateAction<ICategory[]>>;
};

const CategoryWithSubs: React.FC<IProps> = (props) => {
  const [showSubs, setShowSubs] = useState(false);
  const handleCheckboxChange = (value: boolean, category: ICategory) => {
    if (value) {
      props.setCategoryfilter([
        ...props.categoryfilter,
        { ...category, subCategories: [] },
      ]);
    } else {
      props.setCategoryfilter(
        props.categoryfilter.filter((item) => item.id !== category.id)
      );
    }
  };

  const handleSubCategoryCheckboxChange = (
    value: boolean,
    parentCategory: ICategory,
    subCategory: ISubCategory
  ) => {
    if (value) {
      const currentParent = props.categoryfilter.find(
        (item) => item.id === parentCategory.id
      );
      if (!currentParent) return;
      const updatedCategory = {
        ...currentParent,
        subCategories: [...(currentParent.subCategories || []), subCategory],
      };
      props.setCategoryfilter(
        props.categoryfilter.map((item) =>
          item.id === parentCategory.id ? updatedCategory : item
        )
      );
    } else {
      const currentParent = props.categoryfilter.find(
        (item) => item.id === parentCategory.id
      );
      if (!currentParent) return;
      const updatedCategory = {
        ...currentParent,
        subCategories: (currentParent.subCategories || []).filter(
          (item) => item.id !== subCategory.id
        ),
      };
      props.setCategoryfilter(
        props.categoryfilter.map((item) =>
          item.id === currentParent.id ? updatedCategory : item
        )
      );
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-2 py-3 rounded-lg text-sm cursor-pointer">
      <Checkbox
        label={props.category.name}
        checked={props.categoryfilter.some(
          (item) => item.id === props.category.id
        )}
        classNames={{
          checkbox: "bg-primary-light",
          label: "group-hover:text-gray-200",
        }}
        onChange={(value) => {
          handleCheckboxChange(value, props.category), setShowSubs(value);
        }}
      />
      {props.category.subCategories &&
        props.category.subCategories?.length > 0 &&
        showSubs && (
          <div className="flex flex-col space-y-2 py-4 pl-4">
            {props.category.subCategories?.map((subCategory, index) => (
              <Checkbox
                key={index}
                label={subCategory.name}
                checked={props.categoryfilter.some(
                  (item) =>
                    item.id === props.category.id &&
                    item.subCategories?.some((sub) => sub.id === subCategory.id)
                )}
                classNames={{
                  label: "group-hover:text-gray-200",
                  checkbox: "bg-primary-light",
                }}
                onChange={(value) =>
                  handleSubCategoryCheckboxChange(
                    value,
                    props.category,
                    subCategory
                  )
                }
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default CategoryCard;
