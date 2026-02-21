import { imageNameToDate } from "./dateTime";

export default async function getImageMetadata(file: File): Promise<{
  timestamp: Date | null;
  width: number | null;
  height: number | null;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      
      const fileTimestamp = file.lastModified ? new Date(file.lastModified) : null;
      const filenameTimestamp = imageNameToDate(file.name);
      const timestamp = filenameTimestamp || fileTimestamp;
      
      URL.revokeObjectURL(url);
      resolve({ timestamp, width, height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ timestamp: null, width: null, height: null });
    };
    
    img.src = url;
  });
}