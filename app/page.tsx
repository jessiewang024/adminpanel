import Link from "next/link";

export default function HomePage() {
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
            <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>Admin Panel</h1>
            <p style={{ fontSize: "16px", color: "var(--muted)", marginBottom: "32px" }}>
                Database administration for the staging environment.
            </p>

            <Link
                href="/admin"
                style={{
                    padding: "12px 24px",
                    backgroundColor: "var(--accent, #3b82f6)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                }}
            >
                Open Admin Area
            </Link>
        </main>
    );
}
