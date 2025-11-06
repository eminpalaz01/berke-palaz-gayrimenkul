export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  categoryKey: string; // Translation key for category
  location: string;
  year: string;
}

export interface ProjectCategory {
  id: string;
  key: string; // Translation key
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHoursKey: string;
  addressKey: string;
}

export const navigation = [
  { name: "navigation.home", href: "/" },
  { name: "navigation.about", href: "/about" },
  { 
    name: "navigation.services", 
    href: "/",
    submenu: [
      { name: "navigation.submenu.constructionMaterials", href: "/services/construction-materials" },
      { name: "navigation.submenu.construct", href: "/services/construction" },
      { name: "navigation.submenu.readyMix", href: "/services/ready-mix-concrete" },
      { name: "navigation.submenu.quarry", href: "/services/quarry" },
      { name: "navigation.submenu.brands", href: "/services/brands-we-represent" }
    ]
  },
  { name: "navigation.projects", href: "/projects" },
  { name: "navigation.concretePlant", href: "/concrete-plant" },
  { 
    name: "navigation.humanResources", 
    href: "/",
    submenu: [
      { name: "navigation.submenu.firstStep", href: "/human-resources/first-step" }
    ]
  },
  { name: "navigation.contact", href: "/contact" }
];

// Project categories with their translation keys
export const projectCategories: ProjectCategory[] = [
  {
    id: "infrastructure",
    key: "infrastructure"
  },
  {
    id: "residential",
    key: "residential"
  },
  {
    id: "education",
    key: "education"
  },
  {
    id: "housing",
    key: "housing"
  },
  {
    id: "socialHousing",
    key: "socialHousing"
  },
  {
    id: "site",
    key: "site"
  }
];

export const projects: Project[] = [
  {
    id: "syal-kaldirim-beton-temini",
    title: "Syal Kaldırım Beton Temini",
    description: "Balıkesir'in en büyük kaldırım projelerinden biri olan Syal Kaldırım projesinde 5.000 m³ beton tedariki.",
    image: "/images/projects/syal-kaldirim-beton-temini.jpg",
    category: "Altyapı",
    categoryKey: "infrastructure",
    location: "Balıkesir",
    year: "2023"
  },
  {
    id: "residance-beton-temini",
    title: "Residance Beton Temini",
    description: "Modern konut kompleksi projesinde 8.000 m³ yüksek kaliteli beton tedariki ve dökümü.",
    image: "/images/projects/residance-beton-temini.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2023"
  },
  {
    id: "bilgi-anaokulu-insaati",
    title: "Bilgi Anaokulu İnşaatı",
    description: "Eğitim yapısı inşaatında 2.500 m³ beton tedariki ve profesyonel döküm hizmeti.",
    image: "/images/projects/bilgi-anaokulu-insaati.jpg",
    category: "Eğitim Binası",
    categoryKey: "education",
    location: "Balıkesir",
    year: "2022"
  },
  {
    id: "selale-apartmani-2",
    title: "Şelale Apartmanı 2",
    description: "Şelale Apartmanı serisinin ikinci projesi, modern tasarımı ve konforlu daireleri ile dikkat çekiyor.",
    image: "/images/projects/selale-apartmani-2.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2023"
  },
  {
    id: "elit-apartmani",
    title: "Elit Apartmanı",
    description: "Şehrin seçkin bölgelerinden birinde yer alan Elit Apartmanı, kaliteli ve prestijli bir yaşam sunuyor.",
    image: "/images/projects/elit-apartmani.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2022"
  },
  {
    id: "selale-apartmani",
    title: "Şelale Apartmanı",
    description: "Markamızın imzasını taşıyan Şelale Apartmanı, güven ve kalitenin simgesi.",
    image: "/images/projects/selale-apartmani.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2022"
  },
  {
    id: "kocak-apartmani",
    title: "Koçak Apartmanı",
    description: "Aile yaşamına uygun, sıcak ve samimi bir atmosfere sahip konut projesi.",
    image: "/images/projects/kocak-apartmani.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2021"
  },
  {
    id: "burak-apartmani",
    title: "Burak Apartmanı",
    description: "Fonksiyonel ve estetik detaylarla tasarlanmış, modern bir şehir apartmanı.",
    image: "/images/projects/burak-apartmani.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2021"
  },
  {
    id: "karaman-elit-viva-apartmanlari",
    title: "Karaman Elit – Viva Apartmanları",
    description: "Karaman bölgesine değer katan, Elit ve Viva apartmanlarından oluşan konut kompleksi.",
    image: "/images/projects/karaman-elit-viva-apartmanlari.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2020"
  },
  {
    id: "selale-dublex",
    title: "Şelale Dublex",
    description: "Geniş ve ferah yaşam alanları sunan, özel tasarımlı dubleks konut projesi.",
    image: "/images/projects/selale-dublex.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2021"
  },
  {
    id: "ilkadim-anaokulu-konutu",
    title: "İlkadım Anaokulu Konutu",
    description: "Eğitim ve konut fonksiyonlarını bir araya getiren karma kullanımlı proje.",
    image: "/images/projects/ilkadim-anaokulu-konutu.jpg",
    category: "Eğitim Binası",
    categoryKey: "education",
    location: "Balıkesir",
    year: "2020"
  },
  {
    id: "selale-siteleri",
    title: "Şelale Siteleri",
    description: "Geniş bir alana yayılan, sosyal donatıları ve peyzajıyla öne çıkan site projesi.",
    image: "/images/projects/selale-siteleri.jpg",
    category: "Toplu Konut",
    categoryKey: "housing",
    location: "Balıkesir",
    year: "2019"
  },
  {
    id: "toki-konutlari",
    title: "TOKİ Konutları Beton Projesi",
    description: "Sosyal konut projesinde 12.000 m³ beton tedariki ve kalite kontrollü döküm.",
    image: "/images/projects/toki-konutlari.jpg",
    category: "Sosyal Konut",
    categoryKey: "socialHousing",
    location: "Balıkesir",
    year: "2023"
  },
  {
    id: "sefakoy-menekse-apartmani",
    title: "Şefaköy Menekşe Apartmanı",
    description: "Şefaköy bölgesinde yer alan, modern tasarımı ve konforlu yaşam alanları ile öne çıkan apartman projesi.",
    image: "/images/projects/sefakoy-menekse-apartmani.jpg",
    category: "Konut",
    categoryKey: "residential",
    location: "Balıkesir",
    year: "2021"
  },
  {
    id: "guzelyali-siteleri",
    title: "Güzelyalı Siteleri",
    description: "Site projelerinde 6.500 m³ beton tedariki ve profesyonel uygulama.",
    image: "/images/projects/guzelyali-siteleri.jpg",
    category: "Site",
    categoryKey: "site",
    location: "Balıkesir",
    year: "2022"
  }
];

