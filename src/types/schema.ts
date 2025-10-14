import * as yup from "yup";

export const AuthValidationSchema = yup.object().shape({
  code: yup.string().required("Code is required"),
  password: yup.string().required("Password is required"),
});
