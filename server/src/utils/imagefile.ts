import { promises as fsPromises } from "fs";
import path from "path";

interface FileUpload {
  filename: string;
  data: Buffer;
}
export const saveFile = async (folder: string, file: FileUpload) => {
  const extension = path.extname(file.filename);
  const filename =
    Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;
  const filePath = path.join(process.cwd(), "uploads", folder, filename);

  try {
    await fsPromises.writeFile(filePath, file.data);
    return filename;
  } catch (error) {
    throw error;
  }
};

export const getFile = async (folder: string, filename: string) => {
  const filePath = path.join(process.cwd(), "uploads", folder, filename);
  try {
    const data = await fsPromises.readFile(filePath);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (folder: string, filename: string) => {
  const filePath = path.join(process.cwd(), "uploads", folder, filename);
  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    throw error;
  }
};
