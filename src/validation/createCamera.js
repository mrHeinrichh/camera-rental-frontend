import * as yup from "yup";

export default yup.object({
  name: yup.string().required("Name is required"),
  text: yup.string().required("Text is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .max(10000, "Price must be at most 10000"),
});
