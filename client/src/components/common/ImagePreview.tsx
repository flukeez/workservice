import { useEffect, useState } from "react";
import { Image } from "@mantine/core";
import { BASE_URL } from "@/config";

interface ImagePreviewProps {
  folder: string;
  image: unknown;
}

export default function ImagePreview({ folder, image }: ImagePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setObjectUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [image]);

  const imageSrc =
    image instanceof File ? objectUrl : `${BASE_URL}/images/${folder}/${image}`;

  return <Image h={300} w={300} src={imageSrc} />;
}
