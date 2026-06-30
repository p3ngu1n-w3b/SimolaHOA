// Submits a form to Netlify Forms. No server code, no database — Netlify
// captures the submission and emails it to the configured address(es).
//
// For SSR/static frameworks the POST must target the static skeleton file
// (`/__forms.html`) rather than "/", otherwise it can be intercepted before
// reaching Netlify's form handler. We send multipart FormData (works for both
// text-only and file uploads); the browser sets the correct Content-Type.

export const NETLIFY_FORM_ENDPOINT = "/__forms.html";

export async function submitNetlifyForm(formName: string, data: FormData): Promise<boolean> {
  data.set("form-name", formName);
  try {
    const res = await fetch(NETLIFY_FORM_ENDPOINT, {
      method: "POST",
      body: data,
    });
    return res.ok;
  } catch {
    return false;
  }
}
