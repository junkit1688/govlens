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
    title: "Tingkatkan Kualiti Pengangkutan Awam di Lembah Klang",
    description: "Kami menuntut kerajaan untuk meningkatkan frekuensi dan liputan bas awam di Lembah Klang, terutamanya di kawasan pinggir bandar yang kurang mendapat perkhidmatan.",
    state: "Selangor",
    category: "Transportation",
    signatures: 12450,
    target: 15000,
    status: "active",
    createdAt: "2025-01-15",
    author: "Ahmad Faizal",
    tags: ["pengangkutan", "awam", "bas", "lembah-klang"],
  },
  {
    id: "p2",
    title: "Bina Lebih Banyak Taman Awam di Johor Bahru",
    description: "Kawasan hijau di Johor Bahru semakin berkurangan akibat pembangunan pesat. Kami memohon kerajaan negeri untuk menyediakan lebih banyak ruang hijau untuk komuniti.",
    state: "Johor",
    category: "Environment",
    signatures: 8920,
    target: 10000,
    status: "active",
    createdAt: "2025-02-03",
    author: "Siti Rahimah",
    tags: ["taman", "hijau", "johor-bahru", "alam-sekitar"],
  },
  {
    id: "p3",
    title: "Naik Taraf Hospital Sultanah Bahiyah Alor Setar",
    description: "Hospital utama di Kedah memerlukan peralatan perubatan moden dan penambahan bilangan doktor pakar untuk memenuhi keperluan penduduk yang semakin meningkat.",
    state: "Kedah",
    category: "Healthcare",
    signatures: 15680,
    target: 20000,
    status: "active",
    createdAt: "2024-12-10",
    author: "Dr. Mohd Hafiz",
    tags: ["hospital", "kesihatan", "kedah", "perubatan"],
  },
  {
    id: "p4",
    title: "Pembaikan Jalan Berlubang di Ipoh",
    description: "Jalan-jalan di kawasan Ipoh Timur dalam keadaan yang sangat teruk dengan banyak lubang yang membahayakan pengguna jalan raya.",
    state: "Perak",
    category: "Infrastructure",
    signatures: 6340,
    target: 8000,
    status: "won",
    createdAt: "2024-10-05",
    author: "Tan Wei Ming",
    tags: ["jalan", "lubang", "ipoh", "infrastruktur"],
  },
  {
    id: "p5",
    title: "Program Biasiswa untuk Pelajar B40 Sabah",
    description: "Pelajar dari keluarga berpendapatan rendah di Sabah memerlukan lebih banyak peluang biasiswa untuk meneruskan pengajian ke peringkat tertiari.",
    state: "Sabah",
    category: "Education",
    signatures: 22100,
    target: 25000,
    status: "active",
    createdAt: "2025-03-01",
    author: "Nurul Izzah",
    tags: ["biasiswa", "pendidikan", "sabah", "b40"],
  },
  {
    id: "p6",
    title: "Hentikan Pembalakan Haram di Sarawak",
    description: "Aktiviti pembalakan haram di kawasan hutan Sarawak mengancam biodiversiti dan kehidupan komuniti Orang Asal. Kami menuntut tindakan segera.",
    state: "Sarawak",
    category: "Environment",
    signatures: 31200,
    target: 50000,
    status: "active",
    createdAt: "2025-01-20",
    author: "James Dawat",
    tags: ["hutan", "pembalakan", "sarawak", "orang-asal"],
  },
];

