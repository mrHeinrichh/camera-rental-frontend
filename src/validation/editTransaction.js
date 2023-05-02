import * as yup from "yup";

export default yup.object({
  status: yup.string("Enter your Status").required("Status is required"),
  date: yup
    .date("Enter a valid date")
    .required("Date is required")
    .transform((value, originalValue) => {
      const parsedDate = new Date(originalValue);
      return isNaN(parsedDate) ? null : parsedDate;
    }),
});
