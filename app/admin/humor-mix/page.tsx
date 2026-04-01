import { createServiceClient } from "@/lib/supabase/service";
import { updateHumorMix } from "./actions";

/**
 * Humor Mix page — READ + UPDATE.
 * The humor mix controls the weight/probability of each humor flavor
 * being used when generating captions. Admins can adjust weights and
 * enable/disable flavors in the mix.
 */
export default async function HumorMixPage() {
    const admin = createServiceClient();

    const { data: mixes, error } = await admin
        .from("humor_flavor_mix")
        .select("*")
        .limit(100);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Humor Mix</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read and update humor mix configurations.
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
                        <th style={thStyle}>Humor Flavor ID</th>
                        <th style={thStyle}>Caption Count</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {mixes?.map((m: any) => (
                        <tr key={m.id}>
                            <td style={monoTdStyle}>{m.id}</td>
                            <td style={monoTdStyle}>{m.humor_flavor_id}</td>
                            <td style={tdStyle}>{m.caption_count ?? "—"}</td>
                            <td style={tdStyle}>
                                {m.created_datetime_utc ? new Date(m.created_datetime_utc).toLocaleDateString() : "—"}
                            </td>
                            <td style={tdStyle}>
                                {/* Inline edit form */}
                                <details>
                                    <summary style={{ cursor: "pointer", color: "var(--accent)" }}>Edit</summary>
                                    <form action={updateHumorMix} style={{ display: "grid", gap: "8px", marginTop: "8px", minWidth: "200px" }}>
                                        <input type="hidden" name="id" value={m.id} />
                                        <label style={labelStyle}>Caption Count</label>
                                        <input name="caption_count" type="number" defaultValue={m.caption_count ?? ""} style={inputStyle} />
                                        <button type="submit" style={buttonStyle}>Update</button>
                                    </form>
                                </details>
                            </td>
                        </tr>
                    ))}
                    {(!mixes || mixes.length === 0) && !error && (
                        <tr><td style={tdStyle} colSpan={5}>No humor mix entries found.</td></tr>
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
    verticalAlign: "top",
};

const monoTdStyle: React.CSSProperties = {
    ...tdStyle,
    fontSize: "11px",
    fontFamily: "monospace",
};

const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
};

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
