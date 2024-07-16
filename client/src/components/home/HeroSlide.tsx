import { WEBSITE_NAME } from "@/config";
import {
  Box,
  Flex,
  Stack,
  Text,
  Image,
  Spoiler,
  Group,
  Grid,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const layout = {
  xs: 12,
  sm: 6,
  md: 6,
  lg: 6,
  xl: 6,
};
export default function HeroSlide() {
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  return (
    <Box
      style={{ background: "linear-gradient(to right, #228be6 , #1a6db9)" }}
      h="700px"
      maw="100vw"
      p="md"
    >
      <Grid align="center" mt="10rem">
        <Grid.Col span={layout}>
          <Stack align={isLargeScreen ? "flex-end" : "center"} justify="center">
            <Text size="5rem" fw={900} c="white" ta="center" maw="100vw">
              {WEBSITE_NAME}
            </Text>
            {isLargeScreen && (
              <Spoiler maxHeight={200} showLabel="เพิ่มเติม" hideLabel="Hide">
                <Text
                  ms="xl"
                  mt="1rem"
                  size="1.3rem"
                  fw={400}
                  c="gray.3"
                  ta={isLargeScreen ? "right" : "center"}
                  lh="2.2rem"
                >
                  iService
                  เป็นแพลตฟอร์มที่คุณสามารถพึ่งพาได้สำหรับทุกความต้องการในการซ่อม
                  ไม่ว่าจะเป็นอุปกรณ์ในบ้าน เครื่องใช้ไฟฟ้า หรืออุปกรณ์สำนักงาน
                  ระบบที่ใช้งานง่ายและมีประสิทธิภาพของเรา
                  ช่วยให้คุณสามารถส่งคำขอแจ้งซ่อมได้อย่างง่ายดายและติดตามความคืบหน้าได้แบบเรียลไทม์
                  ด้วย iService
                  คุณสามารถคาดหวังบริการที่รวดเร็วและน่าเชื่อถือจากเครือข่ายช่างเทคนิคที่ได้รับการรับรองของเรา
                </Text>
              </Spoiler>
            )}
            <Group>
              <Button size="lg" color="yellow">
                Try It!
              </Button>
              <Button size="lg" color="gray.5">
                Learn More
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={layout}>
          <Group grow>
            <Image h={300} src="/logo.png" alt="iService Logo" />
          </Group>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
