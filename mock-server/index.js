const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ALUMNI = [
  {
    id: 1,
    email: "somsak.k@kvis.ac.th",
    first_name: "Somsak",
    last_name: "Khamchoo",
    kvis_year: 14,
    place: "Bangkok, Thailand",
    latitude: 13.7563,
    longitude: 100.5018,
    country: "Thailand",
    profile_pic_url: null,
    bio: "Machine learning researcher passionate about NLP and Thai language processing.",
    mbti: "INTJ",
    interests: "AI, chess, hiking",
    facebook_url: null,
    linkedin_url: "https://linkedin.com/in/somsakk",
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-03-01T10:00:00Z",
    education: [
      {
        id: 1,
        uni_name: "MIT",
        degree: "Master",
        major: "Computer Science",
        country: "USA",
        state: "Massachusetts",
        scholarship: "DPST",
        start_year: 2020,
        end_year: 2022,
      },
    ],
    career: [
      {
        id: 1,
        job_title: "ML Engineer",
        employer: "Google",
        job_field: "Technology",
        country: "USA",
        state: "California",
        is_current: true,
        start_year: 2022,
        end_year: null,
      },
    ],
  },
  {
    id: 2,
    email: "nattakorn.p@kvis.ac.th",
    first_name: "Nattakorn",
    last_name: "Phongsuwan",
    kvis_year: 16,
    place: "London, UK",
    latitude: 51.5074,
    longitude: -0.1278,
    country: "UK",
    profile_pic_url: null,
    bio: "Aerospace engineer working on satellite systems.",
    mbti: "ENTP",
    interests: "Rocketry, astronomy, photography",
    facebook_url: null,
    linkedin_url: null,
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-02-10T08:00:00Z",
    education: [
      {
        id: 2,
        uni_name: "Imperial College London",
        degree: "Master",
        major: "Aerospace Engineering",
        country: "UK",
        state: null,
        scholarship: "Royal Thai Government",
        start_year: 2019,
        end_year: 2021,
      },
    ],
    career: [
      {
        id: 2,
        job_title: "Satellite Systems Engineer",
        employer: "Airbus",
        job_field: "Engineering",
        country: "UK",
        state: null,
        is_current: true,
        start_year: 2021,
        end_year: null,
      },
    ],
  },
  {
    id: 3,
    email: "pimchanok.s@kvis.ac.th",
    first_name: "Pimchanok",
    last_name: "Srithai",
    kvis_year: 18,
    place: "Tokyo, Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    country: "Japan",
    profile_pic_url: null,
    bio: "Biochemistry PhD student studying protein folding.",
    mbti: "INFJ",
    interests: "Biology, cooking, anime",
    facebook_url: null,
    linkedin_url: null,
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-02-01T08:00:00Z",
    updated_at: "2024-02-01T08:00:00Z",
    education: [
      {
        id: 3,
        uni_name: "University of Tokyo",
        degree: "PhD",
        major: "Biochemistry",
        country: "Japan",
        state: null,
        scholarship: "MEXT",
        start_year: 2022,
        end_year: null,
      },
    ],
    career: [],
  },
  {
    id: 4,
    email: "chaiwat.n@kvis.ac.th",
    first_name: "Chaiwat",
    last_name: "Nakorn",
    kvis_year: 12,
    place: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    country: "Singapore",
    profile_pic_url: null,
    bio: "Quantitative analyst at a leading hedge fund.",
    mbti: "ISTJ",
    interests: "Finance, statistics, golf",
    facebook_url: null,
    linkedin_url: "https://linkedin.com/in/chaiwatn",
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-03-15T08:00:00Z",
    education: [
      {
        id: 4,
        uni_name: "NUS",
        degree: "Bachelor",
        major: "Mathematics",
        country: "Singapore",
        state: null,
        scholarship: "DPST",
        start_year: 2013,
        end_year: 2017,
      },
      {
        id: 5,
        uni_name: "London School of Economics",
        degree: "Master",
        major: "Financial Mathematics",
        country: "UK",
        state: null,
        scholarship: null,
        start_year: 2017,
        end_year: 2018,
      },
    ],
    career: [
      {
        id: 3,
        job_title: "Quantitative Analyst",
        employer: "Citadel",
        job_field: "Finance",
        country: "Singapore",
        state: null,
        is_current: true,
        start_year: 2019,
        end_year: null,
      },
    ],
  },
  {
    id: 5,
    email: "wipawee.t@kvis.ac.th",
    first_name: "Wipawee",
    last_name: "Taweerat",
    kvis_year: 20,
    place: "Sydney, Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    country: "Australia",
    profile_pic_url: null,
    bio: "Marine biologist studying coral reef ecosystems.",
    mbti: "ENFP",
    interests: "Ocean, diving, environmental activism",
    facebook_url: null,
    linkedin_url: null,
    website_url: "https://wipawee.science",
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-02-15T08:00:00Z",
    updated_at: "2024-02-15T08:00:00Z",
    education: [
      {
        id: 6,
        uni_name: "University of Queensland",
        degree: "PhD",
        major: "Marine Biology",
        country: "Australia",
        state: "Queensland",
        scholarship: "Australia Awards",
        start_year: 2021,
        end_year: null,
      },
    ],
    career: [],
  },
  {
    id: 6,
    email: "thanet.w@kvis.ac.th",
    first_name: "Thanet",
    last_name: "Wiriya",
    kvis_year: 15,
    place: "Munich, Germany",
    latitude: 48.1351,
    longitude: 11.582,
    country: "Germany",
    profile_pic_url: null,
    bio: "Automotive engineer specialising in electric vehicle powertrains.",
    mbti: "ISTP",
    interests: "Cars, cycling, Bundesliga",
    facebook_url: null,
    linkedin_url: null,
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-01-25T08:00:00Z",
    updated_at: "2024-01-25T08:00:00Z",
    education: [
      {
        id: 7,
        uni_name: "TU Munich",
        degree: "Master",
        major: "Mechanical Engineering",
        country: "Germany",
        state: "Bavaria",
        scholarship: "DAAD",
        start_year: 2018,
        end_year: 2020,
      },
    ],
    career: [
      {
        id: 4,
        job_title: "Powertrain Engineer",
        employer: "BMW",
        job_field: "Engineering",
        country: "Germany",
        state: "Bavaria",
        is_current: true,
        start_year: 2020,
        end_year: null,
      },
    ],
  },
  {
    id: 7,
    email: "sirima.c@kvis.ac.th",
    first_name: "Sirima",
    last_name: "Chantara",
    kvis_year: 22,
    place: "Boston, USA",
    latitude: 42.3601,
    longitude: -71.0589,
    country: "USA",
    profile_pic_url: null,
    bio: "Medical student at Harvard, interested in oncology.",
    mbti: "ENTJ",
    interests: "Medicine, running, piano",
    facebook_url: null,
    linkedin_url: null,
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-03-01T08:00:00Z",
    updated_at: "2024-03-01T08:00:00Z",
    education: [
      {
        id: 8,
        uni_name: "Harvard University",
        degree: "Bachelor",
        major: "Biology",
        country: "USA",
        state: "Massachusetts",
        scholarship: "DPST",
        start_year: 2022,
        end_year: null,
      },
    ],
    career: [],
  },
  {
    id: 8,
    email: "kritsada.m@kvis.ac.th",
    first_name: "Kritsada",
    last_name: "Mongkol",
    kvis_year: 10,
    place: "Chiang Mai, Thailand",
    latitude: 18.7883,
    longitude: 98.9853,
    country: "Thailand",
    profile_pic_url: null,
    bio: "Entrepreneur running an AgriTech startup in Northern Thailand.",
    mbti: "ESTP",
    interests: "Agriculture, startups, hiking",
    facebook_url: null,
    linkedin_url: null,
    website_url: "https://agristart.th",
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-02-20T08:00:00Z",
    education: [
      {
        id: 9,
        uni_name: "Chiang Mai University",
        degree: "Bachelor",
        major: "Agricultural Science",
        country: "Thailand",
        state: null,
        scholarship: null,
        start_year: 2011,
        end_year: 2015,
      },
    ],
    career: [
      {
        id: 5,
        job_title: "Co-Founder & CEO",
        employer: "AgriStart",
        job_field: "Business",
        country: "Thailand",
        state: null,
        is_current: true,
        start_year: 2018,
        end_year: null,
      },
    ],
  },
  {
    id: 9,
    email: "parichat.r@kvis.ac.th",
    first_name: "Parichat",
    last_name: "Rungrot",
    kvis_year: 17,
    place: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    country: "France",
    profile_pic_url: null,
    bio: "Fashion designer blending Thai textile heritage with contemporary style.",
    mbti: "ISFP",
    interests: "Fashion, art, travel",
    facebook_url: null,
    linkedin_url: null,
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-02-05T08:00:00Z",
    updated_at: "2024-02-05T08:00:00Z",
    education: [
      {
        id: 10,
        uni_name: "Institut Français de la Mode",
        degree: "Master",
        major: "Fashion Design",
        country: "France",
        state: null,
        scholarship: null,
        start_year: 2019,
        end_year: 2021,
      },
    ],
    career: [
      {
        id: 6,
        job_title: "Senior Designer",
        employer: "Louis Vuitton",
        job_field: "Creative Arts",
        country: "France",
        state: null,
        is_current: true,
        start_year: 2021,
        end_year: null,
      },
    ],
  },
  {
    id: 10,
    email: "thanakit.b@kvis.ac.th",
    first_name: "Thanakit",
    last_name: "Buranasiri",
    kvis_year: 19,
    place: "Toronto, Canada",
    latitude: 43.6532,
    longitude: -79.3832,
    country: "Canada",
    profile_pic_url: null,
    bio: "Data scientist at a major Canadian bank.",
    mbti: "INTP",
    interests: "Statistics, board games, skiing",
    facebook_url: null,
    linkedin_url: "https://linkedin.com/in/thanakitb",
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-01-30T08:00:00Z",
    updated_at: "2024-03-10T08:00:00Z",
    education: [
      {
        id: 11,
        uni_name: "University of Toronto",
        degree: "Master",
        major: "Statistics",
        country: "Canada",
        state: "Ontario",
        scholarship: "Vanier CGS",
        start_year: 2020,
        end_year: 2022,
      },
    ],
    career: [
      {
        id: 7,
        job_title: "Senior Data Scientist",
        employer: "RBC",
        job_field: "Finance",
        country: "Canada",
        state: "Ontario",
        is_current: true,
        start_year: 2022,
        end_year: null,
      },
    ],
  },
  {
    id: 11,
    email: "phakphum.a@kvis.ac.th",
    first_name: "Phakphum",
    last_name: "Aumthai",
    kvis_year: 13,
    place: "San Francisco, USA",
    latitude: 37.7749,
    longitude: -122.4194,
    country: "USA",
    profile_pic_url: null,
    bio: "Senior software engineer at a Bay Area startup.",
    mbti: "ENTP",
    interests: "Open source, coffee, surfing",
    facebook_url: null,
    linkedin_url: null,
    website_url: "https://phakphum.dev",
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-01-12T08:00:00Z",
    updated_at: "2024-01-12T08:00:00Z",
    education: [
      {
        id: 12,
        uni_name: "Stanford University",
        degree: "Bachelor",
        major: "Computer Science",
        country: "USA",
        state: "California",
        scholarship: "DPST",
        start_year: 2014,
        end_year: 2018,
      },
    ],
    career: [
      {
        id: 8,
        job_title: "Staff Software Engineer",
        employer: "Stripe",
        job_field: "Technology",
        country: "USA",
        state: "California",
        is_current: true,
        start_year: 2020,
        end_year: null,
      },
    ],
  },
  {
    id: 12,
    email: "wanida.ph@kvis.ac.th",
    first_name: "Wanida",
    last_name: "Pholsena",
    kvis_year: 21,
    place: "Seoul, South Korea",
    latitude: 37.5665,
    longitude: 126.978,
    country: "South Korea",
    profile_pic_url: null,
    bio: "PhD student in Materials Science, researching next-gen batteries.",
    mbti: "INFP",
    interests: "K-pop, chemistry, yoga",
    facebook_url: null,
    linkedin_url: null,
    website_url: null,
    line_id: null,
    email_verified: true,
    is_verified: true,
    created_at: "2024-02-20T08:00:00Z",
    updated_at: "2024-02-20T08:00:00Z",
    education: [
      {
        id: 13,
        uni_name: "KAIST",
        degree: "PhD",
        major: "Materials Science",
        country: "South Korea",
        state: null,
        scholarship: "Korean Government Scholarship",
        start_year: 2023,
        end_year: null,
      },
    ],
    career: [],
  },
];

