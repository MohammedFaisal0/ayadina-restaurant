import type { BilingualList, BilingualText } from "@/types/data";

const DICTIONARY: Record<string, string> = {
  // ── Dishes ──
  "طبق مشاوي مشكل": "Mixed Grill Platter",
  "ريش غنم، كباب، وأسياخ دجاج.": "Lamb chops, kebab, and chicken skewers.",
  "طبق مميز من ريش الغنم على الفحم، الكباب المتبل، وأسياخ الدجاج الطرية مع خضار مشوية وصلصة البيت.":
    "A signature platter of charcoal-grilled lamb chops, seasoned kebab, and tender chicken skewers served with grilled vegetables and our house sauce.",
  "ريش غنم على الفحم": "Charcoal Lamb Chops",
  "ريش غنم فاخرة بتتبيلة أعشاب.": "Premium lamb chops with herb marinade.",
  "ريش غنم سميكة متبلة بالأعشاب والبهارات، مشوية على الفحم بنكهة مدخنة وطرية.":
    "Thick-cut lamb chops marinated in herbs and spices, grilled over charcoal for a smoky, juicy finish.",
  "كباب دجاج": "Chicken Kebab",
  "أسياخ دجاج طرية متبلة.": "Tender chicken skewers with spices.",
  "مكعبات دجاج متبلة ومشوية على أسياخ، تُقدَّم مع الطحينة والخبز الطازج.":
    "Marinated chicken cubes grilled on skewers, served with tahini and fresh bread.",
  "كبة مقلية": "Fried Kibbeh",
  "قشرة برغل مقرمشة بحشوة لحم.": "Crispy bulgur shells with spiced meat.",
  "كبة مقلية ذهبية بحشوة لحم مفروم ومكسرات صنوبر.":
    "Golden fried kibbeh with a savory minced meat and pine nut filling.",
  "حمص كلاسيكي": "Classic Hummus",
  "حمص كريمي بزيت الزيتون.": "Creamy chickpea dip with olive oil.",
  "حمص ناعم مزين بزيت الزيتون والفلفل الحلو، يُقدَّم مع خبز دافئ.":
    "Smooth hummus topped with olive oil and paprika, served with warm bread.",
  "سمبوسة جبن": "Cheese Sambousek",
  "عجينة مقرمشة محشوة بالجبن.": "Crispy pastry filled with cheese.",
  "أقراص عجين مطوية يدوياً محشوة بالجبن الذائب والأعشاب.":
    "Hand-folded pastry pockets filled with melted cheese and herbs.",
  "كنافة": "Kunafa",
  "عجينة شعيرية دافئة بالقطر.": "Warm shredded pastry with sweet syrup.",
  "كنافة تقليدية بخيوط كتاifi مقرمشة وقطر عطري.":
    "Traditional kunafa with crispy kataifi threads and aromatic syrup.",
  "بقلاوة مشكلة": "Mixed Baklava",
  "حلويات بالعسل والمكسرات.": "Assorted honey-soaked pastries.",
  "تشكيلة بقلاوة بالفستق والجوز مع زبدة وقطر العسل.":
    "A selection of pistachio and walnut baklava layered with butter and honey syrup.",
  "ليمون بالنعناع": "Fresh Lemon Mint",
  "مشروب منعش بالحمضيات والنعناع.": "Refreshing citrus and mint cooler.",
  "ليمون طازج مع أوراق النعناع ولمسة من الحلاوة.":
    "Freshly squeezed lemon with mint leaves and a touch of sweetness.",
  "قهوة عربية": "Arabic Coffee",
  "قهوة تقليدية متبلة خفيفاً.": "Traditional lightly spiced coffee.",
  "قهوة عربية أصيلة تُقدَّم مع التمر ولمسة هيل.":
    "Authentic Arabic coffee served with dates, lightly spiced with cardamom.",
  "أجنحة دجاج حارة": "Spicy Grilled Wings",
  "أجنحة مشوية بصلصة فلفل.": "Fire-grilled wings with chili glaze.",
  "أجنحة دجاج مشوية على الفحم بصلصة الفلفل الحار الخاصة.":
    "Charcoal-grilled chicken wings tossed in our signature spicy chili glaze.",
  "طبق خضار مشوية": "Grilled Vegetable Plate",
  "خضار موسمية من الشواية.": "Seasonal vegetables from the grill.",
  "طبق ملون من الخضار الموسمية المشوية بزيت الزيتون والأعشاب.":
    "A colorful plate of seasonal vegetables grilled with olive oil and herbs.",

  // ── Ingredients ──
  "لحم غنم": "Lamb",
  "كباب لحم": "Beef kebab",
  "صدر دجاج": "Chicken breast",
  "خضار مشوية": "Grilled vegetables",
  "بهارات خاصة": "House spice blend",
  "صلصة ثوم": "Garlic sauce",
  "زيت زيتون": "Olive oil",
  "ثوم": "Garlic",
  "أعشاب طازجة": "Fresh herbs",
  "بهارات": "Spices",
  "تتبيلة زبادي": "Yogurt marinade",
  "بصل": "Onion",
  "طحينة": "Tahini",
  "برغل": "Bulgur",
  "لحم غنم مفروم": "Minced lamb",
  "صنوبر": "Pine nuts",
  "حمص": "Chickpeas",
  "ليمون": "Lemon",
  "عجين": "Pastry dough",
  "مزيج جبن": "Cheese blend",
  "بقدونس": "Parsley",
  "عجين كنافة": "Kataifi pastry",
  "جبن حلو": "Sweet cheese",
  "قطر": "Sugar syrup",
  "فستق": "Pistachio",
  "زبدة": "Butter",
  "عجين فيلو": "Phyllo pastry",
  "جوز": "Walnut",
  "قطر عسل": "Honey syrup",
  "ليمون طازج": "Fresh lemon",
  "نعناع": "Mint",
  "ماء": "Water",
  "سكر": "Sugar",
  "بن عربي": "Arabic coffee beans",
  "هيل": "Cardamom",
  "أجنحة دجاج": "Chicken wings",
  "معجون فلفل": "Chili paste",
  "كوسا": "Zucchini",
  "فلفل رومي": "Bell pepper",
  "باذنجان": "Eggplant",
  "أعشاب": "Herbs",

  // ── Allergens ──
  "جلوتين": "Gluten",
  "ألبان": "Dairy",
  "سمسم": "Sesame",
  "مكسرات": "Nuts",

  // ── Offers ──
  "باقة الضيافة المتكاملة": "Hospitality Package",
  "وليمة كاملة للتجمعات — مشاوي مشكلة، مقبلات، معجنات، ومشروبات لـ 10–15 ضيفاً.":
    "A complete feast for gatherings — mixed grills, appetizers, pastries, and drinks for 10–15 guests.",
  "ساري حتى ديسمبر 2026": "Valid until December 2026",
  "عرض وليمة العائلة": "Family Feast Deal",
  "طبق مشاوي مشكل، حمص، سمبوسة، ومشروبين كبيرين بسعر خاص.":
    "Mixed grill platter, hummus, sambousek, and two large drinks at a special price.",
  "أيام الأسبوع فقط · حتى نهاية الشهر": "Weekdays only · until end of month",
  "عرض نهاية الأسبوع": "Weekend Special",
  "خصم 20% على أطباق المشاوي المختارة كل خميس إلى سبت بعد 6 مساءً.":
    "20% off selected grill dishes every Thursday to Saturday after 6 PM.",
  "كل نهايةسبوع": "Every weekend",

  // ── Common ──
  "حار": "Spicy",
  "الأكثر طلباً": "Popular",
  "المكونات": "Ingredients",
  "مسببات الحساسية": "Allergens",
  "ساري حتى": "Valid until",
  "مميز": "Featured",
  "sfari hatta": "Valid until",
};

