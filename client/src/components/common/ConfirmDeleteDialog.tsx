import Swal from "sweetalert2";

interface Props {
  html: string; // ข้อความที่ต้องการแสดง แบบ html ขนาดปกติ
}

const ConfirmDeleteDialog = async ({ html }: Props): Promise<boolean> => {
  const confirmResult = await Swal.fire({
    position: "top",
    html,
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "ยกเลิก",
    confirmButtonText: "ใช่, ลบทันที",
  });

  return confirmResult.isConfirmed;
};

export default ConfirmDeleteDialog;
