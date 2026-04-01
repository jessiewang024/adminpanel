"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const handleGoogleLogin = async () => {
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
            },
        });

        if (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>Admin Login</h1>
            <p style={{ marginBottom: "20px" }}>
                Please sign in with Google to continue.
            </p>

            <button
                onClick={handleGoogleLogin}
                style={{
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#111",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Continue with Google
            </button>
        </main>
    );
}