import { createServiceClient } from "@/lib/supabase/service";
import { createLlmModel, updateLlmModel, deleteLlmModel } from "./actions";

/**
 * LLM Models page — full CRUD.
 * Each model record represents an AI model (like GPT-4, Claude, etc.)
 * that can be assigned to humor flavor steps for caption generation.
 */
export default async function LlmModelsPage() {
    const admin = createServiceClient();

    // Fetch models and providers (for the dropdown)
    const [{ data: models, error }, { data: providers }] = await Promise.all([
        admin.from("llm_models").select("*").limit(100),
        admin.from("llm_providers").select("id, name"),
    ]);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>LLM Models</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Manage AI model configurations.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            {/* ── Create Form ────────────────────────────────── */}
            <section style={cardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Create LLM Model</h2>
                <form action={createLlmModel} style={{ display: "grid", gap: "12px", maxWidth: "600px" }}>
                    <label style={labelStyle}>Name</label>
                    <input name="name" style={inputStyle} required />

                    <label style={labelStyle}>Provider Model ID</label>
                    <input name="provider_model_id" placeholder="e.g. gpt-4o" style={inputStyle} required />

                    <label style={labelStyle}>Provider</label>
                    <select name="llm_provider_id" style={inputStyle} required>
                        <option value="">Select provider...</option>
                        {providers?.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <label style={labelStyle}>Temperature Supported</label>
                    <select name="is_temperature_supported" defaultValue="false" style={inputStyle}>
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>

                    <button type="submit" style={buttonStyle}>Create Model</button>
                </form>
            </section>

            {/* ── Table ───────────────────────────────────────── */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Provider Model ID</th>
                        <th style={thStyle}>Provider</th>
                        <th style={thStyle}>Temp Supported</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {models?.map((m: any) => {
                        // Look up provider name for display
                        const provider = providers?.find((p: any) => p.id === m.llm_provider_id);
                        return (
                            <tr key={m.id}>
                                <td style={monoTdStyle}>{m.id}</td>
                                <td style={tdStyle}>{m.name}</td>
                                <td style={tdStyle}>{m.provider_model_id ?? "—"}</td>
                                <td style={tdStyle}>{provider?.name ?? "—"}</td>
                                <td style={tdStyle}>{String(m.is_temperature_supported ?? false)}</td>
                                <td style={tdStyle}>
                                    <details>
                                        <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Edit</summary>
                                        <form action={updateLlmModel} style={{ display: "grid", gap: "8px", marginTop: "8px", minWidth: "250px" }}>
                                            <input type="hidden" name="id" value={m.id} />
                                            <input name="name" defaultValue={m.name ?? ""} style={inputStyle} />
                                            <input name="provider_model_id" defaultValue={m.provider_model_id ?? ""} placeholder="Provider model ID" style={inputStyle} />
                                            <select name="llm_provider_id" defaultValue={m.llm_provider_id ?? ""} style={inputStyle}>
                                                <option value="">None</option>
                                                {providers?.map((p: any) => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <select name="is_temperature_supported" defaultValue={String(m.is_temperature_supported ?? false)} style={inputStyle}>
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                            </select>
                                            <button type="submit" style={buttonStyle}>Update</button>
                                        </form>
                                    </details>
                                    <form action={deleteLlmModel} style={{ marginTop: "8px" }}>
                                        <input type="hidden" name="id" value={m.id} />
                                        <button type="submit" style={dangerButtonStyle}>Delete</button>
                                    </form>
                                </td>
                            </tr>
                        );
                    })}
                    {(!models || models.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={6}>No LLM models found.</td></tr>
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
