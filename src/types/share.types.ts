export interface SharedFileType {
    id: string;
    fileName: string;
    fileType: string;
    size: number;
    timestamp: Date;
    sender: string;
    note: string;
    reviewed: boolean;
}