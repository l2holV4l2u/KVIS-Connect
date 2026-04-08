// Migrated from legacy kvis-alumni-website schema

export const DEGREES = [
  { value: "MD", label: "M.D. Doctor of Medicine" },
  { value: "BEng", label: "B.Eng. Bachelor of Engineering" },
  { value: "BS", label: "B.S. Bachelor of Science" },
  { value: "BA", label: "B.A. Bachelor of Arts" },
  { value: "BBA", label: "B.B.A. Bachelor of Business Administration" },
  { value: "BEd", label: "B.Ed. Bachelor of Education" },
  { value: "BFA", label: "B.F.A. Bachelor of Fine Arts" },
  { value: "BM", label: "B.M. Bachelor of Medicine" },
  { value: "BMus", label: "B.Mus. Bachelor of Music" },
  { value: "LLB", label: "LL.B. Bachelor of Law" },
  { value: "BPhi", label: "B.Phil. Bachelor of Philosophy" },
  { value: "BSEE", label: "B.S.E.E. Bachelor of Science/Electrical Engineering" },
  { value: "BSME", label: "B.S.M.E. Bachelor of Mechanical Engineering" },
  { value: "BSN", label: "B.S.N. Bachelor of Nursing" },
  { value: "AB", label: "A.B. Arts Bachelor" },
  { value: "LLM", label: "LL.M. Master of Law" },
  { value: "MA", label: "M.A. Master of Arts" },
  { value: "MArch", label: "M.Arch. Master of Architecture" },
  { value: "MBA", label: "M.B.A. Master of Business Administration" },
  { value: "MS", label: "M.S. Master of Science" },
  { value: "ME", label: "M.E. Mechanical Engineering" },
  { value: "MEd", label: "M.Ed. Master of Education" },
  { value: "MEng", label: "M.Eng. Master of Engineering" },
  { value: "MM", label: "M.M. Masters of Management" },
  { value: "MMSC", label: "M.M.S.C. Master of Medical Science" },
  { value: "MMus", label: "M.Mus. Master of Music" },
  { value: "MNur", label: "M.Nur. Master of Nursing" },
  { value: "MPP", label: "M.P.P. Master of Public Policy" },
  { value: "MPS", label: "M.P.S. Master of Political Science" },
  { value: "MPhi", label: "M.Phil. Master of Philosophy" },
  { value: "MSCE", label: "M.S.C.E. Master of Science in Civil Engineering" },
  { value: "MSCS", label: "M.S.C.S. Master of Science in Computer" },
  { value: "MSE", label: "M.S.E. Master of Science in Engineering" },
  { value: "MSEE", label: "M.S.E.E. Master of Science in Electrical Engineering" },
  { value: "MSME", label: "M.S.M.E. Master of Science in Mechanical Engineering" },
  { value: "DMD", label: "D.M.D. Doctor of Dental Medicine" },
  { value: "DPM", label: "D.P.M. Doctor of Physical Medicine" },
  { value: "DPhil", label: "D.Phil. Doctor of Philosophy" },
  { value: "DA", label: "D.A. Doctor of Arts" },
  { value: "DEd", label: "D.Ed. Doctor of Education" },
  { value: "DM", label: "D.M. Doctor of Music" },
  { value: "LLD", label: "LL.D. Doctor of Law" },
  { value: "AS", label: "A.S. Associate in Science" },
] as const;

