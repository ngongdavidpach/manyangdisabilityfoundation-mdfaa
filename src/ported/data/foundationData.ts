export interface Program {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  image: string;
  impactStats: string;
  category: "mobility" | "healthcare" | "education" | "livelihood" | "advocacy";
}

export interface SuccessStory {
  id: string;
  name: string;
  age: number;
  location: string;
  title: string;
  story: string;
  quote: string;
  image: string;
  aidType: string;
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "donations" | "assistance" | "volunteering";
}

export interface GalleryImage {
  id: string;
  title: string;
  location: string;
  category: "mobility" | "medical" | "education" | "livelihood";
  url: string;
  date: string;
  description: string;
}

export interface FoundationEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "upcoming" | "past";
  category: string;
  description: string;
  image: string;
  registrationLink?: string;
  seatsAvailable?: number;
}

export const FOUNDATION_INFO = {
  name: "Manyang Disability Foundation",
  shortName: "MDF",
  tagline: "Empowering Abilities, Restoring Dignity, Transforming Lives",
  mission:
    "To provide essential mobility aids, comprehensive healthcare access, inclusive education, and sustainable livelihood opportunities to vulnerable individuals and persons with disabilities, ensuring they live with utmost dignity and independence.",
  vision:
    "A fully inclusive society where individuals of all abilities have barrier-free access to opportunities, active community involvement, and the resources to achieve their maximum potential.",
  email: "info@manyangdisabilityfoundation.org",
  phone: "+1 (555) 382-9104",
  altPhone: "+237 670 123 456",
  address: "MDF Headquarters, Inclusion Plaza, Suite 400",
  workingHours: "Monday - Friday: 8:00 AM - 5:00 PM",
  socials: {
    facebook: "https://www.facebook.com/p/Manyang-Disability-Foundation-100079732670624/",
    twitter: "https://twitter.com/ManyangFoundation",
    linkedin: "https://linkedin.com/company/manyang-disability-foundation",
    instagram: "https://instagram.com/manyangdisabilityfoundation",
  },
};

export const IMPACT_METRICS = [
  { id: "wheelchairs", label: "Wheelchairs & Aids Distributed", value: "1,450+", icon: "Wheelchair" },
  { id: "lives", label: "Direct Beneficiaries Impacted", value: "5,200+", icon: "Users" },
  { id: "medical", label: "Medical & Rehab Sessions Funded", value: "3,600+", icon: "HeartPulse" },
  { id: "volunteers", label: "Active Global & Local Volunteers", value: "320+", icon: "HeartHandshake" },
];

