import * as yup from "yup";

export default yup.object({
  title: yup.string("Enter your Title").required("Title is required"),
  text: yup.string("Enter your Text").required("Text is required"),
});
