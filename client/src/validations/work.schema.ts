import * as yup from "yup";

export const initialWorkValues = {
  request_id: 0,
  status_id: "",
  details: "",
  image: null,
  total_cost: null,
  request_cost: null,
  parts_cost: null,
  other_cost: null,
  vat: null,
  resolution: null,
};
export const workYup = yup.object().shape({
  request_id: yup.number().required("กรุณาระบุเลขที่รายการแจ้งซ่อม"),
  status_id: yup.string().required("กรุณาเลือกสถานะงานซ่อม"),
  details: yup.string().default(null),
  image: yup.mixed().nullable().default(null),

  total_cost: yup
    .number()
    .nullable()
    .default(null)
    .when("status_id", {
      is: (status_id: string) => status_id === "8",
      then: (schema) => schema.required("กรุณาระบุราคารวม"),
    }),
  request_cost: yup
    .number()
    .nullable()
    .default(null)
    .when("status_id", {
      is: (status_id: string) => status_id === "8",
      then: (schema) => schema.required("กรุณาระบุค่าซ่อม"),
    }),
  parts_cost: yup
    .number()
    .nullable()
    .default(null)
    .when("status_id", {
      is: (status_id: string) => status_id === "8",
      then: (schema) => schema.required("กรุณาระบุค่าอะไหล่"),
    }),
  other_cost: yup
    .number()
    .nullable()
    .default(null)
    .when("status_id", {
      is: (status_id: string) => status_id === "8",
      then: (schema) => schema.required("กรุณาระบุค่าใช้จ่ายอื่น ๆ"),
    }),
  vat: yup
    .number()
    .nullable()
    .default(null)
    .when("status_id", {
      is: (status_id: string) => status_id === "8",
      then: (schema) => schema.required("กรุราระบุภาษี"),
    }),
  resolution: yup.string().nullable().default(null),
  // .when("status_id", {
  //   is: (status_id: string) => status_id === "8",
  //   then: (schema) => schema.required("กรุณากรอกวิธีแก้ปัญหา"),
  // }),
});
