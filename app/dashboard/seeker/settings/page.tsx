import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentUser } from "@/lib/auth-server"

import { PageHeader, PageShell, Panel } from "../../_components/dashboard-ui"

const fieldClass =
  "h-10 rounded-lg border-hl-border-default bg-hl-surface-input text-sm text-hl-text-primary placeholder:text-hl-text-tertiary"

const selectClass =
  "h-10 w-full rounded-lg border border-hl-border-default bg-hl-surface-input px-2.5 text-sm text-hl-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const notificationOptions = [
  {
    id: "job-alerts",
    title: "Job alerts",
    description: "New roles that match your preferences.",
    defaultChecked: true,
  },
  {
    id: "application-updates",
    title: "Application updates",
    description: "Status changes and messages from recruiters.",
    defaultChecked: true,
  },
  {
    id: "product-news",
    title: "Product news",
    description: "New HireLoop features and tips.",
    defaultChecked: false,
  },
]

export default async function SeekerSettingsPage() {
  const user = await getCurrentUser()

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="Manage your profile, job preferences and notifications."
      />

      <div className="rounded-lg border border-hl-border-subtle bg-hl-surface-2 px-4 py-2.5 text-xs text-hl-text-tertiary">
        Preview only — these changes are not saved yet.
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Panel
            title="Personal information"
            description="This is how recruiters will see you."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-hl-text-secondary">
                  Full name
                </Label>
                <Input
                  id="full-name"
                  defaultValue={user?.name ?? ""}
                  placeholder="Jane Doe"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-hl-text-secondary">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email ?? ""}
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-hl-text-secondary">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-hl-text-secondary">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="City, country"
                  className={fieldClass}
                />
              </div>
            </div>
          </Panel>

          <Panel
            title="Job preferences"
            description="We use these to recommend roles to you."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="desired-role"
                  className="text-hl-text-secondary"
                >
                  Desired role
                </Label>
                <Input
                  id="desired-role"
                  placeholder="Frontend developer"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="preferred-location"
                  className="text-hl-text-secondary"
                >
                  Preferred location
                </Label>
                <Input
                  id="preferred-location"
                  placeholder="Remote"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-type" className="text-hl-text-secondary">
                  Work type
                </Label>
                <select id="work-type" className={selectClass}>
                  <option>Any</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-hl-text-secondary">
                  Experience level
                </Label>
                <select id="experience" className={selectClass}>
                  <option>Entry level</option>
                  <option>Mid level</option>
                  <option>Senior level</option>
                  <option>Lead / Manager</option>
                </select>
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
