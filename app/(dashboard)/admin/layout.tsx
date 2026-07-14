import { AdminSubnav } from "@/components/ui/admin-subnav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 p-8">
      <AdminSubnav />
      {children}
    </div>
  );
}
