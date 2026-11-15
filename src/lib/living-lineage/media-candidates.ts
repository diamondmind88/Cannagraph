export type MediaCandidate = {
  id: string;
  cultivarLabel: string;
  sourcePage: string;
  sourceName: string;
  reportedLine: string;
  view: string;
  training: string;
  rights: "unverified" | "permission-granted" | "licensed";
  identity: "unverified" | "grower-reported" | "documented";
  review: "candidate" | "shortlisted" | "rejected";
  notes: string;
};

export const sourDieselMediaCandidates: MediaCandidate[] = [
  {
    id: "gd-sour-diesel-explore",
    cultivarLabel: "Sour Diesel",
    sourcePage: "https://growdiaries.com/explore/sour-diesel",
    sourceName: "GrowDiaries cultivar explorer",
    reportedLine: "Multiple reported seed lines and cuts",
    view: "Mixed plant views; select individual diary",
    training: "Varies by diary",
    rights: "unverified",
    identity: "unverified",
    review: "candidate",
    notes: "Discovery index only. Do not treat its images as a single phenotype or download them automatically."
  },
  {
    id: "gd-zamnesia-diary",
    cultivarLabel: "Sour Diesel",
    sourcePage: "https://growdiaries.com/diaries/295826-grow-journal-by-dogdoctorofficial",
    sourceName: "GrowDiaries grow journal",
    reportedLine: "Zamnesia Sour Diesel (grower reported)",
    view: "Multiple weeks; inspect full-plant framing",
    training: "Requires verification",
    rights: "unverified",
    identity: "grower-reported",
    review: "candidate",
    notes: "Separate this commercial seed line from clone-only East Coast Sour Diesel."
  },
  {
    id: "gd-ilgm-diary",
    cultivarLabel: "Sour Diesel",
    sourcePage: "https://growdiaries.com/diaries/189519-ilgm-sour-diesel-grow-journal-by-itsgrowingonme",
    sourceName: "GrowDiaries grow journal",
    reportedLine: "ILGM Sour Diesel (grower reported)",
    view: "Longitudinal diary; inspect images",
    training: "Topping / low-stress training reported",
    rights: "unverified",
    identity: "grower-reported",
    review: "candidate",
    notes: "Training changes natural plant architecture. Model only the documented plant."
  },
  {
    id: "icmag-ecsd",
    cultivarLabel: "East Coast Sour Diesel",
    sourcePage: "https://www.icmag.com/threads/ecsd-monstah.99766/",
    sourceName: "ICMag historical thread",
    reportedLine: "ECSD (thread claim; unverified)",
    view: "Inspect for full plant rather than cola closeups",
    training: "Unknown",
    rights: "unverified",
    identity: "unverified",
    review: "candidate",
    notes: "Historical research lead, not confirmation of cut identity."
  },
  {
    id: "leafly-sour-diesel",
    cultivarLabel: "Sour Diesel",
    sourcePage: "https://www.leafly.com/strains/sour-diesel/photos",
    sourceName: "Leafly photo collection",
    reportedLine: "Unspecified Sour Diesel submissions",
    view: "Mixed images; often flower closeups",
    training: "Unknown",
    rights: "unverified",
    identity: "unverified",
    review: "candidate",
    notes: "Use as leads only; verify each individual contributor and rights."
  }
];