export const PROGRAMS: Program[] = [
  {
    id: "mobility-aids",
    title: "Mobility & Assistive Devices",
    shortDescription:
      "Providing premium custom wheelchairs, tricycles, crutches, and direct technical repair grants to restore immediate independence.",
    fullDescription:
      "Mobility is a fundamental human right. Our flagship initiative directly addresses the mobility crisis by manufacturing, procuring, and adapting state-of-the-art wheelchairs and mobility tricycles tailored to the rough terrains of developing communities. We also host direct mobile repair workshops—such as our recent intervention providing critical cash and resources to repair broken mobility devices—ensuring beneficiaries can maintain their independence for the long haul.",
    iconName: "Wheelchair",
    image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=1200&q=80",
    impactStats: "1,450+ devices distributed and repaired",
    category: "mobility",
  },
  {
    id: "healthcare-rehab",
    title: "Healthcare & Rehabilitation",
    shortDescription:
      "Subsidizing specialized surgical interventions, continuous physical therapy, and chronic medication for disabled individuals.",
    fullDescription:
      "Access to continuous and specialized healthcare is often financially out of reach for vulnerable families. We partner with local tertiary hospitals and private physical therapists to fully sponsor reconstructive surgeries, provide custom orthotics and prosthetics, and run weekly community-based rehabilitation camps. Our preventative health program also conducts widespread screenings to provide timely intervention.",
    iconName: "HeartPulse",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    impactStats: "3,600+ physical therapy & medical sessions",
    category: "healthcare",
  },
  {
    id: "inclusive-education",
    title: "Inclusive Education Grants",
    shortDescription:
      "Awarding comprehensive academic scholarships, accessible learning technology, and school integration aids.",
    fullDescription:
      "Education breaks the cycle of multi-generational poverty. The MDF Inclusive Education program covers tuition fees, textbooks, specialized sign language and braille resources, and digital learning tools for children with physical and sensory disabilities. We actively advocate alongside partner school boards to retrofit classrooms with access ramps and accessible sanitation facilities.",
    iconName: "GraduationCap",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
    impactStats: "850+ active student scholars",
    category: "education",
  },
  {
    id: "livelihood-skills",
    title: "Livelihood & Skills Training",
    shortDescription:
      "Empowering adults with disabilities through micro-grants, vocational craft workshops, and digital literacy bootcamps.",
    fullDescription:
      "Economic self-reliance transforms how society views persons with disabilities. We run fully equipped vocational training hubs teaching computer programming, tailoring, shoe-making, sustainable agriculture, and electronic repairs. Graduates receive a complete 'Startup Kit' and zero-interest micro-loans to launch their own local enterprises.",
    iconName: "Briefcase",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    impactStats: "520+ entrepreneurs funded",
    category: "livelihood",
  },
  {
    id: "rights-advocacy",
    title: "Rights, Policy & Advocacy",
    shortDescription:
      "Championing legal accessibility rights, anti-discrimination frameworks, and community sensitization campaigns.",
    fullDescription:
      "True inclusion requires systemic change. We organize high-impact civic workshops, radio talk shows, and legal aid clinics to educate the public on the inherent dignity and legal rights of persons with disabilities. We work closely with municipal planners to enforce universal design codes in public transport and state buildings.",
    iconName: "Scale",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    impactStats: "45+ municipal policies influenced",
    category: "advocacy",
  },
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    name: "Yii Emmanuel",
    age: 34,
    location: "Bamenda",
    title: "Back on the Move: Restoring Independence",
    story:
      "For over two years, Yii's primary custom wheelchair suffered severe mechanical structural damage, leaving him effectively homebound and unable to run his neighborhood convenience stand. Manyang Disability Foundation's Rapid Response team intervened by providing immediate financial direct grants and technical hardware support to overhaul and restore his custom wheelchair. Today, Yii is fully mobile, his small enterprise is thriving, and he actively mentors newly injured youth in his district.",
    quote:
      "The foundation didn't just repair the metal and wheels of my chair; they restored my ability to provide for my family with dignity.",
    image: "https://images.unsplash.com/photo-1565706596465-b1a82f3c7e09?auto=format&fit=crop&w=800&q=80",
    aidType: "Mobility Aid & Repair Grant",
    date: "January 2026",
  },
  {
    id: "story-2",
    name: "Grace Achieng",
    age: 12,
    location: "Nairobi Outskirts",
    title: "Breaking Classroom Barriers",
    story:
      "Born with cerebral palsy, Grace faced immense rejection from mainstream primary institutions that lacked accessible desks and trained special-needs aides. Through MDF's Inclusive Education Grant, Grace received a customized supportive positioning chair, full annual tuition coverage, and a specialized tablet. She recently finished top of her class in natural sciences.",
    quote: "I love going to school because now I can sit comfortably and raise my hand just like all my friends.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    aidType: "Inclusive Education Scholarship",
    date: "November 2025",
  },
  {
    id: "story-3",
    name: "David Pach",
    age: 28,
    location: "Douala",
    title: "From Beneficiary to Master Tailor",
    story:
      "After losing his lower limb in a severe traffic accident, David struggled with severe depression and unemployment. He enrolled in the Manyang Disability Foundation's 6-month intensive tailoring and textile design workshop. Upon graduating with honors, the foundation provided him with a fully motorized industrial sewing machine and initial shop rental assistance.",
    quote:
      "Disability is not inability. With the right tools and someone who believes in you, you can stitch together a completely new destiny.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    aidType: "Livelihood & Skills Grant",
    date: "August 2025",
  },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "MDF Distributes Emergency Wheelchair Repair Grants to Local Communities",
    summary:
      "In a dedicated outreach initiative, Manyang Disability Foundation directly disbursed financial grants and replacement toolkits to over 40 individuals with damaged assistive mobility devices.",
    content:
      "Mobility devices endure incredible wear and tear, especially in rural and semi-urban settings where paved walkways are scarce. Recognizing that a broken wheelchair can instantly halt a person's livelihood, the Manyang Disability Foundation launched its 'Keep Moving' emergency intervention this month.\n\nVolunteers and certified biomedical technicians set up pop-up repair stations across three major districts. Beneficiaries received brand new all-terrain caster wheels, heavy-duty upholstery replacements, and direct cash stipends to cover localized welding for cracked metallic frames. Among the recipients was local vendor Yii, whose restored wheelchair now allows him back into the vibrant central market.\n\n'Our ongoing commitment is to ensure no one is left behind simply because of a mechanical failure,' stated the Program Director. The foundation plans to make these mobile repair clinics a permanent bi-monthly feature.",
    date: "February 14, 2026",
    author: "Communications Team",
    category: "Field Outreach",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
  },
  {
    id: "news-2",
    title: "Annual Inclusive Livelihoods Empowerment Summit Concludes with 120 New Grantees",
    summary:
      "Entrepreneurs with disabilities receive startup capital, digital point-of-sale systems, and comprehensive business mentorship to foster financial independence.",
    content:
      "The vibrant halls of the Inclusion Plaza played host to the 4th Annual MDF Livelihoods Empowerment Summit. Over the course of three days, 120 aspiring entrepreneurs with various physical and sensory disabilities underwent intensive masterclasses covering cooperative financial management, micro-marketing, and digital client acquisition.\n\nThe climax of the event featured the distribution of the MDF Enterprise Seed Grants. Each graduate was awarded tailored asset kits ranging from high-yield agricultural seed stocks to professional graphic design workstations. Partnering micro-finance executives were also on hand to offer zero-collateral credit lines, creating a robust ecosystem for sustainable growth.",
    date: "January 28, 2026",
    author: "David N. Pach",
    category: "Economic Empowerment",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
  },
  {
    id: "news-3",
    title: "MDF Partners with Regional Health Boards to Expand Free Physical Therapy Camps",
    summary:
      "A ground-breaking memorandum of understanding will see certified physical therapists deployed directly to remote community centers.",
    content:
      "For many families raising children with congenital conditions such as spina bifida or cerebral palsy, traveling to central city hospitals for weekly physical therapy is a logistical and financial impossibility. To bridge this critical gap, the Manyang Disability Foundation has officially ratified a new strategic alliance with regional health directorates.\n\nStarting next quarter, mobile health vans equipped with state-of-the-art neuro-rehabilitation gear will make scheduled weekly visits to five underserved peripheral municipalities. The program will also train primary family caregivers in essential daily home-exercise routines to accelerate muscular development and prevent joint contractures.",
    date: "December 10, 2025",
    author: "Medical Advisory Board",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    readTime: "3 min read",
  },
];

