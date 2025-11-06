import Image from "next/image";
import React, { useState } from "react";
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
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";
import Button from "../buttons/Button";
import { toast } from "../toast/toast";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";

interface Props {
  user: IUser | null;
  onCloseDialog: () => void;
  onApprove?: (userId: string, notes?: string) => Promise<void>;
  onReject?: (userId: string, reason: string) => Promise<void>;
}

function ApproveLicenseView(props: Props) {
  const { user } = props;
  const { secureAxios } = useAxios();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  if (!user) return null;

  const getStatusBadge = (status?: "pending" | "approved" | "rejected") => {
    if (!status) return null;

    let bgColor = "";
    let textColor = "";
    let text = "";

    switch (status) {
      case "approved":
        bgColor = "bg-green-100";
        textColor = "text-green-700";
        text = "Approved";
        break;
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        text = "Pending Review";
        break;
      case "rejected":
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        text = "Rejected";
        break;
    }

    return (
      <span
        className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-semibold`}
      >
        {text}
      </span>
    );
  };

  const handleViewLicense = () => {
    if (user.license) {
      window.open(user.license, "_blank");
    }
  };

  const handleDownloadLicense = () => {
    if (user.license) {
      window.open(user.license, "_blank");
    }
  };

  const handleUpdateLicence = async (status: string) => {
    const data = {
      userId: user.id,
      status: status,
      rejectionReason: rejectReason,
    };
    setIsProcessing(true);
    try {
      const res = await secureAxios.put("/admin/license", data);
      useAppStore.setState((state) => {
        state.users = state.users.map((user) => {
          if (user.id === props.user?.id) {
            return {
              ...user,
              licenseStatus: status as "pending" | "approved" | "rejected",
            };
          }
          return user;
        });
      });
      toast({
        description: res.data.message,
        variant: "success",
      });
      props.onCloseDialog();
    } catch (error: any) {
      toast({
        description: error?.response?.data?.message || error.message,
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const canTakeAction = user.licenseStatus === "pending";

  return (
    <div className="flex flex-col w-full max-w-[50rem] max-h-full">
      <h2 className="px-4 py-2 font-bold text-xl">Approve License</h2>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3 p-4 pt-6 w-full">
        <div className="flex flex-col space-y-4 md:col-span-1">
          <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative bg-gray-200 border-4 border-primary/20 rounded-full w-24 h-24 overflow-hidden">
                {user.logo ? (
                  <Image
                    src={user.logo}
                    alt={user.companyName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-primary/10 w-full h-full">
                    <HiOutlineUser className="w-12 h-12 text-primary/50" />
                  </div>
                )}
              </div>

              <div className="space-y-1 text-center">
                <h2 className="font-bold text-xl">{user.companyName}</h2>
                <p className="text-gray-600 text-sm">{user.branchName}</p>
              </div>

              <div className="bg-primary/10 px-3 py-1 rounded-lg font-semibold text-primary text-xs uppercase">
                {user.role}
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="space-y-3 bg-white shadow-sm p-4 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-700 text-sm">
              Contact Information
            </h3>

            <div className="flex items-start space-x-2">
              <HiOutlineMail className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-gray-500 text-xs">Email</span>
                <span className="font-medium text-sm break-all">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <HiOutlinePhone className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Phone</span>
                <span className="font-medium text-sm">{user.phone}</span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <HiOutlineLocationMarker className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Address</span>
                <span className="font-medium text-sm">{user.address}</span>
                <span className="text-gray-600 text-xs">{user.city}</span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <HiOutlineUser className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Administrator</span>
                <span className="font-medium text-sm">
                  {user.administrator}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - License Review */}
        <div className="flex flex-col space-y-6 md:col-span-2">
          {/* License Status Header */}
          <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl">License Review</h2>
              {getStatusBadge(user.licenseStatus)}
            </div>

            {user.licenseStatus === "pending" && (
              <div className="bg-yellow-50 p-3 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <span className="font-semibold">Pending Review:</span> This
                  license requires your approval before the user can proceed.
                </p>
              </div>
            )}
          </div>

          {/* License Document */}
          <div className="space-y-4 bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">License Document</h3>
              {user.licenseNumber && (
                <div className="text-right">
                  <span className="text-gray-500 text-xs">License Number</span>
                  <p className="font-semibold text-sm">{user.licenseNumber}</p>
                </div>
              )}
            </div>

            {user.license ? (
              <div className="bg-gray-50 p-6 border-2 border-gray-300 border-dashed rounded-xl">
                <div className="flex flex-col justify-between items-start space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-4 rounded-xl">
                      <HiOutlineDocumentText className="w-10 h-10 text-red-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        License Document.pdf
                      </span>
                      <span className="text-gray-500 text-sm">
                        PDF Document
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleViewLicense}
                      className="flex items-center space-x-2 bg-primary text-white text-xs transition-colors"
                    >
                      <HiOutlineDocumentText className="w-5 h-5" />
                      <span>View PDF</span>
                    </Button>
                    <Button
                      onClick={handleDownloadLicense}
                      className="flex items-center space-x-2 bg-gray-200 text-gray-700 text-xs transition-colors"
                    >
                      <HiOutlineDownload className="w-5 h-5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 border-2 border-gray-300 border-dashed rounded-xl text-center">
                <HiOutlineDocumentText className="mx-auto mb-2 w-16 h-16 text-gray-400" />
                <p className="text-gray-500">No license document uploaded</p>
              </div>
            )}
          </div>

          {/* Approval/Rejection Form */}
          {canTakeAction && (
            <div className="space-y-4 bg-white shadow-sm p-6 border border-gray-200 rounded-xl">
              <h3 className="font-bold text-lg">Review Decision</h3>

              {!showRejectForm ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-medium text-gray-700 text-sm">
                      Approval Notes (Optional)
                    </label>
                    <textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Add any notes about this approval..."
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-full resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleUpdateLicence("approved")}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <HiOutlineCheck className="w-5 h-5" />
                      <span>
                        {isProcessing ? "Processing..." : "Approve License"}
                      </span>
                    </Button>
                    <Button
                      onClick={() => setShowRejectForm(true)}
                      disabled={isProcessing}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <HiOutlineX className="w-5 h-5" />
                      <span>Reject License</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
                    <p className="mb-3 font-medium text-red-800 text-sm">
                      You are about to reject this license application
                    </p>
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700 text-sm">
                        Reason for Rejection{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Please provide a detailed reason for rejection. This will be sent to the user."
                        className="p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 w-full resize-none"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason("");
                      }}
                      disabled={isProcessing}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      onClick={() => handleUpdateLicence("rejected")}
                      disabled={isProcessing || !rejectReason.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <HiOutlineX className="w-5 h-5" />
                      <span>
                        {isProcessing ? "Processing..." : "Confirm Rejection"}
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Already Processed Message */}
          {!canTakeAction && user.licenseStatus && (
            <div
              className={`rounded-xl p-6 ${
                user.licenseStatus === "approved"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                {user.licenseStatus === "approved" ? (
                  <HiOutlineCheckCircle className="flex-shrink-0 w-8 h-8 text-green-600" />
                ) : (
                  <HiOutlineXCircle className="flex-shrink-0 w-8 h-8 text-red-600" />
                )}
                <div>
                  <h4
                    className={`font-semibold ${
                      user.licenseStatus === "approved"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    License{" "}
                    {user.licenseStatus === "approved"
                      ? "Approved"
                      : "Rejected"}
                  </h4>
                  <p
                    className={`text-sm ${
                      user.licenseStatus === "approved"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    This license has already been reviewed and{" "}
                    {user.licenseStatus}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApproveLicenseView;
