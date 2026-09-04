import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "ayadina" },
    update: {
      nameAr: "مشويات أيادينا",
      nameEn: "Ayadina Grills",
      isActive: true,
    },
    create: {
      slug: "ayadina",
      nameAr: "مشويات أيادينا",
      nameEn: "Ayadina Grills",
      phone: "+966112345678",
      whatsapp: "966500000000",
      openingHours: "Daily · 12:00 PM – 12:00 AM",
      locationAr: "الرياض",
      locationEn: "Riyadh",
      aboutStoryAr: "",
      aboutStoryEn: "",
      aboutVisionAr: "",
      aboutVisionEn: "",
      aboutValuesAr: [],
      aboutValuesEn: [],
      galleryImages: [],
      branches: [],
    },
  });
  const restaurantId = restaurant.id;
  console.log(`✅ Restaurant: ${restaurant.slug} (${restaurantId})`);

  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash, restaurantId },
    create: { username: "admin", passwordHash, role: "admin", restaurantId },
  });
  console.log("✅ User: admin / admin123");

  const categoryData = [
    { id: 1, nameAr: "المشويات", nameEn: "Grills", displayOrder: 1 },
    { id: 2, nameAr: "المقبلات", nameEn: "Appetizers", displayOrder: 2 },
    { id: 3, nameAr: "المعجنات", nameEn: "Pastries", displayOrder: 3 },
    { id: 4, nameAr: "المشروبات", nameEn: "Drinks", displayOrder: 4 },
  ];
  for (const cat of categoryData) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        restaurantId,
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        displayOrder: cat.displayOrder,
      },
      create: { ...cat, restaurantId },
    });
  }
  console.log("✅ Categories seeded");

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  console.log("✅ Site settings seeded");

  const branches = [
    {
      id: 1,
      nameAr: "فرع المعالي",
      nameEn: "Al-Maali Branch",
      addressAr: "حي المعالي، الرياض",
      addressEn: "Al-Maali District, Riyadh",
      phone: "+966112345678",
      mapEmbedUrl: "",
      directionsUrl: "https://maps.google.com/?q=24.7136,46.6753",
      displayOrder: 1,
      isMainBranch: true,
    },
    {
      id: 2,
      nameAr: "فرع النظيم",
      nameEn: "Al-Naseem Branch",
      addressAr: "حي النظيم، الرياض",
      addressEn: "Al-Naseem District, Riyadh",
      phone: "+966112345679",
      mapEmbedUrl: "",
      directionsUrl: "https://maps.google.com/?q=24.7494,46.8128",
      displayOrder: 2,
      isMainBranch: false,
    },
  ];
  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      update: {},
      create: branch,
    });
  }
  console.log("✅ Branches seeded");

  const gallery = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", titleAr: "", titleEn: "", displayOrder: 1 },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80", titleAr: "", titleEn: "", displayOrder: 2 },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", titleAr: "", titleEn: "", displayOrder: 3 },
    { id: 4, imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", titleAr: "", titleEn: "", displayOrder: 4 },
    { id: 5, imageUrl: "https://images.unsplash.com/photo-1590846400822-0a1a4a5b5f5b?w=800&q=80", titleAr: "", titleEn: "", displayOrder: 5 },
    { id: 6, imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80", titleAr: "", titleEn: "", displayOrder: 6 },
  ];
  for (const image of gallery) {
    await prisma.galleryImage.upsert({
      where: { id: image.id },
      update: {},
      create: image,
    });
  }
  console.log("✅ Gallery seeded");

  const dishData = [
    {
      id: 1, categoryId: 1, price: 149, calories: 920,
      badges: "popular", imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
      featured: true, available: true, displayOrder: 1,
      nameAr: "مشكل مشاوي", nameEn: "Mixed Grill",
      shortDescAr: "تشكيلة فاخرة من أجود أنواع المشويات", shortDescEn: "Premium selection of finest grilled meats",
      descriptionAr: "تشكيلة فاخرة تضم كفتة ولحم غنم مشوي وصدور دجاج متبلة مع أرز بالزعفران وخضار مشوية",
      descriptionEn: "A luxurious platter featuring kofta, lamb chops, and seasoned chicken breasts served with saffron rice and grilled vegetables",
      ingredientsAr: ["لحم بقر", "لحم غنم", "دجاج", "أرز", "زعفران", "خضار"],
      ingredientsEn: ["beef", "lamb", "chicken", "rice", "saffron", "vegetables"],
      allergensAr: [""], allergensEn: [""],
    },
    {
      id: 2, categoryId: 1, price: 119, calories: 680,
      badges: "popular", imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
      featured: true, available: true, displayOrder: 2,
      nameAr: "كوتلت لحم غنم", nameEn: "Lamb Chops",
      shortDescAr: "كوتلت غنم طازج مشوي على الفحم", shortDescEn: "Fresh charcoal-grilled lamb chops",
      descriptionAr: "كوتلت لحم غنم طازج مشوي على الفحم مع توابلنا الخاصة والأعشاب الطازجة",
      descriptionEn: "Fresh lamb chops charcoal-grilled with our signature spices and fresh herbs",
      ingredientsAr: ["لحم غنم", "توابل", "أعشاب"],
      ingredientsEn: ["lamb", "spices", "herbs"],
      allergensAr: [""], allergensEn: [""],
    },
    {
      id: 3, categoryId: 1, price: 59, calories: 420,
      badges: "", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      featured: true, available: true, displayOrder: 3,
      nameAr: "سيخ كباب دجاج", nameEn: "Chicken Kebab",
      shortDescAr: "كباب دجاج متبل مع الخضار المشوية", shortDescEn: "Spiced chicken kebab with grilled vegetables",
      descriptionAr: "سيخ كباب دجاج طازج متبل بتوابلنا الخاصة مع خضار مشوية على الفحم",
      descriptionEn: "Fresh chicken kebab skewers seasoned with our spices, served with charcoal-grilled vegetables",
      ingredientsAr: ["دجاج", "توابل", "خضار"],
      ingredientsEn: ["chicken", "spices", "vegetables"],
      allergensAr: [""], allergensEn: [""],
    },
    {
      id: 4, categoryId: 1, price: 45, calories: 510,
      badges: "spicy,popular", imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80",
      featured: false, available: true, displayOrder: 4,
      nameAr: "أجنحة حارة", nameEn: "Spicy Wings",
      shortDescAr: "أجنحة دجاج حارة مع صلصة خاصة", shortDescEn: "Spicy chicken wings with signature sauce",
      descriptionAr: "أجنحة دجاج مقرمشة ومتبلة بصلصة حارة خاصة مع أعواد الكرفس",
      descriptionEn: "Crispy chicken wings tossed in our hot signature sauce with celery sticks",
      ingredientsAr: ["دجاج", "صلصة حارة", "كرفس"],
      ingredientsEn: ["chicken", "hot sauce", "celery"],
      allergensAr: [""], allergensEn: [""],
    },
    {
      id: 5, categoryId: 2, price: 32, calories: 280,
      badges: "", imageUrl: "https://images.unsplash.com/photo-1625944525537-473f2d6bd0d0?w=800&q=80",
      featured: false, available: true, displayOrder: 5,
      nameAr: "كبة", nameEn: "Kibbeh",
      shortDescAr: "كبة مشوية على الفحم", shortDescEn: "Charcoal-grilled kibbeh",
      descriptionAr: "كبة مشوية على الفحم بالطريقة التقليدية مع البصل والبرغل",
      descriptionEn: "Traditional charcoal-grilled kibbeh with bulgur and onions",
      ingredientsAr: ["لحم بقر", "برغل", "بصل"],
      ingredientsEn: ["beef", "bulgur", "onion"],
      allergensAr: ["قمح"], allergensEn: ["wheat"],
    },
    {
      id: 6, categoryId: 2, price: 18, calories: 190,
      badges: "popular", imageUrl: "https://images.unsplash.com/photo-1625579139544-aa2a8b2a0a?w=800&q=80",
      featured: false, available: true, displayOrder: 6,
      nameAr: "حمص", nameEn: "Hummus",
      shortDescAr: "حمص طازج بزبدة طحينة", shortDescEn: "Fresh hummus with tahini",
      descriptionAr: "حمص طازج مخفوق مع زبدة الطحينة والزيتون والبابريكا",
      descriptionEn: "Freshly blended chickpeas with tahini butter, olive oil, and paprika",
      ingredientsAr: ["حمص", "طحينة", "زيتون"],
      ingredientsEn: ["chickpeas", "tahini", "olive oil"],
      allergensAr: ["سمسم"], allergensEn: ["sesame"],
    },
    {
      id: 7, categoryId: 2, price: 28, calories: 320,
      badges: "", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      featured: false, available: true, displayOrder: 7,
      nameAr: "سمبوسك", nameEn: "Sambousek",
      shortDescAr: "سمبوسك محشي باللحم المفروم", shortDescEn: "Minced meat stuffed sambousek",
      descriptionAr: "سمبوسك مقرمش محشي باللحم المفروم المتبل مع البصل والصنوبر",
      descriptionEn: "Crispy pastry stuffed with seasoned minced meat, onions, and pine nuts",
      ingredientsAr: ["دقيق", "لحم مفروم", "بصل", "صنوبر"],
      ingredientsEn: ["flour", "minced meat", "onion", "pine nuts"],
      allergensAr: ["قمح"], allergensEn: ["wheat"],
    },
    {
      id: 8, categoryId: 2, price: 35, calories: 180,
      badges: "", imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
      featured: false, available: true, displayOrder: 8,
      nameAr: "خضار مشوية", nameEn: "Grilled Vegetables",
      shortDescAr: "تشكيلة من الخضار المشوية على الفحم", shortDescEn: "Selection of charcoal-grilled vegetables",
      descriptionAr: "تشكيلة فاخرة من الخضار الطازجة مشوية على الفحم مع زيت الزيتون والأعشاب",
      descriptionEn: "Premium selection of fresh vegetables grilled over charcoal with olive oil and herbs",
      ingredientsAr: ["فلفل", "باذنجان", "كوسا", "طماطم"],
      ingredientsEn: ["bell pepper", "eggplant", "zucchini", "tomato"],
      allergensAr: [""], allergensEn: [""],
    },
    {
      id: 9, categoryId: 3, price: 38, calories: 450,
      badges: "popular", imageUrl: "https://images.unsplash.com/photo-1579888944880-d9831f962f45?w=800&q=80",
      featured: false, available: true, displayOrder: 9,
      nameAr: "كنافة", nameEn: "Kunafa",
      shortDescAr: "كنافة نابلسية بالجبنة", shortDescEn: "Nabulsi kunafa with cheese",
      descriptionAr: "كنافة نابلسية تقليدية بالجبنة الطازجة وماء الورد",
      descriptionEn: "Traditional Nabulsi kunafa with fresh cheese and rose water",
      ingredientsAr: ["جبنة", "عجينة", "زبدة", "ماء ورد"],
      ingredientsEn: ["cheese", "pastry", "butter", "rose water"],
      allergensAr: ["حليب", "قمح"], allergensEn: ["milk", "wheat"],
    },
    {
      id: 10, categoryId: 3, price: 42, calories: 380,
      badges: "", imageUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80",
      featured: false, available: true, displayOrder: 10,
      nameAr: "بقلاوة", nameEn: "Baklava",
      shortDescAr: "بقلاوة بالفستق والجوز", shortDescEn: "Pistachio and walnut baklava",
      descriptionAr: "بقلاوة شرقية تقليدية بالفستق الحلبي والجوز مع القطر",
      descriptionEn: "Traditional oriental baklava with Aleppo pistachios and walnuts in syrup",
      ingredientsAr: ["فستق", "جوز", "دقيق", "قطر"],
      ingredientsEn: ["pistachio", "walnut", "flour", "syrup"],
      allergensAr: ["مكسرات", "قمح"], allergensEn: ["nuts", "wheat"],
    },
    {
      id: 11, categoryId: 4, price: 15, calories: 90,
      badges: "", imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80",
      featured: false, available: true, displayOrder: 11,
      nameAr: "ليمون بالنعناع", nameEn: "Lemon Mint",
      shortDescAr: "عصير ليمون طازج بالنعناع", shortDescEn: "Fresh lemon mint juice",
      descriptionAr: "عصير ليمون طازج منعش مع أوراق النعناع الطازجة",
      descriptionEn: "Refreshing fresh lemon juice with mint leaves",
      ingredientsAr: ["ليمون", "نعناع", "سكر"],
      ingredientsEn: ["lemon", "mint", "sugar"],
      allergensAr: [""], allergensEn: [""],
    },
    {
      id: 12, categoryId: 4, price: 12, calories: 5,
      badges: "", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      featured: false, available: true, displayOrder: 12,
      nameAr: "قهوة عربية", nameEn: "Arabic Coffee",
      shortDescAr: "قهوة عربية تقليدية بالهيل", shortDescEn: "Traditional Arabic coffee with cardamom",
      descriptionAr: "قهوة عربية تقليدية محضرة طازجة بالهيل",
      descriptionEn: "Traditional freshly brewed Arabic coffee with cardamom",
      ingredientsAr: ["قهوة", "هيل"],
      ingredientsEn: ["coffee", "cardamom"],
      allergensAr: [""], allergensEn: [""],
    },
  ];

  for (const dish of dishData) {
    await prisma.dish.upsert({
      where: { id: dish.id },
      update: {
        restaurantId,
        categoryId: dish.categoryId, price: dish.price, calories: dish.calories,
        badges: dish.badges, imageUrl: dish.imageUrl, featured: dish.featured,
        available: dish.available, displayOrder: dish.displayOrder,
        nameAr: dish.nameAr, nameEn: dish.nameEn,
        shortDescAr: dish.shortDescAr, shortDescEn: dish.shortDescEn,
        descriptionAr: dish.descriptionAr, descriptionEn: dish.descriptionEn,
        ingredientsAr: dish.ingredientsAr, ingredientsEn: dish.ingredientsEn,
        allergensAr: dish.allergensAr, allergensEn: dish.allergensEn,
      },
      create: {
        id: dish.id,
        restaurantId,
        categoryId: dish.categoryId, price: dish.price, calories: dish.calories,
        badges: dish.badges, imageUrl: dish.imageUrl, featured: dish.featured,
        available: dish.available, displayOrder: dish.displayOrder,
        nameAr: dish.nameAr, nameEn: dish.nameEn,
        shortDescAr: dish.shortDescAr, shortDescEn: dish.shortDescEn,
        descriptionAr: dish.descriptionAr, descriptionEn: dish.descriptionEn,
        ingredientsAr: dish.ingredientsAr, ingredientsEn: dish.ingredientsEn,
        allergensAr: dish.allergensAr, allergensEn: dish.allergensEn,
      },
    });
  }
  console.log("✅ Dishes seeded");

  const offerData = [
    {
      id: 1, active: true, featuredOnHome: true,
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      titleAr: "باقة الضيافة", titleEn: "Hospitality Package",
      descriptionAr: "باقة ضيافة فاخرة لـ ١٠ أشخاص تشمل تشكيلة من المشويات والمقبلات والمشروبات",
      descriptionEn: "Premium hospitality package for 10 guests including a selection of grills, appetizers, and beverages",
      validPeriodAr: "حتى ٣٠ ديسمبر ٢٠٢٦", validPeriodEn: "Valid until December 30, 2026",
    },
    {
      id: 2, active: true, featuredOnHome: true,
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      titleAr: "وجبة العائلة", titleEn: "Family Feast",
      descriptionAr: "وجبة عائلية شاملة لـ ٦ أشخاص بأطباق متنوعة ومشروبات",
      descriptionEn: "Family meal for 6 with a variety of dishes and drinks",
      validPeriodAr: "حتى ٣٠ ديسمبر ٢٠٢٦", validPeriodEn: "Valid until December 30, 2026",
    },
    {
      id: 3, active: true, featuredOnHome: false,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      titleAr: "عرض نهاية الأسبوع", titleEn: "Weekend Special",
      descriptionAr: "عرض خاص بنهاية الأسبوع مع خصم ٢٠٪ على جميع المشويات",
      descriptionEn: "Special weekend offer with 20% off all grills",
      validPeriodAr: "كل جمعة وسبت", validPeriodEn: "Every Friday and Saturday",
    },
  ];

  for (const offer of offerData) {
    await prisma.offer.upsert({
      where: { id: offer.id },
      update: {
        restaurantId,
        active: offer.active, featuredOnHome: offer.featuredOnHome, imageUrl: offer.imageUrl,
        titleAr: offer.titleAr, titleEn: offer.titleEn,
        descriptionAr: offer.descriptionAr, descriptionEn: offer.descriptionEn,
        validPeriodAr: offer.validPeriodAr, validPeriodEn: offer.validPeriodEn,
      },
      create: {
        id: offer.id,
        restaurantId,
        active: offer.active, featuredOnHome: offer.featuredOnHome, imageUrl: offer.imageUrl,
        titleAr: offer.titleAr, titleEn: offer.titleEn,
        descriptionAr: offer.descriptionAr, descriptionEn: offer.descriptionEn,
        validPeriodAr: offer.validPeriodAr, validPeriodEn: offer.validPeriodEn,
      },
    });
  }
  console.log("✅ Offers seeded");

  const settings = [
    { key: "restaurant_name_ar", value: "مشويات أيادينا" },
    { key: "restaurant_name_en", value: "Ayadina Grills" },
    { key: "site_name_ar", value: "مشويات أيادينا" },
    { key: "site_name_en", value: "Ayadina Grills" },
    { key: "site_logo_url", value: "/logo.png" },
    { key: "opening_hour", value: "12" },
    { key: "closing_hour", value: "24" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: {
        restaurantId_key: { restaurantId, key: s.key },
      },
      update: { value: s.value },
      create: { restaurantId, key: s.key, value: s.value },
    });
  }
  console.log("✅ Settings seeded");

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
