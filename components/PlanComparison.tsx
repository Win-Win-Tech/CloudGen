"use client";

import { useState, type ReactNode } from "react";
import {
  COMPARISON_PACKAGE_IDS,
  getPackage,
  PLAN_COMPARISON,
  type ComparisonCell,
  type SolutionPackageId,
} from "@/lib/solutions";

function cellLabel(value: ComparisonCell | undefined) {
  if (value === true) return { text: "✓", className: "text-[var(--teal-deep)] font-bold" };
  if (value === "limited") return { text: "Limited", className: "text-[var(--navy)] text-xs font-semibold" };
  if (value === "quote") return { text: "Quote", className: "text-[var(--orange-deep)] text-xs font-semibold" };
  if (value === "addon") return { text: "Add-on", className: "text-[var(--steel)] text-xs font-semibold" };
  return { text: "—", className: "text-[var(--line)]" };
}

const SHORT_LABELS: Partial<Record<SolutionPackageId, string>> = {
  face: "Attendance",
  "qr-patrol": "Checkpoint",
  visitor: "Visitor",
  vehicle: "Vehicle",
  "workforce-duo": "Workforce Duo",
  "gate-duo": "Gate Duo",
  "site-ops": "Site Ops",
  "vision-ai": "Vision AI",
};

export function PlanComparison() {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PLAN_COMPARISON.map((g, i) => [g.title, i === 0])),
  );

  const columns = COMPARISON_PACKAGE_IDS.map((id) => getPackage(id));

  return (
    <section className="space-y-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Compare packages</p>
        <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
          Plan Comparison
        </h2>
        <p className="mt-3 text-[var(--steel)]">
          See what each Smart Patrol package includes. Expand a section for feature
          detail — Ticket Complaints Tracking ships with every package.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white shadow-[0_10px_30px_rgba(26,31,44,0.04)]">
        <table className="min-w-[920px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[#f8fafc]">
              <th className="sticky left-0 z-10 bg-[#f8fafc] px-4 py-4 text-xs font-bold uppercase tracking-wide text-[var(--steel)]">
                Features
              </th>
              {columns.map((pkg) => (
                <th
                  key={pkg.id}
                  className="px-3 py-4 text-center text-xs font-bold uppercase tracking-wide text-[var(--navy)]"
                >
                  {SHORT_LABELS[pkg.id] ?? pkg.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLAN_COMPARISON.map((group) => {
              const isOpen = open[group.title] ?? false;
              return (
                <FragmentGroup
                  key={group.title}
                  title={group.title}
                  open={isOpen}
                  colSpan={columns.length + 1}
                  onToggle={() =>
                    setOpen((prev) => ({ ...prev, [group.title]: !isOpen }))
                  }
                >
                  {isOpen
                    ? group.rows.map((row) => (
                        <tr
                          key={row.feature}
                          className="border-b border-[var(--line)] last:border-0"
                        >
                          <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-[var(--navy)]">
                            {row.feature}
                          </td>
                          {columns.map((pkg) => {
                            const cell = cellLabel(row.values[pkg.id]);
                            return (
                              <td
                                key={pkg.id}
                                className={`px-3 py-3 text-center ${cell.className}`}
                              >
                                {cell.text}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    : null}
                </FragmentGroup>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FragmentGroup({
  title,
  open,
  colSpan,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  colSpan: number;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <tr className="border-b border-[var(--line)] bg-[var(--mist)]">
        <td colSpan={colSpan} className="px-2 py-2">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-bold text-[var(--ink)] hover:bg-white/70"
            aria-expanded={open}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--line)] bg-white text-xs ${
                open ? "text-[var(--teal-deep)]" : "text-[var(--steel)]"
              }`}
            >
              {open ? "−" : "+"}
            </span>
            {open ? "Collapse" : "Expand"} {title}
          </button>
        </td>
      </tr>
      {children}
    </>
  );
}
