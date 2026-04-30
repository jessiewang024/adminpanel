"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

/** Helper: returns null for empty strings, otherwise trims whitespace. */
function emptyToNull(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
}

/** Creates a new human-written example caption. */
export async function createCaptionExample(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const { error } = await admin.from("caption_examples").insert({
        image_id: null,
        image_description: String(formData.get("image_description") || "").trim(),
        caption: String(formData.get("caption") || "").trim(),
        explanation: String(formData.get("explanation") || "").trim(),
        priority: 0,
        created_by_user_id: userId,
        modified_by_user_id: userId,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/caption-examples");
    revalidatePath("/admin");
}

/** Updates an existing caption example by ID. */
export async function updateCaptionExample(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();
    const id = String(formData.get("id")).trim();

    const { error } = await admin
        .from("caption_examples")
        .update({
            image_description: String(formData.get("image_description") || "").trim(),
            caption: String(formData.get("caption") || "").trim(),
            explanation: String(formData.get("explanation") || "").trim(),
            modified_by_user_id: userId,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/caption-examples");
    revalidatePath("/admin");
}

/** Deletes a caption example by ID. */
export async function deleteCaptionExample(formData: FormData) {
    const admin = createServiceClient();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("caption_examples").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/caption-examples");
    revalidatePath("/admin");
}