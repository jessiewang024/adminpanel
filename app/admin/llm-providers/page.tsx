import { createServiceClient } from "@/lib/supabase/service";
import { createLlmProvider, updateLlmProvider, deleteLlmProvider } from "./actions";

/**
 * LLM Providers page — full CRUD.
 * Providers are companies like OpenAI, Anthropic, Google, etc.
 * Each provider has an API base URL and can have multiple models.
 */
export default async function LlmProvidersPage() {
    const admin = createServiceClient();

    const { data: providers, error } = await admin
        .from("llm_providers")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>LLM Providers</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Manage LLM provider configurations.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            {/* ── Create Form ────────────────────────────────── */}
            <section style={cardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Create LLM Provider</h2>
                <form action={createLlmProvider} style={{ display: "grid", gap: "12px", maxWidth: "600px" }}>
                    <label style={labelStyle}>Name</label>
                    <input name="name" style={inputStyle} required />

                    <button type="submit" style={buttonStyle}>Create Provider</button>
                </form>
            </section>

            {/* ── Table ───────────────────────────────────────── */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {providers?.map((p: any) => (
                        <tr key={p.id}>
                            <td style={monoTdStyle}>{p.id}</td>
                            <td style={tdStyle}>{p.name}</td>
                            <td style={tdStyle}>
                                {p.created_datetime_utc ? new Date(p.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                            <td style={tdStyle}>
                                <details>
                                    <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Edit</summary>
                                    <form action={updateLlmProvider} style={{ display: "grid", gap: "8px", marginTop: "8px", minWidth: "250px" }}>
                                        <input type="hidden" name="id" value={p.id} />
                                        <input name="name" defaultValue={p.name ?? ""} style={inputStyle} />
                                        <button type="submit" style={buttonStyle}>Update</button>
                                    </form>
                                </details>
                                <form action={deleteLlmProvider} style={{ marginTop: "8px" }}>
                                    <input type="hidden" name="id" value={p.id} />
                                    <button type="submit" style={dangerButtonStyle}>Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {(!providers || providers.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={4}>No LLM providers found.</td></tr>
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
