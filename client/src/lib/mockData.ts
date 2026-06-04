// GovLens Mock Data — Malaysian States Government Spending
// All figures in Malaysian Ringgit (MYR), amounts in millions

export interface Project {
  id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  status: "ongoing" | "completed" | "planned";
  startDate: string;
  endDate: string;
  location: string;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface StateData {
  id: string;
  name: string;
  capital: string;
  population: number;
  area: number;
  totalAllocation: number;
  totalSpent: number;
  categories: SpendingCategory[];
  projects: Project[];
  stats: {
    activeProjects: number;
    completedProjects: number;
    citizenReports: number;
    activePetitions: number;
    satisfactionRate: number;
  };
  monthlySpending: { month: string; amount: number }[];
  yearlyBudget: { year: string; budget: number; spent: number }[];
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  state: string;
  category: string;
  signatures: number;
  target: number;
  status: "active" | "closed" | "won";
  createdAt: string;
  author: string;
  tags: string[];
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  state: string;
  category: string;
  options: { label: string; votes: number; color: string }[];
  totalVotes: number;
  endDate: string;
  status: "active" | "closed";
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  state: string;
  category: string;
  likes: number;
  replies: number;
  views: number;
  createdAt: string;
  tags: string[];
  trending: boolean;
}

export interface CitizenReport {
  id: string;
  title: string;
  description: string;
  category: "pothole" | "streetlight" | "road" | "sanitation" | "flooding" | "other";
  state: string;
  location: string;
  status: "pending" | "investigating" | "resolved";
  reportedAt: string;
  reporter: string;
  upvotes: number;
  imageUrl: string;
  imageAlt: string;
}

const COLORS = {
  infrastructure: "#0EA5E9",
  healthcare: "#22C55E",
  education: "#6366F1",
  utilities: "#F59E0B",
  transportation: "#EC4899",
  environment: "#14B8A6",
  community: "#8B5CF6",
  security: "#EF4444",
  agriculture: "#84CC16",
};

function generateProjects(stateName: string, count: number): Project[] {
  const projectTemplates = {
    infrastructure: [
      "Pembinaan Jambatan", "Naik Taraf Jalan Raya", "Pembangunan Kawasan Perindustrian",
      "Pembinaan Kompleks Sukan", "Naik Taraf Sistem Saliran"
    ],
    healthcare: [
      "Pembinaan Klinik Kesihatan", "Naik Taraf Hospital", "Program Vaksinasi Komuniti",
      "Perolehan Peralatan Perubatan", "Pusat Dialisis Baru"
    ],
    education: [
      "Pembinaan Sekolah Baru", "Naik Taraf Makmal Sains", "Program Biasiswa Negeri",
      "Pusat Latihan Kemahiran", "Perpustakaan Digital"
    ],
    transportation: [
      "Pembinaan Lebuh Raya", "Sistem Pengangkutan Awam", "Naik Taraf Terminal Bas",
      "Pembinaan Laluan Basikal", "Jambatan Baharu"
    ],
    environment: [
      "Program Penanaman Semula Hutan", "Pengurusan Sisa Pepejal", "Taman Ekologi Baru",
      "Sistem Rawatan Air", "Program Tenaga Boleh Baharu"
    ],
  };

  const categories = Object.keys(projectTemplates) as (keyof typeof projectTemplates)[];
  const statuses: Project["status"][] = ["ongoing", "completed", "planned"];

  return Array.from({ length: count }, (_, i) => {
    const cat = categories[i % categories.length];
    const templates = projectTemplates[cat];
    const budget = Math.floor(Math.random() * 450 + 50);
    const spentPct = Math.random() * 0.9 + 0.1;
    return {
      id: `${stateName.toLowerCase().replace(/\s/g, "-")}-proj-${i + 1}`,
      name: `${templates[i % templates.length]} ${stateName} Fasa ${(i % 3) + 1}`,
      category: cat,
      budget,
      spent: Math.floor(budget * spentPct),
      status: statuses[i % 3],
      startDate: `2023-0${(i % 9) + 1}-01`,
      endDate: `2025-${String((i % 12) + 1).padStart(2, "0")}-30`,
      location: `${stateName}, Malaysia`,
    };
  });
}

function generateMonthlySpending(): { month: string; amount: number }[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => ({
    month,
    amount: Math.floor(Math.random() * 800 + 200),
  }));
}

