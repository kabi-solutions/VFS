export type StateMarket = {
  slug: string;
  name: string;
  abbr: string;
  blurb: string;
};

/** Starter markets for dynamic state landings — licensing may not exist in all */
export const starterStates: StateMarket[] = [
  {
    slug: "california",
    name: "California",
    abbr: "CA",
    blurb: "Investor acquisition and rehab activity across major metros.",
  },
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    blurb: "High-velocity markets for bridge and fix-and-flip capital.",
  },
  {
    slug: "florida",
    name: "Florida",
    abbr: "FL",
    blurb: "Coastal and inland rental and transitional inventory.",
  },
  {
    slug: "arizona",
    name: "Arizona",
    abbr: "AZ",
    blurb: "Growth corridors with strong investor purchase volume.",
  },
  {
    slug: "nevada",
    name: "Nevada",
    abbr: "NV",
    blurb: "Southern Nevada focus including community impact initiatives.",
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbr: "GA",
    blurb: "Atlanta-area and statewide investor credit demand.",
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbr: "NC",
    blurb: "Research Triangle and growing secondary markets.",
  },
  {
    slug: "colorado",
    name: "Colorado",
    abbr: "CO",
    blurb: "Front Range acquisition and renovation activity.",
  },
  {
    slug: "washington",
    name: "Washington",
    abbr: "WA",
    blurb: "Pacific Northwest investor and rental pipelines.",
  },
  {
    slug: "tennessee",
    name: "Tennessee",
    abbr: "TN",
    blurb: "Nashville and statewide transitional financing demand.",
  },
];

export function getStateBySlug(slug: string): StateMarket | undefined {
  return starterStates.find((s) => s.slug === slug);
}
