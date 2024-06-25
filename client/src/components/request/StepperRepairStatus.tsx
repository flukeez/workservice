import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useRequestHistory } from "@/hooks/request";
import { LoadingOverlay, Stepper } from "@mantine/core";
import { dateThai } from "@/utils/mydate";

interface StepperRepairStatusProps {
  id: number;
}
interface StepProps {
  name: string;
  timestamp: string;
  status_id: number;
}
export default function StepperRepairStatus({ id }: StepperRepairStatusProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data, isLoading } = useRequestHistory(id);
  const [status, setStatus] = useState(1);

  const statusLabels = [
    { id: 1, label: "แจ้งซ่อม" },
    { id: 2, label: "รอดำเนินการ" },
    { id: 3, label: "รออนุมัติ" },
    { id: 4, label: "กำลังดำเนินการ" },
    { id: 5, label: "รออะไหล่" },
    { id: 6, label: "ดำเนินการต่อ" },
    { id: 7, label: "รอตรวจสอบ" },
    { id: 8, label: "เสร็จสิ้น" },
    { id: 9, label: "ยกเลิก" },
  ];

  const getNextSteps = () => {
    // TODO: เช็คเพื่อไม่ให้แสดง รอดำเนินการและ รออนุมัติ ทั้งคู่ เพราะสถานะเดียวกัน
    if (status <= 2) return statusLabels.slice(3, -1);
    return statusLabels.slice(status, -1);
  };

  useEffect(() => {
    const lastStatus = data?.result[data?.result.length - 1].status_id;
    setStatus(lastStatus);
  }, [data]);
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Stepper
        my="lg"
        mx="sm"
        color="blue"
        size="sm"
        active={status - 2} //ที่ต้องลบ 2 เพราะสถานะ 2 กับ3อันเดียวกัน และ อีก1 เพื่อแสดงสถานะปัจจุบัน
        iconPosition="left"
        allowNextStepsSelect={false}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {/* สถานะงานปัจจุบัน */}
        {data?.result.map((item: StepProps, index: number) => (
          <Stepper.Step
            key={index}
            label={item.name}
            description={dateThai(item.timestamp)}
          />
        ))}
        {/* สถานะงานถัดไป */}
        {getNextSteps().map((item, index) => (
          <Stepper.Step key={index + data?.result.length} label={item.label} />
        ))}
      </Stepper>
    </>
  );
}
