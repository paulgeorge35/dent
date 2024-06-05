import Chatroom from "@/app/_components/chatroom";
import HomepageHeader from "@/app/_components/homepage-header";

import { Shell } from "@/components/shell";
import { auth } from "@/auth";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Home",
});

export default async function Home() {
  const user = await auth();

  return (
    <Shell className="p-0 md:p-4">
      <HomepageHeader user={user} />
      <section className="grid grow grid-cols-12">
        <Chatroom
          user={user}
          className="col-span-12 box-border border-t-2 border-dashed border-primary/30 md:rounded-xl md:border-2 lg:col-span-7"
        />
      </section>
    </Shell>
  );
}
