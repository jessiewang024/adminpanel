import { createServiceClient } from "@/lib/supabase/service";

/**
 * Caption Requests page — READ only.
 * Shows all the requests users have made to generate captions.
 * Each request is linked to an image and a humor flavor.
 */
export default async function CaptionRequestsPage() {
    const admin = createServiceClient();

    // Fetch up to 100 caption requests
    const { data: requests, error } = await admin
        .from("caption_requests")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Caption Requests</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read-only view of caption generation requests. Showing {requests?.length ?? 0} rows.
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
                        <th style={thStyle}>Image ID</th>
                        <th style={thStyle}>Profile ID</th>
                        <th style={thStyle}>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {requests?.map((r: any) => (
                        <tr key={r.id}>
                            <td style={monoTdStyle}>{r.id}</td>
                            <td style={monoTdStyle}>{r.image_id ?? "—"}</td>
                            <td style={monoTdStyle}>{r.profile_id ?? "—"}</td>
                            <td style={tdStyle}>
                                {r.created_datetime_utc ? new Date(r.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                        </tr>
                    ))}
                    {(!requests || requests.length === 0) && !error && (
                        <tr>
                            <td style={tdStyle} colSpan={4}>No caption requests found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ── Style constants ─────────────────────────────────────────

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

// Same as tdStyle but with monospace font for UUIDs
const monoTdStyle: React.CSSProperties = {
    ...tdStyle,
    fontSize: "11px",
    fontFamily: "monospace",
};
