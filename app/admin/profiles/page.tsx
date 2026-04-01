import { createServiceClient } from "@/lib/supabase/service";

/**
 * Profiles page — READ only.
 * Shows all auth users joined with their profile data from the profiles table.
 * We fetch from both auth.users and the profiles table, then merge them together.
 */
export default async function ProfilesPage() {
    const admin = createServiceClient();

    // Fetch auth users and profiles in parallel
    const [{ data: usersData }, { data: profiles, error: profilesError }] =
        await Promise.all([
            admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
            admin.from("profiles").select("*"),
        ]);

    const users = usersData?.users ?? [];

    // Join each auth user with their matching profile row
    const rows = users.map((user) => {
        const profile = profiles?.find((p: any) => p.id === user.id);
        return {
            id: user.id,
            email: user.email ?? "No email",
            created_at: user.created_at ?? "N/A",
            is_superadmin: profile?.is_superadmin ?? false,
            is_matrix_admin: profile?.is_matrix_admin ?? false,
            first_name: profile?.first_name ?? "",
            last_name: profile?.last_name ?? "",
        };
    });

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Users / Profiles</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Total users found: {rows.length}
            </p>

            {/* Show error if profiles failed to load */}
            {profilesError && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error loading profiles: {profilesError.message}
                </p>
            )}

            {/* Users table */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>First Name</th>
                        <th style={thStyle}>Last Name</th>
                        <th style={thStyle}>User ID</th>
                        <th style={thStyle}>Superadmin</th>
                        <th style={thStyle}>Matrix Admin</th>
                        <th style={thStyle}>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td style={tdStyle}>{row.email}</td>
                            <td style={tdStyle}>{row.first_name}</td>
                            <td style={tdStyle}>{row.last_name}</td>
                            <td style={{ ...tdStyle, fontSize: "11px", fontFamily: "monospace" }}>
                                {row.id}
                            </td>
                            <td style={tdStyle}>{String(row.is_superadmin)}</td>
                            <td style={tdStyle}>{String(row.is_matrix_admin)}</td>
                            <td style={tdStyle}>
                                {new Date(row.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td style={tdStyle} colSpan={7}>No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ── Shared style constants ──────────────────────────────────

const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "10px",
    overflow: "hidden",
};

const thStyle: React.CSSProperties = {
    borderBottom: "1px solid var(--card-border)",
    textAlign: "left",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--muted)",
    backgroundColor: "var(--table-header-bg)",
    textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
    borderBottom: "1px solid var(--card-border)",
    textAlign: "left",
    padding: "10px 14px",
    fontSize: "13px",
};
