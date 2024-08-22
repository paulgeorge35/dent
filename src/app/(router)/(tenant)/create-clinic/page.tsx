import { constructMetadata } from "@/lib/utils";
import ClinicForm from "./clinic-form";
import Image from "next/image";
import { Shell } from "@/components/shell";

export const metadata = constructMetadata({
  page: "Create Clinic",
});

export default async function CreateClinic() {
  return (
    <Shell variant="center">
      <div className="flex items-center justify-center p-8 text-lg font-black">
        <Image
          height={40}
          width={40}
          alt="MyDent"
          className="mr-2"
          src="logo.svg"
        />
        MyDent
      </div>
      <h1 className="text-center text-5xl font-bold">
        Tell us about your team
      </h1>
      <ClinicForm />
    </Shell>
  );
}
