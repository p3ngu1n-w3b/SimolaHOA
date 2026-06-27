// Lightweight email helper. If SMTP env vars are not configured, it logs the
// message to the server console instead of sending — keeping the app fully
// functional in development and demo deployments without an email provider.

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: MailInput) {
  const host = process.env.SMTP_HOST;
  const from = process.env.EMAIL_FROM || "Simola HOA <no-reply@simolahoa.co.za>";

  if (!host) {
    console.info("\n[email:fallback] (SMTP not configured — logging only)");
    console.info(`  From:    ${from}`);
    console.info(`  To:      ${to}`);
    console.info(`  Subject: ${subject}`);
    console.info(`  Body:    ${text}\n`);
    return { delivered: false as const };
  }

  // Real delivery is intentionally left as an integration point. To enable,
  // install `nodemailer` and create a transport from the SMTP_* env vars here.
  try {
    // Dynamic import keeps nodemailer optional (not a hard dependency).
    // The specifier is computed so the bundler/type-checker does not require it.
    const moduleName = ["node", "mailer"].join("");
    const nodemailer: any = await import(/* webpackIgnore: true */ moduleName).catch(() => null);
    if (!nodemailer) {
      console.warn("[email] nodemailer not installed; skipping real delivery.");
      return { delivered: false as const };
    }
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
    await transport.sendMail({ from, to, subject, text, html: html || text });
    return { delivered: true as const };
  } catch (error) {
    console.error("[email] delivery failed:", (error as Error).message);
    return { delivered: false as const };
  }
}

export function adminNotifyAddress() {
  return process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_FROM || "office@simolahoa.co.za";
}
