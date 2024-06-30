export function TitleWorkPage(text: string) {
  let title;
  switch (text) {
    case "workSubmit":
      title = `รายละเอียดงานซ่อม`;
      break;
    case "workUpdate":
      title = `เปลี่ยนสถานะงาน`;
      break;
    case "workAssign":
      title = `งานที่ได้รับมอบหมาย`;
      break;
    case "workSend":
      title = "ส่งมอบงานซ่อม";
      break;
    default:
      title = `รายละเอียดงานซ่อม`;
      break;
  }

  return title;
}
