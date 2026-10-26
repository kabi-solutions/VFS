/**
 * Proof containers — empty-honest until Vault supplies real content.
 * TODO (Vault): Populate only with approved, real files / quotes. No fake seed data.
 */

export type RecentFile = {
  id: string;
  market: string;
  product: string;
  shape: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  role?: string;
};

/** Empty until Vault adds real anonymized recent files. Hide UI when empty. */
export const recentFiles: RecentFile[] = [];

/** Empty until Vault adds approved testimonials. Hide UI when empty. */
export const testimonials: Testimonial[] = [];
