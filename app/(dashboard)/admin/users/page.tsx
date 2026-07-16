import { Shield, ShieldOff } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { promoteToAdmin, demoteToUser } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const [session, users] = await Promise.all([
    auth(),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-serif text-2xl text-fg-1">Users</h1>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-1 text-left text-xs text-fg-3">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === session?.user.id;
              return (
                <tr key={user.id} className="border-b border-border-1 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={user.name}
                        size="sm"
                        variant={user.role === "ADMIN" ? "violet" : "auto"}
                      />
                      <div>
                        <p className="font-medium text-fg-1">
                          {user.name}
                          {isSelf && (
                            <span className="ml-1.5 font-mono text-2xs text-fg-3">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="font-mono text-2xs text-fg-3">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "ADMIN" ? "violet" : "neutral"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.role === "ADMIN" ? (
                      <form action={demoteToUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          disabled={isSelf}
                          className="inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1.5 text-xs font-medium text-fg-2 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg-2"
                          aria-label={`Revoke admin access for ${user.name}`}
                        >
                          <ShieldOff className="h-3.5 w-3.5" strokeWidth={1.75} />
                          Revoke admin
                        </button>
                      </form>
                    ) : (
                      <form action={promoteToAdmin}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1.5 text-xs font-medium text-fg-2 hover:bg-surface-brand-subtle hover:text-teal-700"
                          aria-label={`Promote ${user.name} to admin`}
                        >
                          <Shield className="h-3.5 w-3.5" strokeWidth={1.75} />
                          Promote to admin
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
