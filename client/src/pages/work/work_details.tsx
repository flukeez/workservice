import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import StepperRepairStatus from "@/components/request/StepperRepairStatus";
import { Button, Card, Divider, Group, Tabs } from "@mantine/core";
import { convertToNumberOrZero } from "@/utils/mynumber";
import { useWorkSubmitMutation } from "@/hooks/work";
import ConfirmSubmitWorkDialog from "@/components/common/ConfirmSubmitWorkDialog";
import AlertSuccessDialog from "@/components/common/AlertSuccessDialog";
import AlertErrorDialog from "@/components/common/AlertErrorDialog";
import WorkDetailsComp from "@/components/work/WorkDetails";
import WorkUpdate from "@/components/work/WorkUpdate";
import { TitleWorkPage } from "@/utils/titleWorkPage";

export default function WorkDetails() {
  const params = useParams();
  const id = convertToNumberOrZero(params.id);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const mutation = useWorkSubmitMutation();

  const title = TitleWorkPage(location.state.type);
  const tabState = location.state.type || "details";
  const listItems = [
    { title: locationState.mainTitle, href: locationState.from },
    { title: title, href: "#" },
  ];

  const [status, setStatus] = useState("");

  //รับงานซ่อม
  const handleSubmitWork = async () => {
    const isConfirmed = await ConfirmSubmitWorkDialog({
      html: ` <p>คุณต้องการที่จะรับงานซ่อมนี้ใช่หรือไม่</p>`,
    });
    if (isConfirmed) {
      try {
        const { data } = await mutation.mutateAsync(id.toString());
        if (data) {
          const isConfirmed = await AlertSuccessDialog({
            title: "ดำเนินการสำเร็จ",
          });
          if (isConfirmed) navigate("/work_progress");
        } else {
          await AlertErrorDialog({
            title: "ดำเนินการไม่สำเร็จ",
            html: "เนื่องจากมีบุคคลอื่นรับงานซ่อมนี้แล้ว",
          });
        }
      } catch (error) {
        await AlertErrorDialog({
          title: "ดำเนินการไม่สำเร็จ",
          html: "ดำเนินการไม่สำเร็จ เนื่องจากหมดเวลาเชื่อมต่อ ให้ออกจากระบบ แล้วเข้าใหม่",
        });
      }
    }
  };

  const handleSetStatus = (value: string) => {
    setStatus(value);
  };
  return (
    <>
      <PageHeader title={title} listItems={listItems} />
      <Card shadow="sm">
        <Card.Section withBorder inheritPadding py="md">
          <StepperRepairStatus id={id} />
        </Card.Section>
        <Tabs defaultValue={"details"} mt="sm">
          <Tabs.List>
            {tabState === "workUpdate" ? (
              <Tabs.Tab value={"details"}>{title}</Tabs.Tab>
            ) : (
              <Tabs.Tab value="details">รายละเอียด</Tabs.Tab>
            )}
          </Tabs.List>
          {tabState === "workUpdate" ? (
            <Tabs.Panel value={"details"}>
              <WorkUpdate id={id} status={status} />
            </Tabs.Panel>
          ) : (
            <Tabs.Panel value="details">
              <WorkDetailsComp id={id} setStatus={handleSetStatus} />
              <Divider mt="md" />
              <Group justify="center" mt="md">
                <Button size="lg" color="gray" onClick={() => navigate(-1)}>
                  ย้อนกลับ
                </Button>
                {tabState === "workSubmit" ? (
                  <Button
                    size="lg"
                    color="blue"
                    onClick={() => handleSubmitWork()}
                  >
                    ยืนยัน
                  </Button>
                ) : null}
              </Group>
            </Tabs.Panel>
          )}
        </Tabs>
      </Card>
    </>
  );
}
