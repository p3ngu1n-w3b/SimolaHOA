// Submits a form to the cPanel/live-site email handler endpoint.
// The endpoint must accept multipart FormData (text fields and file uploads)
// and email submissions to the estate office inbox.

const FORM_EMAIL_ENDPOINT = process.env.NEXT_PUBLIC_FORM_EMAIL_ENDPOINT;

export async function submitForm(formName: string, data: FormData): Promise<boolean> {
  if (!FORM_EMAIL_ENDPOINT) return false;

  data.set("form-name", formName);
  try {
    const res = await fetch(FORM_EMAIL_ENDPOINT, {
      method: "POST",
      body: data,
    });
    return res.ok;
  } catch {
    return false;
  }
}
