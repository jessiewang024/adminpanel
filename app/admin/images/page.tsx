import { createServiceClient } from "@/lib/supabase/service";
import { createImage, updateImage, deleteImage } from "./actions";

export default async function ImagesPage() {
    const admin = createServiceClient();

    const { data: images, error } = await admin
        .from("images")
        .select("*")
        .limit(20);

    return (
        <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>Images</h1>

            {error && (
                <p style={{ color: "red", marginBottom: "16px" }}>
                    Error loading images: {error.message}
                </p>
            )}

            <section
                style={{
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "32px",
                }}
            >
                <h2 style={{ marginBottom: "16px" }}>Create Image</h2>

                <form action={createImage} style={{ display: "grid", gap: "12px", maxWidth: "800px" }}>
                    <input name="url" placeholder="Image URL" />
                    <input name="profile_id" placeholder="Profile ID" />
                    <input name="created_by_user_id" placeholder="Created by user ID" />
                    <input name="modified_by_user_id" placeholder="Modified by user ID" />

                    <select name="is_common_use" defaultValue="false">
                        <option value="false">is_common_use = false</option>
                        <option value="true">is_common_use = true</option>
                    </select>

                    <select name="is_public" defaultValue="false">
                        <option value="false">is_public = false</option>
                        <option value="true">is_public = true</option>
                    </select>

                    <input name="image_description" placeholder="Image description (optional)" />
                    <input name="additional_context" placeholder="Additional context (optional)" />

                    <button type="submit" style={buttonStyle}>
                        Create Image
                    </button>
                </form>
            </section>

            <p style={{ marginBottom: "20px" }}>
                Total images shown: {images?.length ?? 0}
            </p>

            <div style={{ display: "grid", gap: "20px" }}>
                {images?.map((image: any) => (
                    <div
                        key={image.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "20px",
                            backgroundColor: "white",
                        }}
                    >
                        <p><strong>ID:</strong> {image.id}</p>
                        <p><strong>URL:</strong> {image.url}</p>
                        <p><strong>Profile ID:</strong> {image.profile_id}</p>
                        <p><strong>Created by:</strong> {image.created_by_user_id}</p>
                        <p><strong>Modified by:</strong> {image.modified_by_user_id}</p>
                        <p><strong>Public:</strong> {String(image.is_public)}</p>
                        <p><strong>Common Use:</strong> {String(image.is_common_use)}</p>
                        <p><strong>Description:</strong> {String(image.image_description ?? "")}</p>
                        <p><strong>Additional Context:</strong> {String(image.additional_context ?? "")}</p>

                        <div style={{ marginTop: "16px", marginBottom: "12px" }}>
                            <h3 style={{ marginBottom: "10px" }}>Update This Image</h3>

                            <form action={updateImage} style={{ display: "grid", gap: "10px", maxWidth: "700px" }}>
                                <input type="hidden" name="id" value={image.id} />

                                <input name="url" defaultValue={image.url ?? ""} />
                                <input name="modified_by_user_id" defaultValue={image.modified_by_user_id ?? ""} />
                                <input name="image_description" defaultValue={image.image_description ?? ""} />
                                <input name="additional_context" defaultValue={image.additional_context ?? ""} />

                                <select name="is_public" defaultValue={String(image.is_public)}>
                                    <option value="false">is_public = false</option>
                                    <option value="true">is_public = true</option>
                                </select>

                                <select name="is_common_use" defaultValue={String(image.is_common_use)}>
                                    <option value="false">is_common_use = false</option>
                                    <option value="true">is_common_use = true</option>
                                </select>

                                <button type="submit" style={buttonStyle}>
                                    Update Image
                                </button>
                            </form>
                        </div>

                        <div>
                            <h3 style={{ marginBottom: "10px" }}>Delete This Image</h3>

                            <form action={deleteImage}>
                                <input type="hidden" name="id" value={image.id} />
                                <button
                                    type="submit"
                                    style={{
                                        ...buttonStyle,
                                        backgroundColor: "#b42318",
                                    }}
                                >
                                    Delete Image
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {(!images || images.length === 0) && !error && <p>No images found.</p>}
            </div>
        </main>
    );
}

const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#111",
    color: "white",
    cursor: "pointer",
};