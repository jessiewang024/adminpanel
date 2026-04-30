import { createServiceClient } from "@/lib/supabase/service";

/**
 * StatCard component — displays a single metric on the dashboard.
 * Each card shows a title, a big number, and a short description.
 */
type StatCardProps = {
    title: string;
    value: string | number;
    description: string;
};

function StatCard({ title, value, description }: StatCardProps) {
    return (
        <div
            style={{
                border: "1px solid var(--card-border)",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "var(--card-bg)",
            }}
        >
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>
                {title}
            </p>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }}>
                {value}
            </div>
            <p style={{ color: "var(--muted)", fontSize: "12px", margin: 0 }}>
                {description}
            </p>
        </div>
    );
}

/**
 * Counts every Supabase auth user by paging through all users.
 * This avoids the old 1000-user limit from listUsers({ page: 1, perPage: 1000 }).
 */
async function countAllAuthUsers() {
    const admin = createServiceClient();

    const perPage = 1000;
    let page = 1;
    let total = 0;

    while (true) {
        const { data, error } = await admin.auth.admin.listUsers({
            page,
            perPage,
        });

        if (error) {
            throw new Error(error.message);
        }

        const countThisPage = data.users.length;
        total += countThisPage;

        if (countThisPage < perPage) {
            break;
        }

        page += 1;
    }

    return total;
}

/**
 * Admin Dashboard page.
 * Fetches counts from every table in the database and displays them
 * as stat cards so the admin can see an overview at a glance.
 */
export default async function AdminPage() {
    const admin = createServiceClient();

    // Fetch row counts from all tables in parallel for performance
    const [
        authUsersCount,
        profilesRes,
        imagesRes,
        captionsRes,
        captionRequestsRes,
        termsRes,
        humorFlavorsRes,
        humorFlavorStepsRes,
        llmModelsRes,
        llmProvidersRes,
        llmPromptChainsRes,
        llmResponsesRes,
        captionExamplesRes,
        allowedDomainsRes,
        whitelistedEmailsRes,
    ] = await Promise.all([
        countAllAuthUsers(),
        admin.from("profiles").select("*", { count: "exact", head: true }),
        admin.from("images").select("*", { count: "exact", head: true }),
        admin.from("captions").select("*", { count: "exact", head: true }),
        admin.from("caption_requests").select("*", { count: "exact", head: true }),
        admin.from("terms").select("*", { count: "exact", head: true }),
        admin.from("humor_flavors").select("*", { count: "exact", head: true }),
        admin.from("humor_flavor_steps").select("*", { count: "exact", head: true }),
        admin.from("llm_models").select("*", { count: "exact", head: true }),
        admin.from("llm_providers").select("*", { count: "exact", head: true }),
        admin.from("llm_prompt_chains").select("*", { count: "exact", head: true }),
        admin.from("llm_model_responses").select("*", { count: "exact", head: true }),
        admin.from("caption_examples").select("*", { count: "exact", head: true }),
        admin.from("allowed_signup_domains").select("*", { count: "exact", head: true }),
        admin.from("whitelist_email_addresses").select("*", { count: "exact", head: true }),
    ]);

    // Build the stats array for rendering
    const stats = [
        { title: "Auth Users", value: authUsersCount, description: "Total auth accounts" },
        { title: "Profiles", value: profilesRes.count ?? 0, description: "User profiles" },
        { title: "Images", value: imagesRes.count ?? 0, description: "Uploaded images" },
        { title: "Captions", value: captionsRes.count ?? 0, description: "Generated captions" },
        { title: "Caption Requests", value: captionRequestsRes.count ?? 0, description: "Generation requests" },
        { title: "Caption Examples", value: captionExamplesRes.count ?? 0, description: "Example captions" },
        { title: "Terms", value: termsRes.count ?? 0, description: "Terms entries" },
        { title: "Humor Flavors", value: humorFlavorsRes.count ?? 0, description: "Flavor configs" },
        { title: "Flavor Steps", value: humorFlavorStepsRes.count ?? 0, description: "Prompt chain steps" },
        { title: "LLM Models", value: llmModelsRes.count ?? 0, description: "Configured models" },
        { title: "LLM Providers", value: llmProvidersRes.count ?? 0, description: "Model providers" },
        { title: "Prompt Chains", value: llmPromptChainsRes.count ?? 0, description: "LLM prompt chains" },
        { title: "LLM Responses", value: llmResponsesRes.count ?? 0, description: "Stored responses" },
        { title: "Signup Domains", value: allowedDomainsRes.count ?? 0, description: "Allowed domains" },
        { title: "Whitelisted Emails", value: whitelistedEmailsRes.count ?? 0, description: "Whitelisted addresses" },
    ];

    return (
        <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Admin Dashboard</h1>
            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
                Overview of all database tables.
            </p>

            {/* Stat cards in a responsive grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
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
        </div>
    );
}