import * as yup from "yup";

export default yup.object({
  name: yup.string("Enter your Name").required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  file: yup.mixed().test("fileRequired", "File is required", function (value) {
    if (!value || !value.length) {
      return "File is required";
    }
    return true;
  }),
});
