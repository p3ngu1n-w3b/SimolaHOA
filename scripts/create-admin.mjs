// Minimal, dependency-light admin bootstrap that runs with plain Node in
// production images (no tsx/TypeScript required). Creates or updates the
// initial admin user and default site settings so the portal is usable.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@simolahoa.co.za").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", active: true },
    create: { email, name: "Estate Administrator", passwordHash, role: "ADMIN" },
  });

  await prisma.setting.upsert({
    where: { key: "site" },
    update: {},
    create: {
      key: "site",
      value: {
        email: "office@simolahoa.co.za",
        phone: "+27 44 302 9700",
        whatsapp: "+27 82 000 0000",
        address: "Simola Estate, Old Cape Road, Knysna, 6571, South Africa",
      },
    },
  });

  console.log(`✓ Admin ready: ${email}`);
}

main()
  .catch((e) => {
    console.error("create-admin failed:", e.message);
    process.exit(0); // non-fatal
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
