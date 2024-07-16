import Swal from "sweetalert2";

interface Props {
  title?: string; // ข้อความที่ต้องการแสดง แบบ title ขนาดใหญ่
  html?: string; // ข้อความที่ต้องการแสดง แบบ html ขนาดปกติ
  allowOutsideClick?: boolean;
}

const AlertSuccessDialog = async ({
  title,
  html,
  allowOutsideClick = true,
}: Props): Promise<boolean> => {
  const confirmResult = await Swal.fire({
    position: "top",
    title,
    html,
    icon: "success",
    confirmButtonText: "ปิด",
    allowOutsideClick,
    allowEnterKey: allowOutsideClick,
    allowEscapeKey: allowOutsideClick,
  });

  return confirmResult.isConfirmed;
};

export default AlertSuccessDialog;
