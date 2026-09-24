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
  };

  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
    setPage(1);
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
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading products...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Admin Dashboard
            </h1>

            <p className="mt-1 text-gray-600">
              Manage and view your products.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/products/add")}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Add Product
          </button>

        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Current Page
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {page}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {categories.length}
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search Products
              </label>

              <input
                id="search"
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by product name..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

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
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
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
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Product Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-gray-200 bg-gray-50">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Rating
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-200">

                {products.map((product) => (

                  <tr
                    key={product.id}
                    className="transition hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-4">

                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                        />

                        <div>

                          <p className="font-medium text-gray-900">
                            {product.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ID: {product.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                        {product.category}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      ⭐ {product.rating}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/products/${product.id}`
                            )
                          }
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
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
                          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* No Products */}
          {!loading &&
            products.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-gray-500">
                  No products found.
                </p>
              </div>
            )}

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">

              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-product-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl">
                🗑️
              </div>

              <div>
                <h2
                  id="delete-product-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Delete Product?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    "{productToDelete.title}"
                  </span>
                  ?
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">

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
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId !== null
                  ? "Deleting..."
                  : "Delete Product"}
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}