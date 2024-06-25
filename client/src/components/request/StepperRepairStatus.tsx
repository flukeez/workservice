import { dateThai } from "@/utils/mydate";
import { Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface StepperRepairStatusProps {
  status: number;
}
export default function StepperRepairStatus({
  status,
}: StepperRepairStatusProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const statusLabels: { [key: string]: string } = {
    2: status == 1 ? "รอดำเนินการ" : "รออนุมัติ",
    3: "กำลังดำเนินการ",
    4: "รออะไหล่",
    5: "ดำเนินการต่อ",
    6: "รอตรวจสอบ",
    7: "เสร็จสิ้น",
    8: "ยกเลิก",
  };

  const nextSteps = Object.entries(statusLabels)
    .map(([, label]) => ({
      label,
    }))
    .slice(0, -1); // เลือกช่วงที่ต้องการ

  return (
    <Stepper
      my="lg"
      mx="sm"
      color="blue"
      size="sm"
      active={status}
      iconPosition="left"
      allowNextStepsSelect={false}
      orientation={isMobile ? "vertical" : "horizontal"}
    >
      <Stepper.Step label="แจ้งซ่อม" description={dateThai(new Date())} />
      {nextSteps.map((step, index) => (
        <Stepper.Step
          key={index}
          label={step.label}
          description={dateThai(new Date())}
        />
      ))}
    </Stepper>
  );
}