export const JOB_FIELDS = [
  { value: "AgriF", label: "Agriculture/Forestry" },
  { value: "Art", label: "Arts/Design" },
  { value: "Finan", label: "Banking/Finance/Investing" },
  { value: "BTradC", label: "Building/Trades/Crafts" },
  { value: "BusiC", label: "Business/Commerce" },
  { value: "Reli", label: "Clergy/Religious Leadership" },
  { value: "Commu", label: "Communications/Media" },
  { value: "Comp", label: "Computers/IT" },
  { value: "Couns", label: "Counseling" },
  { value: "Edu", label: "Education" },
  { value: "Engi", label: "Engineering" },
  { value: "Envi", label: "Environment/Recreation" },
  { value: "Fund", label: "Fundraising" },
  { value: "Health", label: "Health Care" },
  { value: "Homem", label: "Homemaking" },
  { value: "HumRe", label: "Human Resources" },
  { value: "Insur", label: "Insurance" },
  { value: "Lang", label: "Languages" },
  { value: "Legal", label: "Legal Professions" },
  { value: "Libra", label: "Libraries/Archives/Museums" },
  { value: "Mark", label: "Marketing" },
  { value: "Milit", label: "Military/Protective Services" },
  { value: "Other", label: "Other Careers" },
  { value: "PArt", label: "Performing Arts" },
  { value: "Plan", label: "Planning" },
  { value: "PubS", label: "Public Service" },
  { value: "RealE", label: "Real Estate" },
  { value: "Resea", label: "Research & Development" },
  { value: "Sci", label: "Sciences" },
  { value: "SHos", label: "Service/Hospitality" },
  { value: "SoSc", label: "Social Sciences" },
  { value: "SoSer", label: "Social Service" },
  { value: "Sport", label: "Sports" },
  { value: "Stud", label: "Student" },
  { value: "Transp", label: "Transportation/Travel" },
  { value: "Volun", label: "Volunteering" },
] as const;

export const MAJORS = [
  "Accounting", "Agricultural Economics", "Agriculture", "Applied Physics",
  "Architecture", "Astronomy", "Astrophysics", "Audiology", "Banking",
  "Biochemistry", "Bioinformatics", "Biology", "Biomedical Engineering",
  "Biophysics", "Biostatistics", "Business", "Business Management",
  "Career Development", "Chemical Engineering", "Chemical Physics", "Chemistry",
  "Chinese", "Cinema and Media Studies", "City Planning", "Civil Engineering",
  "Cognitive Science", "Communications", "Computational Biology",
  "Computer Engineering", "Computer Science", "Consulting", "Counseling",
  "Data Science", "Dentistry", "Design", "Earth Science", "Ecology",
  "Economics", "Education", "Electrical Engineering", "Engineering", "English",
  "Environmental Engineering", "Environmental Science", "Epidemiology",
  "Finance", "Fine Arts", "Genetics", "Geography", "Geological Engineering",
  "Geology", "Government", "Health", "History", "Industrial Engineering",
  "Information Sciences", "International Business", "International Finance",
  "Law", "Liberal Arts", "Management", "Marketing", "Mathematics",
  "Mathematics Education", "Mechanical Engineering", "Media Studies",
  "Medicine", "Microbiology", "Mining Engineering", "Molecular Biology",
  "Music", "Neuroscience", "Nuclear Engineering", "Nursing", "Nutrition",
  "Ophthalmology", "Organic Chemistry", "Orthopaedic Surgery", "Painting",
  "Paleontology", "Personal Training", "Petroleum Engineering", "Pharmacy",
  "Philosophy", "Philosophy of Science", "Physics", "Political Science",
  "Psychology", "Public Policy", "Radiology", "Real Estate", "Science",
  "Science Education", "Statistics",
] as const;

export const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export type MBTIType = (typeof MBTI_TYPES)[number];

const currentYear = new Date().getFullYear();
const KVIS_BASE_YEAR = 2018;

export const KVIS_YEARS: Array<{ value: number; label: string }> = Array.from(
  { length: currentYear - KVIS_BASE_YEAR + 5 },
  (_, i) => {
    const year = KVIS_BASE_YEAR + i;
    const gen = i + 1;
    return { value: year, label: `${year} (Gen ${gen})` };
  }
).reverse();

export function degreeLabel(value: string) {
  return DEGREES.find((d) => d.value === value)?.label ?? value;
}

export function jobFieldLabel(value: string) {
  return JOB_FIELDS.find((j) => j.value === value)?.label ?? value;
}
