/**
 * Gmail REST API Client
 * Interacts directly with Google Workspace Gmail API using the client-side access token
 */

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  bodyText?: string;
  labelIds?: string[];
}

export interface GmailUserProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

/**
 * Base64URL encoder conforming to RFC 4648
 */
function toBase64Url(str: string): string {
  // UTF-8 safe btoa
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Fetch the authenticated user's Gmail profile
 */
export async function fetchGmailProfile(accessToken: string): Promise<GmailUserProfile> {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail Profile API Error (${res.status}): ${errorText}`);
  }

  return res.json();
}

/**
 * List messages with optional search query (e.g. "label:INBOX", "fracture", "subject:research")
 */
export async function listGmailMessages(
  accessToken: string,
  options: { query?: string; maxResults?: number } = {}
): Promise<{ messages: { id: string; threadId: string }[]; resultSizeEstimate?: number }> {
  const { query = '', maxResults = 12 } = options;
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', String(maxResults));
  if (query) {
    url.searchParams.set('q', query);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail List API Error (${res.status}): ${errorText}`);
  }

  return res.json();
}

/**
 * Fetch detailed content of a specific message by ID
 */
export async function getGmailMessage(
  accessToken: string,
  messageId: string
): Promise<GmailMessageItem> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail Get Message Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const headers: GmailMessageHeader[] = data.payload?.headers || [];

  const getHeader = (name: string): string => {
    const h = headers.find((header) => header.name.toLowerCase() === name.toLowerCase());
    return h ? h.value : '';
  };

  // Decode body if available
  let bodyText = '';
  if (data.snippet) {
    bodyText = data.snippet;
  }

  // Try extracting plain text body from payload parts
  if (data.payload?.parts && Array.isArray(data.payload.parts)) {
    const textPart = data.payload.parts.find(
      (part: any) => part.mimeType === 'text/plain' && part.body?.data
    );
    if (textPart && textPart.body?.data) {
      try {
        const decoded = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        bodyText = decoded;
      } catch {
        // fallback to snippet
      }
    }
  }

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet || '',
    subject: getHeader('Subject') || '(No Subject)',
    from: getHeader('From') || 'Unknown Sender',
    to: getHeader('To') || '',
    date: getHeader('Date') || '',
    bodyText,
    labelIds: data.labelIds || [],
  };
}

/**
 * Send an email using Gmail REST API
 */
export async function sendGmailMessage(
  accessToken: string,
  options: {
    to: string;
    subject: string;
    body: string;
    fromEmail?: string;
  }
): Promise<{ id: string; threadId: string; labelIds?: string[] }> {
  const { to, subject, body, fromEmail } = options;

  // Construct RFC 2822 email message
  const rawEmail = [
    `To: ${to}`,
    fromEmail ? `From: ${fromEmail}` : '',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body,
  ]
    .filter(Boolean)
    .join('\r\n');

  const encodedMessage = toBase64Url(rawEmail);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail Send Error (${res.status}): ${errorText}`);
  }

  return res.json();
}
