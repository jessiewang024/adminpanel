import { createServiceClient } from "@/lib/supabase/service";
import type { CSSProperties } from "react";

/**
 * Caption Requests page — READ only.
 * Shows caption generation requests in a readable table.
 * Instead of showing raw profile_id, it displays the user's name when possible.
 */
export default async function CaptionRequestsPage() {
    const admin = createServiceClient();

    const { data: requests, error } = await admin
        .from("caption_requests")
        .select("*")
        .order("created_datetime_utc", { ascending: false })
        .limit(100);

    const { data: profiles } = await admin
        .from("profiles")
        .select("*");

    const { data: images } = await admin
        .from("images")
        .select("id, image_description, url");

    function shortId(id: string | number | null | undefined) {
        if (!id) return "—";
        const text = String(id);
        return text.length > 8 ? `${text.slice(0, 8)}...` : text;
    }

    function getUserName(profileId: string | null | undefined) {
        if (!profileId) return "Unknown user";

        const profile = profiles?.find((p: any) => {
            return (
                p.id === profileId ||
                p.profile_id === profileId ||
                p.user_id === profileId ||
                p.auth_user_id === profileId
            );
        });

        return (
            profile?.username ??
            profile?.display_name ??
            profile?.full_name ??
            profile?.name ??
            profile?.email ??
            shortId(profileId)
        );
    }

    function getImageName(imageId: string | null | undefined) {
        if (!imageId) return "No image";

        const image = images?.find((img: any) => img.id === imageId);

        return (
            image?.image_description ??
            image?.url ??
            "Untitled image"
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
                Caption Requests
            </h1>

            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Read-only view of caption generation requests. Showing {requests?.length ?? 0} rows.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error: {error.message}
                </p>
            )}

            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle}>Request</th>
                    <th style={thStyle}>Image</th>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Created</th>
                </tr>
                </thead>

                <tbody>
                {requests?.map((request: any) => (
                    <tr key={request.id}>
                        <td style={tdStyle}>
                            <div style={{ fontWeight: 600 }}>Caption Request</div>
                            <div style={smallMutedStyle}>ID: {shortId(request.id)}</div>
                        </td>

                        <td style={{ ...tdStyle, maxWidth: "420px" }}>
                            {getImageName(request.image_id)}
                        </td>

                        <td style={tdStyle}>
                            {getUserName(request.profile_id)}
                        </td>

                        <td style={tdStyle}>
                            {request.created_datetime_utc
                                ? new Date(request.created_datetime_utc).toLocaleDateString()
                                : "—"}
                        </td>
                    </tr>
                ))}

                {(!requests || requests.length === 0) && !error && (
                    <tr>
                        <td style={tdStyle} colSpan={4}>
                            No caption requests found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
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
    marginTop: "4px",
};