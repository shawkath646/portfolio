/**
 * Extracts date from image filename
 * Supports formats like: IMG_20250331_121054_911.jpg, IMG_20250331_121054.jpg, etc.
 * @param filename - The image filename
 * @returns Date object or null if date couldn't be extracted
 */
export function imageNameToDate(filename: string): Date | null {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Try to match common image filename patterns with date
  // Pattern 1: IMG_YYYYMMDD_HHMMSS_XXX or IMG_YYYYMMDD_HHMMSS
  const pattern1 = /(\d{8})_(\d{6})/;
  const match1 = nameWithoutExt.match(pattern1);
  
  if (match1) {
    const dateStr = match1[1]; // YYYYMMDD
    const timeStr = match1[2]; // HHMMSS
    
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1; // Month is 0-indexed
    const day = parseInt(dateStr.substring(6, 8), 10);
    
    const hour = parseInt(timeStr.substring(0, 2), 10);
    const minute = parseInt(timeStr.substring(2, 4), 10);
    const second = parseInt(timeStr.substring(4, 6), 10);
    
    const date = new Date(year, month, day, hour, minute, second);
    
    // Validate the date
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Pattern 2: YYYY-MM-DD or YYYYMMDD anywhere in filename
  const pattern2 = /(\d{4})-?(\d{2})-?(\d{2})/;
  const match2 = nameWithoutExt.match(pattern2);
  
  if (match2) {
    const year = parseInt(match2[1], 10);
    const month = parseInt(match2[2], 10) - 1;
    const day = parseInt(match2[3], 10);
    
    const date = new Date(year, month, day);
    
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Pattern 3: Screenshot_YYYYMMDD-HHMMSS (screenshot format)
  const pattern3 = /Screenshot_(\d{8})-(\d{6})/;
  const match3 = nameWithoutExt.match(pattern3);
  
  if (match3) {
    const dateStr = match3[1];
    const timeStr = match3[2];
    
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    
    const hour = parseInt(timeStr.substring(0, 2), 10);
    const minute = parseInt(timeStr.substring(2, 4), 10);
    const second = parseInt(timeStr.substring(4, 6), 10);
    
    const date = new Date(year, month, day, hour, minute, second);
    
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  return null;
}

/**
 * Extracts EXIF data from image file
 * @param file - The image file
 * @returns Promise with EXIF data including timestamp
 */
export async function getImageMetadata(file: File): Promise<{
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
      
      // Try to get timestamp from file's lastModified
      const fileTimestamp = file.lastModified ? new Date(file.lastModified) : null;
      
      // Try to extract from filename
      const filenameTimestamp = imageNameToDate(file.name);
      
      // Prefer filename timestamp over file modification time
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
