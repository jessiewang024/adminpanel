import Link from "next/link";

export default function NotAuthorizedPage() {
    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "40px",
            fontFamily: "Arial, sans-serif",
        }}>
            <h1 style={{ fontSize: "36px", marginBottom: "12px", color: "var(--danger, #ef4444)" }}>
                Access Denied
            </h1>
            <p style={{ fontSize: "16px", color: "var(--muted)", marginBottom: "32px", textAlign: "center" }}>
                Your account does not have admin privileges.<br />
                You need <code>is_superadmin</code> or <code>is_matrix_admin</code> set to TRUE.
            </p>
            <Link
                href="/login"
                style={{
                    padding: "12px 24px",
                    backgroundColor: "var(--accent, #3b82f6)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                }}
            >
                Try Another Account
            </Link>
        </main>
    );
}
