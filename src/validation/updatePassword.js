import * as yup from "yup";

export default yup.object({
  oldPassword: yup
    .string("Enter your old password")
    .min(8, "Password must be at least 8 characters long")
    .required("Old Password is required"),
  newPassword: yup
    .string("Enter your new password")
    .min(8, "Password must be at least 8 characters long")
    .required("New Password is required"),
  confirmPassword: yup
    .string("Enter your confirm password")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});
