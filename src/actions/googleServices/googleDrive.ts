import { google } from 'googleapis';
import { getEnv } from '@/utils/getEnv';

export function getDriveClient() {
  const auth = new google.auth.JWT({
    email: getEnv("DRIVE_CLIENT_EMAIL"),
    key: getEnv("DRIVE_PRIVATE_KEY").replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}
