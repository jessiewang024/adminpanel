import { createServiceClient } from "@/lib/supabase/service";

/**
 * LLM Responses page — READ only.
 * Shows the raw responses from LLM API calls.
 */
export default async function LlmResponsesPage() {
    const admin = createServiceClient();

    const { data: responses, error } = await admin
        .from("llm_model_responses")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
                LLM Responses
            </h1>

            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read-only log of all LLM API responses. Showing{" "}
                {responses?.length ?? 0} rows.
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
                    <th style={thStyle}>Model</th>
                    <th style={thStyle}>Prompt Chain ID</th>
                    <th style={thStyle}>Response</th>
                    <th style={thStyle}>Processing (s)</th>
                    <th style={thStyle}>Created</th>
                </tr>
                </thead>

                <tbody>
                {responses?.map((r: any) => (
                    <tr key={r.id}>
                        <td style={monoTdStyle}>{r.id}</td>
                        <td style={tdStyle}>{r.llm_model_id ?? r.model ?? "—"}</td>
                        <td style={monoTdStyle}>{r.llm_prompt_chain_id ?? "—"}</td>
                        <td style={{ ...tdStyle, maxWidth: "420px", whiteSpace: "pre-wrap" }}>
                            {r.llm_model_response ?? r.response ?? "—"}
                        </td>
                        <td style={tdStyle}>
                            {r.processing_time_seconds ?? "—"}
                        </td>
                        <td style={tdStyle}>
                            {r.created_datetime_utc
                                ? new Date(r.created_datetime_utc).toLocaleDateString()
                                : "—"}
                        </td>
                    </tr>
                ))}

                {(!responses || responses.length === 0) && !error && (
                    <tr>
                        <td style={tdStyle} colSpan={6}>
                            No LLM responses found.
                        </td>
                    </tr>
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
    verticalAlign: "top",
};

const monoTdStyle: React.CSSProperties = {
    ...tdStyle,
    fontSize: "11px",
    fontFamily: "monospace",
};