"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

export async function updateHumorMix(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();
    const id = Number(formData.get("id"));

    const { error } = await admin.from("humor_flavor_mix").update({
        caption_count: Number(formData.get("caption_count")),
        modified_by_user_id: userId,
    }).eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/humor-mix");
}