function generateYearlyBudget(): { year: string; budget: number; spent: number }[] {
  return ["2021", "2022", "2023", "2024", "2025"].map((year) => {
    const budget = Math.floor(Math.random() * 3000 + 2000);
    return { year, budget, spent: Math.floor(budget * (Math.random() * 0.3 + 0.65)) };
  });
}

function buildStateData(
  id: string,
  name: string,
  capital: string,
  population: number,
  area: number,
  totalAllocation: number
): StateData {
  const spent = Math.floor(totalAllocation * (Math.random() * 0.2 + 0.65));
  const catAmounts = [
    { name: "Infrastructure", color: COLORS.infrastructure, pct: 0.28 },
    { name: "Healthcare", color: COLORS.healthcare, pct: 0.18 },
    { name: "Education", color: COLORS.education, pct: 0.16 },
    { name: "Transportation", color: COLORS.transportation, pct: 0.14 },
    { name: "Utilities", color: COLORS.utilities, pct: 0.10 },
    { name: "Environment", color: COLORS.environment, pct: 0.07 },
    { name: "Community", color: COLORS.community, pct: 0.05 },
    { name: "Security", color: COLORS.security, pct: 0.02 },
  ];

  const categories: SpendingCategory[] = catAmounts.map((c) => ({
    name: c.name,
    amount: Math.floor(totalAllocation * c.pct),
    color: c.color,
    percentage: Math.round(c.pct * 100),
  }));

  return {
    id,
    name,
    capital,
    population,
    area,
    totalAllocation,
    totalSpent: spent,
    categories,
    projects: generateProjects(name, 12),
    stats: {
      activeProjects: Math.floor(Math.random() * 30 + 10),
      completedProjects: Math.floor(Math.random() * 80 + 20),
      citizenReports: Math.floor(Math.random() * 500 + 100),
      activePetitions: Math.floor(Math.random() * 20 + 5),
      satisfactionRate: Math.floor(Math.random() * 25 + 60),
    },
    monthlySpending: generateMonthlySpending(),
    yearlyBudget: generateYearlyBudget(),
  };
}

export const statesData: Record<string, StateData> = {
  perlis: buildStateData("perlis", "Perlis", "Kangar", 255000, 821, 1850),
  kedah: buildStateData("kedah", "Kedah", "Alor Setar", 2185000, 9425, 6200),
  penang: buildStateData("penang", "Pulau Pinang", "George Town", 1766000, 1048, 8400),
  perak: buildStateData("perak", "Perak", "Ipoh", 2498000, 21035, 9100),
  selangor: buildStateData("selangor", "Selangor", "Shah Alam", 6538000, 7960, 18500),
  "negeri-sembilan": buildStateData("negeri-sembilan", "Negeri Sembilan", "Seremban", 1128000, 6686, 5800),
  melaka: buildStateData("melaka", "Melaka", "Melaka City", 932000, 1664, 4900),
  johor: buildStateData("johor", "Johor", "Johor Bahru", 3765000, 19210, 14200),
  kelantan: buildStateData("kelantan", "Kelantan", "Kota Bharu", 1867000, 15099, 7100),
  terengganu: buildStateData("terengganu", "Terengganu", "Kuala Terengganu", 1181000, 12955, 6800),
  pahang: buildStateData("pahang", "Pahang", "Kuantan", 1673000, 35965, 8200),
  sabah: buildStateData("sabah", "Sabah", "Kota Kinabalu", 3543000, 73619, 16800),
  sarawak: buildStateData("sarawak", "Sarawak", "Kuching", 2818000, 124450, 22400),
  "kuala-lumpur": buildStateData("kuala-lumpur", "Kuala Lumpur", "Kuala Lumpur", 1982000, 243, 32000),
  putrajaya: buildStateData("putrajaya", "Putrajaya", "Putrajaya", 109000, 49, 4200),
  labuan: buildStateData("labuan", "Labuan", "Victoria", 99000, 92, 2100),
};

