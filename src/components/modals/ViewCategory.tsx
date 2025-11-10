import { useModal } from "./Modal";
import CategoryModal from "./Category";
import Button from "../buttons/Button";
import { TbTrash } from "react-icons/tb";
import { useAxios } from "@/hooks/useAxios";
import { MdModeEdit } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import DeleteCategory from "./DeleteCategory";
import React, { useEffect, useState } from "react";
import FxDropdown, { DropdownItem } from "@/components/dropdown/FxDropDown";
import { GrUpgrade } from "react-icons/gr";

type Props = {
  parentId: string;
  closeModal: () => void;
  getCategories: () => void;
  subCategory: ISubCategory[];
};

function SubCategoryModal(props: Props) {
  const { secureAxios } = useAxios();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-start space-y-4 px-6 pb-5 w-full h-full overflow-y-auto"
      style={{ maxHeight: `${0.8 * height}px` }}
    >
      <span className="mt-1 mb-10 font-bold text-2xl">Sub Categories</span>
      <div className="flex flex-col space-y-3 w-full overflow-x-auto">
        <table className="bg-gray-50 rounded-xl w-full">
          <thead>
            <tr className="border-border border-b">
              <th className="p-3 font-semibold text-sm text-left">
                Sub Category ID
              </th>
              <th className="p-3 font-semibold text-sm text-left">Name</th>
              <th className="p-3 font-semibold text-sm text-left"></th>
            </tr>
          </thead>
          <tbody>
            {props.subCategory?.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                parentId={props.parentId}
                getCategories={props.getCategories}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Button
        onClick={props.closeModal}
        className="flex bg-primary ml-auto px-8 transition"
      >
        Close
      </Button>
    </div>
  );
}

const CategoryRow = ({
  category,
  parentId,
  getCategories,
}: {
  category: ICategory;
  parentId: string;
  getCategories: () => void;
}) => {
  const { openModal, closeModal } = useModal();

  const actions = [
    {
      name: "Upgrade to parent category",
      icon: GrUpgrade,
      description: "Make " + category.name + " a parent category",
      onClick: () =>
        openModal(
          <CategoryModal
            type="edit"
            onDone={getCategories}
            category={category}
            closeModal={closeModal}
          />
        ),
    },
    {
      name: "Update details",
      icon: MdModeEdit,
      description: "Update " + category.name + " details",
      onClick: () =>
        openModal(
          <CategoryModal
            type="edit"
            isChild={true}
            parentId={parentId}
            onDone={getCategories}
            category={category}
            closeModal={closeModal}
          />
        ),
    },
    {
      name: "Delete sub category",
      icon: TbTrash,
      description: "Delete " + category.name + " from store.",
      onClick: () =>
        openModal(
          <DeleteCategory
            closeModal={closeModal}
            onDone={getCategories}
            category={category}
          />
        ),
    },
  ];

  return (
    <tr key={category.id} className="hover:bg-gray-50 border-border border-b">
      <td className="p-3">
        <span className="font-mono font-medium text-sm">{category.id}</span>
      </td>
      <td className="p-3">
        <span className="font-semibold">{category.name}</span>
      </td>
      <td className="relative flex justify-end items-end p-3 w-full">
        <span className="font-semibold">
          <FxDropdown
            align="right"
            trigger={
              <div className="flex items-center space-x-2 hover:bg-gray-50 px-4 py-2.5 text-primary">
                <CiMenuKebab size={20} />
              </div>
            }
            classnames={{
              dropdown: "w-72",
            }}
          >
            {actions.map((action, index) => (
              <DropdownItem key={index} onClick={action.onClick}>
                <div className="flex items-center space-x-3">
                  <action.icon className="w-5 h-5 text-gray-500" />
                  <div className="flex flex-col">
                    <span>{action.name}</span>
                    <span className="text-gray-500 text-xxs">
                      {action.description}
                    </span>
                  </div>
                </div>
              </DropdownItem>
            ))}
          </FxDropdown>
        </span>
      </td>
    </tr>
  );
};

export default SubCategoryModal;
