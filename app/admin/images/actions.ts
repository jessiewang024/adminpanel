"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

/**
 * Helper: converts a form value like "true"/"false" string to a boolean.
 * HTML form selects always send strings, so we need this conversion.
 */
function toBoolean(value: FormDataEntryValue | null) {
    return String(value) === "true";
}

/**
 * Helper: trims whitespace from a form value and returns null if empty.
 * This is useful for optional fields — we store null instead of "".
 */
function emptyToNull(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
}

/**
 * Creates a new image record. Supports two ways to provide the image:
 *   1. Paste a URL directly
 *   2. Upload a file (stored in Supabase Storage, URL generated automatically)
 *
 * If both are provided, the uploaded file takes priority.
 */
export async function uploadAndCreateImage(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const file = formData.get("file") as File | null;
    let imageUrl = String(formData.get("url") || "").trim();

    // If a file was uploaded, store it in Supabase Storage
    if (file && file.size > 0) {
        // Generate a unique filename using timestamp + random string
        const ext = file.name.split(".").pop() || "png";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data: uploadData, error: uploadError } = await admin.storage
            .from("images")
            .upload(fileName, file, { contentType: file.type });

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get the public URL for the uploaded file
        const { data: urlData } = admin.storage
            .from("images")
            .getPublicUrl(uploadData.path);

        imageUrl = urlData.publicUrl;
    }

    if (!imageUrl) {
        throw new Error("Please provide an image URL or upload a file.");
    }

    // Build the payload and insert into the images table
    const payload = {
        url: imageUrl,
        profile_id: emptyToNull(formData.get("profile_id")) ?? userId,
        created_by_user_id: userId,
        modified_by_user_id: userId,
        is_common_use: toBoolean(formData.get("is_common_use")),
        is_public: toBoolean(formData.get("is_public")),
        additional_context: emptyToNull(formData.get("additional_context")),
        image_description: emptyToNull(formData.get("image_description")),
    };

    const { error } = await admin.from("images").insert(payload);

    if (error) {
        throw new Error(error.message);
    }

    // Revalidate both the images page and the dashboard (which shows counts)
    revalidatePath("/admin/images");
    revalidatePath("/admin");
}

/**
 * Wrapper for uploadAndCreateImage — this is the function used by the form.
 */
export async function createImage(formData: FormData) {
    return uploadAndCreateImage(formData);
}

/**
 * Updates an existing image record by ID.
 * Only updates the fields that the admin can change (not profile_id, etc.)
 */
export async function updateImage(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const id = String(formData.get("id") || "").trim();

    const payload = {
        url: String(formData.get("url") || "").trim(),
        is_public: toBoolean(formData.get("is_public")),
        is_common_use: toBoolean(formData.get("is_common_use")),
        additional_context: emptyToNull(formData.get("additional_context")),
        image_description: emptyToNull(formData.get("image_description")),
        modified_by_user_id: userId,
    };

    const { error } = await admin.from("images").update(payload).eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/images");
    revalidatePath("/admin");
}

/**
 * Deletes an image record by ID.
 */
export async function deleteImage(formData: FormData) {
    const admin = createServiceClient();

    const id = String(formData.get("id") || "").trim();

    const { error } = await admin.from("images").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/images");
    revalidatePath("/admin");
}
