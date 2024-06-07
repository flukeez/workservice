import { Image } from "@mantine/core";

export default function ImagePreview({ image }: { image: File | string }) {
  const imageName = typeof image === "string" ? image : image.name;
  return <Image src={imageName} alt={imageName} w={"auto"} h={200} />;
}
