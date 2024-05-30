import * as yup from "yup";

export const userInitialValues = {};

export const userYup = yup.object().shape({
  id: yup.number().default(0),
  id_card: yup
    .string()
    .required("กรุณากรอกเลขบัตรประชาชน")
    .length(13, "เลขบัตรประชาชนต้องมี 13 หลัก"),
  firstname: yup
    .string()
    .required("กรุณากรอกชื่อจริง")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  surname: yup
    .string()
    .required("กรุณากรอกนามสกุล")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  nickname: yup
    .string()
    .notRequired()
    .default("")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  sex: yup.number().nullable().default(null).max(3, "ข้อมูลไม่ถูกต้อง"),
  birthday: yup.string().nullable().default(null).typeError("วันที่ไม่ถูกต้อง"),
  address: yup
    .string()
    .notRequired()
    .default("")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  province_id: yup.string().notRequired().default(""),
  amphure_id: yup.string().notRequired().default(""),
  tumbol_id: yup.string().notRequired().default(""),
  phone: yup.string().notRequired().default("").max(10, "ห้ามเกิน 10 ตัวอักษร"),
  email: yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").notRequired().default(""),
  line: yup.string().notRequired().default("").max(50, "ห้ามเกิน 50 ตัวอักษร"),
  line_token: yup
    .string()
    .notRequired()
    .default("")
    .max(200, "ห้ามเกิน 200 ตัวอักษร"),
  username: yup
    .string()
    .required("กรุณากรอกชื่อเข้าใช้งาน")
    .min(6, "ชื่อเข้าใช้งานต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
    .max(32, "ชื่อเข้าใช้งานต้องมีความยาวไม่เกิน 32 ตัวอักษร")
    .matches(
      /^[a-zA-Z0-9]{6,32}$/,
      "ชื่อเข้าใช้งานต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลขเท่านั้น"
    ),
  password: yup
    .string()
    .notRequired()
    .default("")
    .when((id, schema) => {
      if (id) {
        //แก้ไข
        schema.when((password) => {
          if (password) {
            return schema
              .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
              .max(32, "รหัสผ่านต้องมีความยาวไม่เกิน 32 ตัวอักษร")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
                "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
              )
              .default("");
          }
          return schema;
        });
      }
      //เพิ่ม
      return schema
        .required("กรุณากรอกรหัสผ่าน")
        .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
        .max(32, "รหัสผ่านต้องมีความยาวไม่เกิน 32 ตัวอักษร")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
          "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
        );
    }),

  con_password: yup
    .string()
    .notRequired()
    .default("")
    .when((password, schema) => {
      if (password) {
        return schema
          .required("กรุณากรอกรหัสผ่าน")
          .oneOf([yup.ref("password")], "รหัสผ่านไม่ตรงกัน");
      }
      return schema;
    }),
  image: yup.string().notRequired().default(""),
});
