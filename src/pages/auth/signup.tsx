import jsPDF from "jspdf";
import cn from "@/utils/cn";
import Link from "next/link";
import Image from "next/image";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { LuLock } from "react-icons/lu";
import { BiRename } from "react-icons/bi";
import { useAxios } from "@/hooks/useAxios";
import useAppStore from "@/stores/AppStore";
import { useRouter } from "next/navigation";
import AuthLayout from "@/layouts/AuthLayout";
import { toast } from "@/components/toast/toast";
import Button from "@/components/buttons/Button";
import { FaCity, FaFilePdf } from "react-icons/fa6";
import TextField from "@/components/input/TextField";
import { AuthValidationSchema } from "@/types/schema";
import { MdOutlineMail, MdPhone } from "react-icons/md";
import { HiMiniXMark, HiOutlineDocument } from "react-icons/hi2";
import { IoDocumentAttachSharp, IoLocationOutline } from "react-icons/io5";
import useAuthSession from "@/hooks/useAuthSession";
import Checkbox from "@/components/input/Checkbox";
import SelectField from "@/components/input/SelectField";
import { cities } from "@/utils/constants";
import PricingCard from "@/components/ui/PricingCard";
import Plasma from "@/components/ui/Plasma";

type UploadedFile = {
  url: string;
  type: "image" | "pdf";
};

type UploadMode = "images" | "pdf" | null;

const FormControls = React.memo(
  ({ isSubmitting }: { isSubmitting: boolean }) => (
    <>
      <Button
        isLoading={isSubmitting}
        type="submit"
        className="bg-primary w-full h-10"
      >
        Next
      </Button>
      <p className="text-default-500 text-sm text-center">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary">
          Sign in
        </Link>
      </p>
    </>
  )
);

