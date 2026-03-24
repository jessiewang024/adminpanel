import { createServiceClient } from "@/lib/supabase/service";

export default async function ProfilesPage() {
    const admin = createServiceClient();

    const [{ data: usersData }, { data: profiles, error: profilesError }] =
        await Promise.all([
            admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
            admin.from("profiles").select("*"),
        ]);

    const users = usersData?.users ?? [];

    const rows = users.map((user) => {
        const profile = profiles?.find((p: any) => p.id === user.id);

        return {
            id: user.id,
            email: user.email ?? "No email",
            created_at: user.created_at ?? "N/A",
            is_superadmin: profile?.is_superadmin ?? false,
        };
    });

    return (
        <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>Users / Profiles</h1>

            {profilesError && (
                <p style={{ color: "red" }}>
                    Error loading profiles: {profilesError.message}
                </p>
            )}

            <p style={{ marginBottom: "20px" }}>
                Total users found: {rows.length}
            </p>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                }}
            >
                <thead>
                <tr>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Superadmin</th>
                    <th style={thStyle}>Created</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => (
                    <tr key={row.id}>
                        <td style={tdStyle}>{row.email}</td>
                        <td style={tdStyle}>{row.id}</td>
                        <td style={tdStyle}>{String(row.is_superadmin)}</td>
                        <td style={tdStyle}>{row.created_at}</td>
                    </tr>
                ))}

                {rows.length === 0 && (
                    <tr>
                        <td style={tdStyle} colSpan={4}>
                            No users found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </main>
    );
}

const thStyle = {
    borderBottom: "1px solid #ddd",
    textAlign: "left" as const,
    padding: "10px",
    backgroundColor: "#f7f7f7",
};

const tdStyle = {
    borderBottom: "1px solid #eee",
    textAlign: "left" as const,
    padding: "10px",
};