// Votes
export const votes: Vote[] = [
  {
    id: "v1",
    title: "Kaedah Terbaik Mengurangkan Kesesakan Lalu Lintas KL",
    description: "Apakah penyelesaian terbaik untuk mengatasi masalah kesesakan lalu lintas di Kuala Lumpur?",
    state: "Kuala Lumpur",
    category: "Transportation",
    options: [
      { label: "Kembangkan MRT/LRT", votes: 4820, color: "#0EA5E9" },
      { label: "Tambah Laluan Basikal", votes: 2150, color: "#22C55E" },
      { label: "Kawalan Kenderaan Persendirian", votes: 1890, color: "#6366F1" },
      { label: "Kerja Dari Rumah Wajib", votes: 980, color: "#F59E0B" },
    ],
    totalVotes: 9840,
    endDate: "2025-06-30",
    status: "active",
  },
  {
    id: "v2",
    title: "Keutamaan Pembangunan Infrastruktur Sabah 2025",
    description: "Apakah projek infrastruktur yang paling diperlukan di Sabah pada tahun 2025?",
    state: "Sabah",
    category: "Infrastructure",
    options: [
      { label: "Jalan Raya Pedalaman", votes: 8920, color: "#0EA5E9" },
      { label: "Bekalan Air Bersih", votes: 7340, color: "#22C55E" },
      { label: "Elektrik Luar Bandar", votes: 5680, color: "#F59E0B" },
      { label: "Internet Berkelajuan Tinggi", votes: 4210, color: "#6366F1" },
    ],
    totalVotes: 26150,
    endDate: "2025-05-31",
    status: "active",
  },
  {
    id: "v3",
    title: "Program Alam Sekitar Terpenting Pulau Pinang",
    description: "Program alam sekitar manakah yang perlu diutamakan oleh kerajaan negeri Pulau Pinang?",
    state: "Pulau Pinang",
    category: "Environment",
    options: [
      { label: "Pengurusan Sisa Pepejal", votes: 3240, color: "#14B8A6" },
      { label: "Penanaman Pokok Bandar", votes: 2890, color: "#22C55E" },
      { label: "Pengurangan Plastik", votes: 2450, color: "#0EA5E9" },
      { label: "Tenaga Solar", votes: 1980, color: "#F59E0B" },
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
    title: "Pengalaman Menggunakan Perkhidmatan Bas RapidKL — Adakah Ia Bertambah Baik?",
    content: "Saya telah menggunakan bas RapidKL selama 5 tahun. Dalam tempoh setahun ini, saya perasan ada peningkatan dalam frekuensi bas di laluan utama, tetapi kawasan pinggir bandar masih ketinggalan...",
    author: "Khairul Anwar",
    state: "Selangor",
    category: "Transportation",
    likes: 234,
    replies: 67,
    views: 1820,
    createdAt: "2025-04-15",
    tags: ["bas", "pengangkutan-awam", "rapidkl"],
    trending: true,
  },
  {
    id: "f2",
    title: "Projek MRT3 — Manfaat atau Pembaziran?",
    content: "Dengan kos yang dijangkakan melebihi RM50 bilion, adakah projek MRT3 benar-benar diperlukan? Saya percaya wang tersebut lebih baik digunakan untuk meningkatkan infrastruktur luar bandar...",
    author: "Lim Chee Keong",
    state: "Kuala Lumpur",
    category: "Infrastructure",
    likes: 456,
    replies: 128,
    views: 5640,
    createdAt: "2025-04-10",
    tags: ["mrt3", "infrastruktur", "perbelanjaan-awam"],
    trending: true,
  },
  {
    id: "f3",
    title: "Kualiti Air di Kelantan — Masalah Berterusan",
    content: "Penduduk Kelantan masih menghadapi masalah bekalan air yang tidak bersih. Walaupun kerajaan telah berjanji untuk menyelesaikan masalah ini, situasi masih tidak berubah...",
    author: "Wan Zulaikha",
    state: "Kelantan",
    category: "Utilities",
    likes: 389,
    replies: 94,
    views: 3210,
    createdAt: "2025-04-08",
    tags: ["air", "kelantan", "utiliti"],
    trending: true,
  },
  {
    id: "f4",
    title: "Kejayaan Program Pertanian Moden di Kedah",
    content: "Program pertanian moden yang diperkenalkan di Kedah telah menunjukkan hasil yang menggalakkan. Petani-petani tempatan kini menggunakan teknologi drone dan sistem pengairan pintar...",
    author: "Mohd Razif",
    state: "Kedah",
    category: "Agriculture",
    likes: 178,
    replies: 42,
    views: 1450,
    createdAt: "2025-04-05",
    tags: ["pertanian", "teknologi", "kedah"],
    trending: false,
  },
  {
    id: "f5",
    title: "Pelancongan Sarawak — Potensi yang Belum Diterokai Sepenuhnya",
    content: "Sarawak mempunyai potensi pelancongan yang luar biasa tetapi masih kurang diketengahkan. Hutan hujan tropika, budaya Orang Asal, dan hidupan liar yang unik perlu dipromosikan lebih agresif...",
    author: "Dayang Suraya",
    state: "Sarawak",
    category: "Community",
    likes: 312,
    replies: 85,
    views: 2890,
    createdAt: "2025-04-01",
    tags: ["pelancongan", "sarawak", "budaya"],
    trending: false,
  },
  {
    id: "f6",
    title: "Isu Banjir Tahunan di Terengganu — Penyelesaian Jangka Panjang Diperlukan",
    content: "Setiap tahun Terengganu dilanda banjir yang menyebabkan kerugian besar. Sistem perparitan yang usang dan pembangunan tidak terancang adalah punca utama...",
    author: "Roslan Hamid",
    state: "Terengganu",
    category: "Infrastructure",
    likes: 521,
    replies: 143,
    views: 6780,
    createdAt: "2025-03-28",
    tags: ["banjir", "terengganu", "infrastruktur", "saliran"],
    trending: true,
  },
];

// Citizen reports
export const citizenReports: CitizenReport[] = [
  {
    id: "r1",
    title: "Lubang Besar di Jalan Ampang, KL",
    description: "Terdapat lubang besar berukuran lebih kurang 1 meter di Jalan Ampang berhampiran persimpangan dengan Jalan Tun Razak. Membahayakan pengguna jalan raya.",
    category: "pothole",
    state: "Kuala Lumpur",
    location: "Jalan Ampang, Kuala Lumpur",
    status: "investigating",
    reportedAt: "2025-05-01",
    reporter: "Ahmad Zaki",
    upvotes: 45,
  },
  {
    id: "r2",
    title: "Lampu Jalan Rosak di Taman Desa, KL",
    description: "Beberapa lampu jalan di Taman Desa tidak berfungsi selama lebih 2 minggu. Kawasan ini menjadi gelap dan tidak selamat pada waktu malam.",
    category: "streetlight",
    state: "Kuala Lumpur",
    location: "Taman Desa, Kuala Lumpur",
    status: "pending",
    reportedAt: "2025-05-03",
    reporter: "Nurul Hana",
    upvotes: 32,
  },
  {
    id: "r3",
    title: "Sampah Tidak Dikutip di SS2, Petaling Jaya",
    description: "Sampah di kawasan SS2 tidak dikutip selama 5 hari. Bau busuk dan risiko kesihatan kepada penduduk setempat.",
    category: "sanitation",
    state: "Selangor",
    location: "SS2, Petaling Jaya, Selangor",
    status: "resolved",
    reportedAt: "2025-04-28",
    reporter: "Chen Wei Liang",
    upvotes: 78,
  },
  {
    id: "r4",
    title: "Jalan Berlubang di Jalan Ipoh",
    description: "Permukaan jalan di Jalan Ipoh dalam keadaan teruk dengan banyak lubang. Telah menyebabkan beberapa kemalangan kecil.",
    category: "road",
    state: "Perak",
    location: "Jalan Ipoh, Perak",
    status: "investigating",
    reportedAt: "2025-05-05",
    reporter: "Rajendran Pillai",
    upvotes: 56,
  },
  {
    id: "r5",
    title: "Banjir Kilat di Taman Melawati",
    description: "Kawasan Taman Melawati kerap mengalami banjir kilat setiap kali hujan lebat. Sistem perparitan perlu dinaik taraf segera.",
    category: "flooding",
    state: "Kuala Lumpur",
    location: "Taman Melawati, Kuala Lumpur",
    status: "pending",
    reportedAt: "2025-05-07",
    reporter: "Faridah Mohd",
    upvotes: 124,
  },
  {
    id: "r6",
    title: "Pokok Tumbang Menutup Laluan di Kota Kinabalu",
    description: "Sebuah pokok besar telah tumbang dan menutup sebahagian jalan di kawasan Likas, Kota Kinabalu selepas ribut semalam.",
    category: "other",
    state: "Sabah",
    location: "Likas, Kota Kinabalu, Sabah",
    status: "resolved",
    reportedAt: "2025-05-02",
    reporter: "Benedict Lim",
    upvotes: 19,
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
