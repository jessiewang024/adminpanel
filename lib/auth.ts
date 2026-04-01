import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * requireAdmin() — used by the admin layout to protect all /admin routes.
 *
 * Checks:
 *   1. Is the user logged in? If not, redirect to /login.
 *   2. Is the user a superadmin? If not, redirect to /not-authorized.
 */
export async function requireAdmin() {
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
