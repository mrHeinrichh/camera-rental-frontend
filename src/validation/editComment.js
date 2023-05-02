import * as yup from "yup";

export default yup.object({
  transService: yup
    .string("Enter your TransService")
    .required("TransService is required"),
  text: yup.string("Enter your Text").required("Text is required"),
  ratings: yup.string("Enter your Ratings ").required("Ratings  is required"),
});
