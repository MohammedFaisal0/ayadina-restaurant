export type MenuCategory =
  | "grills"
  | "appetizers"
  | "pastries"
  | "drinks";

export type DishBadge = "spicy" | "popular";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  price: number;
  calories: number;
  badges: DishBadge[];
  image: string;
  featured?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: "mixedGrill",
    category: "grills",
    price: 149,
    calories: 920,
    badges: ["popular"],
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
    featured: true,
  },
  {
    id: "lambChops",
    category: "grills",
    price: 119,
    calories: 680,
    badges: ["popular"],
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
    featured: true,
  },
  {
    id: "chickenKebab",
    category: "grills",
    price: 59,
    calories: 420,
    badges: [],
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    featured: true,
  },
  {
    id: "spicyWings",
    category: "grills",
    price: 45,
    calories: 510,
    badges: ["spicy", "popular"],
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80",
  },
  {
    id: "kibbeh",
    category: "appetizers",
    price: 32,
    calories: 280,
    badges: [],
    image:
      "https://images.unsplash.com/photo-1625944525537-473f2d6bd0d0?w=800&q=80",
  },
  {
    id: "hummus",
    category: "appetizers",
    price: 18,
    calories: 190,
    badges: ["popular"],
    image:
      "https://images.unsplash.com/photo-1625579139544-aa2a8b2a0a?w=800&q=80",
  },
  {
    id: "sambousek",
    category: "appetizers",
    price: 28,
    calories: 320,
    badges: [],
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  },
  {
    id: "grilledVegetables",
    category: "appetizers",
    price: 35,
    calories: 180,
    badges: [],
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
  },
  {
    id: "kunafa",
    category: "pastries",
    price: 38,
    calories: 450,
    badges: ["popular"],
    image:
      "https://images.unsplash.com/photo-1579888944880-d9831f962f45?w=800&q=80",
  },
  {
    id: "baklava",
    category: "pastries",
    price: 42,
    calories: 380,
    badges: [],
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80",
  },
  {
    id: "lemonMint",
    category: "drinks",
    price: 15,
    calories: 90,
    badges: [],
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80",
  },
  {
    id: "arabicCoffee",
    category: "drinks",
    price: 12,
    calories: 5,
    badges: [],
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
  },
];

export const featuredDishIds = menuItems
  .filter((item) => item.featured)
  .map((item) => item.id);

export type OfferItem = {
  id: string;
  image: string;
};

export const offers: OfferItem[] = [
  {
    id: "hospitalityPackage",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    id: "familyFeast",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  },
  {
    id: "weekendSpecial",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  },
];

export type Branch = {
  id: string;
  phone: string;
  mapUrl: string;
  coordinates: { lat: number; lng: number };
};

export const branches: Branch[] = [
  {
    id: "maali",
    phone: "+966112345678",
    mapUrl: "https://maps.google.com/?q=24.7136,46.6753",
    coordinates: { lat: 24.7136, lng: 46.6753 },
  },
  {
    id: "naseem",
    phone: "+966112345679",
    mapUrl: "https://maps.google.com/?q=24.7494,46.8128",
    coordinates: { lat: 24.7494, lng: 46.8128 },
  },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  "https://images.unsplash.com/photo-1590846400822-0a1a4a5b5f5b?w=800&q=80",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
];

export const OPENING_HOUR = 12;
export const CLOSING_HOUR = 24;

export function isRestaurantOpen(date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= OPENING_HOUR && hour < CLOSING_HOUR;
}