// Mock blogs
let MOCK_BLOGS = [
  {
    id: 1,
    slug: "life-at-mit",
    title: "Life at MIT as a Thai Student",
    content:
      "# Life at MIT\n\nComing from KVIS to MIT was a huge transition...\n\n## Academic Culture\n\nThe pace here is intense but rewarding...\n\n## Thai Community\n\nThere's a vibrant Thai student community on campus...",
    excerpt: "A look at life at one of the world's top universities from a KVIS grad's perspective.",
    cover_image_url: null,
    tags: "MIT,USA,grad school",
    is_published: true,
    published_at: "2024-02-01T08:00:00Z",
    created_at: "2024-01-28T08:00:00Z",
    updated_at: "2024-02-01T08:00:00Z",
    author_id: 1,
    author: {
      id: 1,
      first_name: "Somsak",
      last_name: "Khamchoo",
      profile_pic_url: null,
      kvis_year: 14,
    },
  },
  {
    id: 2,
    slug: "applying-dpst-scholarship",
    title: "How to Apply for DPST Scholarship: My Experience",
    content:
      "# DPST Scholarship Guide\n\nThe Development and Promotion of Science and Technology Talents Project (DPST) scholarship changed my life...\n\n## What is DPST?\n\nDPST is a Thai government scholarship for STEM students...\n\n## Application Timeline\n\n- January: Open applications\n- March: Written exam\n- May: Interview\n- July: Results",
    excerpt: "Everything you need to know about Thailand's most prestigious STEM scholarship.",
    cover_image_url: null,
    tags: "scholarship,DPST,tips",
    is_published: true,
    published_at: "2024-02-15T08:00:00Z",
    created_at: "2024-02-12T08:00:00Z",
    updated_at: "2024-02-15T08:00:00Z",
    author_id: 4,
    author: {
      id: 4,
      first_name: "Chaiwat",
      last_name: "Nakorn",
      profile_pic_url: null,
      kvis_year: 12,
    },
  },
  {
    id: 3,
    slug: "working-in-singapore-finance",
    title: "Breaking into Finance in Singapore",
    content:
      "# Finance Career in Singapore\n\nSingapore is Asia's financial hub and a great destination for KVIS alumni...\n\n## Why Singapore?\n\n- Tax-friendly environment\n- Gateway to Southeast Asian markets\n- Strong English proficiency required\n\n## Getting a Role\n\nNetworking is crucial. Start by connecting with the KVIS alumni network here.",
    excerpt: "Tips and insights for KVIS alumni looking to build a finance career in Singapore.",
    cover_image_url: null,
    tags: "Singapore,finance,career",
    is_published: true,
    published_at: "2024-03-01T08:00:00Z",
    created_at: "2024-02-28T08:00:00Z",
    updated_at: "2024-03-01T08:00:00Z",
    author_id: 4,
    author: {
      id: 4,
      first_name: "Chaiwat",
      last_name: "Nakorn",
      profile_pic_url: null,
      kvis_year: 12,
    },
  },
];

