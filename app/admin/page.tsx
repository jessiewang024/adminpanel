import { createServiceClient } from "@/lib/supabase/service";

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

export default async function AdminPage() {
    const admin = createServiceClient();

    const [{ data: usersData }, profilesRes, imagesRes, captionsRes] = await Promise.all([
        admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        admin.from("profiles").select("*", { count: "exact", head: true }),
        admin.from("images").select("*", { count: "exact", head: true }),
        admin.from("captions").select("*", { count: "exact", head: true }),
    ]);

    const totalUsers = usersData?.users?.length ?? 0;
    const totalProfiles = profilesRes.count ?? 0;
    const totalImages = imagesRes.count ?? 0;
    const totalCaptions = captionsRes.count ?? 0;

    const stats = [
        { title: "Total Users", value: totalUsers, description: "Auth users" },
        { title: "Total Profiles", value: totalProfiles, description: "Profiles table rows" },
        { title: "Total Images", value: totalImages, description: "Uploaded images" },
        { title: "Total Captions", value: totalCaptions, description: "Saved captions" },
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
                Real statistics from the database.
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px",
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