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

  /*
   * Load Product + Categories
   */
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

        const [productData, categoriesData] =
          await Promise.all([
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
          discountPercentage:
            productData.discountPercentage || 0,
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

  /*
   * Handle Input Change
   */
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

  /*
   * Submit Update
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * Validation
     */
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

    if (!product) {
      setError("Product information is missing.");
      return;
    }

    /*
     * Update Product
     */
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

  /*
   * Loading State
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error State
   */
  if (error && !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Product
            </h1>

            <p className="mt-1 text-gray-600">
              Update product information.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/products/${product?.id}`)
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Product Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter product description"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Category + Brand */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
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

              {/* Brand */}
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>

            {/* Price + Discount + Stock */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Price *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Discount */}
              <div>
                <label
                  htmlFor="discountPercentage"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Discount (%)
                </label>

                <input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

              <button
                type="button"
                onClick={() =>
                  router.push(`/products/${product?.id}`)
                }
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Updating Product..."
                  : "Update Product"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </main>
  );
}