function Signup() {
  const router = useRouter();
  const { axios } = useAxios();
  const { signIn } = useAuthSession();
  const [step, setStep] = useState(0);
  const { selectedPlan } = useAppStore();
  const [values, setValues] = useState<any>(null);
  const deviceId = useAppStore((state) => state.deviceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<string>("");
  const [finalPdf, setFinalPdf] = useState<Blob | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("pdf");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleSubmitForm = async (values: any) => {
    setValues(values);
    setStep(2);
  };

  const signUp = async (values: any) => {
    const data = {
      ...values,
      subscription: selectedPlan,
    };
    try {
      const response = await axios.post("/user/signup", data, {
        headers: {
          "X-Platform": selectedPlan.includes("distributor")
            ? "supplier"
            : "retailer",
        },
      });
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${
          !error.response ? error.message : error.response.data.message
        }`,
        variant: "error",
      });
      return {
        accessToken: "",
        refreshToken: "",
      };
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await signUp(values);
    if (res.accessToken !== "") {
      let pdf: Blob | null = finalPdf;
      if (uploadMode === "images") {
        pdf = await convertImagesToPdf(uploadedFiles.map((file) => file.url));
      }
      await axios
        .post(
          "/admin/license",
          {
            license: pdf,
          },
          {
            headers: {
              Authorization: `Bearer ${res.accessToken}`,
              "X-Platform": selectedPlan.includes("distributor")
                ? "supplier"
                : "retailer",
              "X-Device-Id": deviceId,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          router.replace(
            selectedPlan.includes("distributor") ? "/supplier" : "/shop"
          );
          toast({
            title: "Success",
            description: res.data.message,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || error.message,
            variant: "error",
          });
        });
    }
    setIsSubmitting(false);
    return res.refreshToken;
  };

  const generatePdfPreview = async (pdfBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result as ArrayBuffer);

        try {
          // Use PDF.js to render first page
          const pdfjsLib = (window as any).pdfjsLib;
          if (!pdfjsLib) {
            // Fallback: just show PDF icon
            resolve("");
            return;
          }

          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);

          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          resolve(canvas.toDataURL());
        } catch (error) {
          resolve("");
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(pdfBlob);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadMode === "pdf") {
      const file = files[0];
      if (file.type === "application/pdf") {
        const url = URL.createObjectURL(file);
        setUploadedFiles([{ url, type: "pdf" }]);
        setFinalPdf(file);

        const preview = await generatePdfPreview(file);
        setPdfPreview(preview);
      } else {
        toast({
          description: "Please select a PDF file.",
          variant: "error",
        });
      }
    } else if (uploadMode === "images") {
      const newFiles: UploadedFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          newFiles.push({ url, type: "image" });
        }
      }
      if (newFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      } else {
        toast({
          description: "Please select image files only.",
          variant: "error",
        });
      }
    }

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadedFiles[index]?.type === "pdf") {
      setFinalPdf(null);
      setPdfPreview("");
    }
  };

  const resetUpload = () => {
    setUploadedFiles([]);
    setFinalPdf(null);
    setPdfPreview("");
    setUploadMode(null);
  };

  const convertImagesToPdf = async (imageUrls: string[]): Promise<Blob> => {
    const pdf = new jsPDF();

    for (let i = 0; i < imageUrls.length; i++) {
      const imgUrl = imageUrls[i];

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = imgUrl;
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = img.width / img.height;
      const pdfRatio = pdfWidth / pdfHeight;

      let width = pdfWidth;
      let height = pdfHeight;

      if (imgRatio > pdfRatio) {
        height = width / imgRatio;
      } else {
        width = height * imgRatio;
      }

      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(img, "JPEG", 0, 0, width, height);
    }

    return pdf.output("blob");
  };

  return (
    <AuthLayout isHideImage={step === 0}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
        className={cn(
          "relative flex flex-col justify-center items-center gap-6 mx-auto w-full max-w-[30rem] h-full",
          step === 0 && "max-w-full"
        )}
      >
        <div className="flex flex-col justify-center items-center space-y-2">
          {step !== 0 && (
            <span className="z-10 font-bold text-2xl capitalize">
              {selectedPlan.replaceAll("_", " ")}
            </span>
          )}
          <span className="z-10 font-bold text-2xl capitalize">
            {step === 0 ? "Select Package" : "Sign Up "}
          </span>
        </div>
        {step === 0 && (
          <div className="w-full max-w-[70rem]">
            <div className="top-0 left-0 absolute w-full h-full">
              <Plasma
                color="#9fbff1"
                speed={0.6}
                direction="forward"
                scale={1.1}
                opacity={0.8}
                mouseInteractive={true}
              />
            </div>
            <div className="items-center gap-6 grid grid-cols-3 w-full">
              <PricingCard
                side="left"
                offer="$30"
                setStep={setStep}
                title="Pharmacy Plan"
                options={[
                  "Order processing",
                  "Market analysis",
                  "Customer support",
                ]}
              />
              <PricingCard
                side="center"
                offer="$100"
                setStep={setStep}
                title="Distributor Premium"
                options={[
                  "All Basic Features",
                  "AI data analysis",
                  "Advertisement",
                ]}
              />
              <PricingCard
                side="right"
                offer="$60"
                setStep={setStep}
                title="Distributor Basic"
                options={[
                  "Order processing",
                  "Market analysis",
                  "Customer support",
                ]}
              />
            </div>
          </div>
        )}
        {step === 1 && (
          <Formik
            initialValues={{
              companyName: "",
              licenseNumber: "",
              email: "",
              phone: "",
              city: "",
              address: "",
              password: "",
            }}
            validationSchema={AuthValidationSchema}
            onSubmit={handleSubmitForm}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col items-center gap-6 w-full">
                <>
                  <TextField
                    label="Company Name"
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    className="bg-white/40"
                    icon={<BiRename size={20} />}
                  />
                  <TextField
                    label="Full Name"
                    type="branchName"
                    name="branchName"
                    placeholder="Enter full name"
                    icon={<BiRename size={20} />}
                    className="bg-white/40"
                  />
                  <TextField
                    label="License Number"
                    type="text"
                    name="licenseNumber"
                    placeholder="Enter company license number"
                    className="bg-white/40"
                    icon={<HiOutlineDocument size={20} />}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter company license number"
                    className="bg-white/40"
                    icon={<MdOutlineMail size={20} />}
                  />
                  <TextField
                    label="Phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    className="bg-white/40"
                    icon={<MdPhone size={20} />}
                  />
                  <SelectField
                    label="City"
                    name="city"
                    options={cities}
                    className="bg-white/40"
                    placeholder="Enter city"
                    icon={<FaCity size={20} />}
                  />
                  <TextField
                    label="Address"
                    type="text"
                    name="address"
                    className="bg-white/40"
                    placeholder="Enter address"
                    icon={<IoLocationOutline size={20} />}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    className="bg-white/40"
                    name="password"
                    placeholder="Enter your password"
                    icon={<LuLock size={20} />}
                  />
                </>
                <FormControls isSubmitting={isSubmitting} />
              </Form>
            )}
          </Formik>
        )}
        {step === 2 && (
          <div className="flex flex-col items-center gap-6 w-full max-w-[30rem]">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="flex flex-col space-y-4 w-full"
            >
              <span className="text-xl">Company License</span>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    {uploadMode === "images"
                      ? "Uploading Images"
                      : "Uploading PDF"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (uploadMode !== "images") resetUpload();
                        setUploadMode("images");
                      }}
                      className={cn(
                        "flex-1 bg-gray-500",
                        uploadMode === "images" && "bg-primary text-white"
                      )}
                    >
                      <IoDocumentAttachSharp className="w-4 min-w-4 h-4" />
                      <span className="text-xs">Images</span>
                    </Button>
                    <Button
                      onClick={() => {
                        if (uploadMode !== "pdf") resetUpload();
                        setUploadMode("pdf");
                      }}
                      className={cn(
                        "flex-1 bg-gray-500",
                        uploadMode === "pdf" && "bg-primary text-white"
                      )}
                    >
                      <FaFilePdf className="w-4 h-4" />
                      <span className="text-xs">PDF</span>
                    </Button>
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept={
                    uploadMode === "images" ? "image/*" : "application/pdf"
                  }
                  multiple={uploadMode === "images"}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="gap-4 grid grid-cols-1 w-full">
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative flex flex-col justify-center items-center bg-primary/10 backdrop-blur-lg p-2 border-1 border-primary rounded-2xl w-full aspect-video"
                    >
                      <HiMiniXMark
                        className="top-2 right-2 z-10 absolute bg-white p-1 rounded-full w-6 h-6 text-danger cursor-pointer"
                        onClick={() => removeFile(index)}
                      />
                      {file.type === "image" ? (
                        <Image
                          width={0}
                          height={0}
                          sizes="100vw"
                          src={file.url}
                          alt={`Upload ${index + 1}`}
                          className="rounded-lg w-full max-w-80 h-fit max-h-96 object-center object-cover"
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center space-y-2 p-2 w-full h-full">
                          {pdfPreview ? (
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              src={pdfPreview}
                              alt="PDF Preview"
                              className="rounded-lg w-full h-full object-center object-cover"
                            />
                          ) : (
                            <>
                              <FaFilePdf className="w-16 h-16 text-red-500" />
                              <span className="text-xs text-center">
                                PDF Document
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {uploadedFiles.length === 0 && uploadMode && (
                <div
                  onClick={() => {
                    document.getElementById("file-upload")?.click();
                  }}
                  className="flex flex-col justify-center items-center space-y-3 bg-primary/10 backdrop-blur-lg p-4 border-1 border-primary border-dashed rounded-2xl w-full aspect-video cursor-pointer"
                >
                  {uploadMode === "images" ? (
                    <IoDocumentAttachSharp className="w-12 h-12 text-gray-400" />
                  ) : (
                    <FaFilePdf className="w-12 h-12 text-gray-400" />
                  )}
                  <span className="text-gray-400 text-center">
                    No files uploaded yet
                  </span>
                  <span className="text-gray-500 text-xs text-center">
                    {uploadMode === "images"
                      ? "Take photos or upload images"
                      : "Upload a PDF document"}
                  </span>
                </div>
              )}
            </motion.div>
            <Button
              onClick={() => signIn(() => handleSubmit(), { replace: true })}
              isLoading={isSubmitting}
              type="submit"
              className="bg-primary w-full h-10"
            >
              Submit
            </Button>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}

export default Signup;