// Petitions
export const petitions: Petition[] = [
  {
    id: "p1",
    title: "Improve Public Transport Quality in the Klang Valley",
    description: "We urge the government to improve public bus frequency and coverage in the Klang Valley, especially in suburban areas that remain underserved.",
    state: "Selangor",
    category: "Transportation",
    signatures: 12450,
    target: 15000,
    status: "active",
    createdAt: "2025-01-15",
    author: "Ahmad Faizal",
    tags: ["transport", "public", "bus", "klang-valley"],
  },
  {
    id: "p2",
    title: "Build More Public Parks in Johor Bahru",
    description: "Green spaces in Johor Bahru are shrinking due to rapid development. We ask the state government to provide more public green areas for local communities.",
    state: "Johor",
    category: "Environment",
    signatures: 8920,
    target: 10000,
    status: "active",
    createdAt: "2025-02-03",
    author: "Siti Rahimah",
    tags: ["parks", "green-space", "johor-bahru", "environment"],
  },
  {
    id: "p3",
    title: "Upgrade Sultanah Bahiyah Hospital in Alor Setar",
    description: "Kedah's main hospital needs modern medical equipment and more specialist doctors to meet the needs of a growing population.",
    state: "Kedah",
    category: "Healthcare",
    signatures: 15680,
    target: 20000,
    status: "active",
    createdAt: "2024-12-10",
    author: "Dr. Mohd Hafiz",
    tags: ["hospital", "healthcare", "kedah", "medical"],
  },
  {
    id: "p4",
    title: "Repair Pothole-Damaged Roads in Ipoh",
    description: "Roads in East Ipoh are in poor condition, with many potholes that endanger motorists, motorcyclists, and pedestrians.",
    state: "Perak",
    category: "Infrastructure",
    signatures: 6340,
    target: 8000,
    status: "won",
    createdAt: "2024-10-05",
    author: "Tan Wei Ming",
    tags: ["roads", "potholes", "ipoh", "infrastructure"],
  },
  {
    id: "p5",
    title: "Scholarship Programme for B40 Students in Sabah",
    description: "Students from lower-income families in Sabah need more scholarship opportunities to continue their studies at tertiary level.",
    state: "Sabah",
    category: "Education",
    signatures: 22100,
    target: 25000,
    status: "active",
    createdAt: "2025-03-01",
    author: "Nurul Izzah",
    tags: ["scholarships", "education", "sabah", "b40"],
  },
  {
    id: "p6",
    title: "Stop Illegal Logging in Sarawak",
    description: "Illegal logging in Sarawak's forests threatens biodiversity and the livelihoods of Indigenous communities. We demand urgent enforcement action.",
    state: "Sarawak",
    category: "Environment",
    signatures: 31200,
    target: 50000,
    status: "active",
    createdAt: "2025-01-20",
    author: "James Dawat",
    tags: ["forest", "logging", "sarawak", "indigenous-communities"],
  },
];

// Votes
export const votes: Vote[] = [
  {
    id: "v1",
    title: "Best Way to Reduce Traffic Congestion in KL",
    description: "What is the best solution for reducing traffic congestion in Kuala Lumpur?",
    state: "Kuala Lumpur",
    category: "Transportation",
    options: [
      { label: "Expand MRT/LRT", votes: 4820, color: "#0EA5E9" },
      { label: "Add cycling lanes", votes: 2150, color: "#22C55E" },
      { label: "Limit private vehicles", votes: 1890, color: "#6366F1" },
      { label: "Mandate work from home", votes: 980, color: "#F59E0B" },
    ],
    totalVotes: 9840,
    endDate: "2025-06-30",
    status: "active",
  },
  {
    id: "v2",
    title: "Sabah Infrastructure Priorities for 2025",
    description: "Which infrastructure project is most urgently needed in Sabah in 2025?",
    state: "Sabah",
    category: "Infrastructure",
    options: [
      { label: "Rural roads", votes: 8920, color: "#0EA5E9" },
      { label: "Clean water supply", votes: 7340, color: "#22C55E" },
      { label: "Rural electricity", votes: 5680, color: "#F59E0B" },
      { label: "High-speed internet", votes: 4210, color: "#6366F1" },
    ],
    totalVotes: 26150,
    endDate: "2025-05-31",
    status: "active",
  },
  {
    id: "v3",
    title: "Most Important Environmental Programme for Penang",
    description: "Which environmental programme should the Penang state government prioritize?",
    state: "Penang",
    category: "Environment",
    options: [
      { label: "Solid waste management", votes: 3240, color: "#14B8A6" },
      { label: "Urban tree planting", votes: 2890, color: "#22C55E" },
      { label: "Plastic reduction", votes: 2450, color: "#0EA5E9" },
      { label: "Solar energy", votes: 1980, color: "#F59E0B" },
    ],
    totalVotes: 10560,
    endDate: "2025-07-15",
    status: "active",
  },
];

