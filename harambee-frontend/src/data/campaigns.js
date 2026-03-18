export const CATEGORIES = [
  { id: "medical", label: "Medical" },
  { id: "education", label: "Education" },
  { id: "emergency", label: "Emergency" },
  { id: "memorial", label: "Memorial" },
  { id: "community", label: "Community" },
  { id: "wedding", label: "Wedding" },
  { id: "business", label: "Business" },
  { id: "church", label: "Church" },
];

export const CAMPAIGNS = [
  {
    id: 1,
    title: "Support Jane Muthoni's School Fees",
    slug: "jane-muthoni-school",
    category: "education",
    organizer: "Muthoni Family",
    location: "Kiambu, Kenya",
    target: 120000,
    raised: 85000,
    donors: 156,
    daysLeft: 25,
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
    description:
      "Jane Muthoni, Form 2 student at Kiambu High School, needs KES 120,000 for school fees, uniform and books for the coming term. Her single mother works as a househelp and cannot afford the fees.",
    story:
      "Jane is a bright student who scored B+ in her KCPE exams. She dreams of becoming a doctor to help people in her community. The family lives in a single room in Juja and her mother earns KES 12,000 per month.\n\nSchool reopens in 3 weeks. Without the fees, Jane will miss another term.",
    updates: [
      { date: "April 5, 2024", text: "Thank you! Jane has been admitted and is preparing for school. Uniform and books purchased." },
    ],
    recentDonors: [
      { name: "Anonymous", amount: 2000, time: "1 hour ago" },
      { name: "Kiambu Teachers SACCO", amount: 15000, time: "2 days ago" },
      { name: "Cousin in US", amount: 5000, time: "4 hours ago" },
    ],
  },
  {
    id: 2,
    title: "Rebuild Mukuru Slum Clinic After Fire",
    slug: "mukuru-clinic-fire",
    category: "community",
    organizer: "Mukuru Community Health",
    location: "Nairobi, Kenya",
    target: 800000,
    raised: 523000,
    donors: 289,
    daysLeft: 12,
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&h=400&fit=crop",
    description:
      "Last week's fire destroyed our community clinic serving 5,000 residents in Mukuru. We need to rebuild basic facilities for maternal care, vaccinations and daily medicine.",
    story:
      "Mukuru Kwa Njenga Clinic has been serving the slum since 2015. The fire destroyed medicines, beds and equipment worth KES 800,000. Pregnant women and children are now walking 5km to the nearest facility.\n\nWe need to restore services within 2 weeks.",
    updates: [
      { date: "April 10, 2024", text: "Temporary tent clinic operational. First vaccinations given to 120 children today." },
    ],
    recentDonors: [
      { name: "Anonymous", amount: 1000, time: "30 mins ago" },
      { name: "Nairobi County Gov", amount: 100000, time: "1 day ago" },
      { name: "Local business", amount: 5000, time: "3 hours ago" },
    ],
  },
  {
    id: 3,
    title: "Joseph's Leg Surgery - Motorcycle Accident",
    slug: "joseph-leg-surgery",
    category: "medical",
    organizer: "Joseph's Family",
    location: "Mombasa, Kenya",
    target: 450000,
    raised: 289000,
    donors: 134,
    daysLeft: 8,
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=400&fit=crop",
    description:
      "Joseph, 28, bodaboda rider from Likoni, broke his leg in accident. Needs surgery at Coast General Hospital. Family has spent all savings on initial treatment.",
    story:
      "Joseph is sole breadwinner for family of 5. His KES 800/day income stopped after accident. Doctors say surgery (KES 450,000) is needed to save the leg and restore mobility.",
    updates: [
      { date: "April 12, 2024", text: "Joseph admitted to Coast General. Surgery scheduled for next week. Thank you donors." },
    ],
    recentDonors: [
      { name: "Bodaboda Sacco", amount: 20000, time: "5 hours ago" },
      { name: "Anonymous", amount: 1000, time: "1 hour ago" },
    ],
  },
  {
    id: 4,
    title: "Kiosk Expansion - Mama Mboga Thika",
    slug: "mama-mboga-thika",
    category: "business",
    organizer: "Fatuma Ali",
    location: "Thika, Kenya",
    target: 150000,
    raised: 98000,
    donors: 67,
    daysLeft: 35,
    verified: false,
    featured: false,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
    description:
      "Mama Fatuma sells vegetables daily in Thika market. Wants to expand kiosk with refrigeration to stock more produce and increase daily sales from KES 2,000 to KES 5,000.",
    story: "Fatuma has sold vegetables for 12 years, raising 4 children alone. Kiosk expansion will double income and provide better produce to community.",
    updates: [],
    recentDonors: [
      { name: "Neighbor", amount: 2000, time: "2 days ago" },
    ],
  },
  {
    id: 5,
    title: "Burial Expenses for Mama Grace - Kitale",
    slug: "mama-grace-burial",
    category: "memorial",
    organizer: "Grace Family",
    location: "Kitale, Kenya",
    target: 120000,
    raised: 95000,
    donors: 123,
    daysLeft: 4,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    description:
      "Grace Wanjala passed away suddenly. Family needs funds for transport, coffin and burial ceremony in Kitale.",
    story: "Grace, 58, mother of 6, passed after short illness. Husband retired, children struggling to raise KES 120,000 needed.",
    updates: [],
    recentDonors: [
      { name: "Church group", amount: 10000, time: "4 hours ago" },
    ],
  },
  {
    id: 6,
    title: "Church Roof Repair - Zion Chapel Meru",
    slug: "zion-chapel-roof",
    category: "church",
    organizer: "Zion Chapel Committee",
    location: "Meru, Kenya",
    target: 350000,
    raised: 187000,
    donors: 245,
    daysLeft: 28,
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&h=400&fit=crop",
    description:
      "Leaking roof during rains disrupts services for 450 member congregation. Need iron sheets and labour to repair before next rainy season.",
    story: "Zion Chapel has served Meru community for 30 years. Recent heavy rains damaged roof, making Sunday services uncomfortable.",
    updates: [
      { date: "April 8, 2024", text: "Labour secured. Materials ordered. Work starts next week." },
    ],
    recentDonors: [
      { name: "Local farmer", amount: 5000, time: "1 day ago" },
    ],
  },
];

/* STATS removed */

export const TESTIMONIALS = [
  {
    name: "Mary Wangeci",
    location: "Nairobi",
    text: "Harambee helped me raise over KES 900,000 for my husband's heart surgery in just 3 weeks. The M-Pesa integration made it so easy for people to donate.",
    avatar: "MW",
    raised: "KES 912,000",
  },
  {
    name: "Pastor David Kipchumba",
    location: "Eldoret",
    text: "We used Harambee for our church building fund. The transparency tools helped our congregation trust where every shilling was going.",
    avatar: "DK",
    raised: "KES 2.1M",
  },
  {
    name: "Amina Hassan",
    location: "Mombasa",
    text: "As a diaspora Kenyan in the UK, I can finally support harambees back home with a simple click. No bank transfers, no delays.",
    avatar: "AH",
    raised: "Multiple donations",
  },
];