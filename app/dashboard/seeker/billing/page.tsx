import { Check, CreditCard, ReceiptText, Sparkles } from "lucide-react"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
} from "../../_components/dashboard-ui"

const freePlanFeatures = [
  "Apply to up to 10 jobs per month",
  "Save up to 25 jobs",
  "Standard application tracking",
  "Email job alerts",
]

export default function SeekerBillingPage() {
  return (
    <PageShell>
      <PageHeader
        title="Billing"
        description="Manage your plan, payment method and invoices."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          title="Current plan"
          description="You are on the free plan"
          action={
            <span className="rounded-full bg-hl-brand/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-hl-brand uppercase">
              Active
            </span>
          }
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-2xl font-bold text-hl-text-primary">
                Free
              </p>
              <p className="mt-1 text-sm text-hl-text-secondary">
                Everything you need to start your search.
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-hl-text-primary">
              $0
              <span className="text-sm font-medium text-hl-text-tertiary">
                /month
              </span>
            </p>
          </div>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {freePlanFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-hl-text-secondary"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-hl-brand" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-hl-surface-2 px-3 py-2.5 text-xs text-hl-text-tertiary">
            <Sparkles className="size-3.5 shrink-0" />
            Paid plans are coming soon. You will be able to upgrade here.
          </div>
        </Panel>

        <Panel
          className="lg:col-span-2"
          title="Payment method"
          description="Used for paid plans"
        >
          <EmptyState
            icon={CreditCard}
            title="No payment method"
            description="Add a card when you upgrade to a paid plan."
            className="border-0 px-0 py-2"
          />
        </Panel>
      </div>

      <Panel
        title="Invoices"
        description="Your billing history"
        contentClassName="p-4 sm:p-5"
      >
        <EmptyState
          icon={ReceiptText}
          title="No invoices yet"
          description="Invoices will appear here after your first payment."
          className="border-0 px-0 py-6"
        />
      </Panel>
    </PageShell>
  )
}
