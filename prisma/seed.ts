// seed prisma schema with timezones form ./seedData/timezones.json
import {
  type City,
  type County,
  PrismaClient,
  type Profile,
  type User,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

import { type PickAndFlatten } from "@/lib/utils";

import countyData from "./seedData/counties.json";
import userData from "./seedData/users.json";

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

type UserSeedData = {
  email: string;
  firstName: string;
  lastName: string;
};

type UserData = PickAndFlatten<
  Pick<User, "name" | "email" | "passwordHash"> & {
    profile: PickAndFlatten<Pick<Profile, "firstName" | "lastName">>;
  }
>;

const users: UserData[] = (userData as unknown as UserSeedData[]).map(
  (user) => {
    return {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      passwordHash: bcrypt.hashSync("password", 10),
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  },
);

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  const user = await prisma.user.findFirst();
  if (!user) return;

  // COUNTIES AND CITIES
  if (!isProduction) await prisma.county.deleteMany();
  if (!isProduction) await prisma.city.deleteMany();
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

  // USERS
  if (!isProduction) {
    for (const { profile, ...rest } of users) {
      await prisma.user.create({
        data: {
          ...rest,
          profile: { create: profile },
        },
      });
    }
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