// Forum posts
export const forumPosts: ForumPost[] = [
  {
    id: "f1",
    title: "Using RapidKL Buses: Has the Service Improved?",
    content: "I have used RapidKL buses for five years. Over the past year, I have noticed better frequency on major routes, but suburban areas are still behind in schedules, coverage, and bus stop facilities. My suggestions are to add feeder buses, improve real-time arrival displays, and make routes to MRT or LRT stations easier to access.",
    author: "Khairul Anwar",
    state: "Selangor",
    category: "Transportation",
    likes: 234,
    replies: 67,
    views: 1820,
    createdAt: "2025-04-15",
    tags: ["bus", "public-transport", "rapidkl"],
    trending: true,
  },
  {
    id: "f2",
    title: "MRT3 Project: Benefit or Waste?",
    content: "With expected costs exceeding RM50 billion, is the MRT3 project truly necessary? I believe the spending should be assessed carefully so its benefits are balanced against the needs of rural communities. If the project proceeds, the government should publish cost breakdowns, implementation timelines, and expected user benefits openly.",
    author: "Lim Chee Keong",
    state: "Kuala Lumpur",
    category: "Infrastructure",
    likes: 456,
    replies: 128,
    views: 5640,
    createdAt: "2025-04-10",
    tags: ["mrt3", "infrastructure", "public-spending"],
    trending: true,
  },
  {
    id: "f3",
    title: "Water Quality in Kelantan: A Continuing Problem",
    content: "Residents in Kelantan still face problems with unsafe water supply. Although the government has promised to solve this issue, conditions remain unchanged in many housing areas. Priority should be given to replacing old pipes, upgrading water treatment plants, and publishing monthly progress reports that the public can monitor.",
    author: "Wan Zulaikha",
    state: "Kelantan",
    category: "Utilities",
    likes: 389,
    replies: 94,
    views: 3210,
    createdAt: "2025-04-08",
    tags: ["water", "kelantan", "utilities"],
    trending: true,
  },
  {
    id: "f4",
    title: "Success of Modern Farming Programmes in Kedah",
    content: "Modern farming programmes introduced in Kedah have shown encouraging results. Local farmers are now using drone technology and smart irrigation systems to monitor crops, reduce water waste, and improve paddy yields. Programmes like this should be expanded with technical training and maintenance support.",
    author: "Mohd Razif",
    state: "Kedah",
    category: "Agriculture",
    likes: 178,
    replies: 42,
    views: 1450,
    createdAt: "2025-04-05",
    tags: ["agriculture", "technology", "kedah"],
    trending: false,
  },
  {
    id: "f5",
    title: "Sarawak Tourism: Potential That Is Still Underdeveloped",
    content: "Sarawak has extraordinary tourism potential, but it is still underpromoted. Tropical rainforests, Indigenous cultures, and unique wildlife should be promoted more actively through digital campaigns, tourist-friendly infrastructure, and partnerships with local communities so economic benefits can be shared fairly.",
    author: "Dayang Suraya",
    state: "Sarawak",
    category: "Community",
    likes: 312,
    replies: 85,
    views: 2890,
    createdAt: "2025-04-01",
    tags: ["tourism", "sarawak", "culture"],
    trending: false,
  },
  {
    id: "f6",
    title: "Annual Flooding in Terengganu: Long-Term Solutions Needed",
    content: "Terengganu faces floods every year, causing major losses for residents and businesses. Outdated drainage systems and poorly planned development are key causes that must be addressed through long-term flood mitigation plans, regular maintenance, and stricter controls on development in high-risk areas.",
    author: "Roslan Hamid",
    state: "Terengganu",
    category: "Infrastructure",
    likes: 521,
    replies: 143,
    views: 6780,
    createdAt: "2025-03-28",
    tags: ["flooding", "terengganu", "infrastructure", "drainage"],
    trending: true,
  },
];

