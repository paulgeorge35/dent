// seed prisma schema with timezones form ./seedData/timezones.json
import { type City, type County, PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

import { type PickAndFlatten } from "@/lib/utils";

import countyData from "./seedData/counties.json";
import { env } from "@/env";

const prisma = new PrismaClient();

type CountySeedData = {
  auto: string;
  nume: string;
  localitati: {
    nume: string;
    simplu?: string;
    comuna?: string;
  }[];
};

type CountyData = PickAndFlatten<
  Omit<County, "createdAt" | "updatedAt"> & {
    cities: PickAndFlatten<Omit<City, "createdAt" | "updatedAt">>[];
  }
>;

const counties: CountyData[] = (countyData as unknown as CountySeedData[]).map(
  (county) => {
    const countyId = uuid();
    return {
      id: countyId,
      code: county.auto,
      name: county.nume,
      cities: county.localitati.map((city) => ({
        id: uuid(),
        name: city.nume + (city.comuna ? ` (${city.comuna})` : ""),
        countyId,
      })),
    };
  },
);

const seedPlans = async () => {
  const plans = await prisma.plan.findMany();
  if (plans.length > 0) return;
  await prisma.plan.createMany({
    data: [
      {
        name: "Individual",
        stripeProductId: env.INDIVIDUAL_PRICE_ID,
        stripePriceId: env.INDIVIDUAL_PRICE_ID,
        maxUsers: 1,
      },
      {
        name: "Team",
        stripeProductId: env.TEAM_PLAN_ID,
        stripePriceId: env.TEAM_PRICE_ID,
        maxUsers: 5,
      },
      {
        name: "Enterprise",
        stripeProductId: env.ENTERPRISE_PLAN_ID,
        stripePriceId: env.ENTERPRISE_PRICE_ID,
        maxUsers: 25,
      },
    ],
  });
};

async function main() {
  // const isProduction = process.env.NODE_ENV === "production";
  const user = await prisma.user.findFirst();
  if (!user) return;

  await prisma.county.deleteMany();
  await prisma.city.deleteMany();
  for (const county of counties) {
    await prisma.county.create({
      data: {
        id: county.id,
        code: county.code,
        name: county.name,
        cities: {
          createMany: {
            data: county.cities.map((city) => ({
              id: city.id,
              name: city.name,
            })),
          },
        },
      },
    });
  }
  await seedPlans();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
