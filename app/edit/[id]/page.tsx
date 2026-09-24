"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getCategories,
  getProductById,
  updateProduct,
} from "@/services/product.service";

import { Product, ProductCategory } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    stock: 0,
    brand: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const id = Number(params.id);

        if (!id) {
          setError("Invalid product ID.");
          return;
        }

        const [productData, categoriesData] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        setProduct(productData);
        setCategories(categoriesData);

        setFormData({
          title: productData.title || "",
          description: productData.description || "",
          category: productData.category || "",
          price: productData.price || 0,
          discountPercentage: productData.discountPercentage || 0,
          stock: productData.stock || 0,
          brand: productData.brand || "",
        });
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

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

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      setError("Discount percentage must be between 0 and 100.");
      return;
    }

    if (!product) {
      setError("Product information is missing.");
      return;
    }

    try {
      setSaving(true);

      const updatedProduct = await updateProduct(
        product.id,
        formData
      );

      setProduct(updatedProduct);

      setFormData({
        title: updatedProduct.title || "",
        description: updatedProduct.description || "",
        category: updatedProduct.category || "",
        price: updatedProduct.price || 0,
        discountPercentage:
          updatedProduct.discountPercentage || 0,
        stock: updatedProduct.stock || 0,
        brand: updatedProduct.brand || "",
      });

      setSuccess(
        `Product "${updatedProduct.title}" updated successfully.`
      );
    } catch (err) {
      console.error("Failed to update product:", err);

      setError(
        "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="space-y-6 p-6">
              <div className="h-11 w-full animate-pulse rounded-lg bg-gray-200" />
              <div className="h-32 w-full animate-pulse rounded-lg bg-gray-200" />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              !
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Unable to load product
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="transition hover:text-gray-900"
          >
            Dashboard
          </button>

          <span>/</span>

          <button
            type="button"
            onClick={() =>
              router.push(`/products/${product?.id}`)
            }
            className="transition hover:text-gray-900"
          >
            Product Details
          </button>

          <span>/</span>

          <span className="font-medium text-gray-900">
            Edit Product
          </span>
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-lg text-white">
                ✎
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Edit Product
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Update the product information and inventory.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/products/${product?.id}`)
            }
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            ← Back to Product
          </button>
        </div>

        {/* Product Summary */}
        {product && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xl">📦</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Currently Editing
                </p>

                <h2 className="mt-1 truncate text-base font-semibold text-gray-900 sm:text-lg">
                  {product.title}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    ID: #{product.id}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {product.category}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <section className="border-b border-gray-200 p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the product name, description, category
                  and brand.
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
                    placeholder="Enter product title"
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
                    placeholder="Enter product description"
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />
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
                      placeholder="Enter brand name"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing & Inventory */}
            <section className="p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pricing & Inventory
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update pricing, discount and available stock.
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
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
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
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-8 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
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
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
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

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              {/* Discount Preview */}
              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Pricing Preview
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Current price after discount
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xl font-bold text-gray-900">
                      $
                      {(
                        formData.price -
                        (formData.price *
                          formData.discountPercentage) /
                          100
                      ).toFixed(2)}
                    </p>

                    {formData.discountPercentage > 0 && (
                      <p className="text-xs text-gray-500">
                        {formData.discountPercentage}% discount applied
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <span className="font-bold">!</span>
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  <span className="font-bold">✓</span>
                  <p>{success}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Fields marked with{" "}
                  <span className="text-red-500">*</span> are
                  required.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/products/${product?.id}`)
                    }
                    disabled={saving}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        ✓ Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </main>
  );
}