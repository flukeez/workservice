import {
  Card,
  Container,
  DEFAULT_THEME,
  LoadingOverlay,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";

function EmptyLoading() {
  const skeleton = () => {
    const height = 20;
    return (
      <>
        <Skeleton height={height} radius="xl" />
        <Skeleton height={height} mt={6} radius="xl" />
        <Skeleton height={height} mt={6} width="70%" radius="xl" />
      </>
    );
  };

  const customLoader = (
    <Stack align="center" justify="center">
      <svg
        width="54"
        height="54"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke={DEFAULT_THEME.colors.blue[6]}
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
      <Text color="dimmed" size="lg" align="center">
        กำลังอ่านข้อมูล...
      </Text>
    </Stack>
  );

  return (
    <Container fluid p={0}>
      <Card withBorder>
        <Stack>
          <LoadingOverlay loader={customLoader} visible />
          {skeleton()}
          {skeleton()}
          {skeleton()}
          {skeleton()}
          {skeleton()}
          {skeleton()}
        </Stack>
      </Card>
    </Container>
  );
}

export default EmptyLoading;
