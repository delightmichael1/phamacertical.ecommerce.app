import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import useAppStore from "@/stores/AppStore";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import { toast } from "@/components/toast/toast";
import useUserStore from "@/stores/useUserStore";
import AddUser from "@/components/modals/AddUser";
import { useModal } from "@/components/modals/Modal";
import DashboardLayout from "@/layouts/DashboardLayout";
import SearchInput from "@/components/input/SearchInput";
import { useClickOutside } from "@/hooks/useOutsideClick";
import React, { useEffect, useRef, useState } from "react";
import UserDetailsView from "@/components/modals/ViewUserDeails";
import Pagination from "@/components/Pagination";

function Index() {
  const router = useRouter();
  const { openModal } = useModal();
  const { secureAxios } = useAxios();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const id = useUserStore((state) => state.id);
  const users = useAppStore((state) => state.users);
  const role = useUserStore((state) => state.role);

  useEffect(() => {
    if (id && !role.includes("super")) {
      router.replace("/supplier");
      return;
    }
    fetchUsers();
  }, [page, id]);

  const fetchUsers = async () => {
    try {
      const response = await secureAxios.get(`/admin/users?page=${page}`);
      if (!response.data.users || response.data.users.length === 0) {
        useAppStore.setState((state) => {
          state.users = [];
        });
        return;
      }
      setPages(response.data.pages);
      useAppStore.setState((state) => {
        state.users = response.data.users;
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
    }
  };

  return (
    <DashboardLayout title="Users" description="Manage users">
      <div className="mx-auto w-full container">
        <div className="flex justify-between items-center">
          <SearchInput placeholder="Search users..." />
          <div className="flex items-center space-x-4">
            <Button
              className="bg-primary h-10"
              onClick={() => openModal(<AddUser />)}
            >
              <IoMdAdd />
              <span>Add new user</span>
            </Button>
          </div>
        </div>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-4">
          {users.map((user) => (
            <UserCard user={user} key={user.id} />
          ))}
        </div>
        {users.length === 0 && (
          <div className="flex flex-col justify-center items-center space-y-4 w-full h-[90%]">
            <Image
              src="/svgs/empty-cart.svg"
              alt="empty cart"
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-xl w-full max-w-[10rem] object-cover aspect-square"
            />
            <span className="font-bold text-xl">There are no users yet</span>
            <Button
              className="bg-primary h-10"
              onClick={() => openModal(<AddUser />)}
            >
              <IoMdAdd />
              <span>Add new user</span>
            </Button>
          </div>
        )}
        {pages > 1 && (
          <Pagination
            contentsLength={users.length}
            pageNumber={page}
            variant="primary"
            setPageNumber={setPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

const UserCard = ({ user }: { user: IUser }) => {
  const { openModal, closeModal } = useModal();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  return (
    <div className="relative bg-white p-6 rounded-lg w-full">
      <div className="top-4 right-4 absolute" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="hover:bg-gray-100 p-1 rounded-full transition-colors"
          aria-label="More options"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <circle cx="8" cy="2" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="14" r="1.5" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="right-0 z-10 absolute bg-white shadow-lg mt-2 border border-gray-200 rounded-md w-48">
            <div className="py-1">
              <button
                onClick={() =>
                  openModal(
                    <UserDetailsView onCloseDialog={closeModal} user={user} />
                  )
                }
                className="block hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left"
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="flex justify-start items-center space-x-3 mb-4">
        <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 font-bold text-white text-xl">
          {user.logo ? (
            <img
              src={user.logo}
              alt={user.branchName}
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            user.branchName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="font-semibold text-gray-900 text-xl">
            {user.branchName}
          </h3>
          <p className="text-gray-600 text-sm capitalize">
            {user.role.replaceAll("-", " ")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {user.verified && (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">{user.email}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{user.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{user.city}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.emailStatus === "verified"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {user.emailStatus}
        </span>
      </div>
    </div>
  );
};

export default Index;
