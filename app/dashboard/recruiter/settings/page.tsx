import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentUser } from "@/lib/auth-server"

import { PageHeader, PageShell, Panel } from "../../_components/dashboard-ui"

const fieldClass =
  "h-10 rounded-lg border-hl-border-default bg-hl-surface-input text-sm text-hl-text-primary placeholder:text-hl-text-tertiary"

const textareaClass =
  "w-full rounded-lg border border-hl-border-default bg-hl-surface-input px-2.5 py-2 text-sm text-hl-text-primary outline-none placeholder:text-hl-text-tertiary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const notificationOptions = [
  {
    id: "new-applications",
    title: "New applications",
    description: "Get notified when a candidate applies.",
    defaultChecked: true,
  },
  {
    id: "candidate-messages",
    title: "Candidate messages",
    description: "Replies and messages from applicants.",
    defaultChecked: true,
  },
  {
    id: "weekly-summary",
    title: "Weekly summary",
    description: "A Monday digest of your hiring activity.",
    defaultChecked: false,
  },
]

export default async function RecruiterSettingsPage() {
  const user = await getCurrentUser()

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="Manage your account, company profile and notifications."
      />

      <div className="rounded-lg border border-hl-border-subtle bg-hl-surface-2 px-4 py-2.5 text-xs text-hl-text-tertiary">
        Preview only — these changes are not saved yet.
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Panel
            title="Company profile"
            description="Shown on every job you publish."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="company-name"
                  className="text-hl-text-secondary"
                >
                  Company name
                </Label>
                <Input
                  id="company-name"
                  placeholder="HireLoop"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-hl-text-secondary">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="company-location"
                  className="text-hl-text-secondary"
                >
                  Headquarters
                </Label>
                <Input
                  id="company-location"
                  placeholder="City, country"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="company-about"
                  className="text-hl-text-secondary"
                >
                  About the company
                </Label>
                <textarea
                  id="company-about"
                  rows={4}
                  placeholder="Tell candidates what your company does and what it is like to work there."
                  className={textareaClass}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Account" description="Your personal recruiter details.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="recruiter-name"
                  className="text-hl-text-secondary"
                >
                  Full name
                </Label>
                <Input
                  id="recruiter-name"
                  defaultValue={user?.name ?? ""}
                  placeholder="Jane Doe"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="recruiter-email"
                  className="text-hl-text-secondary"
                >
                  Email address
                </Label>
                <Input
                  id="recruiter-email"
                  type="email"
                  defaultValue={user?.email ?? ""}
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="recruiter-title"
                  className="text-hl-text-secondary"
                >
                  Job title
                </Label>
                <Input
                  id="recruiter-title"
                  placeholder="Talent acquisition lead"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="recruiter-phone"
                  className="text-hl-text-secondary"
                >
                  Phone
                </Label>
                <Input
                  id="recruiter-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={fieldClass}
                />
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          title="Notifications"
          description="Choose what lands in your inbox."
        >
          <div className="flex flex-col gap-4">
            {notificationOptions.map((option) => (
              <label
                key={option.id}
                htmlFor={option.id}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  id={option.id}
                  type="checkbox"
                  defaultChecked={option.defaultChecked}
                  className="mt-0.5 size-4 shrink-0 rounded border-hl-border-default accent-hl-brand"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-hl-text-primary">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-hl-text-tertiary">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <Button
            type="button"
            className="mt-6 h-9 w-full rounded-lg bg-hl-brand font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
          >
            Save changes
          </Button>
        </Panel>
      </div>
    </PageShell>
  )
}
