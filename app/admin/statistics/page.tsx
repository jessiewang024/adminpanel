import { createServiceClient } from "@/lib/supabase/service";
import type { CSSProperties } from "react";

type Row = Record<string, any>;

const ratingTableCandidates = [
    "caption_ratings",
    "caption_votes",
    "caption_rankings",
    "ratings",
    "votes",
];

async function fetchAllRows(admin: any, tableName: string, select = "*") {
    const pageSize = 1000;
    let from = 0;
    let allRows: Row[] = [];

    while (true) {
        const { data, error } = await admin
            .from(tableName)
            .select(select)
            .range(from, from + pageSize - 1);

        if (error) {
            throw error;
        }

        const rows = data ?? [];
        allRows = allRows.concat(rows);

        if (rows.length < pageSize) break;

        from += pageSize;
    }

    return allRows;
}

async function tryFetchRatings(admin: any) {
    for (const tableName of ratingTableCandidates) {
        try {
            const rows = await fetchAllRows(admin, tableName);
            return { tableName, rows };
        } catch {
            // Try next possible table name
        }
    }

    return { tableName: null, rows: [] as Row[] };
}

async function fetchRowsByIds(admin: any, tableName: string, ids: string[]) {
    const cleanIds = Array.from(new Set(ids.filter(Boolean)));
    if (cleanIds.length === 0) return [];

    const chunkSize = 200;
    let rows: Row[] = [];

    for (let i = 0; i < cleanIds.length; i += chunkSize) {
        const chunk = cleanIds.slice(i, i + chunkSize);

        const { data, error } = await admin
            .from(tableName)
            .select("*")
            .in("id", chunk);

        if (!error && data) {
            rows = rows.concat(data);
        }
    }

    return rows;
}

function getCaptionId(row: Row) {
    return (
        row.caption_id ??
        row.captionId ??
        row.rated_caption_id ??
        row.llm_caption_id ??
        null
    );
}

function getRequestId(row: Row) {
    return (
        row.caption_request_id ??
        row.request_id ??
        row.generation_request_id ??
        null
    );
}

function getFlavorId(row: Row) {
    return (
        row.humor_flavor_id ??
        row.flavor_id ??
        row.humor_flavor ??
        row.flavor ??
        null
    );
}

function getVoteScore(row: Row) {
    const value =
        row.rating ??
        row.score ??
        row.value ??
        row.vote ??
        row.reaction ??
        row.is_funny ??
        row.is_positive ??
        row.liked ??
        null;

    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? 1 : -1;

    const text = String(value ?? "").toLowerCase();

    if (["up", "upvote", "like", "liked", "positive", "funny", "yes", "1"].includes(text)) {
        return 1;
    }

    if (["down", "downvote", "dislike", "disliked", "negative", "not_funny", "no", "-1"].includes(text)) {
        return -1;
    }

    const numberValue = Number(text);
    if (!Number.isNaN(numberValue)) return numberValue;

    return 0;
}

function getFlavorLabel(flavor: Row | undefined, fallback: string) {
    return (
        flavor?.name ??
        flavor?.slug ??
        flavor?.title ??
        flavor?.label ??
        fallback
    );
}

function getConfidence(totalVotes: number) {
    if (totalVotes >= 100) return "High";
    if (totalVotes >= 20) return "Medium";
    return "Low";
}

