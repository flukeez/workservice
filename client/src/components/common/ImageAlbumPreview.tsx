import { useEffect, useState } from "react";
import { Box, Image, Stack } from "@mantine/core";
import { BASE_URL } from "@/config";

interface ImagePreviewProps {
  folder: string;
  images: unknown[];
}

export default function ImageAlbumPreview({
  folder,
  images,
}: ImagePreviewProps) {
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    console.log(images);
    const urls = images.map((image) => {
      if (typeof image === "string") {
        return `${BASE_URL}/images/${folder}/${image}`;
      } else {
        return URL.createObjectURL(image as File);
      }
    });
    setObjectUrls(urls);
  }, [images, folder]);

  return (
    <Stack gap="md">
      {objectUrls.length > 0 && (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            maxHeight: "400px",
          }}
        >
          {/* ภาพแรก */}
          <Box style={{ flex: "1 1 60%", paddingRight: "10px" }}>
            <Image
              src={objectUrls[0]}
              height={400}
              width={300}
              fit="cover"
              radius="md"
            />
          </Box>
          {/* ภาพที่เหลือ */}
          <Box
            style={{
              flex: "1 1 40%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {objectUrls.slice(1, 5).map((src, index) => (
              <Image
                key={index}
                src={src}
                height={93}
                fit="cover"
                radius="md"
              />
            ))}
          </Box>
        </Box>
      )}
    </Stack>
  );
}
