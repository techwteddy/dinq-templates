import os

services_dir = "/home/sheamus/Repositories/famous-sheamus-website/content/services"
updates = {
    "ai-chatbot-development.mdx": ('title: "AI Chatbot & Assistant Development"', 'title: "AI Chatbot & Assistant Development For Modern Business"'),
    "ai-consulting.mdx": ('title: "AI Implementation Consulting"', 'title: "Strategic AI Implementation & Fractional CTO Services"'),
    "ai-lead-capture.mdx": ('title: "AI-Powered Lead Capture"', 'title: "AI-Powered Lead Capture & Automated Qualification System"'),
    "crm-integration.mdx": ('title: "CRM Integration & Data Pipelines"', 'title: "Enterprise CRM Integration & Real-Time Data Pipelines"'),
    "n8n-workflow-automation.mdx": ('title: "N8N Workflow Automation"', 'title: "Custom N8N Workflow Automation For Scale & Efficiency"'),
    "process-optimization.mdx": ('title: "Process Analysis & Optimization"', 'title: "Workflow Process Analysis & Cost Optimization Strategy"'),
    "social-media-automation.mdx": ('title: "Social Media Automation"', 'title: "AI Social Media Automation For Consistent Brand Growth"'),
    "system-architecture.mdx": ('title: "System Architecture Design"', 'title: "End-to-End System Architecture Design & Cloud Strategy"'),
    "voice-ai-receptionist.mdx": ('title: "Voice AI Receptionist"', 'title: "24/7 Voice AI Receptionist For Bookings & Qualification"')
}

for fname, (old, new) in updates.items():
    fpath = os.path.join(services_dir, fname)
    if os.path.exists(fpath):
        with open(fpath, "r") as f:
            content = f.read()
        content = content.replace(old, new)
        with open(fpath, "w") as f:
            f.write(content)
