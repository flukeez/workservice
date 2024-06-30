import Swal from "sweetalert2";

interface Props {
  html: string; // ข้อความที่ต้องการแสดง แบบ html ขนาดปกติ
}

const ConfirmSubmitWorkDialog = async ({ html }: Props): Promise<boolean> => {
  const confirmResult = await Swal.fire({
    position: "top",
    html,
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "ยกเลิก",
    confirmButtonText: "ใช่",
  });

  return confirmResult.isConfirmed;
};

export default ConfirmSubmitWorkDialog;
