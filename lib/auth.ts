import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireSuperadmin() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, is_superadmin")
        .eq("id", user.id)
        .single();

    if (error || !profile?.is_superadmin) {
        redirect("/not-authorized");
    }

    return { user, profile };
}