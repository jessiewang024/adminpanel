"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

export async function createDomain(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const { error } = await admin.from("allowed_signup_domains").insert({
        apex_domain: String(formData.get("apex_domain") || "").trim(),
        created_by_user_id: userId,
        modified_by_user_id: userId,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/allowed-signup-domains");
    revalidatePath("/admin");
}

export async function updateDomain(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("allowed_signup_domains").update({
        apex_domain: String(formData.get("apex_domain") || "").trim(),
        modified_by_user_id: userId,
    }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/allowed-signup-domains");
}

export async function deleteDomain(formData: FormData) {
    const admin = createServiceClient();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("allowed_signup_domains").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/allowed-signup-domains");
    revalidatePath("/admin");
}