export const FAQS: FAQItem[] = [
  {
    question: "Who is eligible to receive assistance from the Manyang Disability Foundation?",
    answer:
      "Any individual living with a physical, sensory, or intellectual disability who faces socio-economic hardship is eligible to apply. We prioritize vulnerable children, single mothers with disabled dependents, and individuals whose immediate livelihoods are hindered by a lack of assistive devices or medical care.",
    category: "assistance",
  },
  {
    question: "How can I request a wheelchair or medical support?",
    answer:
      "You can submit a direct application through our online 'Request Assistance' portal. Alternatively, applications can be filed in person at our central headquarters or through our recognized community liaison officers. Every application is reviewed by our intake committee within 7-10 business days.",
    category: "assistance",
  },
  {
    question: "Are my donations tax-deductible?",
    answer:
      "Yes! Manyang Disability Foundation operates as a registered non-profit charitable organization. All direct donations receive an official itemized receipt containing our tax identification details, which can be used for tax deduction purposes in applicable jurisdictions.",
    category: "donations",
  },
  {
    question: "Where does the foundation operate?",
    answer:
      "While our core primary interventions are concentrated in Sub-Saharan Africa (including active chapters in Cameroon and Kenya), our advocacy and digital skill-building networks welcome beneficiaries and partners globally.",
    category: "general",
  },
  {
    question: "How can I volunteer if I don't have a medical background?",
    answer:
      "We rely on a diverse spectrum of skills! You can contribute by offering digital mentorship, assisting with grant writing, organizing local community fundraising drives, providing administrative support, or participating in our physical field distribution days.",
    category: "volunteering",
  },
  {
    question: "How does the foundation ensure financial transparency?",
    answer:
      "Transparency is our foundational bedrock. We publish comprehensive quarterly financial disclosures and an annual independently audited impact report. Furthermore, donors can opt to track the exact lifecycle of their specific capital grants, from procurement to the final smiling beneficiary.",
    category: "donations",
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "gal-1",
    title: "All-Terrain Wheelchair Custom Fitting",
    location: "Bamenda Outreach Camp",
    category: "mobility",
    url: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=1200&q=80",
    date: "February 2026",
    description:
      "Local biomechanical specialists configure deep-tread rugged wheels for unpaved rural terrain, providing durable independence.",
  },
  {
    id: "gal-2",
    title: "Mobile Emergency Repair Workshop",
    location: "Ngong Community Square",
    category: "mobility",
    url: "https://images.unsplash.com/photo-1565706596465-b1a82f3c7e09?auto=format&fit=crop&w=1200&q=80",
    date: "January 2026",
    description:
      "Technicians welding broken cross-braces and replacing caster assemblies to return beneficiaries to their daily trade.",
  },
  {
    id: "gal-3",
    title: "Post-Surgical Physical Therapy Camp",
    location: "Douala General Annex",
    category: "medical",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    date: "December 2025",
    description:
      "Children receiving free specialized neuro-muscular rehabilitation and tailored gait training with supportive rails.",
  },
  {
    id: "gal-4",
    title: "Inclusive Digital Learning Kits",
    location: "Nairobi Primary Board",
    category: "education",
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
    date: "November 2025",
    description:
      "Distribution of adapted tablet stands and braille-compatible input keyboards for primary integration.",
  },
  {
    id: "gal-5",
    title: "Vocational Craft & Tailoring Graduation",
    location: "Inclusion Plaza Hub",
    category: "livelihood",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    date: "October 2025",
    description:
      "Entrepreneurs proudly receiving fully automated stitching machines and brand new shop rental stipends.",
  },
  {
    id: "gal-6",
    title: "Community Sensitization & Rights Rally",
    location: "Yaoundé Civic Garden",
    category: "mobility",
    url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
    date: "September 2025",
    description:
      "Advocating alongside municipal state planners to enforce mandatory access ramps and accessible transit routes.",
  },
];

