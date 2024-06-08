import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Center, LoadingOverlay } from "@mantine/core";

export function LoadingLayout() {
  return (
    <Suspense fallback={<LoadingOverlay visible={true} />}>
      <Center mih={"100vh"} bg="gray.0">
        <Outlet />
      </Center>
    </Suspense>
  );
}
