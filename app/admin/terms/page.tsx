import { createServiceClient } from "@/lib/supabase/service";
import { createTerm, updateTerm, deleteTerm } from "./actions";

/**
 * Terms page — full CRUD.
 * Manages the "terms of service" entries in the database.
 * Each term has a title, content, version, and active/inactive status.
 */
export default async function TermsPage() {
    const admin = createServiceClient();

    const { data: terms, error } = await admin
        .from("terms")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Terms</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Manage terms of service entries.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            {/* ── Create Form ────────────────────────────────── */}
            <section style={cardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Create Term</h2>
                <form action={createTerm} style={{ display: "grid", gap: "12px", maxWidth: "600px" }}>
                    <label style={labelStyle}>Term</label>
                    <input name="term" style={inputStyle} required />

                    <label style={labelStyle}>Definition</label>
                    <textarea name="definition" style={textareaStyle} rows={4} required />

                    <label style={labelStyle}>Example</label>
                    <textarea name="example" style={textareaStyle} rows={2} required />

                    <label style={labelStyle}>Priority</label>
                    <input name="priority" type="number" defaultValue="0" style={inputStyle} />

                    <button type="submit" style={buttonStyle}>Create Term</button>
                </form>
            </section>

            {/* ── Table ───────────────────────────────────────── */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Term</th>
                        <th style={thStyle}>Definition</th>
                        <th style={thStyle}>Example</th>
                        <th style={thStyle}>Priority</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {terms?.map((t: any) => (
                        <tr key={t.id}>
                            <td style={monoTdStyle}>{t.id}</td>
                            <td style={tdStyle}>{t.term ?? "—"}</td>
                            <td style={{ ...tdStyle, maxWidth: "250px" }}>{t.definition ?? "—"}</td>
                            <td style={{ ...tdStyle, maxWidth: "200px" }}>{t.example ?? "—"}</td>
                            <td style={tdStyle}>{t.priority ?? 0}</td>
                            <td style={tdStyle}>
                                {t.created_datetime_utc ? new Date(t.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                            <td style={tdStyle}>
                                <details>
                                    <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Edit</summary>
                                    <form action={updateTerm} style={{ display: "grid", gap: "8px", marginTop: "8px", minWidth: "250px" }}>
                                        <input type="hidden" name="id" value={t.id} />
                                        <input name="term" defaultValue={t.term ?? ""} placeholder="Term" style={inputStyle} />
                                        <textarea name="definition" defaultValue={t.definition ?? ""} placeholder="Definition" style={textareaStyle} />
                                        <textarea name="example" defaultValue={t.example ?? ""} placeholder="Example" style={textareaStyle} />
                                        <input name="priority" type="number" defaultValue={t.priority ?? 0} placeholder="Priority" style={inputStyle} />
                                        <button type="submit" style={buttonStyle}>Update</button>
                                    </form>
                                </details>
                                <form action={deleteTerm} style={{ marginTop: "8px" }}>
                                    <input type="hidden" name="id" value={t.id} />
                                    <button type="submit" style={dangerButtonStyle}>Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {(!terms || terms.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={7}>No terms found.</td></tr>
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

const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: "60px", resize: "vertical" };

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
