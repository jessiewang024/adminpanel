import Link from "next/link";

export default function HomePage() {
    return (
        <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>Week 6 Admin Area</h1>
            <p style={{ fontSize: "18px", marginBottom: "24px" }}>
                This app is the admin area for the database.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
                <Link
                    href="/admin"
                    style={{
                        padding: "12px 20px",
                        backgroundColor: "#111",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                    }}
                >
                    Open Admin Area
                </Link>
            </div>
        </main>
    );
}