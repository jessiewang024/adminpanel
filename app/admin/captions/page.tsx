import { createServiceClient } from "@/lib/supabase/service";
import type { CSSProperties } from "react";

/**
 * Captions page — READ only.
 * Displays captions in a readable admin table.
 * It avoids showing raw database IDs as main columns.
 */
export default async function CaptionsPage() {
    const admin = createServiceClient();

    const { data: captions, error } = await admin
        .from("captions")
        .select("*")
        .order("created_datetime_utc", { ascending: false })
        .limit(100);

    const { data: profiles } = await admin
        .from("profiles")
        .select("*");

    const { data: images } = await admin
        .from("images")
        .select("id, image_description, profile_id, created_by_user_id");

    function shortId(id: string | null | undefined) {
        if (!id) return "—";
        return id.length > 8 ? `${id.slice(0, 8)}...` : id;
    }

    function getCaptionText(caption: any) {
        return (
            caption.content ??
            caption.caption ??
            caption.caption_text ??
            caption.text ??
            "—"
        );
    }

    function getImageForCaption(caption: any) {
        return images?.find((img: any) => img.id === caption.image_id);
    }

    function getCreatorName(caption: any) {
        const image = getImageForCaption(caption);

        const possibleUserId =
            caption.profile_id ??
            caption.user_id ??
            caption.created_by_user_id ??
            caption.owner_id ??
            image?.profile_id ??
            image?.created_by_user_id;

        if (!possibleUserId) return "Unknown user";

        const profile = profiles?.find((p: any) => {
            return (
                p.id === possibleUserId ||
                p.user_id === possibleUserId ||
                p.auth_user_id === possibleUserId
            );
        });

        return (
            profile?.display_name ??
            profile?.full_name ??
            profile?.name ??
            profile?.username ??
            profile?.email ??
            shortId(possibleUserId)
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Captions</h1>

            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Showing up to 100 captions in a readable format. Raw database IDs are hidden from the main table.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error loading captions: {error.message}
                </p>
            )}

            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle}>Caption</th>
                    <th style={thStyle}>Creator</th>
                    <th style={thStyle}>Image</th>
                    <th style={thStyle}>Created</th>
                </tr>
                </thead>

                <tbody>
                {captions?.map((c: any) => {
                    const image = getImageForCaption(c);

                    return (
                        <tr key={c.id}>
                            <td style={{ ...tdStyle, maxWidth: "520px" }}>
                                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                                    {getCaptionText(c)}
                                </div>
                                <div style={smallMutedStyle}>ID: {shortId(c.id)}</div>
                            </td>

                            <td style={tdStyle}>
                                {getCreatorName(c)}
                            </td>

                            <td style={tdStyle}>
                                {image?.image_description || "Untitled image"}
                            </td>

                            <td style={tdStyle}>
                                {c.created_datetime_utc
                                    ? new Date(c.created_datetime_utc).toLocaleDateString()
                                    : "—"}
                            </td>
                        </tr>
                    );
                })}

                {(!captions || captions.length === 0) && !error && (
                    <tr>
                        <td style={tdStyle} colSpan={4}>
                            No captions found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

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
    padding: "12px 14px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--muted)",
    backgroundColor: "var(--table-header-bg)",
    textTransform: "uppercase",
};

const tdStyle: CSSProperties = {
    borderBottom: "1px solid var(--card-border)",
    textAlign: "left",
    padding: "14px",
    fontSize: "13px",
    verticalAlign: "top",
};

const smallMutedStyle: CSSProperties = {
    color: "var(--muted)",
    fontSize: "12px",
};