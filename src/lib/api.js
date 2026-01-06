const STORE_ID = "0000125";
const BASE_URL = "https://ecommerce-saas-server-wine.vercel.app/api/v1";

// Fetch banners
export async function getBanners() {
  try {
    const response = await fetch(`${BASE_URL}/banner/website`, {
      next: { revalidate: 10, tags: ["banner"] },
      headers: {
        "Content-Type": "application/json",
        "store-id": STORE_ID,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch banners");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return null;
  }
}

// Fetch categories
export async function getCategories() {
  try {
    const response = await fetch(`${BASE_URL}/category/website/${STORE_ID}`, {
      next: { revalidate: 10, tags: ["category"] },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
}

// Fetch products by category
export async function getProducts(category = "") {
  try {
    const url = category
      ? `${BASE_URL}/product/website?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/product/website`;

    const response = await fetch(url, {
      next: { revalidate: 10, tags: ["product"] },
      headers: {
        "Content-Type": "application/json",
        "store-id": STORE_ID,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}