export const stats = [
  {
    id: "experience",
    value: "30+",
    label: "Yıllık Tecrübe",
    labelKey: "experience",
    icon: "Calendar"
  },
  {
    id: "employees",
    value: "50+",
    label: "Çalışan Sayımız",
    labelKey: "employees",
    icon: "Users"
  },
  {
    id: "stores",
    value: "2",
    label: "Yapı Malzemesi Mağazası",
    labelKey: "stores",
    icon: "Building2"
  },
  {
    id: "projects",
    value: "500+",
    label: "Teslim Edilen Proje",
    labelKey: "projects",
    icon: "Building"
  },
  {
    id: "plants",
    value: "2",
    label: "Hazır Beton Üretim Santrali",
    labelKey: "plants",
    icon: "Factory"
  },
  {
    id: "crushingFacility",
    value: "1",
    label: "Taş Kırma Tesisi",
    labelKey: "crushingFacility",
    icon: "Pickaxe"
  },
  {
    id: "pumps",
    value: "6",
    label: "Beton Pompası",
    labelKey: "pumps",
    icon: "Zap"
  },
  {
    id: "mixers",
    value: "20",
    label: "Beton Mikseri",
    labelKey: "mixers",
    icon: "Truck"
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: "ceo",
    name: "Ahmet Şelale",
    position: "Genel Müdür",
    image: "/images/team/ceo.jpg",
    bio: "30 yıllık sektör deneyimi ile Şelale Beton'u sektörün lider firmalarından biri haline getirdi."
  },
  {
    id: "technical-director",
    name: "Mehmet Kaya",
    position: "Teknik Müdür",
    image: "/images/team/technical.jpg",
    bio: "İnşaat mühendisi olarak 20 yıldır kaliteli beton üretimi ve proje yönetiminde uzmanlaştı."
  },
  {
    id: "production-manager",
    name: "Fatma Demir",
    position: "Üretim Müdürü",
    image: "/images/team/production.jpg",
    bio: "Üretim süreçlerinin optimizasyonu ve kalite kontrolünde 15 yıllık deneyime sahip."
  }
];

import { COMPANY_INFO, SOCIAL_CONFIG } from '@/config';

export const contactInfo: ContactInfo = {
  phone: COMPANY_INFO.phone,
  email: COMPANY_INFO.email,
  address: `${COMPANY_INFO.address.tr.street}, ${COMPANY_INFO.address.tr.postalCode} ${COMPANY_INFO.address.tr.city}`,
  workingHoursKey: "contact.workingHours",
  addressKey: "contact.address"
};

// Additional contact information
export const additionalContactInfo = {
  accountingAndSales: COMPANY_INFO.phone,
  office: COMPANY_INFO.phone
};

// Social media links (only essential ones from config)
export const socialMediaLinks = {
  instagram: SOCIAL_CONFIG.instagramUrl || "#",
  youtube: SOCIAL_CONFIG.youtubeUrl || "#"
};

export const brands = [
  { name: "Kimtaş", logo: "/images/brands/kimtas.png" },
  { name: "Demireller", logo: "/images/brands/demireller.png" },
  { name: "Ytong", logo: "/images/brands/ytong.png" },
  { name: "Neotherm", logo: "/images/brands/neotherm.png" },
  { name: "Terrawoll", logo: "/images/brands/terrawoll.png" },
  { name: "Kiremix", logo: "/images/brands/kiremix.png" },
  { name: "İzocam", logo: "/images/brands/izocam.png" },
  { name: "Lafarge", logo: "/images/brands/lafarge.png" }
];

export const news = [
  {
    id: "uretmeye-devam",
    title: "Üretmeye Devam Ediyoruz",
    excerpt: "Balıkesir'in Karesi ve Altıeylül ilçelerinde yer alan Hazır Beton Üretim Santrallerimiz faaliyetlerine devam ediyor.",
    date: "26 Ocak 2022",
    image: "/images/news/uretim.jpg",
    author: "Şelale Beton"
  },
  {
    id: "bursa-expansion",
    title: "Şelale Beton Bursa'da",
    excerpt: "Şelale Beton olarak Balıkesir'in ardından Bursa'da da kalitemizi sürdürmek için yola çıktık.",
    date: "26 Ocak 2022",
    image: "/images/news/bursa.jpg",
    author: "Şelale Beton"
  },
  {
    id: "tanitim-filmi",
    title: "Tanıtım Filmimiz Yayında",
    excerpt: "Şelale Beton faaliyet ve projeleri izleyebileceğiniz tanıtım filmimiz yayında.",
    date: "3 Şubat 2022",
    image: "/images/news/tanitim.jpg",
    author: "Şelale Beton"
  }
];
