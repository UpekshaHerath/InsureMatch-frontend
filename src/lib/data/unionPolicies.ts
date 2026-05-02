export interface PolicyRider {
  id: string;
  name: string;
  category: string;
  summary: string;
  builtIn?: boolean;
}

export interface UnionPolicy {
  slug: string;
  name: string;
  shortName?: string;
  type: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  riders: PolicyRider[];
}

const RIDERS: Record<string, Omit<PolicyRider, "builtIn">> = {
  UH360: {
    id: "UH360",
    name: "Union Health 360",
    category: "Hospitalisation",
    summary:
      "Comprehensive multi-generational health rider with cashless hospitalisation, day care, overseas treatment, and inbuilt critical illness cover.",
  },
  USHP: {
    id: "USHP",
    name: "Union Smart Health Premier",
    category: "Hospitalisation",
    summary:
      "Hospital reimbursement for the life assured, spouse, children below 23, and parents — a more accessible alternative to Health 360.",
  },
  HCB: {
    id: "HCB",
    name: "Hospital Cash Benefit",
    category: "Hospital Cash",
    summary:
      "Daily cash payout per day of hospitalisation, paid on top of any other reimbursements to cover incidental costs and lost income.",
  },
  HCCB: {
    id: "HCCB",
    name: "Hospital Cash Child Benefit",
    category: "Child Hospital Cash",
    summary:
      "Daily cash benefit during a child's hospital stay, helping cover extra expenses for the family.",
  },
  CSB: {
    id: "CSB",
    name: "Comprehensive Surgery Benefit",
    category: "Surgery",
    summary:
      "Lump sum paid immediately after a surgery — accident or illness related — regardless of other claims.",
  },
  SMB: {
    id: "SMB",
    name: "Suwamaga Critical Illness Benefit",
    category: "Critical Illness",
    summary:
      "Lump sum on diagnosis of a covered critical illness; payout is unrestricted (treatment, recovery, or income replacement).",
  },
  CHB: {
    id: "CHB",
    name: "Child Health Benefit",
    category: "Child Health",
    summary:
      "Daily cash benefit plus coverage for 244 specified surgeries undergone by children of the life assured.",
  },
  TPA: {
    id: "TPA",
    name: "TPD due to Accident Only",
    category: "Disability",
    summary:
      "Rider sum assured paid in 5 equal annual instalments on total permanent disability caused by an accident.",
  },
  TPS: {
    id: "TPS",
    name: "TPD due to Accident or Sickness",
    category: "Disability",
    summary:
      "Broader disability cover — rider sum assured paid in 5 instalments on total permanent disability from accident or sickness.",
  },
  EPD: {
    id: "EPD",
    name: "Extended Partial Disability",
    category: "Disability",
    summary:
      "Percentage payout for partial permanent disabilities (loss of limb, eye, hearing) caused by an accident.",
  },
  WP: {
    id: "WP",
    name: "Waiver of Premium (TPD)",
    category: "Premium Waiver",
    summary:
      "Waives all future premiums on total permanent disability while the policy fund continues to grow.",
  },
  WPD: {
    id: "WPD",
    name: "Waiver of Premium on Death",
    category: "Premium Waiver",
    summary:
      "On death of the life assured, future premiums are waived so the fund continues toward the planned maturity for dependents.",
  },
  DI: {
    id: "DI",
    name: "Disability Income",
    category: "Income Protection",
    summary:
      "Monthly income payout while the life assured is unable to work due to disability — ongoing income replacement.",
  },
  LTB: {
    id: "LTB",
    name: "Level Term Benefit",
    category: "Additional Death Cover",
    summary:
      "Multiplies the death cover (up to 20× on FlexLife, 10× on Life+) for a small extra premium.",
  },
  ADB: {
    id: "ADB",
    name: "Accidental Death Benefit",
    category: "Additional Death Cover",
    summary:
      "Additional lump sum on top of the basic death cover in the event of accidental demise.",
  },
  SPB: {
    id: "SPB",
    name: "Spouse Protection Benefit",
    category: "Spouse / Family",
    summary:
      "Lump sum paid on the demise of the spouse during the policy term, covering the spouse without a separate policy.",
  },
  FEB: {
    id: "FEB",
    name: "Funeral Expense Benefit",
    category: "Funeral",
    summary:
      "Fast-disbursed lump sum to cover funeral and final expenses, easing immediate financial burden on the family.",
  },
  FIB: {
    id: "FIB",
    name: "Family Income Benefit",
    category: "Income Replacement",
    summary:
      "Recurring quarterly lump sum payments to the family until the policy expires, replacing lost ongoing income.",
  },
  OPD: {
    id: "OPD",
    name: "Outpatient (OPD)",
    category: "Outpatient Health",
    summary:
      "Covers outpatient consultations, diagnostics, lab work, imaging, and routine prescriptions.",
  },
  CHRMED: {
    id: "CHRMED",
    name: "Chronic Medication",
    category: "Chronic Care",
    summary:
      "Reimbursement for long-term medication (diabetes, hypertension, cardiovascular conditions).",
  },
  MAT: {
    id: "MAT",
    name: "Maternity Benefit",
    category: "Maternity",
    summary:
      "Covers normal vaginal delivery (NVD) and lower-segment caesarean (LSCS), plus newborn-related expenses.",
  },
  OT: {
    id: "OT",
    name: "Organ Transplant",
    category: "Specialist Medical",
    summary:
      "Coverage for transplant surgery and related hospital expenses, including donor expenses under Health 360.",
  },
  OVT: {
    id: "OVT",
    name: "Overseas Treatment",
    category: "International Medical",
    summary:
      "Extends coverage to India, Singapore, Thailand, Malaysia, or worldwide (excluding USA & Canada).",
  },
};

