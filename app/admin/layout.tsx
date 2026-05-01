import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

const navGroups = [
    {
        label: "Overview",
        links: [
            { href: "/admin", text: "Dashboard" },
            { href: "/admin/statistics", text: "Statistics" },
        ],
    },
    {
        label: "Users",
        links: [
            { href: "/admin/profiles", text: "Profiles" },
            { href: "/admin/allowed-signup-domains", text: "Signup Domains" },
            { href: "/admin/whitelisted-emails", text: "Whitelisted Emails" },
        ],
    },
    {
        label: "Content",
        links: [
            { href: "/admin/images", text: "Images" },
            { href: "/admin/captions", text: "Captions" },
            { href: "/admin/caption-requests", text: "Caption Requests" },
            { href: "/admin/caption-examples", text: "Caption Examples" },
            { href: "/admin/terms", text: "Terms" },
        ],
    },
    {
        label: "Humor",
        links: [
            { href: "/admin/humor-flavors", text: "Humor Flavors" },
            { href: "/admin/humor-flavor-steps", text: "Flavor Steps" },
            { href: "/admin/humor-mix", text: "Humor Mix" },
        ],
    },
    {
        label: "LLM",
        links: [
            { href: "/admin/llm-models", text: "LLM Models" },
            { href: "/admin/llm-providers", text: "LLM Providers" },
            { href: "/admin/llm-prompt-chains", text: "Prompt Chains" },
            { href: "/admin/llm-responses", text: "LLM Responses" },
        ],
    },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <div className="admin-layout">
            <nav className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <div className="sidebar-nav">
                    {navGroups.map((group) => (
                        <div key={group.label} className="nav-group">
                            <div className="nav-group-label">{group.label}</div>
                            {group.links.map((link) => (
                                <Link key={link.href} href={link.href} className="nav-link">
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="sidebar-footer">
                    <LogoutButton />
                </div>
            </nav>
            <main className="admin-main">{children}</main>
        </div>
    );
}
