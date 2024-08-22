import { constructMetadata } from "@/lib/utils";
import Odontogram from "@/components/ui/odontogram";

export const metadata = constructMetadata({
  page: "Patients",
});

export default async function Patients() {
  return (
    <>
      <Odontogram treatments={[]} />
    </>
  );
}
