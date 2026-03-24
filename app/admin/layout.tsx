import Link from "next/link";
// import { requireSuperadmin } from "@/lib/auth";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    // await requireSuperadmin();

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            <nav
                style={{
                    display: "flex",
                    gap: "16px",
                    padding: "20px 40px",
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "white",
                }}
            >
                <Link href="/admin">Dashboard</Link>
                <Link href="/admin/profiles">Profiles</Link>
                <Link href="/admin/images">Images</Link>
                <Link href="/admin/captions">Captions</Link>
            </nav>

            {children}
        </div>
    );
}