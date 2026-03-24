type StatCardProps = {
    title: string;
    value: string | number;
    description: string;
};

function StatCard({ title, value, description }: StatCardProps) {
    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
        >
            <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>{title}</h2>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
                {value}
            </div>
            <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>{description}</p>
        </div>
    );
}

export default function AdminPage() {
    const stats = [
        { title: "Total Users", value: 0, description: "Users in the system" },
        { title: "Total Profiles", value: 0, description: "Profiles table rows" },
        { title: "Total Images", value: 0, description: "Uploaded images" },
        { title: "Total Captions", value: 0, description: "Saved captions" },
    ];

    return (
        <main
            style={{
                padding: "40px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f7f7f7",
                minHeight: "100vh",
            }}
        >
            <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>Admin Dashboard</h1>
            <p style={{ fontSize: "18px", color: "#555", marginBottom: "32px" }}>
                This page will later show real statistics from Supabase.
            </p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <a href="/admin/profiles">Profiles</a>
                <a href="/admin/images">Images</a>
                <a href="/admin/captions">Captions</a>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                }}
            >
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                    />
                ))}
            </div>
        </main>
    );
}