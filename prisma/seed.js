import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.merchant.upsert({
    where: { email: "admin@littleovenbakery.local" },
    update: {},
    create: { name: "Little Oven Bakery Admin", email: "admin@littleovenbakery.local", passwordHash },
  });

  if ((await prisma.merchandise.count()) === 0) {
    await prisma.merchandise.createMany({
      data: [
        { name: "Branded Tote Bag", description: "Canvas tote with our logo.", pointCost: 150, stock: 20 },
        { name: "Ceramic Mug", description: "Holds your coffee and our bread puns.", pointCost: 100, stock: 30 },
        { name: "Free Croissant", description: "One classic butter croissant, on us.", pointCost: 50, stock: 50 },
      ],
    });
  }

  const now = new Date();
  const inDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

  if ((await prisma.event.count()) === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "Sourdough Baking Workshop",
          description: "Learn to bake your own sourdough starter from scratch.",
          startDate: inDays(10),
          endDate: inDays(10),
        },
        {
          title: "Weekend Tasting Table",
          description: "Sample our new seasonal pastries this weekend.",
          startDate: inDays(-1),
          endDate: inDays(2),
        },
      ],
    });
  }

  if ((await prisma.promo.count()) === 0) {
    await prisma.promo.createMany({
      data: [
        {
          title: "10% Off All Cakes",
          description: "Celebrate with us — 10% off whole cakes this month.",
          code: "CAKE10",
          startDate: inDays(-5),
          endDate: inDays(10),
        },
      ],
    });
  }

  console.log("Seed complete. Merchant login: admin@littleovenbakery.local / Admin123!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
