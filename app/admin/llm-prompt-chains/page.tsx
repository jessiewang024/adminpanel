import { createServiceClient } from "@/lib/supabase/service";

/**
 * LLM Prompt Chains page — READ only.
 * Prompt chains are the sequences of LLM calls used to generate captions.
 * Each chain is associated with a humor flavor.
 */
export default async function LlmPromptChainsPage() {
    const admin = createServiceClient();

    const { data: chains, error } = await admin
        .from("llm_prompt_chains")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>LLM Prompt Chains</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read-only view of prompt chain configurations. Showing {chains?.length ?? 0} rows.
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
                        <th style={thStyle}>Caption Request ID</th>
                        <th style={thStyle}>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {chains?.map((c: any) => (
                        <tr key={c.id}>
                            <td style={monoTdStyle}>{c.id}</td>
                            <td style={monoTdStyle}>{c.caption_request_id ?? "—"}</td>
                            <td style={tdStyle}>
                                {c.created_datetime_utc ? new Date(c.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                        </tr>
                    ))}
                    {(!chains || chains.length === 0) && !error && (
                        <tr>
                            <td style={tdStyle} colSpan={3}>No prompt chains found.</td>
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

const monoTdStyle: React.CSSProperties = {
    ...tdStyle,
    fontSize: "11px",
    fontFamily: "monospace",
};