export const FOUNDATION_EVENTS: FoundationEvent[] = [
  {
    id: "evt-1",
    title: "Spring Global Assistive Device Distribution Day",
    date: "March 28, 2026",
    time: "09:00 AM - 04:00 PM",
    location: "Inclusion Plaza & Regional Outreach Annexes",
    type: "upcoming",
    category: "Mobility Aid Provision",
    description:
      "Our largest quarterly intervention. Over 250 verified applicants will be custom-fitted with bespoke all-terrain manual wheelchairs and hand-cranked tricycles. Volunteers are highly encouraged to join our logistics and welcoming committees.",
    image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=1200&q=80",
    registrationLink: "#",
    seatsAvailable: 45,
  },
  {
    id: "evt-2",
    title: "Inclusive Enterprise & Startup Pitch Forum",
    date: "April 15, 2026",
    time: "10:00 AM - 02:00 PM",
    location: "MDF Headquarters, Suite 400",
    type: "upcoming",
    category: "Livelihood & Skills",
    description:
      "Graduates from our digital literacy and leather-craft workshops will pitch their neighborhood business concepts directly to an expert panel of non-profit investors. Zero-interest seed funding kits will be directly awarded.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    registrationLink: "#",
    seatsAvailable: 18,
  },
  {
    id: "evt-3",
    title: "Bi-Monthly Emergency Mobile Repair Bootcamp",
    date: "May 02, 2026",
    time: "08:00 AM - 05:00 PM",
    location: "Ngong District Medical Grounds",
    type: "upcoming",
    category: "Technical Upkeep",
    description:
      "A specialized pop-up workshop where certified biomedical engineers overhaul broken frames, replace puncture-proof casters, and disburse local mechanical repair grants. Free preventative health screenings included.",
    image: "https://images.unsplash.com/photo-1565706596465-b1a82f3c7e09?auto=format&fit=crop&w=1200&q=80",
    registrationLink: "#",
    seatsAvailable: 30,
  },
  {
    id: "evt-4",
    title: "Annual Inclusive Education Summit",
    date: "January 10, 2026",
    time: "09:00 AM - 03:00 PM",
    location: "Nairobi Central Conference Center",
    type: "past",
    category: "Inclusive Education",
    description:
      "Brought together 80+ school administrators and special needs educators to ratify universal access guidelines and distribute 300+ custom accessible learning toolkits.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "evt-5",
    title: "Winter Free Pediatric Orthopedic Assessment Camp",
    date: "November 22, 2025",
    time: "08:00 AM - 06:00 PM",
    location: "Douala General Hospital Wing",
    type: "past",
    category: "Healthcare Access",
    description:
      "Over 400 children with congenital mobility and neuro-muscular conditions were fully assessed. 65 complex reconstructive surgeries were fully subsidized by the foundation.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  },
];