const rider = (id: keyof typeof RIDERS, builtIn = false): PolicyRider => ({
  ...RIDERS[id],
  builtIn,
});

export const UNION_POLICIES: UnionPolicy[] = [
  {
    slug: "flexlife",
    name: "Union Assurance FlexLife",
    shortName: "FlexLife",
    type: "Whole Life",
    shortDescription:
      "Flexible universal life plan built around five pillars: Retirement, Protection, Investment, Education, and Health — configurable to the customer's stage in life.",
    longDescription:
      "FlexLife combines investment growth with comprehensive protection inside a single configurable policy. It uses a limited-pay structure (5/7/10 years) where premiums stop early while protection and fund growth continue for up to 40 years. Customers can prioritise retirement, child education, wealth building, or health protection by tuning the policy term, premium-paying term, and rider mix. A dedicated investment account compounds via guaranteed-minimum and actual-rate dividends, with a loyalty bonus at maturity if all premiums are paid.",
    highlights: [
      "Five pillars: Retirement, Protection, Investment, Education, Health",
      "Limited-pay (5/7/10 yr) with cover up to 40 yr; cover ceasing age 70",
      "Top-ups, partial withdrawals after 10 yr, lump-sum or annuity at maturity",
      "Built-in Waiver of Premium (Death + TPD); widest rider library",
    ],
    riders: [
      rider("UH360"),
      rider("USHP"),
      rider("HCB"),
      rider("HCCB"),
      rider("CSB"),
      rider("SMB"),
      rider("CHB"),
      rider("TPA"),
      rider("TPS"),
      rider("EPD"),
      rider("WP", true),
      rider("WPD", true),
      rider("DI"),
      rider("LTB"),
      rider("ADB"),
      rider("SPB"),
      rider("FEB"),
      rider("FIB"),
    ],
  },
  {
    slug: "life-plus",
    name: "Union Life Plus (Life+)",
    shortName: "Life+",
    type: "Whole Life",
    shortDescription:
      "Protection-focused universal life plan that pays the higher of the basic sum assured or the investment account balance, plus a 10% loyalty bonus at maturity.",
    longDescription:
      "Life+ is the most customisable rider-driven life plan in the Union Assurance range, designed for customers who want strong family protection plus disciplined fund growth. Premiums are regular-pay across the chosen 10–30 year term and split between the cost of life cover, attached riders, and the investment account. Beneficiaries always receive the higher of the basic sum assured or the accumulated fund balance — a protection floor irrespective of fund performance. Premium discipline is rewarded with an explicit 10% loyalty bonus at maturity.",
    highlights: [
      "Higher-of: basic sum assured OR investment account balance on demise",
      "10% loyalty bonus at maturity if all premiums paid",
      "Suitable across Low / Mid / High income bands",
      "Level Term Benefit up to 10× basic sum assured",
    ],
    riders: [
      rider("UH360"),
      rider("USHP"),
      rider("HCB"),
      rider("CSB"),
      rider("SMB"),
      rider("CHB"),
      rider("TPA"),
      rider("TPS"),
      rider("EPD"),
      rider("WP"),
      rider("DI"),
      rider("LTB"),
      rider("ADB"),
      rider("SPB"),
      rider("FEB"),
      rider("FIB"),
    ],
  },
  {
    slug: "health-360",
    name: "Union Health 360",
    shortName: "Health 360",
    type: "Health",
    shortDescription:
      "Sri Lanka's most comprehensive health insurance — three generations, cashless hospitalisation, worldwide options, with annual cover from LKR 300K to LKR 60M.",
    longDescription:
      "Health 360 is offered both as a standalone health product and as a rider attachable to Union Assurance life plans. It covers the policyholder, spouse, children below 23, and parents — a multi-generational structure uncommon in Sri Lanka. 16 plan tiers scale from LKR 300,000 to LKR 60,000,000 annual cover. Geographic options range from Sri Lanka only to worldwide (excluding USA & Canada). Claim-free years earn a 25% no-claim bonus that can double the limit in four years.",
    highlights: [
      "Cashless hospitalisation at point of discharge",
      "Three generations: policyholder, spouse, children, parents",
      "16 plan tiers (LKR 300K – LKR 60M annual cover)",
      "Worldwide coverage option (excl. USA & Canada); inbuilt critical illness",
    ],
    riders: [rider("OPD"), rider("CHRMED"), rider("MAT"), rider("OT"), rider("OVT")],
  },
  {
    slug: "pension-advantage",
    name: "Union Pension Advantage",
    shortName: "Pension Advantage",
    type: "Whole Life",
    shortDescription:
      "Retirement-focused life plan that builds a dedicated pension fund and pays it out as lump sum or monthly pension over 10/15/20 years.",
    longDescription:
      "Pension Advantage is purpose-built for retirement income — not one of several pillars but the entire product. The plan accumulates a dedicated retirement account through regular monthly premiums and Union Assurance dividend declarations. At the chosen retirement age (55, 60, or 65) the customer takes the fund as a lump sum or as monthly pension over 10, 15, or 20 years. Both Premium Waiver covers (Death and TPD) are built-in, ensuring the fund still reaches maturity if the customer cannot continue contributing.",
    highlights: [
      "Choice of retirement age: 55, 60, or 65",
      "Pension payout: lump sum or 10/15/20-year monthly pension",
      "Both Premium Waiver covers built-in (Death + TPD)",
      "Entry age 25–55 to ensure meaningful accumulation runway",
    ],
    riders: [
      rider("UH360"),
      rider("USHP"),
      rider("SMB"),
      rider("TPA"),
      rider("TPS"),
      rider("WP", true),
      rider("WPD", true),
      rider("LTB"),
      rider("SPB"),
      rider("FEB"),
    ],
  },
  {
    slug: "sisumaga-plus",
    name: "Union Sisumaga Plus (Sisumaga+)",
    shortName: "Sisumaga+",
    type: "Endowment",
    shortDescription:
      "Education-protection plan for children — builds an Education Fund with a 15% loyalty bonus and protects the educational outcome if the parent passes away.",
    longDescription:
      "Sisumaga+ is Sri Lanka's pioneering education protection plan. It blends a long-term Education Fund with three layers of continuity if the parent passes away: a lump-sum life cover (5× annual premium), an ongoing monthly Education Assistance Fee paid until maturity, and a built-in Premium Waiver so the fund still reaches its target. A 15% loyalty bonus at maturity rewards completed premium discipline — meaningfully more generous than Life+'s 10%.",
    highlights: [
      "Built-in Premium Waiver on Death keeps the fund on track",
      "Monthly Education Assistance Fee until maturity",
      "15% loyalty bonus at maturity",
      "Entry age up to 45; aligned with parents of school-age children",
    ],
    riders: [
      rider("UH360"),
      rider("USHP"),
      rider("HCB"),
      rider("HCCB"),
      rider("CSB"),
      rider("SMB"),
      rider("CHB"),
      rider("WP"),
      rider("WPD", true),
      rider("LTB"),
      rider("ADB"),
      rider("SPB"),
      rider("FEB"),
      rider("FIB"),
    ],
  },
  {
    slug: "advantage-starter",
    name: "Union Advantage Starter",
    shortName: "Advantage Starter",
    type: "Endowment",
    shortDescription:
      "Entry-level protection plan with affordable monthly premiums, a continuously growing investment account, and a focused rider menu.",
    longDescription:
      "Advantage Starter is positioned at the accessible end of the Union Assurance range — designed for first-time insurance buyers and budget-conscious customers. Monthly premiums fund three components: basic life cover, optional riders, and the investment account that produces a maturity payout. Cover ceasing age of 75 is meaningfully higher than FlexLife's 70, giving deeper protection into retirement years. Customers can start affordably and add riders incrementally as income grows.",
    highlights: [
      "Cover ceasing age 75 (5 yr higher than FlexLife)",
      "Monthly premium discipline; 10–30 yr policy term",
      "Investment account compounds toward maturity payout",
      "Focused rider menu — life cover, critical illness, hospitalisation",
    ],
    riders: [rider("UH360"), rider("USHP"), rider("HCB"), rider("CSB"), rider("SMB"), rider("TPS")],
  },
  {
    slug: "single-premium-advantage",
    name: "Union Single Premium Advantage",
    shortName: "Single Premium Advantage",
    type: "Whole Life",
    shortDescription:
      "Single-payment universal life plan — one lump sum upfront, dividend-driven growth, and a guaranteed 105% death cover throughout the policy term.",
    longDescription:
      "Single Premium Advantage is for customers with a lump sum to deploy — a maturity payout from another policy, an inheritance, a bonus, or accumulated savings. One premium at inception funds a dedicated investment account that compounds via Union Assurance's annual dividend declarations. A guaranteed death cover of 105% of the single premium is bundled automatically: beneficiaries receive at least 5% more than the original investment, on top of any account growth. No recurring premiums, no top-ups, no rider attachments — simplicity is the design.",
    highlights: [
      "One-time premium payment at policy inception",
      "Guaranteed 105% death cover throughout the term",
      "Policy term flexible from 5 to 30 years",
      "No recurring payments, no lapsation risk",
    ],
    riders: [],
  },
];

export function getPolicyBySlug(slug: string): UnionPolicy | undefined {
  return UNION_POLICIES.find((p) => p.slug === slug);
}
