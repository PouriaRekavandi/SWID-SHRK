import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token from authentication.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface GoogleDriveFile {
  id: string;
  name: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export async function listDrivePDFFiles(accessToken: string): Promise<GoogleDriveFile[]> {
  const query = encodeURIComponent("mimeType = 'application/pdf' or name contains '.pdf' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&pageSize=25&fields=files(id,name,size,modifiedTime,webViewLink)&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Google Drive API returned status ${res.status}`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function fetchDrivePDFAsBase64(fileId: string, accessToken: string): Promise<{ base64: string; fileName: string; size: number }> {
  // Get metadata first
  const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,size`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meta = metaRes.ok ? await metaRes.json() : { name: 'drive_paper.pdf', size: 0 };

  // Fetch binary content
  const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!contentRes.ok) {
    throw new Error(`Failed to download file from Google Drive (${contentRes.status})`);
  }

  const blob = await contentRes.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        base64: reader.result as string,
        fileName: meta.name || 'document.pdf',
        size: blob.size,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read Drive file content as base64'));
    reader.readAsDataURL(blob);
  });
}

export async function saveAnalysisToDrive(
  title: string,
  content: string,
  accessToken: string
): Promise<{ id: string; webViewLink?: string }> {
  const metadata = {
    name: `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_SWID_SHRK_Analysis.txt`,
    mimeType: 'text/plain',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', new Blob([content], { type: 'text/plain' }));

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to upload analysis report to Google Drive (${res.status})`);
  }

  return await res.json();
}
