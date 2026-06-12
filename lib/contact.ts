/**
 * Submits a contact / early-access request to the Baalot API.
 * Stored in Firestore (contactRequests) and forwarded by email server-side.
 */
const API_URL = "https://api.baalot.site/api/user-ops";

export type ContactSource = "early-access" | "demo-request" | "contact";

export interface ContactPayload {
  source: ContactSource;
  email: string;
  name?: string;
  institution?: string;
  role?: string;
  electionType?: string;
  voters?: string;
  message?: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "contact", ...payload }),
    });
  } catch {
    throw new Error("Could not reach the server. Please check your connection and try again.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? "Something went wrong. Please try again."
    );
  }
}
