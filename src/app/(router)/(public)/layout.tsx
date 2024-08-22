export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative flex h-[100dvh] flex-col items-center gap-4 md:h-screen lg:max-w-none lg:px-0">
      {children}
    </div>
  );
}
