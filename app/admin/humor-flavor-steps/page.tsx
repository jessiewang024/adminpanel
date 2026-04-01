import { createServiceClient } from "@/lib/supabase/service";

/**
 * Humor Flavor Steps page — READ only.
 * Each humor flavor has a series of steps (a "prompt chain").
 * Steps are ordered by the "order_by" column.
 */
export default async function HumorFlavorStepsPage() {
    const admin = createServiceClient();

    const [{ data: steps, error }, { data: flavors }] = await Promise.all([
        admin
            .from("humor_flavor_steps")
            .select("*")
            .order("humor_flavor_id")
            .order("order_by", { ascending: true })
            .limit(200),
        admin.from("humor_flavors").select("id, slug"),
    ]);

    // Group steps by their humor_flavor_id
    const grouped: Record<string, { flavor_name: string; steps: any[] }> = {};
    for (const step of steps ?? []) {
        const fid = step.humor_flavor_id;
        if (!grouped[fid]) {
            const flavor = flavors?.find((f: any) => f.id === fid);
            grouped[fid] = { flavor_name: flavor?.slug ?? String(fid), steps: [] };
        }
        grouped[fid].steps.push(step);
    }

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Humor Flavor Steps</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read-only view of the prompt chain steps for each humor flavor.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            {Object.entries(grouped).map(([fid, group]) => (
                <section key={fid} style={{ ...cardStyle, marginBottom: "24px" }}>
                    <h3 style={{ marginBottom: "12px" }}>
                        Flavor: {group.flavor_name}
                    </h3>

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Order</th>
                                <th style={thStyle}>System Prompt</th>
                                <th style={thStyle}>User Prompt</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Model ID</th>
                                <th style={thStyle}>Temperature</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.steps.map((s: any) => (
                                <tr key={s.id}>
                                    <td style={tdStyle}><strong>{s.order_by}</strong></td>
                                    <td style={{ ...tdStyle, maxWidth: "200px" }}>{s.llm_system_prompt ?? "—"}</td>
                                    <td style={{ ...tdStyle, maxWidth: "200px" }}>{s.llm_user_prompt ?? "—"}</td>
                                    <td style={tdStyle}>{s.description ?? "—"}</td>
                                    <td style={tdStyle}>{s.llm_model_id ?? "—"}</td>
                                    <td style={tdStyle}>{s.llm_temperature ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ))}

            {Object.keys(grouped).length === 0 && !error && (
                <p>No humor flavor steps found.</p>
            )}
        </div>
    );
}

const cardStyle: React.CSSProperties = { border: "1px solid var(--card-border)", borderRadius: "12px", padding: "20px", backgroundColor: "var(--card-bg)", marginBottom: "20px" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", overflow: "hidden" };
const thStyle: React.CSSProperties = { borderBottom: "1px solid var(--card-border)", textAlign: "left", padding: "10px 14px", fontSize: "12px", fontWeight: 600, color: "var(--muted)", backgroundColor: "var(--table-header-bg)", textTransform: "uppercase" };
const tdStyle: React.CSSProperties = { borderBottom: "1px solid var(--card-border)", textAlign: "left", padding: "10px 14px", fontSize: "13px", verticalAlign: "top" };
