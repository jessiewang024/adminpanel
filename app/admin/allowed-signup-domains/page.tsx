import { createServiceClient } from "@/lib/supabase/service";
import { createDomain, updateDomain, deleteDomain } from "./actions";

/**
 * Allowed Signup Domains page — full CRUD.
 * Controls which email domains (e.g. "gmail.com", "university.edu")
 * are allowed to create new accounts on the platform.
 */
export default async function AllowedSignupDomainsPage() {
    const admin = createServiceClient();

    const { data: domains, error } = await admin
        .from("allowed_signup_domains")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Allowed Signup Domains</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Manage which email domains are allowed for user signup.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            {/* ── Create Form ────────────────────────────────── */}
            <section style={cardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Add Domain</h2>
                <form action={createDomain} style={{ display: "grid", gap: "12px", maxWidth: "400px" }}>
                    <label style={labelStyle}>Apex Domain</label>
                    <input name="apex_domain" placeholder="example.com" style={inputStyle} required />

                    <button type="submit" style={buttonStyle}>Add Domain</button>
                </form>
            </section>

            {/* ── Table ───────────────────────────────────────── */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Apex Domain</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {domains?.map((d: any) => (
                        <tr key={d.id}>
                            <td style={monoTdStyle}>{d.id}</td>
                            <td style={tdStyle}><strong>{d.apex_domain}</strong></td>
                            <td style={tdStyle}>
                                {d.created_datetime_utc ? new Date(d.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                            <td style={tdStyle}>
                                <details>
                                    <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Edit</summary>
                                    <form action={updateDomain} style={{ display: "grid", gap: "8px", marginTop: "8px", minWidth: "200px" }}>
                                        <input type="hidden" name="id" value={d.id} />
                                        <input name="apex_domain" defaultValue={d.apex_domain ?? ""} style={inputStyle} />
                                        <button type="submit" style={buttonStyle}>Update</button>
                                    </form>
                                </details>
                                <form action={deleteDomain} style={{ marginTop: "8px" }}>
                                    <input type="hidden" name="id" value={d.id} />
                                    <button type="submit" style={dangerButtonStyle}>Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {(!domains || domains.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={4}>No allowed signup domains found.</td></tr>
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
