export type UploadedFile = {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
};
