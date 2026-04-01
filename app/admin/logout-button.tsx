"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/**
 * LogoutButton — signs the user out and redirects to the login page.
 * Uses the Supabase client-side SDK to clear the auth session.
 */
export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <button onClick={handleLogout} className="logout-btn">
            Sign Out
        </button>
    );
}
