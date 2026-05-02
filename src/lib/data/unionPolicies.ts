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
  inbuiltRiders: PolicyRider[];
  additionalRiders: PolicyRider[];
  /** All riders flat (kept for back-compat with any consumer that still reads `riders`). */
  riders: PolicyRider[];
}

function pack(
  inbuilt: PolicyRider[],
  additional: PolicyRider[]
): Pick<UnionPolicy, "inbuiltRiders" | "additionalRiders" | "riders"> {
  return {
    inbuiltRiders: inbuilt.map((r) => ({ ...r, builtIn: true })),
    additionalRiders: additional.map((r) => ({ ...r, builtIn: false })),
    riders: [
      ...inbuilt.map((r) => ({ ...r, builtIn: true })),
      ...additional.map((r) => ({ ...r, builtIn: false })),
    ],
  };
}

export const UNION_POLICIES: UnionPolicy[] = [
  {
    slug: "advantage-starter",
    name: "Union Advantage Starter",
    shortName: "Advantage Starter",
    type: "Endowment",
    shortDescription:
      "Entry-level protection plan with affordable monthly premiums, a continuously growing investment account, and a focused rider menu.",
    longDescription:
      "Advantage Starter is positioned at the accessible end of the Union Assurance range — designed for first-time buyers and budget-conscious customers. Monthly premiums fund three components: basic life cover, optional riders, and the investment account that produces a maturity payout. Cover ceasing age 75 (5 years higher than FlexLife) gives deeper protection into retirement years.",
    highlights: [
      "Cover ceasing age 75",
      "Monthly premiums; 10–30 year policy term",
      "Investment account compounds toward maturity",
      "Optional riders for life, illness, and hospitalisation",
    ],
    ...pack(
      [
        {
          id: "DEATH-COVER",
          name: "Death Cover",
          category: "Death Cover",
          summary:
            "Lump-sum benefit to beneficiaries if the life assured passes away during the policy term.",
        },
        {
          id: "FUND-ACCUMULATION",
          name: "Continuous Fund Accumulation",
          category: "Investment",
          summary:
            "Built-in investment account where premiums and annual dividends accumulate toward a maturity payout.",
        },
      ],
      [
        {
          id: "UH360",
          name: "Union Health 360",
          category: "Hospitalisation",
          summary:
            "Comprehensive hospitalisation cover for the life assured and family, including surgery and pre/post-hospitalisation expenses.",
        },
        {
          id: "USHP",
          name: "Union Smart Health Premier",
          category: "Hospitalisation",
          summary:
            "Entry-level health rider reimbursing medical expenses for the insured and their family at a lower premium tier.",
        },
        {
          id: "HCB",
          name: "Hospital Cash Benefit",
          category: "Hospital Cash",
          summary:
            "Daily cash amount during hospitalisation to help cover incidental costs or lost income.",
        },
        {
          id: "SMB",
          name: "Suwamaga Critical Illness Benefit",
          category: "Critical Illness",
          summary:
            "Lump-sum payment on diagnosis of a covered critical illness for treatment and lifestyle adjustments.",
        },
        {
          id: "LTB",
          name: "Level Term Benefit",
          category: "Death Cover",
          summary:
            "Multiplies the basic sum assured by an additional factor for stronger family protection.",
        },
        {
          id: "ADB",
          name: "Accidental Death Benefit",
          category: "Death Cover",
          summary:
            "Additional lump-sum payout if the life assured passes away due to an accident.",
        },
        {
          id: "WP-DEATH",
          name: "Waiver of Premium on Death",
          category: "Premium Waiver",
          summary:
            "Future premiums waived if the life assured passes away — fund continues to grow for beneficiaries.",
        },
        {
          id: "WP-TPD",
          name: "Waiver of Premium on Total Permanent Disability",
          category: "Premium Waiver",
          summary:
            "Future premiums waived on total permanent disability so the policy still reaches its maturity value.",
        },
      ]
    ),
  },

  {
    slug: "flexlife",
    name: "Union FlexLife",
    shortName: "FlexLife",
    type: "Whole Life",
    shortDescription:
      "Flexible universal life solution combining investment growth with limited-pay protection across five pillars.",
    longDescription:
      "FlexLife combines investment growth with comprehensive protection in a single configurable policy. Limited-pay structure (5/7/10 years) lets premiums stop early while protection and fund growth continue for up to 40 years. Built-in waivers and the widest rider library in the Union Assurance range.",
    highlights: [
      "Five pillars: Retirement, Protection, Investment, Education, Health",
      "Limited-pay 5/7/10 years; cover up to 40 years",
      "Cover ceasing age 70",
      "Top-ups, partial withdrawals after 10 years",
    ],
    ...pack(
      [
        {
          id: "DEATH-COVER",
          name: "Death Cover",
          category: "Death Cover",
          summary:
            "Lump-sum payment to loved ones on the life assured's untimely demise.",
        },
        {
          id: "WP-DEATH",
          name: "Waiver of Premium on Death",
          category: "Premium Waiver",
          summary:
            "Remaining premiums for the basic death cover are waived if the life assured passes away during the premium paying term.",
        },
        {
          id: "WP-TPD",
          name: "Waiver of Premium on Total Permanent Disability",
          category: "Premium Waiver",
          summary:
            "Future premiums waived if the life assured becomes totally and permanently disabled during the premium paying term.",
        },
      ],
      [
        {
          id: "LP-TPA",
          name: "Limited Pay Total Permanent Disability (Accident Only)",
          category: "Disability",
          summary:
            "Coverage value paid in 5 equal annual instalments for total permanent disabilities arising from an accident.",
        },
        {
          id: "LP-EPD",
          name: "Limited Pay Extended Partial Disability",
          category: "Disability",
          summary:
            "Percentage of coverage value paid for partial permanent disabilities resulting from an accident.",
        },
        {
          id: "LP-LTB",
          name: "Limited Pay Level Term Benefit",
          category: "Death Cover",
          summary:
            "Death cover enhanced up to 20× the basic sum assured for a small additional premium.",
        },
        {
          id: "LP-ADB",
          name: "Limited Pay Accidental Death Benefit",
          category: "Death Cover",
          summary:
            "Lump-sum payout in addition to the standard death cover in the event of accidental demise.",
        },
        {
          id: "LP-SPB",
          name: "Limited Pay Spouse Protection Benefit",
          category: "Spouse / Family",
          summary: "Lump-sum payout on the unfortunate demise of the spouse.",
        },
        {
          id: "LP-FEB",
          name: "Limited Pay Funeral Expense Benefit",
          category: "Funeral",
          summary:
            "Covers funeral expenses on the life assured's unfortunate demise.",
        },
        {
          id: "LP-FIB",
          name: "Limited Pay Family Income Benefit",
          category: "Income Replacement",
          summary:
            "Quarterly lump-sum payments to the family in the event of the life assured's demise.",
        },
        {
          id: "TPS",
          name: "Total and Permanent Disability due to Accident or Sickness",
          category: "Disability",
          summary:
            "Coverage value paid in 5 equal annual instalments for disabilities arising from accident or illness.",
        },
        {
          id: "UH360",
          name: "Union Health 360",
          category: "Hospitalisation",
          summary:
            "Comprehensive hospitalisation cover for the life assured and family.",
        },
        {
          id: "USHP",
          name: "Union Smart Health Premier",
          category: "Hospitalisation",
          summary:
            "Reimburses medical expenses for the life assured and family with additional health benefits.",
        },
        {
          id: "HCB",
          name: "Hospital Cash Benefit",
          category: "Hospital Cash",
          summary:
            "Daily benefit amount to help cover additional medical expenses or lost income.",
        },
        {
          id: "HCCB",
          name: "Hospital Cash Child Benefit",
          category: "Child Hospital Cash",
          summary:
            "Daily benefit equal to the coverage value when the life assured's child is hospitalised.",
        },
        {
          id: "CSB",
          name: "Comprehensive Surgery Benefit",
          category: "Surgery",
          summary:
            "Lump-sum payment immediately after a surgery is performed due to an accident or illness.",
        },
        {
          id: "SMB",
          name: "Suwamaga Critical Illness Benefit",
          category: "Critical Illness",
          summary:
            "Lump-sum payment on diagnosis of a covered critical illness for treatment and recovery.",
        },
        {
          id: "CHB",
          name: "Child Health Benefit",
          category: "Child Health",
          summary:
            "Daily cash benefit and coverage for 244 different surgeries undergone by children.",
        },
      ]
    ),
  },

  {
    slug: "health-360",
    name: "Union Health 360",
    shortName: "Health 360",
    type: "Health",
    shortDescription:
      "Standalone comprehensive health solution or attachable health rider — three generations under one umbrella.",
    longDescription:
      "Health 360 covers the policyholder, spouse, children below 23, and parents — three generations. 16 plan tiers scale from LKR 300,000 to LKR 60,000,000 annual cover. Geographic options range from Sri Lanka only to worldwide (excluding USA and Canada). Claim-free years earn a 25% no-claim bonus that can double the limit in four years.",
    highlights: [
      "Cashless hospitalisation at point of discharge",
      "Three generations covered",
      "16 plan tiers (LKR 300K – LKR 60M annual cover)",
      "Worldwide option (excl. USA & Canada); inbuilt critical illness",
    ],
    ...pack(
      [
        {
          id: "HOSPITALISATION",
          name: "Hospitalisation Benefit",
          category: "Hospitalisation",
          summary:
            "Hospital room, board, and ICU expenses covered as per actuals.",
        },
        {
          id: "SURGICAL",
          name: "Surgical Benefit",
          category: "Surgery",
          summary:
            "Fees for surgeons, anaesthetists, consultants, and specialists for medical procedures.",
        },
        {
          id: "MISC-HOSPITAL",
          name: "Miscellaneous Hospital Services",
          category: "Hospitalisation",
          summary:
            "Operation theatre charges, oxygen, blood, and prescribed drugs.",
        },
        {
          id: "INBUILT-CI",
          name: "In-Built Critical Illness Cover",
          category: "Critical Illness",
          summary: "Coverage for critical illnesses included in the base plan.",
        },
        {
          id: "DAYCARE-SURGERY",
          name: "Day Care Surgery Benefit",
          category: "Surgery",
          summary:
            "Surgeries and hospital stays under 24 hours for listed procedures.",
        },
        {
          id: "PRE-POST-HOSP",
          name: "Pre and Post Hospitalisation Benefits",
          category: "Hospitalisation",
          summary:
            "Reimburses medical expenses 30 days before admission and 30 days after discharge.",
        },
        {
          id: "AMBULANCE",
          name: "Ambulance Fees",
          category: "Hospitalisation",
          summary:
            "Licensed ambulance service charges up to 2% of the basic annual sum insured.",
        },
        {
          id: "ORGAN-DONOR",
          name: "Organ Donor Expenses",
          category: "Specialist Medical",
          summary:
            "Donor's hospitalisation costs covered within the recipient's overall sum insured.",
        },
        {
          id: "PROSTHESIS",
          name: "Prosthesis and Implants",
          category: "Specialist Medical",
          summary:
            "Medical implants and prosthetics up to 70% of the annual sum insured.",
        },
        {
          id: "LIMIT-REINSTATE",
          name: "Annual Limit Reinstatement",
          category: "Hospitalisation",
          summary:
            "Full benefit amount reinstated for an unrelated medical emergency in the same year.",
        },
        {
          id: "NCB-25",
          name: "25% Claim-Free Year Bonus",
          category: "Loyalty",
          summary:
            "Coverage limit increases by 25% for every claim-free year.",
        },
        {
          id: "WELLBEING",
          name: "Wellbeing Cover",
          category: "Preventive",
          summary:
            "Free health check-ups (up to 2% of sum insured) after two consecutive claim-free years.",
        },
      ],
      [
        {
          id: "MAT",
          name: "Maternity Benefit",
          category: "Maternity",
          summary:
            "Coverage for Normal Vaginal Delivery (NVD) and Caesarean Section (LSCS) with limits tiered by chosen plan.",
        },
        {
          id: "DENTAL",
          name: "Routine Dental Benefit",
          category: "Outpatient Health",
          summary: "Covers routine dental check-ups and treatments within Sri Lanka.",
        },
        {
          id: "OPTICAL",
          name: "Routine Optical Benefit",
          category: "Outpatient Health",
          summary: "Covers expenses for optical check-ups and vision prescriptions.",
        },
        {
          id: "CI-REIMB",
          name: "Critical Illness Reimbursement Benefit",
          category: "Critical Illness",
          summary:
            "Lump-sum payment on diagnosis of covered conditions, subject to specific annual and lifetime limits.",
        },
        {
          id: "ADMISSION",
          name: "Hospital Admission Charges",
          category: "Hospitalisation",
          summary:
            "Specific admission fees as a sub-limit within the hospitalisation benefits.",
        },
      ]
    ),
  },

  {
    slug: "life-plus",
    name: "Union Life Plus (Life+)",
    shortName: "Life+",
    type: "Whole Life",
    shortDescription:
      "Protection-focused universal life plan with the widest customisable rider suite.",
    longDescription:
      "Life+ blends comprehensive protection with the financial discipline of a regular-premium investment account. Beneficiaries always receive the higher of the basic sum assured or the accumulated fund balance — a protection floor irrespective of fund performance. Premium discipline rewarded with an explicit 10% loyalty bonus at maturity.",
    highlights: [
      "Higher-of: basic sum assured OR investment account balance on demise",
      "10% loyalty bonus at maturity",
      "Suitable across Low / Mid / High income bands",
      "Level Term Benefit up to 10× basic sum assured",
    ],
    ...pack(
      [
        {
          id: "DEATH-COVER-HIGHER-OF",
          name: "Death Cover (Higher of BSA or Fund)",
          category: "Death Cover",
          summary:
            "Beneficiaries receive either the Basic Sum Assured or the investment account balance, whichever is higher.",
        },
        {
          id: "FUND-ACCUMULATION",
          name: "Continuous Fund Accumulation",
          category: "Investment",
          summary:
            "Built-in investment account that grows monthly through premium contributions and annual dividends.",
        },
      ],
      [
        {
          id: "UH360",
          name: "Union Health 360",
          category: "Hospitalisation",
          summary:
            "Comprehensive health rider covering up to three generations.",
        },
        {
          id: "USHP",
          name: "Union Smart Health Premier",
          category: "Hospitalisation",
          summary: "Entry-level health rider for medical expense reimbursement.",
        },
        {
          id: "HCB",
          name: "Hospital Cash Benefit",
          category: "Hospital Cash",
          summary: "Daily benefit during hospitalisation to cover lost income.",
        },
        {
          id: "SMB",
          name: "Suwamaga Benefit",
          category: "Critical Illness",
          summary:
            "Lump-sum payment for medical treatment on diagnosis of a critical illness or surgery.",
        },
        {
          id: "CSB",
          name: "Comprehensive Surgery Benefit",
          category: "Surgery",
          summary: "Lump-sum payment immediately after a surgery.",
        },
        {
          id: "CHB",
          name: "Child Health Benefit",
          category: "Child Health",
          summary:
            "Daily cash benefit and coverage for 244 different surgeries for children.",
        },
        {
          id: "LTB",
          name: "Level Term Benefit",
          category: "Death Cover",
          summary: "Multiplies the basic life cover by up to 10 times.",
        },
        {
          id: "ADB",
          name: "Accidental Death Benefit",
          category: "Death Cover",
          summary:
            "Additional lump-sum payout if the insured passes away due to an accident.",
        },
        {
          id: "SPB",
          name: "Spouse Benefit",
          category: "Spouse / Family",
          summary: "Lump-sum payment on the death of the policyholder's spouse.",
        },
        {
          id: "FEB",
          name: "Funeral Expense Benefit",
          category: "Funeral",
          summary: "Covers immediate funeral costs on the death of the policyholder.",
        },
        {
          id: "TPS",
          name: "TPD Due to Accident or Sickness",
          category: "Disability",
          summary:
            "Sum assured paid in 5 annual instalments for disabilities caused by accident or illness.",
        },
        {
          id: "TPA",
          name: "TPD Due to Accident only",
          category: "Disability",
          summary: "Disability benefit for cases resulting from accidents only.",
        },
        {
          id: "EPD",
          name: "Extended Partial Disability",
          category: "Disability",
          summary:
            "Pays a percentage of the sum assured for partial permanent disabilities.",
        },
        {
          id: "FIB",
          name: "Family Income Benefit",
          category: "Income Replacement",
          summary:
            "Quarterly lump-sum payments after the death of the primary breadwinner.",
        },
        {
          id: "WP",
          name: "Waiver of Premium",
          category: "Premium Waiver",
          summary:
            "Future premiums waived in the event of total permanent disability.",
        },
      ]
    ),
  },

  {
    slug: "pension-advantage",
    name: "Union Pension Advantage",
    shortName: "Pension Advantage",
    type: "Whole Life",
    shortDescription:
      "Dedicated retirement-focused plan designed for pension accumulation.",
    longDescription:
      "Pension Advantage is purpose-built for retirement income — not one of several pillars but the entire product. Premiums build a dedicated retirement account that pays out as a single lump sum or a structured monthly pension over 10/15/20 years. Both Premium Waivers (Death + TPD) are built-in.",
    highlights: [
      "Choice of retirement age: 55, 60, or 65",
      "Pension payout: lump sum or 10/15/20-year monthly pension",
      "Both Premium Waivers built-in (Death + TPD)",
      "Entry age 25–55 to ensure meaningful accumulation runway",
    ],
    ...pack(
      [
        {
          id: "PENSION-FUND",
          name: "Pension Fund Accumulation",
          category: "Investment",
          summary:
            "Dedicated retirement account that grows through contributions and dividends.",
        },
        {
          id: "PENSION-PAYOUT",
          name: "Pension Payout (Lump Sum or Monthly)",
          category: "Pension Payout",
          summary:
            "Receive the fund as a single lump sum or as a monthly pension over 10, 15, or 20 years.",
        },
        {
          id: "WP-DEATH",
          name: "Premium Waiver on Death",
          category: "Premium Waiver",
          summary:
            "Company continues paying premiums until maturity if the policyholder passes away.",
        },
        {
          id: "WP-TPD",
          name: "Premium Waiver on Total Permanent Disability",
          category: "Premium Waiver",
          summary:
            "Future premiums waived if the policyholder becomes disabled due to accident or sickness.",
        },
        {
          id: "WITHDRAWAL",
          name: "Withdrawal Benefit",
          category: "Withdrawal",
          summary:
            "One-time emergency withdrawal of up to 15% after three policy years.",
        },
      ],
      [
        {
          id: "UH360",
          name: "Union Health 360",
          category: "Hospitalisation",
          summary:
            "Comprehensive hospitalisation and overseas treatment cover.",
        },
        {
          id: "USHP",
          name: "Union Smart Health Premier",
          category: "Hospitalisation",
          summary: "Entry-level health rider for medical reimbursement.",
        },
        {
          id: "SMB",
          name: "Suwamaga Critical Illness Benefit",
          category: "Critical Illness",
          summary:
            "Lump-sum payment on diagnosis of a covered critical illness.",
        },
        {
          id: "LTB",
          name: "Level Term Benefit",
          category: "Death Cover",
          summary:
            "Enhances basic death cover for more substantial family protection.",
        },
        {
          id: "FEB",
          name: "Funeral Expenses Benefit",
          category: "Funeral",
          summary: "Covers funeral costs on the demise of the policyholder.",
        },
      ]
    ),
  },

  {
    slug: "single-premium-advantage",
    name: "Union Single Premium Advantage",
    shortName: "Single Premium Advantage",
    type: "Whole Life",
    shortDescription:
      "Simple, one-time investment plan with bundled life cover.",
    longDescription:
      "One premium at inception funds a dedicated investment account that compounds via Union Assurance's annual dividend declarations. A guaranteed death cover of 105% of the single premium is bundled automatically. No recurring premiums, no top-ups, no rider attachments — simplicity is the design.",
    highlights: [
      "One-time premium payment at policy inception",
      "Guaranteed 105% death cover throughout the term",
      "Policy term flexible from 5 to 30 years",
      "No recurring payments, no lapsation risk",
    ],
    ...pack(
      [
        {
          id: "DEATH-COVER-105",
          name: "Death Cover",
          category: "Death Cover",
          summary: "Guaranteed benefit of 105% of the initial single premium.",
        },
        {
          id: "INVESTMENT-ACCOUNT",
          name: "Dedicated Investment Account",
          category: "Investment",
          summary:
            "One-time premium compounds through annual dividends across the policy term.",
        },
      ],
      []
    ),
  },

  {
    slug: "sisumaga-plus",
    name: "Union Sisumaga Plus (Sisumaga+)",
    shortName: "Sisumaga+",
    type: "Endowment",
    shortDescription:
      "Protection-based education plan for a child's future milestones.",
    longDescription:
      "Sisumaga+ is Sri Lanka's pioneering education protection plan. It blends a long-term Education Fund with three layers of continuity if the parent passes away: a lump-sum life cover (5× annual premium), an ongoing monthly Education Assistance Fee, and a built-in Premium Waiver so the fund still reaches its target. A 15% loyalty bonus rewards completed premium discipline.",
    highlights: [
      "Built-in Premium Waiver on Death keeps the fund on track",
      "Monthly Education Assistance Fee until maturity",
      "15% loyalty bonus at maturity",
      "Entry age up to 45; aligned with parents of school-age children",
    ],
    ...pack(
      [
        {
          id: "LIFE-COVER-5X",
          name: "Life Cover (5× Basic Annual Premium)",
          category: "Death Cover",
          summary:
            "Immediate lump-sum payment to the family on the parent's demise.",
        },
        {
          id: "EDU-ASSIST",
          name: "Education Assistance Fee Benefit",
          category: "Education Income",
          summary: "Consistent monthly income paid to the family until policy maturity.",
        },
        {
          id: "WP-DEATH",
          name: "Waiver of Premium on Death",
          category: "Premium Waiver",
          summary:
            "Union Assurance continues paying premiums if the parent passes away.",
        },
        {
          id: "EDU-FUND",
          name: "Education Fund Accumulation",
          category: "Investment",
          summary: "Dedicated fund growing toward higher-education milestones.",
        },
        {
          id: "LOYALTY-15",
          name: "15% Loyalty Bonus",
          category: "Loyalty",
          summary: "Additional 15% bonus added to the fund at maturity.",
        },
      ],
      [
        {
          id: "USHP",
          name: "Union Smart Health Premier",
          category: "Hospitalisation",
          summary:
            "Reimburses medical expenses for the parent and family.",
        },
        {
          id: "CHB",
          name: "Child Health Benefit",
          category: "Child Health",
          summary:
            "Daily cash benefit and coverage for 244 surgeries for the child.",
        },
        {
          id: "SMB",
          name: "Suwamaga Critical Illness Benefit",
          category: "Critical Illness",
          summary:
            "Lump-sum payment on diagnosis of a critical illness for the parent.",
        },
        {
          id: "HCB",
          name: "Hospital Cash Benefit",
          category: "Hospital Cash",
          summary: "Daily cash amount during the parent's hospitalisation.",
        },
        {
          id: "CSB",
          name: "Comprehensive Surgery Benefit",
          category: "Surgery",
          summary: "Immediate lump-sum payment after a surgery.",
        },
        {
          id: "LTB",
          name: "Level Term Benefit",
          category: "Death Cover",
          summary:
            "Enhances death cover beyond the built-in 5× annual premium.",
        },
        {
          id: "ADB",
          name: "Accidental Death Benefit",
          category: "Death Cover",
          summary:
            "Additional payout if the parent passes away due to an accident.",
        },
        {
          id: "SPOUSE-DEATH",
          name: "Spouse Death Cover",
          category: "Spouse / Family",
          summary: "Lump-sum payout on the spouse's demise.",
        },
        {
          id: "FEB",
          name: "Funeral Expenses Benefit",
          category: "Funeral",
          summary: "Covers immediate funeral costs.",
        },
        {
          id: "TPD-BUNDLE",
          name: "Total and Partial Permanent Disability Benefits",
          category: "Disability",
          summary: "Structured payouts for parent's permanent disability.",
        },
        {
          id: "WP-TPD",
          name: "Waiver of Premium on Total Permanent Disability",
          category: "Premium Waiver",
          summary:
            "Ensures fund growth if the parent becomes disabled.",
        },
      ]
    ),
  },
];

export function getPolicyBySlug(slug: string): UnionPolicy | undefined {
  return UNION_POLICIES.find((p) => p.slug === slug);
}
