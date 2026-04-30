import { createServiceClient } from "@/lib/supabase/service";
import type { CSSProperties } from "react";

/**
 * LLM Responses page — READ only.
 * Displays LLM response data in a readable table instead of raw JSON.
 */
export default async function LlmResponsesPage() {
    const admin = createServiceClient();

    const { data: responses, error } = await admin
        .from("llm_model_responses")
        .select("*")
        .order("created_datetime_utc", { ascending: false })
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>LLM Responses</h1>

            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read-only log of LLM API responses. This page summarizes the response content in a readable table instead of showing raw JSON.
                Showing {responses?.length ?? 0} rows.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle}>Response ID</th>
                    <th style={thStyle}>Model</th>
                    <th style={thStyle}>Prompt Chain</th>
                    <th style={thStyle}>Response Preview</th>
                    <th style={thStyle}>Processing Time</th>
                    <th style={thStyle}>Created</th>
                </tr>
                </thead>

                <tbody>
                {responses?.map((r: any) => (
                    <tr key={r.id}>
                        <td style={monoTdStyle}>{shortId(r.id)}</td>

                        <td style={tdStyle}>
                            {shortId(r.llm_model_id ?? r.model ?? "—")}
                        </td>

                        <td style={tdStyle}>
                            {shortId(r.llm_prompt_chain_id ?? "—")}
                        </td>

                        <td style={{ ...tdStyle, maxWidth: "420px" }}>
                            <div style={previewBoxStyle}>
                                {formatResponsePreview(r.llm_model_response)}
                            </div>
                        </td>

                        <td style={tdStyle}>
                            {r.processing_time_seconds
                                ? `${Number(r.processing_time_seconds).toFixed(2)}s`
                                : "—"}
                        </td>

                        <td style={tdStyle}>
                            {formatDate(r.created_datetime_utc)}
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

/**
 * Converts raw LLM response data into a readable preview.
 * This avoids displaying the full raw JSON object directly.
 */
function formatResponsePreview(value: any): string {
    if (!value) return "—";

    let parsed = value;

    if (typeof value === "string") {
        const trimmed = value.trim();

        try {
            if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                parsed = JSON.parse(trimmed);
            } else {
                return truncate(trimmed, 220);
            }
        } catch {
            return truncate(trimmed, 220);
        }
    }

    if (typeof parsed === "object") {
        const possibleText =
            parsed?.choices?.[0]?.message?.content ??
            parsed?.choices?.[0]?.text ??
            parsed?.message?.content ??
            parsed?.content ??
            parsed?.text ??
            parsed?.response ??
            parsed?.output_text;

        if (possibleText) {
            return truncate(String(possibleText), 220);
        }

        const keys = Object.keys(parsed);
        if (keys.length > 0) {
            return `Response object with fields: ${keys.slice(0, 5).join(", ")}`;
        }
    }

    return truncate(String(parsed), 220);
}

function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
}

function shortId(value: string | null | undefined): string {
    if (!value || value === "—") return "—";
    if (value.length <= 12) return value;
    return `${value.slice(0, 8)}...`;
}

function formatDate(value: string | null | undefined): string {
    if (!value) return "—";
    return new Date(value).toLocaleString();
}

// ── Style constants ─────────────────────────────────────────

const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "10px",
    overflow: "hidden",
};

const thStyle: CSSProperties = {
    borderBottom: "1px solid var(--card-border)",
    textAlign: "left",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--muted)",
    backgroundColor: "var(--table-header-bg)",
    textTransform: "uppercase",
};

const tdStyle: CSSProperties = {
    borderBottom: "1px solid var(--card-border)",
    textAlign: "left",
    padding: "10px 14px",
    fontSize: "13px",
    verticalAlign: "top",
};

const monoTdStyle: CSSProperties = {
    ...tdStyle,
    fontSize: "11px",
    fontFamily: "monospace",
};

const previewBoxStyle: CSSProperties = {
    lineHeight: 1.5,
    whiteSpace: "normal",
    wordBreak: "break-word",
};