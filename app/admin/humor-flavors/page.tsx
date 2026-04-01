import { createServiceClient } from "@/lib/supabase/service";

/**
 * Humor Flavors page — READ only.
 * Displays all humor flavor configurations.
 */
export default async function HumorFlavorsPage() {
    const admin = createServiceClient();

    const { data: flavors, error } = await admin
        .from("humor_flavors")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Humor Flavors</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read-only view of humor flavor configurations. Showing {flavors?.length ?? 0} rows.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Slug</th>
                        <th style={thStyle}>Description</th>
                        <th style={thStyle}>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {flavors?.map((f: any) => (
                        <tr key={f.id}>
                            <td style={monoTdStyle}>{f.id}</td>
                            <td style={tdStyle}>{f.slug}</td>
                            <td style={{ ...tdStyle, maxWidth: "300px" }}>{f.description ?? "—"}</td>
                            <td style={tdStyle}>
                                {f.created_datetime_utc ? new Date(f.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                        </tr>
                    ))}
                    {(!flavors || flavors.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={4}>No humor flavors found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

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

const monoTdStyle: React.CSSProperties = {
    ...tdStyle,
    fontSize: "11px",
    fontFamily: "monospace",
};
