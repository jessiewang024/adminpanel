"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

/** Helper: returns null for empty strings, otherwise trims whitespace. */
function emptyToNull(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
}

/** Creates a new terms entry. */
export async function createTerm(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const { error } = await admin.from("terms").insert({
        term: String(formData.get("term") || "").trim(),
        definition: String(formData.get("definition") || "").trim(),
        example: String(formData.get("example") || "").trim(),
        priority: Number(formData.get("priority") || 0),
        created_by_user_id: userId,
        modified_by_user_id: userId,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/terms");
    revalidatePath("/admin");
}

/** Updates an existing terms entry by ID. */
export async function updateTerm(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("terms").update({
        term: String(formData.get("term") || "").trim(),
        definition: String(formData.get("definition") || "").trim(),
        example: String(formData.get("example") || "").trim(),
        priority: Number(formData.get("priority") || 0),
        modified_by_user_id: userId,
    }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/terms");
}

/** Deletes a terms entry by ID. */
export async function deleteTerm(formData: FormData) {
    const admin = createServiceClient();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("terms").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/terms");
    revalidatePath("/admin");
}
