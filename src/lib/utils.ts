import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a file size in bytes to a human-readable string (B, KB, MB)
 */
export function formatFileSize(sizeInBytes: number | null | undefined): string {
  if (sizeInBytes == null) return '';
  
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Convert a file extension to a human-readable file type description
 */
export function getReadableFileType(fileType: string): string {
  if (!fileType) return "file";
  
  const typeMap: Record<string, string> = {
    // Images
    'jpg': 'JPEG Image',
    'jpeg': 'JPEG Image',
    'png': 'PNG Image',
    'gif': 'GIF Image',
    'svg': 'SVG Image',
    'webp': 'WebP Image',
    
    // Documents
    'pdf': 'PDF Document',
    'doc': 'Word Document',
    'docx': 'Word Document',
    'xls': 'Excel Spreadsheet',
    'xlsx': 'Excel Spreadsheet',
    'ppt': 'PowerPoint',
    'pptx': 'PowerPoint',
    'txt': 'Text File',
    'rtf': 'Rich Text',
    'md': 'Markdown',
    
    // Audio
    'mp3': 'MP3 Audio',
    'wav': 'WAV Audio',
    'ogg': 'OGG Audio',
    'flac': 'FLAC Audio',
    
    // Video
    'mp4': 'MP4 Video',
    'webm': 'WebM Video',
    'avi': 'AVI Video',
    'mov': 'QuickTime Video',
    
    // Archive
    'zip': 'ZIP Archive',
    'rar': 'RAR Archive',
    '7z': '7Z Archive',
    'tar': 'TAR Archive',
    'gz': 'GZ Archive',
    
    // Code
    'html': 'HTML File',
    'css': 'CSS File',
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'jsx': 'React JSX',
    'tsx': 'React TSX',
    'json': 'JSON File',
    'py': 'Python File',
    'java': 'Java File',
    'c': 'C File',
    'cpp': 'C++ File',
  };
  
  return typeMap[fileType.toLowerCase()] ?? `${fileType.toUpperCase()} File`;
}
