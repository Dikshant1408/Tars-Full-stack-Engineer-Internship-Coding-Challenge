import { SyncUserWithConvex } from "@/components/sync-user-with-convex";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SyncUserWithConvex />
      {children}
    </>
  );
}
