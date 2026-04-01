"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

export async function createLlmModel(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const { error } = await admin.from("llm_models").insert({
        name: String(formData.get("name") || "").trim(),
        provider_model_id: String(formData.get("provider_model_id") || "").trim(),
        llm_provider_id: Number(formData.get("llm_provider_id")),
        is_temperature_supported: String(formData.get("is_temperature_supported")) === "true",
        created_by_user_id: userId,
        modified_by_user_id: userId,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/llm-models");
    revalidatePath("/admin");
}

export async function updateLlmModel(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("llm_models").update({
        name: String(formData.get("name") || "").trim(),
        provider_model_id: String(formData.get("provider_model_id") || "").trim(),
        llm_provider_id: Number(formData.get("llm_provider_id")),
        is_temperature_supported: String(formData.get("is_temperature_supported")) === "true",
        modified_by_user_id: userId,
    }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/llm-models");
}

export async function deleteLlmModel(formData: FormData) {
    const admin = createServiceClient();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("llm_models").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/llm-models");
    revalidatePath("/admin");
}
