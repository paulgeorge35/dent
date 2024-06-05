import { auth } from "@/auth";
import { RedirectType, redirect } from "next/navigation";
import Image from "next/image";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) redirect("/home", RedirectType.replace);

  return (
    <>
      <div className="container relative grid h-[100dvh] flex-col items-center justify-center md:h-screen lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-zinc-900 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1612736777093-461fb48101d7?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              height={40}
              width={40}
              alt="MyDent"
              className="mr-2"
              src="logo.svg"
            />
            my<strong>Dent</strong>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