// Citizen reports
export const citizenReports: CitizenReport[] = [
  {
    id: "r1",
    title: "Large Pothole on Jalan Ampang, KL",
    description: "There is a large pothole about one metre wide on Jalan Ampang near the Jalan Tun Razak intersection. It is dangerous for road users.",
    category: "pothole",
    state: "Kuala Lumpur",
    location: "Jalan Ampang, Kuala Lumpur",
    status: "investigating",
    reportedAt: "2025-05-01",
    reporter: "Ahmad Zaki",
    upvotes: 45,
    imageUrl: "https://www.malaymail.com/malaymail/uploads/images/2022/11/17/69248.jpg",
    imageAlt: "A Malaysian road user repairing a pothole in Tanjong Karang",
  },
  {
    id: "r2",
    title: "Broken Streetlights in Taman Desa, KL",
    description: "Several streetlights in Taman Desa have not been working for more than two weeks. The area becomes dark and unsafe at night.",
    category: "streetlight",
    state: "Kuala Lumpur",
    location: "Taman Desa, Kuala Lumpur",
    status: "pending",
    reportedAt: "2025-05-03",
    reporter: "Nurul Hana",
    upvotes: 32,
    imageUrl: "https://images.unsplash.com/photo-1766198971304-32d71f18745c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Kuala Lumpur highway at night with road lights",
  },
  {
    id: "r3",
    title: "Uncollected Rubbish in SS2, Petaling Jaya",
    description: "Rubbish in the SS2 area has not been collected for five days, causing bad smells and health risks for nearby residents.",
    category: "sanitation",
    state: "Selangor",
    location: "SS2, Petaling Jaya, Selangor",
    status: "resolved",
    reportedAt: "2025-04-28",
    reporter: "Chen Wei Liang",
    upvotes: 78,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kudat_Sabah_Garbage-Collection-Truck-01.jpg",
    imageAlt: "Garbage collection truck in Kudat, Sabah, Malaysia",
  },
  {
    id: "r4",
    title: "Damaged Road Surface on Jalan Ipoh",
    description: "The road surface on Jalan Ipoh is in poor condition with many potholes. It has already caused several minor accidents.",
    category: "road",
    state: "Perak",
    location: "Jalan Ipoh, Perak",
    status: "investigating",
    reportedAt: "2025-05-05",
    reporter: "Rajendran Pillai",
    upvotes: 56,
    imageUrl: "https://apicms.thestar.com.my/uploads/images/2024/12/20/3077907.jpg",
    imageAlt: "Pothole on Jalan Ho Lok Park in Ipoh",
  },
  {
    id: "r5",
    title: "Flash Flooding in Taman Melawati",
    description: "Taman Melawati frequently experiences flash floods whenever there is heavy rain. The drainage system needs urgent upgrading.",
    category: "flooding",
    state: "Kuala Lumpur",
    location: "Taman Melawati, Kuala Lumpur",
    status: "pending",
    reportedAt: "2025-05-07",
    reporter: "Faridah Mohd",
    upvotes: 124,
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Floods_in_Kota_Tinggi_(December_2006_-_January_2007).jpg",
    imageAlt: "Flooded road area in Kota Tinggi, Johor",
  },
  {
    id: "r6",
    title: "Fallen Tree Blocking a Road in Kota Kinabalu",
    description: "A large tree fell after yesterday's storm and is blocking part of the road in the Likas area of Kota Kinabalu.",
    category: "other",
    state: "Sabah",
    location: "Likas, Kota Kinabalu, Sabah",
    status: "resolved",
    reportedAt: "2025-05-02",
    reporter: "Benedict Lim",
    upvotes: 19,
    imageUrl: "https://apicms.thestar.com.my/uploads/images/2024/05/25/2714590.jpg",
    imageAlt: "Fallen tree blocking a road in Bukit Gasing",
  },
];

// National summary stats
export const nationalStats = {
  totalBudget: 98500,
  totalSpent: 71200,
  activeProjects: 1842,
  completedProjects: 4230,
  citizenReports: 28450,
  activePetitions: 312,
  totalVotes: 1250000,
  satisfactionRate: 68,
};
