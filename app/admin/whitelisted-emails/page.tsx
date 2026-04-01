import { createServiceClient } from "@/lib/supabase/service";
import { createWhitelistedEmail, updateWhitelistedEmail, deleteWhitelistedEmail } from "./actions";

/**
 * Whitelisted Email Addresses page — full CRUD.
 * Specific email addresses that are allowed to access the platform,
 * regardless of whether their domain is in the allowed domains list.
 */
export default async function WhitelistedEmailsPage() {
    const admin = createServiceClient();

    const { data: emails, error } = await admin
        .from("whitelist_email_addresses")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Whitelisted Email Addresses</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Manage individually whitelisted email addresses.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            {/* ── Create Form ────────────────────────────────── */}
            <section style={cardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Add Email</h2>
                <form action={createWhitelistedEmail} style={{ display: "grid", gap: "12px", maxWidth: "400px" }}>
                    <label style={labelStyle}>Email Address</label>
                    <input name="email_address" type="email" placeholder="user@example.com" style={inputStyle} required />

                    <button type="submit" style={buttonStyle}>Add Email</button>
                </form>
            </section>

            {/* ── Table ───────────────────────────────────────── */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {emails?.map((e: any) => (
                        <tr key={e.id}>
                            <td style={monoTdStyle}>{e.id}</td>
                            <td style={tdStyle}><strong>{e.email_address ?? "—"}</strong></td>
                            <td style={tdStyle}>
                                {e.created_datetime_utc ? new Date(e.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                            <td style={tdStyle}>
                                <details>
                                    <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Edit</summary>
                                    <form action={updateWhitelistedEmail} style={{ display: "grid", gap: "8px", marginTop: "8px", minWidth: "200px" }}>
                                        <input type="hidden" name="id" value={e.id} />
                                        <input name="email_address" type="email" defaultValue={e.email_address ?? ""} style={inputStyle} />
                                        <button type="submit" style={buttonStyle}>Update</button>
                                    </form>
                                </details>
                                <form action={deleteWhitelistedEmail} style={{ marginTop: "8px" }}>
                                    <input type="hidden" name="id" value={e.id} />
                                    <button type="submit" style={dangerButtonStyle}>Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {(!emails || emails.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={4}>No whitelisted emails found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ── Style constants ─────────────────────────────────────────

const cardStyle: React.CSSProperties = {
    border: "1px solid var(--card-border)",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "var(--card-bg)",
    marginBottom: "24px",
};

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
    verticalAlign: "top",
};

const monoTdStyle: React.CSSProperties = { ...tdStyle, fontSize: "11px", fontFamily: "monospace" };
const labelStyle: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" };

const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    border: "1px solid var(--input-border)",
    borderRadius: "6px",
    backgroundColor: "var(--input-bg)",
    color: "var(--foreground)",
    fontSize: "14px",
};

const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "var(--accent)",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
};

const dangerButtonStyle: React.CSSProperties = { ...buttonStyle, backgroundColor: "var(--danger)" };
