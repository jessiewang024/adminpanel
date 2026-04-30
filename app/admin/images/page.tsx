import { createServiceClient } from "@/lib/supabase/service";
import { createImage, updateImage, deleteImage } from "./actions";
import type { CSSProperties } from "react";

/**
 * Images page — simple CRUD.
 * Admins can create images using only:
 * - Image URL
 * - Optional image description
 *
 * This keeps the UI simple and avoids showing raw database fields.
 */
export default async function ImagesPage() {
    const admin = createServiceClient();

    const { data: images, error } = await admin
        .from("images")
        .select("*")
        .order("created_datetime_utc", { ascending: false })
        .limit(50);

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Images</h1>

            <p style={{ color: "var(--muted)", marginBottom: "20px" }}>
                Create, view, edit, and delete images. Add a new image by pasting an image URL.
            </p>

            {error && (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>
                    Error loading images: {error.message}
                </p>
            )}

            <section style={cardStyle}>
                <h2 style={{ marginBottom: "8px" }}>Create Image</h2>

                <p style={{ color: "var(--muted)", marginBottom: "16px", fontSize: "14px" }}>
                    Paste an image URL. Description is optional.
                </p>

                <form action={createImage} style={{ display: "grid", gap: "12px", maxWidth: "800px" }}>
                    <label style={labelStyle}>Image URL</label>
                    <input name="url" placeholder="https://..." style={inputStyle} />

                    <label style={labelStyle}>Image Description Optional</label>
                    <input
                        name="image_description"
                        placeholder="Optional short description of the image"
                        style={inputStyle}
                    />

                    <button type="submit" style={buttonStyle}>
                        Create Image
                    </button>
                </form>
            </section>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h2>Image Library</h2>
                <p style={{ color: "var(--muted)" }}>Total shown: {images?.length ?? 0}</p>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
                {images?.map((image: any) => (
                    <div key={image.id} style={cardStyle}>
                        <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                            {image.url ? (
                                <img
                                    src={image.url}
                                    alt={image.image_description || "Uploaded image"}
                                    style={imageStyle}
                                />
                            ) : (
                                <div style={emptyImageStyle}>No image</div>
                            )}

                            <div style={{ flex: 1 }}>
                                <h3 style={{ marginBottom: "8px" }}>
                                    {image.image_description || "Untitled image"}
                                </h3>

                                {image.url && (
                                    <p style={{ ...mutedTextStyle, wordBreak: "break-all" }}>
                                        {image.url}
                                    </p>
                                )}

                                <p style={{ ...mutedTextStyle, marginTop: "10px" }}>
                                    Created:{" "}
                                    {image.created_datetime_utc
                                        ? new Date(image.created_datetime_utc).toLocaleDateString()
                                        : "No date"}
                                </p>
                            </div>
                        </div>

                        <details style={{ marginTop: "18px" }}>
                            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                                Edit Image
                            </summary>

                            <form
                                action={updateImage}
                                style={{
                                    display: "grid",
                                    gap: "10px",
                                    maxWidth: "700px",
                                    marginTop: "14px",
                                }}
                            >
                                <input type="hidden" name="id" value={image.id} />

                                <label style={labelStyle}>Image URL</label>
                                <input name="url" defaultValue={image.url ?? ""} style={inputStyle} />

                                <label style={labelStyle}>Image Description Optional</label>
                                <input
                                    name="image_description"
                                    defaultValue={image.image_description ?? ""}
                                    placeholder="Optional short description"
                                    style={inputStyle}
                                />

                                <button type="submit" style={buttonStyle}>
                                    Save Changes
                                </button>
                            </form>
                        </details>

                        <form action={deleteImage} style={{ marginTop: "12px" }}>
                            <input type="hidden" name="id" value={image.id} />
                            <button type="submit" style={dangerButtonStyle}>
                                Delete Image
                            </button>
                        </form>
                    </div>
                ))}

                {(!images || images.length === 0) && !error && (
                    <p>No images found.</p>
                )}
            </div>
        </div>
    );
}

const cardStyle: CSSProperties = {
    border: "1px solid var(--card-border)",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "var(--card-bg)",
    marginBottom: "20px",
};

const labelStyle: CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
};

const inputStyle: CSSProperties = {
    padding: "10px 12px",
    border: "1px solid var(--input-border)",
    borderRadius: "8px",
    backgroundColor: "var(--input-bg)",
    color: "var(--foreground)",
    fontSize: "14px",
};

const buttonStyle: CSSProperties = {
    padding: "11px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "var(--accent)",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
};

const dangerButtonStyle: CSSProperties = {
    ...buttonStyle,
    backgroundColor: "var(--danger)",
};

const imageStyle: CSSProperties = {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid var(--card-border)",
};

const emptyImageStyle: CSSProperties = {
    width: "140px",
    height: "140px",
    borderRadius: "10px",
    border: "1px solid var(--card-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--muted)",
    backgroundColor: "var(--table-header-bg)",
};

const mutedTextStyle: CSSProperties = {
    color: "var(--muted)",
    fontSize: "14px",
    margin: 0,
};