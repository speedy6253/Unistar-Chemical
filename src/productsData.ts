export interface Product {
  id: string;
  name: string;
  formula: string;
  category: string;
  description: string;
  applications: string[];
  keyBenefits: string[];
  packaging: string;
}

export const CATEGORIES = [
  "All Categories",
  "Acids",
  "Alkalis",
  "Solvents",
  "Water Treatment Chemicals",
  "Salts & Minerals",
  "Food Grade Chemicals",
  "Specialty Chemicals",
  "Industrial Chemicals"
];

export const INDUSTRIES = [
  "Water Treatment",
  "Pharmaceuticals",
  "Food Processing",
  "Agriculture",
  "Textile",
  "Paints & Coatings",
  "Detergents & Cleaning",
  "Chemical Manufacturing"
];

export const BUSINESS_INFO = {
  companyName: "Unistar Chemicals",
  headOffice: "B6-152/NEW UNION BOARD, Kolkata – 700141",
  corporateOffice: "Mraj Premiere, EN-37, Sector V, Kolkata, West Bengal – 700091",
  email: "info@unisterchemicalsl.in",
  phone: "+91 95066 05275",
  whatsapp: "+91 95066 05275",
  whatsappUrlNumber: "919506605275",
  workingHours: "Monday - Saturday: 10:00 AM - 6:30 PM",
  establishedYear: "2015"
};

