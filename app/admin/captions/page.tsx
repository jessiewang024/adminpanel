import { createServiceClient } from "@/lib/supabase/service";

export default async function CaptionsPage() {
    const admin = createServiceClient();

    const { data: captions, error } = await admin
        .from("captions")
        .select("*")
        .limit(100);

    return (
        <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>Captions</h1>

            {error && (
                <p style={{ color: "red", marginBottom: "16px" }}>
                    Error loading captions: {error.message}
                </p>
            )}

            <p style={{ marginBottom: "20px" }}>
                Total captions shown: {captions?.length ?? 0}
            </p>

            <div style={{ display: "grid", gap: "16px" }}>
                {captions?.map((caption: any) => (
                    <div
                        key={caption.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "16px",
                            backgroundColor: "white",
                        }}
                    >
                        <p><strong>ID:</strong> {String(caption.id ?? "")}</p>
                        <p><strong>Image ID:</strong> {String(caption.image_id ?? "")}</p>
                        <p><strong>User ID:</strong> {String(caption.user_id ?? "")}</p>
                        <p>
                            <strong>Caption:</strong>{" "}
                            {String(
                                caption.caption ??
                                caption.text ??
                                caption.content ??
                                "No text field found"
                            )}
                        </p>
                    </div>
                ))}

                {(!captions || captions.length === 0) && !error && (
                    <p>No captions found.</p>
                )}
            </div>
        </main>
    );
}