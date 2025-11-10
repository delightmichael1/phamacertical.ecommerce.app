import * as yup from "yup";

export const AuthValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  companyName: yup.string().required("Company name is required"),
  licenseNumber: yup.string().required("License number is required"),
  phone: yup.string().required("Phone is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
});

export const UserValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup.string().required("Phone is required"),
  branchName: yup.string().required("Full name is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
});

export const CategoryValidationSchema = yup.object().shape({
  name: yup.string().required("Cayegory name is required"),
});

export const ProductValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  price: yup.number().required("Price is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  quantity: yup.string().required("Quantity is required"),
  expiryDate: yup.string().required("Expiry date is required"),
  batchNumber: yup.string(),
});

export const AddValidationSchema = yup.object().shape({
  expiryDate: yup.string().required("Expiry date is required"),
});

export const SignInValidationSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  id: yup.string().required("Identification number is required"),
});

export const ForgotPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export const ResetPasswordValidationSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
});

export const BranchInfoValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup.string().required("Phone is required"),
  branchName: yup.string().required("Branch name is required"),
});

export const CompanyInfoValidationSchema = yup.object().shape({
  companyName: yup.string().required("Company name is required"),
  licenseNumber: yup.string().required("License number is required"),
});

export const PasswordValidationSchema = yup.object().shape({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().required("New password is required"),
});
