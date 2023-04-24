import axios from "axios";
import translit from "./translit";

const uploaderUrl = process.env.NEXT_PUBLIC_UPLOADER_URL || "";

export type APIResponse = {
  status: string;
  message: string;
  filenames: string[];
  aspectRatio: number[];
};

type DeleteResponse = {
  status: string;
  message: string;
};

export const uploadNewFiles = async (files: FileList | null) => {
  if (!files || !files.length) return null;

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file) formData.append(translit(file.name), file);
  }
  return await axios
    .post<APIResponse>(`${uploaderUrl}/upload/christmas-toys`, formData)
    .then((res) => res.data);
};

export const deleteFile = async (fileUrl?: string | null) => {
  if (fileUrl)
    return await axios.delete<DeleteResponse>(fileUrl).then((res) => res.data);
};
