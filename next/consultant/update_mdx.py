import os

blog_dir = "/home/sheamus/Repositories/famous-sheamus-website/content/blog"
updates = {
    "ai-procurement-strategy-profit-gauntlet-2026.mdx": ('title: "Is Your Procurement Strategy Ready for the 2026 Profit Gauntlet?"', 'title: "Is Your Procurement Strategy Ready for the 2026 Shift?"'),
    "ai-roi-blueprint-no-new-software.mdx": ('title: "Are Your AI Initiatives Just Burning Budget? The Blueprint for Real ROI."', 'title: "Are Your AI Initiatives Burning Budget? The ROI Blueprint"'),
    "automated-ai-support-channels.mdx": ('title: "How can AI automate your customer service without replacing your telephony system?"', 'title: "How AI Automates Customer Service Without Telephony Shifts"'),
    "generate-high-conversion-marketing-campaigns.mdx": ('title: "How can AI generate high-conversion marketing campaigns without adding MarTech bloat?"', 'title: "How AI Generates High-Conversion Campaigns Without Bloat"'),
    "How-can-AI-execute-deep-market-research.mdx": ('title: "How can AI execute deep market research without expanding your analyst headcount?"', 'title: "How AI Executes Deep Market Research Without Added Analysts"'),
    "how-can-ai-replace-brainstorming.mdx": ('title: "How can AI replace expensive brainstorming workshops without adding SaaS bloat?"', 'title: "How AI Replaces Brainstorming Workshops Without SaaS Bloat"'),
    "how-to-unify-enterprise-data.mdx": ('title: "How to unify enterprise data with AI agents without adding SaaS bloat?"', 'title: "How to Unify Enterprise Data With AI Without Extra Systems"'),
    "os-strategy-for-ai-automation-roi.mdx": ('title: "Which Operating System Best Fuels Your AI & Automation ROI Without Building New Software?"', 'title: "Which OS Best Fuels Your AI and Automation ROI Strategy?"'),
    "what-is-a-fractional-cto.mdx": ('title: "What is a Fractional CTO?"', 'title: "What is a Fractional CTO? The Complete Guide for Startups"')
}

for fname, (old, new) in updates.items():
    fpath = os.path.join(blog_dir, fname)
    with open(fpath, "r") as f:
        content = f.read()
    content = content.replace(old, new)
    with open(fpath, "w") as f:
        f.write(content)
