import { google } from 'googleapis';

export function getDriveClient() {
  const auth = new google.auth.JWT({
    email: process.env.DRIVE_CLIENT_EMAIL,
    key: process.env.DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}
