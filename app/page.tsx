"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import {
  deleteProduct,
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services/product.service";

import {
  Product,
  ProductCategory,
} from "@/types/product";

const PRODUCTS_PER_PAGE = 12;

export default function Home() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * PRODUCTS_PER_PAGE;

        let data;

        if (search.trim()) {
          data = await searchProducts(
            search.trim(),
            PRODUCTS_PER_PAGE,
            skip
          );
        } else if (category) {
          data = await getProductsByCategory(
            category,
            PRODUCTS_PER_PAGE,
            skip
          );
        } else {
          data = await getProducts(
            PRODUCTS_PER_PAGE,
            skip
          );
        }

        setProducts(data.products);
        setTotalProducts(data.total);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, category, page]);

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setPage(1);
    setSuccess("");
  };

  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
    setPage(1);
    setSuccess("");
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setPage(1);
    setError("");
    setSuccess("");
  };

  const handleDeleteClick = (product: Product) => {
    setError("");
    setSuccess("");
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    try {
      setDeletingId(productToDelete.id);
      setError("");
      setSuccess("");

      await deleteProduct(productToDelete.id);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (item) => item.id !== productToDelete.id
        )
      );

      setTotalProducts((previousTotal) =>
        Math.max(previousTotal - 1, 0)
      );

      setSuccess(
        `Product "${productToDelete.title}" deleted successfully.`
      );

      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete product:", err);

      setError(
        "Failed to delete product. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    if (deletingId !== null) {
      return;
    }

    setProductToDelete(null);
  };

  const totalPages = Math.ceil(
    totalProducts / PRODUCTS_PER_PAGE
  );

  const inStockCount = products.filter(
    (product) => product.stock > 0
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock === 0
  ).length;

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  if (loading && products.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">

          {/* Header Skeleton */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-9 w-72 animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="h-11 w-36 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* Statistics Skeleton */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-gray-200" />
                  </div>

                  <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
                </div>

                <div className="mt-4 h-3 w-40 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Filter Skeleton */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-11 w-full animate-pulse rounded-lg bg-gray-200" />
              </div>

              <div>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-11 w-full animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div
            id="products-section"
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-52 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="divide-y divide-gray-100">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 px-6 py-5"
                >
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-gray-200" />

                  <div className="flex-1">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
                  </div>

                  <div className="hidden h-6 w-24 animate-pulse rounded-full bg-gray-200 md:block" />

                  <div className="hidden h-4 w-16 animate-pulse rounded bg-gray-200 md:block" />

                  <div className="hidden h-6 w-20 animate-pulse rounded-full bg-gray-200 lg:block" />

                  <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-xl text-white sm:flex">
                ▦
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Admin Dashboard
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Product Management
                </h1>
              </div>
            </div>

            <p className="mt-2 max-w-xl text-sm text-gray-500 sm:ml-15">
              Manage your product catalog, inventory and pricing
              from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/products/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Products */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalProducts}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📦
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Products in your catalog
            </p>
          </div>

          {/* In Stock */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  In Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {inStockCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
                ✓
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Available on current page
            </p>
          </div>

          {/* Out of Stock */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Out of Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {outOfStockCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
                !
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Requiring attention
            </p>
          </div>

          {/* Categories */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Categories
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">
                #
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Available product categories
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Management
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Search and filter products from your catalog.
                </p>
              </div>

              {(search || category) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="self-start rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 sm:self-auto"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

              {/* Search */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Search Products
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>

                  <input
                    id="search"
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by product name..."
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                >
                  <option value="">
                    All Categories
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
            </div>

            {/* Active Filters */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">
                Showing:
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {products.length} products
              </span>

              {search && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Search: {search}
                </span>
              )}

              {category && (
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium capitalize text-purple-700">
                  Category: {category}
                </span>
              )}

              {loading && products.length > 0 && (
                <span className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                  Updating...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span className="font-bold">!</span>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <span className="font-bold">✓</span>
            <p>{success}</p>
          </div>
        )}

        {/* Product Table */}
        <div
          id="products-section"
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your product inventory.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                {totalProducts} total
              </span>

              <span className="text-sm text-gray-500">
                Page {page} of {totalPages || 1}
              </span>
            </div>
          </div>

          {/* Table */}
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">

                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Rating
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[280px] truncate font-semibold text-gray-900">
                              {product.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {product.brand || "No brand"}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              ID: #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>

                        {product.discountPercentage > 0 && (
                          <p className="mt-1 text-xs font-medium text-green-600">
                            {product.discountPercentage}% off
                          </p>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                          ⭐ {product.rating}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-5">
                        <p className="font-medium text-gray-900">
                          {product.stock}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          units
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                            product.stock > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.stock > 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          {product.stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/products/${product.id}`
                              )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-900 hover:text-white"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClick(product)
                            }
                            disabled={
                              deletingId === product.id
                            }
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === product.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                📦
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No products found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Try changing your search or category filter to
                find products.
              </p>

              {(search || category) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-900">
                    {products.length}
                  </span>{" "}
                  products
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Page {page} of {totalPages}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={page === 1 || loading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={
                    page === totalPages || loading
                  }
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-product-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl">
                🗑️
              </div>

              <div className="min-w-0">
                <h2
                  id="delete-product-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Delete Product?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    &quot;{productToDelete.title}&quot;
                  </span>
                  ?
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={deletingId !== null}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId !== null ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 