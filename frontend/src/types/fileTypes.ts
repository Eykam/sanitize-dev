const fileTypes = [
  "video/mov",
  "video/quicktime",
  "video/mp4",
  "video/mpeg",
  "video/x-msvideo",
  "audio/wav",
  "audio/mpeg",
  "audio/x-wav",
  "audio/aac",
  "audio/webm",
  "video/webm",
];

export const checkFileType = (type: string) => {
  return fileTypes.includes(type);
};
