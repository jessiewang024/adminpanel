import { createServiceClient } from "@/lib/supabase/service";
import { createImage, updateImage, deleteImage } from "./actions";

/**
 * Images page — full CRUD.
 * Admins can create new images (by URL or file upload), view all images,
 * update image details, and delete images.
 */
export default async function ImagesPage() {
    const admin = createServiceClient();

    // Fetch images sorted by newest first
    const { data: images, error } = await admin
        .from("images")
        .select("*")
        .limit(50);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Images</h1>
            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Create, read, update, and delete images. Supports file upload.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error loading images: {error.message}
                </p>
            )}

            {/* ── Create Image Form ─────────────────────────── */}
            <section style={cardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Create Image</h2>

                <form action={createImage} style={{ display: "grid", gap: "12px", maxWidth: "800px" }}>
                    {/* You can provide a URL or upload a file (or both) */}
                    <label style={labelStyle}>Image URL</label>
                    <input name="url" placeholder="https://..." style={inputStyle} />

                    <label style={labelStyle}>Or Upload a File</label>
                    <input name="file" type="file" accept="image/*" style={inputStyle} />

                    <label style={labelStyle}>Profile ID</label>
                    <input name="profile_id" placeholder="UUID" style={inputStyle} />

                    <label style={labelStyle}>Created by User ID</label>
                    <input name="created_by_user_id" placeholder="UUID" style={inputStyle} />

                    <label style={labelStyle}>Modified by User ID</label>
                    <input name="modified_by_user_id" placeholder="UUID" style={inputStyle} />

                    <select name="is_common_use" defaultValue="false" style={inputStyle}>
                        <option value="false">is_common_use = false</option>
                        <option value="true">is_common_use = true</option>
                    </select>

                    <select name="is_public" defaultValue="false" style={inputStyle}>
                        <option value="false">is_public = false</option>
                        <option value="true">is_public = true</option>
                    </select>

                    <input name="image_description" placeholder="Image description (optional)" style={inputStyle} />
                    <input name="additional_context" placeholder="Additional context (optional)" style={inputStyle} />

                    <button type="submit" style={buttonStyle}>Create Image</button>
                </form>
            </section>

            {/* ── Image List ────────────────────────────────── */}
            <p style={{ marginBottom: "20px" }}>
                Total images shown: {images?.length ?? 0}
            </p>

            <div style={{ display: "grid", gap: "20px" }}>
                {images?.map((image: any) => (
                    <div key={image.id} style={cardStyle}>
                        {/* Show image thumbnail if URL exists */}
                        <div style={{ display: "flex", gap: "16px" }}>
                            {image.url && (
                                <img
                                    src={image.url}
                                    alt={image.image_description || "Image"}
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid var(--card-border)",
                                    }}
                                />
                            )}
                            <div>
                                <p><strong>ID:</strong> {image.id}</p>
                                <p><strong>URL:</strong> {image.url}</p>
                                <p><strong>Profile ID:</strong> {image.profile_id}</p>
                                <p><strong>Created by:</strong> {image.created_by_user_id}</p>
                                <p><strong>Public:</strong> {String(image.is_public)}</p>
                                <p><strong>Common Use:</strong> {String(image.is_common_use)}</p>
                                <p><strong>Description:</strong> {image.image_description ?? ""}</p>
                                <p><strong>Context:</strong> {image.additional_context ?? ""}</p>
                            </div>
                        </div>

                        {/* Update form (hidden inside a collapsible <details>) */}
                        <details style={{ marginTop: "16px" }}>
                            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                                Update This Image
                            </summary>
                            <form action={updateImage} style={{ display: "grid", gap: "10px", maxWidth: "700px", marginTop: "12px" }}>
                                <input type="hidden" name="id" value={image.id} />
                                <input name="url" defaultValue={image.url ?? ""} style={inputStyle} />
                                <input name="modified_by_user_id" defaultValue={image.modified_by_user_id ?? ""} placeholder="Modified by user ID" style={inputStyle} />
                                <input name="image_description" defaultValue={image.image_description ?? ""} placeholder="Description" style={inputStyle} />
                                <input name="additional_context" defaultValue={image.additional_context ?? ""} placeholder="Additional context" style={inputStyle} />

                                <select name="is_public" defaultValue={String(image.is_public)} style={inputStyle}>
                                    <option value="false">is_public = false</option>
                                    <option value="true">is_public = true</option>
                                </select>

                                <select name="is_common_use" defaultValue={String(image.is_common_use)} style={inputStyle}>
                                    <option value="false">is_common_use = false</option>
                                    <option value="true">is_common_use = true</option>
                                </select>

                                <button type="submit" style={buttonStyle}>Update Image</button>
                            </form>
                        </details>

                        {/* Delete form */}
                        <div style={{ marginTop: "12px" }}>
                            <form action={deleteImage}>
                                <input type="hidden" name="id" value={image.id} />
                                <button type="submit" style={dangerButtonStyle}>
                                    Delete Image
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {(!images || images.length === 0) && !error && <p>No images found.</p>}
            </div>
        </div>
    );
}

// ── Style constants ─────────────────────────────────────────

const cardStyle: React.CSSProperties = {
    border: "1px solid var(--card-border)",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "var(--card-bg)",
    marginBottom: "20px",
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
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "var(--accent)",
    color: "white",
    cursor: "pointer",
    fontWeight: 500,
};

const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "var(--danger)",
};
