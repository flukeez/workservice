import { default as dayjs } from "dayjs";
import { default as customParseFormat } from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

//แปลงวันที่เพื่อบันทึลง mysql
//วันที่ส่งเข้ามาแบบ พศ เช่น 20/05/2565
//return 2022-05-20
function dateToMySql(dateText: string) {
  const validDate = dayjs(dateText, "DD/MM/YYYY", true).isValid();
  if (!validDate || dateText === undefined || dateText === null) {
    return "";
  }

  let result = "";

  let year = dateText.substring(6);
  let month = dateText.substring(3, 5);
  let day = dateText.substring(0, 2);

  let yearThai = Number(year) - 543;
  if (Number(year) < 2200) {
    yearThai = Number(year);
  }

  result = `${yearThai}-${month}-${day}`;
  return result;
}

export { dateToMySql };
