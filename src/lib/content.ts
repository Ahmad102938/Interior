/**
 * Content verification model.
 *
 * - verified:    approved by ADIDEV management — always published.
 * - provisional: descriptive copy taken from the client presentation
 *                (positioning, service descriptions, processes) — published,
 *                but still listed in docs/CONTENT_VERIFICATION.md for sign-off.
 * - pending:     a business fact that must not go live until confirmed
 *                (dates, metrics, clients, certifications, contacts…).
 *
 * Pending content is rendered only when SHOW_UNVERIFIED is true, which is the
 * default in development so layouts can be reviewed with realistic content,
 * and always false in a production build unless explicitly overridden.
 */
export type Status = "verified" | "provisional" | "pending";

export type Fact<T> = {
  value: T;
  status: Status;
  /** Internal note for reviewers. Never rendered publicly. */
  note?: string;
};

export const SHOW_UNVERIFIED =
  process.env.NEXT_PUBLIC_SHOW_UNVERIFIED === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SHOW_UNVERIFIED !== "false");

export function isPublishable(status: Status) {
  return status !== "pending" || SHOW_UNVERIFIED;
}

export function publishable<T extends { status: Status }>(items: readonly T[]): T[] {
  return items.filter((item) => isPublishable(item.status));
}

/** Returns the fact's value when it may be shown, otherwise undefined. */
export function factValue<T>(fact: Fact<T>): T | undefined {
  return isPublishable(fact.status) ? fact.value : undefined;
}