function translateWord(word: string): string {
  const trimmed = word.trim();
  if (DICTIONARY[trimmed]) return DICTIONARY[trimmed];
  return trimmed;
}

export function translateText(arabicText: string): string {
  const trimmed = arabicText.trim();
  if (!trimmed) return "";
  if (DICTIONARY[trimmed]) return DICTIONARY[trimmed];

  const words = trimmed.split(/\s+/);
  const translated = words.map((w) => {
    const noPunct = w.replace(/[،.؟!،:;]/g, "");
    const punct = w.slice(noPunct.length);
    if (DICTIONARY[noPunct]) return DICTIONARY[noPunct] + punct;
    return w;
  });
  return translated.join(" ");
}

export function translateList(items: string[]): string[] {
  return items.map(translateWord);
}

export function translateBilingual(ar: string, existingEn?: string): string {
  if (existingEn && existingEn.trim()) return existingEn;
  return translateText(ar);
}

export function translateBilingualList(
  arItems: string[],
  existingEnItems?: string[],
): string[] {
  if (existingEnItems && existingEnItems.length === arItems.length && existingEnItems.some((e) => e.trim())) {
    return existingEnItems;
  }
  return translateList(arItems);
}

export function buildBilingualText(
  ar: string,
  existingEn?: string,
): BilingualText {
  return { ar, en: translateBilingual(ar, existingEn) };
}

export function buildBilingualList(
  arItems: string[],
  existingEnItems?: string[],
): BilingualList {
  return { ar: arItems, en: translateBilingualList(arItems, existingEnItems) };
}
