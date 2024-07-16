export function ColorProviderStatus(status: string) {
  let color;
  let text;
  switch (status) {
    case "1":
      color = `green.6`;
      text = "พร้อมรับงาน";
      break;
    case "2":
      color = `gray.6`;
      text = "ไม่พร้อมรับงาน";
      break;
    case "3":
      color = `red.6`;
      text = "ยุ่ง";
      break;
    case "4":
      color = `dark.6`;
      text = "ถูกระงับ";
      break;
    default:
      color = `dark.6`;
      text = "อื่น ๆ";
      break;
  }

  return [color, text];
}
