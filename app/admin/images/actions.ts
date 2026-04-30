"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentUserId } from "@/lib/current-user";

function emptyToNull(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
}

export async function createImage(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const imageUrl = String(formData.get("url") || "").trim();

    if (!imageUrl) {
        throw new Error("Please provide an image URL.");
    }

    const payload = {
        url: imageUrl,
        created_by_user_id: userId,
        modified_by_user_id: userId,
        is_common_use: false,
        is_public: false,
        additional_context: null,
        image_description: emptyToNull(formData.get("image_description")),
    };

    const { error } = await admin.from("images").insert(payload);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/images");
    revalidatePath("/admin");
    redirect("/admin/images");
}

export async function updateImage(formData: FormData) {
    const admin = createServiceClient();
    const userId = await getCurrentUserId();

    const id = String(formData.get("id") || "").trim();

    if (!id) {
        throw new Error("Missing image ID.");
    }

    const payload = {
        url: emptyToNull(formData.get("url")),
        image_description: emptyToNull(formData.get("image_description")),
        modified_by_user_id: userId,
    };

    const { error } = await admin.from("images").update(payload).eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/images");
    revalidatePath("/admin");
    redirect("/admin/images");
}

export async function deleteImage(formData: FormData) {
    const admin = createServiceClient();

    const id = String(formData.get("id") || "").trim();

    if (!id) {
        throw new Error("Missing image ID.");
    }

    const { error } = await admin.from("images").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/images");
    revalidatePath("/admin");
    redirect("/admin/images");
}