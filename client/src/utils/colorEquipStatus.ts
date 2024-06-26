export function ColorEquipStatus(text: string) {
  let color;
  switch (text) {
    case "พร้อมใช้งาน":
      color = `green.6`;
      break;
    case "ไม่ได้ใช้งาน":
      color = `gray.6`;
      break;
    case "ส่งซ่อม":
      color = `yellow.6`;
      break;
    case "สูญหาย":
      color = `dark.6`;
      break;
    case "อุปกณ์ส่วนกลาง":
      color = `violet.6`;
      break;
    case "ชำรุด":
      color = `red.6`;
      break;
    default:
      color = `dark.6`;
      break;
  }

  return color;
}
