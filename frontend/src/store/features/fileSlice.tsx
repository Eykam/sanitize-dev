import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileUpload {
  fileName: string;
  lastModified: number;
  fileSize: string;
  fileType: string;
  fileUrl: string;
}

interface FileState {
  uploadedFile: FileUpload | null;
}

const initialState: FileState = {
  uploadedFile: null,
};

export const fileSlice = createSlice({
  name: "file",
  initialState: initialState,
  reducers: {
    uploadFile: (state, action: PayloadAction<{ file: FileUpload }>) => {
      state.uploadedFile = action.payload.file;
    },
    deleteFile: (state, action: PayloadAction) => {
      state.uploadedFile = null;
    },
  },
});

export const createFileUpload: (file: File) => { file: FileUpload } = (
  file: File
) => {
  return {
    file: {
      fileName: file.name,
      lastModified: file.lastModified,
      fileSize: (file.size / 1000000.0).toFixed(2) + " MB",
      fileType: file.type,
      fileUrl: URL.createObjectURL(file),
    },
  };
};

export default fileSlice.reducer;
export const { uploadFile, deleteFile } = fileSlice.actions;
