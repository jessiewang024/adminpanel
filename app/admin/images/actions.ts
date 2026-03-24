"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

function toBoolean(value: FormDataEntryValue | null) {
    return String(value) === "true";
}

function emptyToNull(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
}

export async function createImage(formData: FormData) {
    const admin = createServiceClient();

    const payload = {
        url: String(formData.get("url") || "").trim(),
        profile_id: String(formData.get("profile_id") || "").trim(),
        created_by_user_id: String(formData.get("created_by_user_id") || "").trim(),
        modified_by_user_id: String(formData.get("modified_by_user_id") || "").trim(),
        is_common_use: toBoolean(formData.get("is_common_use")),
        is_public: toBoolean(formData.get("is_public")),
        additional_context: emptyToNull(formData.get("additional_context")),
        image_description: emptyToNull(formData.get("image_description")),
        celebrity_recognition: null,
        embedding: null,
    };

    const { error } = await admin.from("images").insert(payload);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/images");
    revalidatePath("/admin");
}

export async function updateImage(formData: FormData) {
    const admin = createServiceClient();

    const id = String(formData.get("id") || "").trim();

    const payload = {
        url: String(formData.get("url") || "").trim(),
        is_public: toBoolean(formData.get("is_public")),
        is_common_use: toBoolean(formData.get("is_common_use")),
        additional_context: emptyToNull(formData.get("additional_context")),
        image_description: emptyToNull(formData.get("image_description")),
        modified_by_user_id: String(formData.get("modified_by_user_id") || "").trim(),
    };

    const { error } = await admin.from("images").update(payload).eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/images");
    revalidatePath("/admin");
}

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