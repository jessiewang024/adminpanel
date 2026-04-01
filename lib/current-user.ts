import { createClient } from "@/lib/supabase/server";

/** Returns the current logged-in user's ID, or throws if not authenticated. */
export async function getCurrentUserId(): Promise<string> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");
    return user.id;
}
