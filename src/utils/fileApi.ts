import axios from "axios";
import translit from "./translit";
import { env } from "~/env.mjs";

const uploaderUrl = env.NEXT_PUBLIC_FILE_UPLOADER_URL;
const uploaderPassword = env.FILE_UPLOADER_PASSWORD;

export const uploadNewFiles = async (files: FileList | null) => {
  if (!files || !files.length) return null;

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file) formData.append(translit(file.name), file);
  }
  return await axios
    .post<APIResponse>(uploaderUrl, formData)
    .then((res) => res.data);
};

export const deleteFile = async (fileUrl?: string | null) => {
  if (fileUrl)
    return await axios
      .delete<DeleteResponse>(`${fileUrl}?pass=${uploaderPassword}`)
      .then((res) => res.data);
};

export type APIResponse = {
  status: string;
  message: string;
  files: {
    name: string;
    aspectRatio: number;
  }[];
};

type DeleteResponse = {
  status: string;
  message: string;
};