export default async function StatisticsPage() {
    const admin = createServiceClient();

    const { tableName, rows: ratingRows } = await tryFetchRatings(admin);

    const captionIds = ratingRows
        .map(getCaptionId)
        .filter(Boolean)
        .map(String);

    const captions = await fetchRowsByIds(admin, "captions", captionIds);

    const requestIds = [
        ...ratingRows.map(getRequestId).filter(Boolean).map(String),
        ...captions.map((c) => getRequestId(c)).filter(Boolean).map(String),
    ];

    const captionRequests = await fetchRowsByIds(admin, "caption_requests", requestIds);

    let humorFlavors: Row[] = [];
    try {
        humorFlavors = await fetchAllRows(admin, "humor_flavors");
    } catch {
        humorFlavors = [];
    }

    const captionMap = new Map(captions.map((c) => [String(c.id), c]));
    const requestMap = new Map(captionRequests.map((r) => [String(r.id), r]));

    const flavorMap = new Map<string, Row>();
    for (const flavor of humorFlavors) {
        if (flavor.id) flavorMap.set(String(flavor.id), flavor);
        if (flavor.slug) flavorMap.set(String(flavor.slug), flavor);
        if (flavor.name) flavorMap.set(String(flavor.name), flavor);
    }

    const grouped = new Map<
        string,
        {
            label: string;
            totalVotes: number;
            positiveVotes: number;
            negativeVotes: number;
            scoreSum: number;
            captionIds: Set<string>;
        }
    >();

    for (const rating of ratingRows) {
        const captionId = getCaptionId(rating);
        const caption = captionId ? captionMap.get(String(captionId)) : undefined;

        const requestId =
            getRequestId(rating) ??
            getRequestId(caption ?? {});

        const request = requestId ? requestMap.get(String(requestId)) : undefined;

        const flavorId =
            getFlavorId(rating) ??
            getFlavorId(caption ?? {}) ??
            getFlavorId(request ?? {}) ??
            "unknown";

        const flavor = flavorMap.get(String(flavorId));
        const label = getFlavorLabel(flavor, String(flavorId));

        const key = String(flavor?.id ?? flavorId);
        const score = getVoteScore(rating);

        if (!grouped.has(key)) {
            grouped.set(key, {
                label,
                totalVotes: 0,
                positiveVotes: 0,
                negativeVotes: 0,
                scoreSum: 0,
                captionIds: new Set(),
            });
        }

        const item = grouped.get(key)!;

        item.totalVotes += 1;
        item.scoreSum += score;

        if (score > 0) item.positiveVotes += 1;
        if (score < 0) item.negativeVotes += 1;

        if (captionId) item.captionIds.add(String(captionId));
    }

    const stats = Array.from(grouped.values())
        .map((item) => {
            const captionCount = item.captionIds.size || 1;
            return {
                ...item,
                captionCount,
                votesPerCaption: item.totalVotes / captionCount,
                averageRating: item.totalVotes > 0 ? item.scoreSum / item.totalVotes : 0,
                confidence: getConfidence(item.totalVotes),
            };
        })
        .sort((a, b) => b.totalVotes - a.totalVotes);

    const maxVotes = Math.max(...stats.map((s) => s.totalVotes), 1);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Statistics</h1>

            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
                Analytics about captions that users are rating.
            </p>

            <section style={cardStyle}>
                <h2 style={{ marginBottom: "6px" }}>Humor Flavor Performance</h2>

                <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                    Caption rating analytics grouped by humor flavor.
                    {tableName ? ` Rating data source: ${tableName}.` : " No rating table was found."}
                </p>

                {stats.length === 0 ? (
                    <p style={{ color: "var(--muted)" }}>
                        No rating data found yet. Once users rate captions, this page will show performance by humor flavor.
                    </p>
                ) : (
                    <>
                        <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>
                            Total Votes by Flavor
                        </h3>

                        <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
                            {stats.slice(0, 8).map((item) => {
                                const width = `${Math.max((item.totalVotes / maxVotes) * 100, 4)}%`;

                                return (
                                    <div
                                        key={item.label}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "180px 1fr 80px",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <div style={smallTextStyle}>{item.label}</div>
                                        <div style={barTrackStyle}>
                                            <div style={{ ...barFillStyle, width }} />
                                        </div>
                                        <div style={{ ...smallTextStyle, textAlign: "right" }}>
                                            {item.totalVotes.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <table style={tableStyle}>
                            <thead>
                            <tr>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Humor Flavor</th>
                                <th style={thStyle}>Total Votes</th>
                                <th style={thStyle}>Votes / Caption</th>
                                <th style={thStyle}>Avg Rating</th>
                                <th style={thStyle}>Confidence</th>
                            </tr>
                            </thead>

                            <tbody>
                            {stats.map((item, index) => (
                                <tr key={item.label}>
                                    <td style={tdStyle}>{index + 1}</td>

                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 700 }}>{item.label}</div>
                                        <div style={smallMutedStyle}>
                                            {item.captionCount.toLocaleString()} captions
                                        </div>
                                    </td>

                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 700 }}>
                                            {item.totalVotes.toLocaleString()}
                                        </div>
                                        <div style={smallMutedStyle}>
                                            +{item.positiveVotes.toLocaleString()} / -{item.negativeVotes.toLocaleString()}
                                        </div>
                                    </td>

                                    <td style={tdStyle}>
                                        {item.votesPerCaption.toFixed(2)}
                                    </td>

                                    <td style={tdStyle}>
                                        {item.averageRating.toFixed(2)}
                                    </td>

                                    <td style={tdStyle}>
                                        <span style={badgeStyle}>{item.confidence}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </section>
        </div>
    );
}

const cardStyle: CSSProperties = {
    border: "1px solid var(--card-border)",
    borderRadius: "12px",
    padding: "24px",
    backgroundColor: "var(--card-bg)",
};

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
    fontWeight: 700,
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

const smallTextStyle: CSSProperties = {
    fontSize: "13px",
    color: "var(--muted)",
};

const smallMutedStyle: CSSProperties = {
    fontSize: "12px",
    color: "var(--muted)",
    marginTop: "4px",
};

const barTrackStyle: CSSProperties = {
    height: "22px",
    borderRadius: "6px",
    backgroundColor: "#eef2f7",
    overflow: "hidden",
};

const barFillStyle: CSSProperties = {
    height: "100%",
    borderRadius: "6px",
    backgroundColor: "#5DADE2",
};

const badgeStyle: CSSProperties = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: 700,
};