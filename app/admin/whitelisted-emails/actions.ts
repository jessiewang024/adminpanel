"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

export async function createWhitelistedEmail(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const { error } = await admin.from("whitelist_email_addresses").insert({
        email_address: String(formData.get("email_address") || "").trim(),
        created_by_user_id: userId,
        modified_by_user_id: userId,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/admin/whitelisted-emails");
    revalidatePath("/admin");
}

export async function updateWhitelistedEmail(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("whitelist_email_addresses").update({
        email_address: String(formData.get("email_address") || "").trim(),
        modified_by_user_id: userId,
    }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/whitelisted-emails");
}

export async function deleteWhitelistedEmail(formData: FormData) {
    const admin = createServiceClient();
    const id = String(formData.get("id")).trim();

    const { error } = await admin.from("whitelist_email_addresses").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/whitelisted-emails");
    revalidatePath("/admin");
}