export const PRODUCTS: Product[] = [
  {
    id: "caustic-soda-flakes",
    name: "Caustic Soda Flakes",
    formula: "NaOH",
    category: "Alkalis",
    description: "Caustic Soda Flakes are a high-purity sodium hydroxide product supplied in a convenient, easy-to-dissolve flake form. Valued for strong alkalinity and consistent quality, they serve as an essential raw material across a wide range of industrial and manufacturing processes.",
    applications: [
      "Soap & detergent manufacturing",
      "Pulp, paper & textile processing",
      "Water & effluent treatment",
      "Chemical & petrochemical processing",
      "Metal cleaning & surface treatment"
    ],
    keyBenefits: [
      "High purity, consistent flake quality",
      "Easy handling, storage & dissolution",
      "Strong, reliable alkaline performance",
      "Suitable for diverse industrial uses"
    ],
    packaging: "25 kg & 50 kg HDPE bags; 1 MT jumbo bags"
  },
  {
    id: "hydrochloric-acid",
    name: "Hydrochloric Acid",
    formula: "HCl",
    category: "Acids",
    description: "Hydrochloric Acid is a versatile mineral acid supplied as a clear, high-strength aqueous solution. Valued for its strong acidity and dependable, consistent performance, it is widely used for pickling, neutralisation, cleaning and processing applications across a broad range of industries.",
    applications: [
      "Steel pickling & metal cleaning",
      "pH adjustment & neutralisation",
      "Water treatment & regeneration",
      "Chemical synthesis & processing",
      "Textile, leather & food processing"
    ],
    keyBenefits: [
      "Consistent concentration & quality",
      "Fast, effective acid performance",
      "Reliable bulk supply availability",
      "Versatile across many industries"
    ],
    packaging: "30 kg carboys; 250 kg HDPE drums; bulk tankers"
  },
  {
    id: "sulphuric-acid",
    name: "Sulphuric Acid",
    formula: "H2SO4",
    category: "Acids",
    description: "Sulphuric Acid is a fundamental, high-strength mineral acid supplied as a clear, dense liquid. Prized for its powerful reactivity and consistent concentration, it serves as an essential raw material and processing agent across a wide range of industrial and manufacturing operations.",
    applications: [
      "Fertiliser & phosphate production",
      "Metal pickling & processing",
      "Chemical & petrochemical manufacturing",
      "Water & effluent treatment",
      "Batteries & electrolyte solutions"
    ],
    keyBenefits: [
      "High concentration, consistent strength",
      "Powerful, reliable reactivity",
      "Dependable, large-scale bulk supply",
      "Versatile industrial workhorse"
    ],
    packaging: "35 kg carboys; 250 kg HDPE drums; bulk tankers"
  },
  {
    id: "phosphoric-acid",
    name: "Phosphoric Acid",
    formula: "H3PO4",
    category: "Acids",
    description: "Phosphoric Acid is a versatile mineral acid supplied as a clear, high-purity solution for both industrial and food-grade uses. Valued for its consistent quality and effective performance, it supports fertiliser production, surface treatment, food processing and many other specialised applications across diverse industries.",
    applications: [
      "Fertiliser & phosphate production",
      "Metal surface treatment",
      "Food & beverage processing",
      "Detergents & cleaning agents",
      "Water treatment & conditioning"
    ],
    keyBenefits: [
      "Consistent purity and quality",
      "Food-grade and industrial grades",
      "Effective, reliable performance",
      "Dependable bulk supply"
    ],
    packaging: "30 kg carboys; 250 kg HDPE drums; bulk tankers"
  },
  {
    id: "hydrogen-peroxide",
    name: "Hydrogen Peroxide",
    formula: "H2O2",
    category: "Industrial Chemicals",
    description: "Hydrogen Peroxide is a powerful, eco-friendly oxidising agent supplied as a clear, colourless aqueous solution. Valued for its strong oxidation, effective disinfection and clean breakdown into water and oxygen, it serves bleaching, treatment and sanitising needs across a wide range of industries.",
    applications: [
      "Textile & paper bleaching",
      "Water & wastewater treatment",
      "Disinfection & sanitisation",
      "Chemical synthesis & oxidation",
      "Electronics & metal surface cleaning"
    ],
    keyBenefits: [
      "Strong, effective oxidising power",
      "Breaks down cleanly into water & oxygen",
      "Chlorine-free, residue-free action",
      "Consistent strength and quality"
    ],
    packaging: "35 kg carboys; 250 kg HDPE drums; bulk tankers"
  },
  {
    id: "sodium-hypochlorite",
    name: "Sodium Hypochlorite",
    formula: "NaOCl",
    category: "Water Treatment Chemicals",
    description: "Sodium Hypochlorite is a versatile chlorine-based solution supplied as a clear, pale-yellow liquid. Valued for its powerful disinfecting and bleaching action and dependable, consistent performance, it is widely used for water treatment, sanitisation and cleaning across municipal, industrial and commercial applications.",
    applications: [
      "Water & wastewater disinfection",
      "Surface & equipment sanitisation",
      "Textile & pulp bleaching",
      "Odour & effluent control",
      "Industrial & institutional cleaning"
    ],
    keyBenefits: [
      "Powerful disinfecting & bleaching action",
      "Fast-acting, broad-spectrum performance",
      "Consistent available-chlorine strength",
      "Reliable bulk supply availability"
    ],
    packaging: "35 kg carboys; 250 kg HDPE drums; bulk tankers"
  },
  {
    id: "isopropyl-alcohol",
    name: "Isopropyl Alcohol (IPA)",
    formula: "C3H8O",
    category: "Solvents",
    description: "Isopropyl Alcohol is a versatile, fast-evaporating solvent supplied as a clear, colourless liquid of high purity. Valued for its excellent cleaning, disinfecting and dissolving properties, it is widely used across pharmaceutical, electronics, cosmetic and industrial applications where a clean, residue-free finish is essential.",
    applications: [
      "Pharmaceutical & laboratory use",
      "Electronics & precision cleaning",
      "Disinfectant & sanitiser production",
      "Cosmetics & personal care",
      "Industrial degreasing & solvents"
    ],
    keyBenefits: [
      "Fast evaporation, residue-free finish",
      "High solvency and purity",
      "Effective cleaning and disinfection",
      "Versatile across many industries"
    ],
    packaging: "30 kg carboys; 160 kg HDPE drums; bulk tankers"
  },
  {
    id: "extra-neutral-alcohol",
    name: "Extra Neutral Alcohol (ENA)",
    formula: "ENA",
    category: "Solvents",
    description: "Extra Neutral Alcohol is a highly refined, food-grade ethyl alcohol supplied as a clear, colourless liquid with an exceptionally neutral aroma. Valued for its high purity and consistent quality, it serves as a premium base for beverages, flavours, pharmaceuticals and personal-care formulations.",
    applications: [
      "Alcoholic beverage production",
      "Flavours & fragrance manufacturing",
      "Pharmaceutical formulations",
      "Cosmetics & personal care",
      "Vinegar & food processing"
    ],
    keyBenefits: [
      "High purity, neutral aroma",
      "Consistent food-grade quality",
      "Versatile production base",
      "Reliable bulk supply"
    ],
    packaging: "30 kg carboys; 210 kg HDPE drums; bulk tankers"
  },
  {
    id: "liquid-paraffin",
    name: "Liquid Paraffin",
    formula: "Mineral Oil",
    category: "Specialty Chemicals",
    description: "Liquid Paraffin is a highly refined mineral oil supplied as a clear, colourless and odourless liquid of consistent purity. Chemically stable and non-reactive, it offers excellent lubricating and moisturising properties, making it a dependable ingredient across pharmaceutical, cosmetic, food-processing and industrial applications.",
    applications: [
      "Pharmaceutical & laxative formulations",
      "Cosmetics & skincare products",
      "Lubricants & release agents",
      "Textile & polymer processing",
      "Food-grade machinery lubrication"
    ],
    keyBenefits: [
      "Odourless, colourless and stable",
      "Excellent lubrication and moisturising",
      "Chemically inert and non-reactive",
      "Consistent high-purity quality"
    ],
    packaging: "50 kg carboys; 210 kg HDPE drums; bulk tankers"
  },
  {
    id: "white-oil",
    name: "White Oil",
    formula: "Mineral Oil",
    category: "Specialty Chemicals",
    description: "White Oil is a highly purified pharmaceutical and industrial grade mineral oil, supplied as a clear, colourless, odourless and tasteless liquid. Highly stable and non-reactive, it is valued for its purity and versatility across pharmaceutical, cosmetic, food-contact and specialised industrial applications.",
    applications: [
      "Pharmaceutical & medicinal formulations",
      "Cosmetics & personal care",
      "Food-grade & packaging lubrication",
      "Textile, rubber & polymer processing",
      "Industrial & specialty lubricants"
    ],
    keyBenefits: [
      "High purity and clarity",
      "Odourless, tasteless and stable",
      "Chemically inert and non-reactive",
      "Versatile across many industries"
    ],
    packaging: "50 kg carboys; 210 kg HDPE drums; bulk tankers"
  },
  {
    id: "potassium-nitrate",
    name: "Potassium Nitrate (KNO3)",
    formula: "KNO3",
    category: "Salts & Minerals",
    description: "Potassium Nitrate is a high-purity, water-soluble crystalline salt supplied as a white, free flowing powder. Rich in both potassium and nitrogen, it delivers reliable performance as a plant nutrient and oxidising agent across agriculture, horticulture, food-processing and diverse industrial and specialty manufacturing applications.",
    applications: [
      "Fertilisers & specialty nutrients",
      "Greenhouse & horticulture feeding",
      "Food preservation & processing",
      "Glass & ceramics manufacturing",
      "Fireworks & industrial oxidisers"
    ],
    keyBenefits: [
      "High purity and solubility",
      "Dual potassium and nitrogen source",
      "Fast, efficient nutrient uptake",
      "Consistent, free-flowing quality"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  },
  {
    id: "potassium-chloride",
    name: "Potassium Chloride (KCl)",
    formula: "KCl",
    category: "Salts & Minerals",
    description: "Potassium Chloride is a high-purity, water-soluble crystalline salt supplied as white to off-white crystals or powder. A concentrated source of potassium, it is widely used as a fertiliser and versatile industrial raw material across agriculture, food-processing, pharmaceutical and chemical manufacturing applications.",
    applications: [
      "Potash fertilisers & agriculture",
      "Food processing & seasoning",
      "Pharmaceutical & nutritional use",
      "Water treatment & softening",
      "Industrial & chemical processing"
    ],
    keyBenefits: [
      "High purity and solubility",
      "Concentrated potassium content",
      "Versatile across many industries",
      "Consistent, reliable quality"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  },
  {
    id: "magnesium-sulphate",
    name: "Magnesium Sulphate (MgSO4)",
    formula: "MgSO4",
    category: "Salts & Minerals",
    description: "Magnesium Sulphate is a high-purity, water-soluble crystalline salt supplied as colourless crystals or a white, free-flowing powder. A readily available source of magnesium and sulphur, it delivers reliable performance across agriculture, healthcare, food-processing and a wide range of industrial and manufacturing applications.",
    applications: [
      "Fertilisers & crop nutrition",
      "Epsom salt & healthcare products",
      "Food & pharmaceutical processing",
      "Bath & personal care products",
      "Industrial & chemical manufacturing"
    ],
    keyBenefits: [
      "High purity and solubility",
      "Rich magnesium and sulphur source",
      "Fast, efficient nutrient uptake",
      "Consistent, free-flowing quality"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  },
  {
    id: "magnesium-chloride",
    name: "Magnesium Chloride (MgCl2)",
    formula: "MgCl2",
    category: "Salts & Minerals",
    description: "Magnesium Chloride is a high-purity, water-soluble crystalline salt supplied as white to off-white flakes or powder. A versatile source of magnesium, it is widely used for de-icing, dust control, agriculture, food-processing and a broad range of industrial and chemical applications.",
    applications: [
      "De-icing & road treatment",
      "Dust control & soil stabilisation",
      "Fertilisers & crop nutrition",
      "Food processing & supplements",
      "Industrial & chemical processing"
    ],
    keyBenefits: [
      "High purity and solubility",
      "Effective moisture absorption",
      "Versatile across many industries",
      "Consistent, reliable quality"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  },
  {
    id: "citric-acid",
    name: "Citric Acid (C6H8O7)",
    formula: "C6H8O7",
    category: "Food Grade Chemicals",
    description: "Citric Acid is a high-purity, white crystalline organic acid produced by the natural fermentation of sugars. Fully water-soluble and biodegradable, it acts as a versatile acidulant, preservative and chelating agent across the food, beverage, pharmaceutical, cosmetic and industrial cleaning sectors worldwide.",
    applications: [
      "Food & beverage acidulant",
      "Pharmaceuticals & effervescents",
      "Cosmetics & personal care",
      "Household & industrial cleaning",
      "Water treatment & metal cleaning"
    ],
    keyBenefits: [
      "High purity and solubility",
      "Natural, biodegradable origin",
      "Effective flavour and pH control",
      "Versatile chelating performance"
    ],
    packaging: "25 kg bags; 1000 kg jumbo bags; bulk supply"
  },
  {
    id: "xanthan-gum",
    name: "Xanthan Gum",
    formula: "Food Grade",
    category: "Food Grade Chemicals",
    description: "Xanthan Gum is a high-purity, food-grade polysaccharide produced by the natural fermentation of glucose. Supplied as a fine cream-coloured powder, it acts as a highly effective thickener, stabiliser and emulsifier, delivering consistent viscosity and texture across food, beverage, pharmaceutical, cosmetic and industrial formulations.",
    applications: [
      "Food & beverage thickening",
      "Sauces, dressings & dairy",
      "Pharmaceutical suspensions",
      "Cosmetics & personal care",
      "Oil drilling & industrial fluids"
    ],
    keyBenefits: [
      "Excellent thickening and stability",
      "Stable across temperature and pH",
      "Natural, fermentation-derived origin",
      "Consistent viscosity and texture"
    ],
    packaging: "25 kg bags; 25 kg drums; bulk supply"
  },
  {
    id: "urea",
    name: "Urea (CO(NH2)2)",
    formula: "CO(NH2)2",
    category: "Specialty Chemicals",
    description: "Urea is a high-purity, white crystalline compound and the most widely used nitrogenous fertiliser, containing 46% nitrogen. Highly soluble and readily biodegradable, it delivers efficient nitrogen nutrition to crops while also serving diverse industrial, resin, feed and emission-control applications across global agriculture and manufacturing.",
    applications: [
      "Nitrogen fertilisers & crop nutrition",
      "Urea-formaldehyde resins & adhesives",
      "Animal feed supplements",
      "NOx reduction (AdBlue/DEF)",
      "Industrial & chemical manufacturing"
    ],
    keyBenefits: [
      "High nitrogen content (46%)",
      "High purity and solubility",
      "Efficient nutrient delivery",
      "Versatile industrial use"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  },
  {
    id: "melamine",
    name: "Melamine (C3H6N6)",
    formula: "C3H6N6",
    category: "Specialty Chemicals",
    description: "Melamine is a high-purity, white crystalline organic compound rich in nitrogen, produced primarily from urea. Valued for its hardness, heat resistance and fire-retardant properties, it is used to manufacture durable resins, laminates, adhesives, coatings and moulding compounds across the furniture, construction and industrial sectors.",
    applications: [
      "Melamine-formaldehyde resins",
      "Laminates & surface coatings",
      "Adhesives & wood panels",
      "Moulding compounds & tableware",
      "Flame retardants"
    ],
    keyBenefits: [
      "High nitrogen content",
      "Excellent hardness and durability",
      "Heat and fire resistance",
      "Consistent, high-purity quality"
    ],
    packaging: "25 kg bags; 1000 kg jumbo bags; bulk supply"
  },
  {
    id: "benzalkonium-chloride",
    name: "Benzalkonium Chloride (BKC)",
    formula: "Disinfectant",
    category: "Specialty Chemicals",
    description: "Benzalkonium Chloride (BKC) is a high-purity, cationic surfactant supplied as a clear liquid concentrate. A broad-spectrum quaternary ammonium disinfectant and biocide, it delivers effective control of bacteria, fungi and algae across hospital, industrial, agricultural and household sanitation applications while remaining stable, water-soluble and easy to formulate.",
    applications: [
      "Hospital & surface disinfection",
      "Water & swimming pool treatment",
      "Sanitisers & cleaning formulations",
      "Agriculture & animal husbandry",
      "Algaecide & industrial biocide"
    ],
    keyBenefits: [
      "Broad-spectrum antimicrobial action",
      "Stable and water-soluble",
      "Low odour and non-staining",
      "Easy to formulate and dilute"
    ],
    packaging: "50 kg carboys; 250 kg drums; bulk supply"
  },
  {
    id: "poly-aluminium-chloride",
    name: "Poly Aluminium Chloride (PAC)",
    formula: "Water Treatment",
    category: "Water Treatment Chemicals",
    description: "Poly Aluminium Chloride (PAC) is a high-performance inorganic coagulant supplied as a pale-yellow liquid or spray-dried powder. Widely used in water and wastewater treatment, it rapidly removes turbidity, suspended solids and organic matter, delivering clearer water, faster settling and lower sludge volumes across municipal and industrial applications.",
    applications: [
      "Drinking water treatment",
      "Municipal wastewater treatment",
      "Industrial effluent clarification",
      "Paper & pulp sizing",
      "Sludge dewatering & thickening"
    ],
    keyBenefits: [
      "Fast, effective coagulation",
      "Wide pH operating range",
      "Lower sludge generation",
      "Reduced chemical dosage"
    ],
    packaging: "25 kg bags; 250 kg drums; bulk supply"
  },
  {
    id: "bleaching-powder",
    name: "Bleaching Powder",
    formula: "Calcium Hypochlorite",
    category: "Water Treatment Chemicals",
    description: "Bleaching Powder, chemically calcium hypochlorite, is a white to off-white powder with a characteristic chlorine odour and high available-chlorine content. A powerful oxidising, disinfecting and bleaching agent, it is widely used for water disinfection, sanitation, textile and paper bleaching across municipal, industrial and household applications.",
    applications: [
      "Drinking water disinfection",
      "Swimming pool sanitation",
      "Textile & paper bleaching",
      "Surface & area sanitation",
      "Sewage & effluent treatment"
    ],
    keyBenefits: [
      "High available chlorine content",
      "Powerful disinfecting and bleaching",
      "Cost-effective and easy to store",
      "Reliable, consistent quality"
    ],
    packaging: "25 kg drums; 50 kg drums; bulk supply"
  },
  {
    id: "ferric-alum",
    name: "Ferric Alum",
    formula: "Water Treatment Coagulant",
    category: "Water Treatment Chemicals",
    description: "Ferric Alum is a high-efficiency iron-based coagulant supplied as pale-green to yellowish crystals or powder. Widely used in water and wastewater treatment, it rapidly neutralises charge and removes turbidity, colour, phosphates and suspended solids, delivering clearer water and dependable performance across municipal and industrial treatment applications.",
    applications: [
      "Drinking water clarification",
      "Municipal wastewater treatment",
      "Industrial effluent treatment",
      "Turbidity & colour removal",
      "Phosphate & odour control"
    ],
    keyBenefits: [
      "Fast, effective coagulation",
      "Removes colour and turbidity",
      "Wide pH operating range",
      "Cost-effective performance"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  },
  {
    id: "refined-glycerine",
    name: "Refined Glycerine",
    formula: "C3H8O3",
    category: "Specialty Chemicals",
    description: "Refined Glycerine is a clear, colourless, odourless and highly viscous liquid of exceptional purity. Derived from vegetable oils, this hygroscopic polyol serves as a versatile humectant, solvent and sweetener across pharmaceutical, cosmetic, food and industrial formulations, offering excellent moisture retention, stability and skin-friendly performance.",
    applications: [
      "Pharmaceutical syrups & formulations",
      "Cosmetics & personal care products",
      "Food & beverage humectant",
      "Toothpaste & oral care",
      "Industrial solvents & lubricants"
    ],
    keyBenefits: [
      "High purity and clarity",
      "Excellent moisture retention",
      "Non-toxic and skin-friendly",
      "Stable and highly versatile"
    ],
    packaging: "250 kg drums; 1250 kg IBC totes; bulk supply"
  },
  {
    id: "sodium-chloride",
    name: "Sodium Chloride",
    formula: "NaCl",
    category: "Salts & Minerals",
    description: "Sodium Chloride is a high-purity white crystalline salt, one of the most widely used industrial and food-grade chemicals. Readily soluble and chemically stable, it functions as an essential raw material, preservative and processing aid across chemical manufacturing, water treatment, food processing and de-icing applications worldwide.",
    applications: [
      "Chemical & chlor-alkali manufacturing",
      "De-icing & road maintenance",
      "Water softening & treatment",
      "Food processing & preservation",
      "Textile & dyeing processes"
    ],
    keyBenefits: [
      "High purity and consistency",
      "Readily soluble and stable",
      "Versatile industrial raw material",
      "Cost-effective and widely available"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  },
  {
    id: "dolomite",
    name: "Dolomite",
    formula: "CaMg(CO3)2",
    category: "Salts & Minerals",
    description: "Dolomite is a naturally occurring calcium magnesium carbonate mineral, supplied as graded granules, chips or fine powder. Valued for its balanced calcium and magnesium content, hardness and chemical stability, it is widely used across steel, glass, construction, agriculture and refractory applications as a versatile, cost-effective industrial raw material.",
    applications: [
      "Steel & iron flux",
      "Glass & ceramics manufacturing",
      "Construction & aggregates",
      "Soil conditioning & agriculture",
      "Refractory & foundry applications"
    ],
    keyBenefits: [
      "Balanced calcium and magnesium",
      "High hardness and stability",
      "Cost-effective raw material",
      "Consistent quality and purity"
    ],
    packaging: "50 kg bags; 1000 kg jumbo bags; bulk supply"
  },
  {
    id: "black-sulphur",
    name: "Black Sulphur",
    formula: "Industrial Sulphur",
    category: "Salts & Minerals",
    description: "Black Sulphur is an industrial-grade sulphur product supplied as dark granules or powder, valued for its high sulphur content and reactivity. Widely used in fertilisers, sulphuric acid production, rubber vulcanisation, dyes and agrochemicals, it serves as an essential, cost-effective raw material across chemical, agricultural and industrial manufacturing sectors.",
    applications: [
      "Sulphuric acid production",
      "Industrial & chemical processing",
      "Fertilisers & agriculture",
      "Rubber vulcanisation",
      "Dyes & agrochemicals"
    ],
    keyBenefits: [
      "High sulphur content",
      "Reactive and versatile",
      "Essential industrial raw material",
      "Cost-effective and reliable"
    ],
    packaging: "25 kg bags; 50 kg bags; bulk supply"
  }
];

export const FAQS = [
  {
    question: "How do I request a quotation for industrial chemicals?",
    answer: "You can request a quotation by clicking 'Enquire Now' on any product card, or by visiting our Contact page and filling out the enquiry form. Upon submitting, a pre-filled WhatsApp message will be generated for instant communication. You can also email us directly at info@unisterchemicalsl.in."
  },
  {
    question: "Do you supply chemicals across India?",
    answer: "Yes, we have a robust, dependable distribution network that ensures timely Pan-India supply and logistics, delivering products directly to your factory or warehouse."
  },
  {
    question: "What packaging sizes do you offer?",
    answer: "Our products are supplied in high-grade, durable industrial packaging tailored to customer requirements. Standard options include 25kg / 50kg bags, 30kg / 50kg carboys, 250kg drums, 1000kg/1.25MT IBC jumbo bags, and bulk tankers."
  },
  {
    question: "Are your products compliant with industry standards?",
    answer: "Absolutely. At Unistar Chemicals, every product undergoes strict quality assessment. We source exclusively from trusted, established chemical manufacturers, providing Certificate of Analysis (COA) and material logs upon request."
  },
  {
    question: "Can you provide customized chemical concentrations?",
    answer: "Yes, for liquid chemicals such as Hydrochloric Acid, Sodium Hypochlorite, and Sulphuric Acid, we can provide customized concentrations and dilutions based on your manufacturing processes and requirements."
  }
];