// Logged-in mock user (id=1)
const MOCK_ME = MOCK_ALUMNI[0];

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

const MOCK_TOKEN = "mock_access_token";

function isAuthenticated(req) {
  return req.cookies?.access_token === MOCK_TOKEN;
}

function requireAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ detail: "Not authenticated" });
  }
  next();
}

function setCookies(res) {
  res.cookie("access_token", MOCK_TOKEN, { httpOnly: true, sameSite: "lax", maxAge: 3600000 });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: "mock" });
});

// Auth
app.post("/api/auth/register", (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email?.endsWith("@kvis.ac.th")) {
    return res.status(400).json({ detail: "Only @kvis.ac.th emails are allowed" });
  }
  setCookies(res);
  res.json({ message: "Registered successfully (mock)", user_id: 1 });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ detail: "Invalid credentials" });
  }
  setCookies(res);
  res.json({ message: "Logged in (mock)", user_id: 1 });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out" });
});

// Users — /me
app.get("/api/users/me", requireAuth, (req, res) => {
  res.json(MOCK_ME);
});

app.patch("/api/users/me", requireAuth, (req, res) => {
  Object.assign(MOCK_ME, req.body);
  res.json(MOCK_ME);
});

app.post("/api/users/me/profile-pic", requireAuth, (req, res) => {
  res.json({ url: "https://via.placeholder.com/150" });
});

