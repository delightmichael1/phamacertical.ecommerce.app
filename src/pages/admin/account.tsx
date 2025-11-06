import {
  BranchInfoValidationSchema,
  CompanyInfoValidationSchema,
  PasswordValidationSchema,
} from "@/types/schema";
import cn from "@/utils/cn";
import Image from "next/image";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import { BiSave } from "react-icons/bi";
import { FaUser } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { IoKeypad } from "react-icons/io5";
import { BsLockFill } from "react-icons/bs";
import { useAxios } from "@/hooks/useAxios";
import { RiLoader2Line } from "react-icons/ri";
import useUserStore from "@/stores/useUserStore";
import { toast } from "@/components/toast/toast";
import Button from "@/components/buttons/Button";
import TextField from "@/components/input/TextField";
import DashboardLayout from "@/layouts/DashboardLayout";

const tabs = ["Profile", "Security"];

function Account() {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  return (
    <DashboardLayout title="Account" description="Manage your account" isAdmin>
      <div className="mx-auto w-full h-full container">
        <Card className="w-full h-full overflow-hidden">
          <div className="flex lg:flex-row flex-col lg:space-x-4 space-y-4 lg:space-y-0 divider-border w-full h-full">
            <div className="flex flex-col space-y-4 p-2 rounded-xl w-60">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`${
                    activeTab === tab ? "bg-primary text-white" : "text-primary"
                  } py-2 px-6 text-sm rounded-lg duration-300 cursor-pointer w-fit`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex px-4 py-2 border-border border-l w-full h-full overflow-y-auto">
              {activeTab === "Profile" && <Profile />}
              {activeTab === "Security" && <Security />}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

const Profile = () => {
  const user = useUserStore();
  const { secureAxios } = useAxios();
  const [logo, setLogo] = useState(user.logo);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingBranchInfo, setIsEditingBranchInfo] = React.useState(false);
  const [isEditingCompanyInfo, setIsEditingCompanyInfo] = React.useState(false);

  const handleUpdateBranchInfo = async (values: any) => {
    const data = {
      ...user,
      ...values,
    };
    await secureAxios
      .post("/user/update", data)
      .then((res) => {
        useUserStore.setState({ ...data });
        toast({
          variant: "success",
          description: res.data.message,
        });
        setIsEditingBranchInfo(false);
        setIsEditingCompanyInfo(false);
      })
      .catch((error) => {
        toast({
          variant: "error",
          description: error.response
            ? error.response.data.message
            : error.message,
        });
      });
  };

  const handleSelectFile = async (e: any) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (file) {
      await secureAxios
        .post(
          "/admin/logo",
          { logo: file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          toast({
            variant: "success",
            description: res.data.message,
          });
          setLogo(res.data.logo);
          useUserStore.setState((state) => {
            state.logo = res.data.logo;
          });
        })
        .catch((error) => {
          toast({
            variant: "error",
            description: error.response
              ? error.response.data.message
              : error.message,
          });
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <span className="text-xl">My Profile</span>
      <div className="flex items-center space-x-4 p-6 border border-border rounded-2xl w-full">
        <label
          className="group relative rounded-full overflow-hidden cursor-pointer"
          htmlFor="logo"
        >
          {user.role.includes("super") && (
            <input
              type="file"
              id="logo"
              className="hidden"
              accept="image/*"
              onChange={handleSelectFile}
            />
          )}
          <Image
            src={user.logo ?? ""}
            alt=""
            width={0}
            height={0}
            sizes="100vw"
            className="bg-border rounded-full w-20 h-20"
          />
          {user.role.includes("super") && (
            <div
              className={cn(
                "top-0 right-0 bottom-0 left-0 absolute flex justify-center items-center bg-black/30 rounded-full translate-x-full group-hover:translate-x-0 duration-300",
                isLoading && "translate-x-0"
              )}
            >
              {isLoading ? (
                <RiLoader2Line className="w-4 h-4 animate-spin" />
              ) : (
                <FiEdit2 className="w-4 h-4 text-white" />
              )}
            </div>
          )}
        </label>
        <div className="flex flex-col space-y-2">
          <span className="text-lg">{user.branchName}</span>
          <span className="text-sm">{user.email}</span>
          <span>{user.companyName}</span>
        </div>
      </div>
      <div className="flex flex-col space-y-4 p-6 border border-border rounded-2xl w-full">
        <Formik
          initialValues={{
            branchName: user.branchName,
            phone: user.phone,
            email: user.email,
          }}
          validationSchema={BranchInfoValidationSchema}
          onSubmit={handleUpdateBranchInfo}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-4 w-full">
              <div className="flex justify-between items-center space-x-4">
                <span className="text-lg">Branch Information</span>
                {!isEditingBranchInfo ? (
                  <Button
                    className="text-black"
                    onClick={() => setIsEditingBranchInfo(true)}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex justify-end space-x-4">
                    {!isSubmitting && (
                      <Button
                        className="text-black"
                        onClick={() => setIsEditingBranchInfo(false)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="bg-primary"
                    >
                      <BiSave className="w-4 h-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 w-full">
                <TextField
                  type="text"
                  name="branchName"
                  label="Branch Name"
                  isDisabled={!isEditingBranchInfo}
                  icon={<FaUser className="w-4 h-4 text-black" />}
                />
                <TextField
                  type="number"
                  name="phone"
                  label="Phone Number"
                  isDisabled={!isEditingBranchInfo}
                  icon={<IoKeypad className="w-4 h-4 text-black" />}
                />
                <TextField
                  type="email"
                  name="email"
                  label="Email Address"
                  isDisabled={!isEditingBranchInfo}
                  icon={<MdEmail className="w-4 h-4 text-black" />}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {user.role.includes("super") && (
        <div className="flex flex-col space-y-4 p-6 border border-border rounded-2xl w-full">
          <Formik
            initialValues={{
              companyName: user.companyName,
              licenseNumber: user.licenseNumber,
            }}
            validationSchema={CompanyInfoValidationSchema}
            onSubmit={handleUpdateBranchInfo}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col space-y-4 w-full">
                <div className="flex justify-between items-center space-x-4">
                  <span className="text-lg">Company Information</span>
                  {!isEditingCompanyInfo ? (
                    <Button
                      className="text-black"
                      onClick={() => setIsEditingCompanyInfo(true)}
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex justify-end space-x-4">
                      {!isSubmitting && (
                        <Button
                          className="text-black"
                          onClick={() => setIsEditingCompanyInfo(false)}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="bg-primary"
                      >
                        <BiSave className="w-4 h-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>
                <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 w-full">
                  <TextField
                    type="text"
                    name="companyName"
                    label="Company Name"
                    isDisabled={!isEditingCompanyInfo}
                    icon={<FaUser className="w-4 h-4 text-black" />}
                  />
                  <TextField
                    type="text"
                    name="licenseNumber"
                    label="License Number"
                    isDisabled={!isEditingCompanyInfo}
                    icon={<IoKeypad className="w-4 h-4 text-black" />}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

const Security = () => {
  const { secureAxios } = useAxios();
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleUpdatePassword = async (values: any, actions: any) => {
    await secureAxios
      .post("/user/password", values)
      .then((res) => {
        toast({
          variant: "success",
          description: res.data.message,
        });
        setIsEditingPassword(false);
        actions.resetForm();
      })
      .catch((error) => {
        toast({
          variant: "error",
          description: error?.response?.data?.message || error.message,
        });
      });
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <span className="text-xl">Security</span>
      <div className="flex flex-col space-y-4 p-6 border border-border rounded-2xl w-full">
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
          }}
          validationSchema={PasswordValidationSchema}
          onSubmit={handleUpdatePassword}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-4 mx-auto w-full max-w-[40rem]">
              <div className="flex justify-between items-center space-x-4">
                <span className="text-lg">Password</span>
                {!isEditingPassword ? (
                  <Button
                    className="text-black"
                    onClick={() => setIsEditingPassword(true)}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex justify-end space-x-4">
                    {!isSubmitting && (
                      <Button
                        className="text-black"
                        onClick={() => setIsEditingPassword(false)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="bg-primary"
                    >
                      <BiSave className="w-4 h-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="gap-6 grid grid-cols-1 mx-auto w-full max-w-[40rem]">
                <TextField
                  type="password"
                  name="oldPassword"
                  label="Current Password"
                  isDisabled={!isEditingPassword}
                  icon={<BsLockFill className="w-4 h-4 text-black" />}
                />
                <TextField
                  type="password"
                  name="newPassword"
                  label="New Password"
                  isDisabled={!isEditingPassword}
                  icon={<BsLockFill className="w-4 h-4 text-black" />}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Account;
