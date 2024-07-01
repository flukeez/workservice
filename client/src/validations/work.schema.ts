import * as yup from "yup";

// export const initialWorkValues = {
//     status_id: "",
//     details: "",
//     image: null,
//     total_cost: null,
//     request_cost: null,
//     parts_cost: null,
//     other_cost: null,
//     vat: null,
//     resolution: null,
// }
export const workYup = yup.object().shape({
  status_id: yup.string().required("กรุณาเลือกสถานะงานซ่อม"),
  details: yup.string().required("กรุณากรอกรายละเอียด"),
  image: yup.string().nullable().default(null),
  total_cost: yup.number().nullable().default(null),
  request_cost: yup.number().nullable().default(null),
  parts_cost: yup.number().nullable().default(null),
  other_cost: yup.number().nullable().default(null),
  vat: yup.number().nullable().default(null),
  resolution: yup.string().nullable().default(null),
});