app.put("/api/users/me/education", requireAuth, (req, res) => {
  MOCK_ME.education = req.body.map((e, i) => ({ id: i + 1, ...e }));
  res.json({ message: "Education updated" });
});

app.put("/api/users/me/career", requireAuth, (req, res) => {
  MOCK_ME.career = req.body.map((c, i) => ({ id: i + 1, ...c }));
  res.json({ message: "Career updated" });
});

// Globe pins
app.get("/api/users/globe/pins", (req, res) => {
  const pins = MOCK_ALUMNI.filter((u) => u.latitude && u.longitude).map((u) => {
    const currentJob = u.career.find((c) => c.is_current) || u.career[u.career.length - 1];
    return {
      user_id: u.id,
      first_name: u.first_name,
      last_name: u.last_name,
      latitude: u.latitude,
      longitude: u.longitude,
      place: u.place,
      country: u.country,
      kvis_year: u.kvis_year,
      profile_pic_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${u.first_name}${u.last_name}`,
      mbti: u.mbti,
      current_job: currentJob ? `${currentJob.job_title} at ${currentJob.employer}` : null,
    };
  });
  res.json(pins);
});

// User by ID — must come after /me and /globe/pins
app.get("/api/users/:id", (req, res) => {
  const user = MOCK_ALUMNI.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ detail: "User not found" });
  res.json(user);
});

// Search
app.get("/api/search", (req, res) => {
  const { name, kvis_year, country, uni_name, degree, major, scholarship,
          job_title, employer, job_field, sort = "name", order = "asc",
          limit = 50, offset = 0 } = req.query;

  let results = [...MOCK_ALUMNI];

  if (name) {
    const t = name.toLowerCase();
    results = results.filter(
      (u) =>
        u.first_name.toLowerCase().includes(t) ||
        u.last_name.toLowerCase().includes(t)
    );
  }
  if (kvis_year) results = results.filter((u) => u.kvis_year === parseInt(kvis_year));
  if (country) results = results.filter((u) => u.country?.toLowerCase().includes(country.toLowerCase()));

  if (uni_name || degree || major || scholarship) {
    results = results.filter((u) =>
      u.education.some((e) => {
        if (uni_name && !e.uni_name?.toLowerCase().includes(uni_name.toLowerCase())) return false;
        if (degree && e.degree !== degree) return false;
        if (major && !e.major?.toLowerCase().includes(major.toLowerCase())) return false;
        if (scholarship && !e.scholarship?.toLowerCase().includes(scholarship.toLowerCase())) return false;
        return true;
      })
    );
  }

  if (job_title || employer || job_field) {
    results = results.filter((u) =>
      u.career.some((c) => {
        if (job_title && !c.job_title?.toLowerCase().includes(job_title.toLowerCase())) return false;
        if (employer && !c.employer?.toLowerCase().includes(employer.toLowerCase())) return false;
        if (job_field && c.job_field !== job_field) return false;
        return true;
      })
    );
  }

  // Sort
  const reverse = order === "desc";
  if (sort === "name") {
    results.sort((a, b) => {
      const cmp = (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name);
      return reverse ? -cmp : cmp;
    });
  } else if (sort === "kvis_year") {
    results.sort((a, b) => reverse ? (b.kvis_year || 0) - (a.kvis_year || 0) : (a.kvis_year || 0) - (b.kvis_year || 0));
  } else if (sort === "created_at") {
    results.sort((a, b) => {
      const cmp = new Date(a.created_at) - new Date(b.created_at);
      return reverse ? -cmp : cmp;
    });
  }

  const page = results.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  // Return same shape as UserCard
  res.json(
    page.map((u) => ({
      id: u.id,
      first_name: u.first_name,
      last_name: u.last_name,
      kvis_year: u.kvis_year,
      place: u.place,
      country: u.country,
      profile_pic_url: u.profile_pic_url,
      mbti: u.mbti,
      education: u.education,
      career: u.career,
    }))
  );
});

// Summary
app.get("/api/summary", (req, res) => {
  const by_kvis_year = {};
  const by_country = {};
  const by_job_field = {};
  const by_degree = {};
  const by_mbti = {};

  for (const u of MOCK_ALUMNI) {
    if (u.kvis_year) by_kvis_year[u.kvis_year] = (by_kvis_year[u.kvis_year] || 0) + 1;
    if (u.country) by_country[u.country] = (by_country[u.country] || 0) + 1;
    if (u.mbti) by_mbti[u.mbti] = (by_mbti[u.mbti] || 0) + 1;
    for (const e of u.education) {
      if (e.degree) by_degree[e.degree] = (by_degree[e.degree] || 0) + 1;
    }
    for (const c of u.career) {
      if (c.job_field) by_job_field[c.job_field] = (by_job_field[c.job_field] || 0) + 1;
    }
  }

  res.json({
    total: MOCK_ALUMNI.length,
    by_kvis_year,
    by_country,
    by_job_field,
    by_degree,
    by_mbti,
  });
});

// Blogs
app.get("/api/blogs", (req, res) => {
  const { tag, limit = 20, offset = 0 } = req.query;
  let blogs = MOCK_BLOGS.filter((b) => b.is_published);
  if (tag) blogs = blogs.filter((b) => b.tags?.toLowerCase().includes(tag.toLowerCase()));
  res.json(blogs.slice(parseInt(offset), parseInt(offset) + parseInt(limit)));
});

app.get("/api/blogs/:slug", (req, res) => {
  const blog = MOCK_BLOGS.find((b) => b.slug === req.params.slug && b.is_published);
  if (!blog) return res.status(404).json({ detail: "Blog not found" });
  res.json(blog);
});

app.post("/api/blogs", requireAuth, (req, res) => {
  const { title, content, excerpt, cover_image_url, tags, is_published } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const blog = {
    id: MOCK_BLOGS.length + 1,
    slug,
    title,
    content,
    excerpt: excerpt || content.slice(0, 200),
    cover_image_url: cover_image_url || null,
    tags: tags || null,
    is_published: !!is_published,
    published_at: is_published ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: MOCK_ME.id,
    author: {
      id: MOCK_ME.id,
      first_name: MOCK_ME.first_name,
      last_name: MOCK_ME.last_name,
      profile_pic_url: MOCK_ME.profile_pic_url,
      kvis_year: MOCK_ME.kvis_year,
    },
  };
  MOCK_BLOGS.push(blog);
  res.status(201).json(blog);
});

app.patch("/api/blogs/:slug", requireAuth, (req, res) => {
  const idx = MOCK_BLOGS.findIndex((b) => b.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ detail: "Blog not found" });
  Object.assign(MOCK_BLOGS[idx], req.body, { updated_at: new Date().toISOString() });
  res.json(MOCK_BLOGS[idx]);
});

app.delete("/api/blogs/:slug", requireAuth, (req, res) => {
  const idx = MOCK_BLOGS.findIndex((b) => b.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ detail: "Blog not found" });
  MOCK_BLOGS.splice(idx, 1);
  res.status(204).send();
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`\n🟡 KVIS Connect MOCK server running at http://localhost:${PORT}`);
  console.log(`   Swagger-style docs: not available in mock mode`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
