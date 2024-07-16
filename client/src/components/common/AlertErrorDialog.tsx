import Swal from "sweetalert2";

interface Props {
  title?: string; // ข้อความที่ต้องการแสดง แบบ title ขนาดใหญ่
  html?: string; // ข้อความที่ต้องการแสดง แบบ html ขนาดปกติ
}

const AlertErrorDialog = async ({ title, html }: Props): Promise<boolean> => {
  const confirmResult = await Swal.fire({
    position: "top",
    title,
    html,
    icon: "warning",
    confirmButtonText: "ปิด",
  });

  return confirmResult.isConfirmed;
};

export default AlertErrorDialog;
