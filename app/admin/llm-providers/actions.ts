"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

export async function createLlmProvider(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const { error } = await admin.from("llm_providers").insert({
        name: String(formData.get("name") || "").trim(),
        created_by_user_id: userId,
        modified_by_user_id: userId,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/llm-providers");
    revalidatePath("/admin");
}

export async function updateLlmProvider(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("llm_providers").update({
        name: String(formData.get("name") || "").trim(),
        modified_by_user_id: userId,
    }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/llm-providers");
}

export async function deleteLlmProvider(formData: FormData) {
    const admin = createServiceClient();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("llm_providers").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/llm-providers");
    revalidatePath("/admin");
}
