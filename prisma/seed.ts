import { type City, type County, PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

import type { PickAndFlatten } from "@/lib/utils";

import countyData from "./seedData/counties.json";

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

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  const user = await prisma.user.findFirst();
  if (user ?? isProduction) return;

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
