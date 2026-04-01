import { createServiceClient } from "@/lib/supabase/service";
import { createCaptionExample, updateCaptionExample, deleteCaptionExample } from "./actions";

/**
 * Caption Examples page — full CRUD.
 * These are human-written example captions that can be used as
 * few-shot examples to help the AI generate better captions.
 */
export default async function CaptionExamplesPage() {
    const admin = createServiceClient();

    const { data: examples, error } = await admin
        .from("caption_examples")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Caption Examples</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Manage human-written example captions.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            {/* ── Create Form ────────────────────────────────── */}
            <section style={cardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Create Caption Example</h2>
                <form action={createCaptionExample} style={{ display: "grid", gap: "12px", maxWidth: "600px" }}>
                    <label style={labelStyle}>Image ID (optional)</label>
                    <input name="image_id" placeholder="UUID" style={inputStyle} />

                    <label style={labelStyle}>Image Description</label>
                    <textarea name="image_description" style={textareaStyle} rows={2} required />

                    <label style={labelStyle}>Caption</label>
                    <textarea name="caption" style={textareaStyle} rows={3} required />

                    <label style={labelStyle}>Explanation</label>
                    <textarea name="explanation" style={textareaStyle} rows={2} required />

                    <label style={labelStyle}>Priority</label>
                    <input name="priority" type="number" defaultValue="0" style={inputStyle} />

                    <button type="submit" style={buttonStyle}>Create Example</button>
                </form>
            </section>

            {/* ── Table ───────────────────────────────────────── */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Image ID</th>
                        <th style={thStyle}>Image Description</th>
                        <th style={thStyle}>Caption</th>
                        <th style={thStyle}>Explanation</th>
                        <th style={thStyle}>Priority</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {examples?.map((e: any) => (
                        <tr key={e.id}>
                            <td style={monoTdStyle}>{e.id}</td>
                            <td style={monoTdStyle}>{e.image_id ?? "—"}</td>
                            <td style={{ ...tdStyle, maxWidth: "200px" }}>{e.image_description ?? "—"}</td>
                            <td style={{ ...tdStyle, maxWidth: "250px" }}>{e.caption ?? "—"}</td>
                            <td style={{ ...tdStyle, maxWidth: "200px" }}>{e.explanation ?? "—"}</td>
                            <td style={tdStyle}>{e.priority ?? 0}</td>
                            <td style={tdStyle}>
                                {e.created_datetime_utc ? new Date(e.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                            <td style={tdStyle}>
                                <details>
                                    <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Edit</summary>
                                    <form action={updateCaptionExample} style={{ display: "grid", gap: "8px", marginTop: "8px", minWidth: "250px" }}>
                                        <input type="hidden" name="id" value={e.id} />
                                        <input name="image_id" defaultValue={e.image_id ?? ""} placeholder="Image ID" style={inputStyle} />
                                        <textarea name="image_description" defaultValue={e.image_description ?? ""} placeholder="Image Description" style={textareaStyle} />
                                        <textarea name="caption" defaultValue={e.caption ?? ""} placeholder="Caption" style={textareaStyle} />
                                        <textarea name="explanation" defaultValue={e.explanation ?? ""} placeholder="Explanation" style={textareaStyle} />
                                        <input name="priority" type="number" defaultValue={e.priority ?? 0} placeholder="Priority" style={inputStyle} />
                                        <button type="submit" style={buttonStyle}>Update</button>
                                    </form>
                                </details>
                                <form action={deleteCaptionExample} style={{ marginTop: "8px" }}>
                                    <input type="hidden" name="id" value={e.id} />
                                    <button type="submit" style={dangerButtonStyle}>Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {(!examples || examples.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={8}>No caption examples found.</td></tr>
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
