"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  getCategories,
  CreateProductData,
} from "@/services/product.service";

import { ProductCategory } from "@/types/product";

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [formData, setFormData] = useState<CreateProductData>({
    title: "",
    description: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    stock: 0,
    brand: "",
  });

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getCategories();

        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" ||
        name === "discountPercentage" ||
        name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (formData.stock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    if (
      formData.discountPercentage < 0 ||
      formData.discountPercentage > 100
    ) {
      setError(
        "Discount percentage must be between 0 and 100."
      );
      return;
    }

    try {
      setLoading(true);

      const createdProduct = await createProduct(formData);

      console.log("Created Product:", createdProduct);

      setSuccess(
        `Product "${createdProduct.title}" added successfully.`
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        price: 0,
        discountPercentage: 0,
        stock: 0,
        brand: "",
      });
    } catch (err) {
      console.error("Failed to create product:", err);

      setError(
        "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">

          {/* Header Skeleton */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="h-8 w-52 animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="hidden h-10 w-24 animate-pulse rounded-lg bg-gray-200 sm:block" />
          </div>

          {/* Form Skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-11 w-full animate-pulse rounded-lg bg-gray-200" />
              </div>

              <div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-32 w-full animate-pulse rounded-lg bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="transition hover:text-gray-900"
              >
                Products
              </button>

              <span>›</span>

              <span className="text-gray-700">
                Add Product
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Add Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add a new product to your catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            ← Back
          </button>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Form Header */}
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg">
                +
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the basic details for your new product.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-7 p-5 sm:p-6"
          >

            {/* Basic Information */}
            <section>
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900">
                  Basic Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Provide the product name, description and category.
                </p>
              </div>

              <div className="space-y-5">

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Product Title{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Premium Wireless Headphones"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe the product, its features and key benefits..."
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Write a clear and informative product description.
                  </p>
                </div>

                {/* Category + Brand */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Category{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="">
                        Select Category
                      </option>

                      {categories.map((item) => (
                        <option
                          key={item.slug}
                          value={item.slug}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="brand"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Brand
                    </label>

                    <input
                      id="brand"
                      name="brand"
                      type="text"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="e.g. Apple, Samsung, Nike"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* Pricing & Inventory */}
            <section className="border-t border-gray-200 pt-7">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900">
                  Pricing & Inventory
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Set pricing, discount and available inventory.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Price{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      $
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label
                    htmlFor="discountPercentage"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Discount
                  </label>

                  <div className="relative">
                    <input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      %
                    </span>
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label
                    htmlFor="stock"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>

                  <div className="relative">
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Number of units currently available.
                  </p>
                </div>

              </div>
            </section>

            {/* Messages */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to add product
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Product added successfully
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => router.push("/")}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Adding Product...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>

            </div>

          </form>
        </div>

        {/* Footer Hint */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Fields marked with <span className="text-red-500">*</span> are required.
        </p>

      </div>
    </main>
  );
}