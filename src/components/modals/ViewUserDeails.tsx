import Image from "next/image";
import React from "react";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineIdentification,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineDocumentText,
  HiOutlineDownload,
} from "react-icons/hi";
import Button from "../buttons/Button";
import Card from "../ui/Card";

interface Props {
  user: IUser | null;
  onCloseDialog: () => void;
}

function UserDetailsView(props: Props) {
  const { user } = props;

  if (!user) return null;

  const getStatusBadge = (
    status: string,
    type: "email" | "license" | "verified"
  ) => {
    let bgColor = "";
    let textColor = "";
    let text = status;

    if (type === "verified") {
      bgColor = user.verified ? "bg-green-100" : "bg-gray-100";
      textColor = user.verified ? "text-green-700" : "text-gray-700";
      text = user.verified ? "Verified" : "Not Verified";
    } else if (type === "license") {
      switch (status) {
        case "approved":
          bgColor = "bg-green-100";
          textColor = "text-green-700";
          text = "Approved";
          break;
        case "pending":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-700";
          text = "Pending";
          break;
        case "rejected":
          bgColor = "bg-red-100";
          textColor = "text-red-700";
          text = "Rejected";
          break;
        default:
          bgColor = "bg-gray-100";
          textColor = "text-gray-700";
          text = "N/A";
      }
    } else if (type === "email") {
      bgColor = status === "verified" ? "bg-green-100" : "bg-yellow-100";
      textColor = status === "verified" ? "text-green-700" : "text-yellow-700";
      text = status.charAt(0).toUpperCase() + status.slice(1);
    }

    return (
      <span
        className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-semibold`}
      >
        {text}
      </span>
    );
  };

  const handleDownloadLicense = () => {
    if (user.license) {
      window.open(user.license, "_blank");
    }
  };

  const handleViewLicense = () => {
    if (user.license) {
      window.open(user.license, "_blank");
    }
  };

  return (
    <div className="gap-8 grid grid-cols-1 md:grid-cols-3 p-4 pt-6 w-full max-w-[60rem] h-full overflow-y-auto">
      {/* Left Column - Profile Image and Basic Info */}
      <div className="flex flex-col items-center space-y-4 md:col-span-1">
        <div className="relative bg-gray-200 border-4 border-primary/20 rounded-full w-32 h-32 overflow-hidden">
          {user.logo ? (
            <Image
              src={user.logo}
              alt={user.companyName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex justify-center items-center bg-primary/10 w-full h-full">
              <HiOutlineUser className="w-16 h-16 text-primary/50" />
            </div>
          )}
        </div>

        <div className="space-y-2 text-center">
          <h2 className="font-bold text-2xl">{user.companyName}</h2>
          <p className="text-gray-600 text-sm">{user.branchName}</p>
          <div className="flex justify-center">
            {getStatusBadge("", "verified")}
          </div>
        </div>

        {/* Role Badge */}
        <div className="bg-primary/10 px-4 py-2 rounded-lg font-semibold text-primary text-sm uppercase">
          {user.role}
        </div>
        <Card className="flex flex-col space-y-2 shadow-black/20 shadow-lg w-full">
          <span className="py-2 w-full font-semibold text-lg">
            Subscription
          </span>
          <div className="flex justify-between items-center space-x-4">
            <span className="text-gray-500 text-sm">Status</span>
            <span
              className={`${
                new Date(user.expiryDate) < new Date()
                  ? "text-red-700 bg-red-100"
                  : "text-green-700 bg-green-100"
              } p-1 px-3 text-center w-fit rounded-full text-xs font-semibold`}
            >
              {user.expiryDate !== 0
                ? new Date(user.expiryDate) < new Date()
                  ? "Expired"
                  : "Active"
                : "New Account"}
            </span>
          </div>
          {new Date(user.expiryDate) > new Date() && (
            <div className="flex justify-between items-center space-x-4">
              <span className="text-gray-500 text-sm">Expiry</span>
              <span className="p-1 px-3 rounded-full w-fit font-semibold text-xs text-center">
                {user.expiryDate !== 0
                  ? new Date(user.expiryDate).toDateString()
                  : "New Account"}
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* Right Column - Detailed Information */}
      <div className="flex flex-col space-y-6 md:col-span-2">
        {/* Contact Information Section */}
        <div className="space-y-3">
          <h3 className="pb-2 border-b font-bold text-gray-800 text-lg">
            Contact Information
          </h3>

          <div className="flex items-center space-x-3">
            <HiOutlineMail className="flex-shrink-0 w-5 h-5 text-primary" />
            <div className="flex flex-col flex-1">
              <span className="text-gray-500 text-sm">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {getStatusBadge(user.emailStatus, "email")}
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlinePhone className="flex-shrink-0 w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Phone</span>
              <span className="font-medium">{user.phone}</span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <HiOutlineLocationMarker className="flex-shrink-0 mt-1 w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Address</span>
              <span className="font-medium">{user.address}</span>
              <span className="text-gray-600 text-sm">{user.city}</span>
            </div>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="space-y-3">
          <h3 className="pb-2 border-b font-bold text-gray-800 text-lg">
            Company Information
          </h3>

          <div className="flex items-center space-x-3">
            <HiOutlineOfficeBuilding className="flex-shrink-0 w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Branch Name</span>
              <span className="font-medium">{user.branchName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlineUser className="flex-shrink-0 w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Administrator</span>
              <span className="font-medium">{user.administrator}</span>
            </div>
          </div>
        </div>

        {/* License Information Section */}
        {(user.license || user.licenseNumber) && (
          <div className="space-y-3">
            <h3 className="pb-2 border-b font-bold text-gray-800 text-lg">
              License Information
            </h3>

            {user.licenseNumber && (
              <div className="flex items-center space-x-3">
                <HiOutlineIdentification className="flex-shrink-0 w-5 h-5 text-primary" />
                <div className="flex flex-col flex-1">
                  <span className="text-gray-500 text-sm">License Number</span>
                  <span className="font-medium">{user.licenseNumber}</span>
                </div>
                {user.licenseStatus &&
                  getStatusBadge(user.licenseStatus, "license")}
              </div>
            )}

            {user.license && (
              <div className="flex items-start space-x-3">
                <HiOutlineDocumentText className="flex-shrink-0 mt-1 w-5 h-5 text-primary" />
                <div className="flex flex-col flex-1">
                  <span className="mb-2 text-gray-500 text-sm">
                    License Document
                  </span>
                  <div className="bg-gray-50 hover:bg-gray-100 p-4 border border-gray-200 rounded-lg transition-colors">
                    <div className="flex flex-col justify-between items-start space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-100 p-3 rounded-lg">
                          <HiOutlineDocumentText className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            License Document.pdf
                          </span>
                          <span className="text-gray-500 text-xs">
                            PDF Document
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleViewLicense}
                          className="flex items-center space-x-2 bg-primary text-xs"
                        >
                          <HiOutlineDocumentText className="w-4 h-4" />
                          <span>View</span>
                        </Button>
                        <Button
                          onClick={handleDownloadLicense}
                          className="flex items-center space-x-2 bg-gray-200 text-black text-xs"
                        >
                          <HiOutlineDownload className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Summary */}
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <h4 className="mb-3 font-semibold text-gray-700 text-sm">
            Account Status Summary
          </h4>
          <div className="gap-3 grid grid-cols-2">
            <div className="flex items-center space-x-2">
              {user.verified ? (
                <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <HiOutlineXCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm">Account Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              {user.emailStatus === "verified" ? (
                <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <HiOutlineXCircle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-sm">Email Verified</span>
            </div>
            {user.licenseStatus && (
              <div className="flex items-center space-x-2">
                {user.licenseStatus === "approved" ? (
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                ) : user.licenseStatus === "pending" ? (
                  <HiOutlineXCircle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <HiOutlineXCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm">License {user.licenseStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsView;
