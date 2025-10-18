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

export const SignInValidationSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  licenseNumber: yup.string().required("License number is required"),
});
