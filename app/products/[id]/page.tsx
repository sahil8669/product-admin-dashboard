"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getProductById } from "@/services/product.service";
import { Product } from "@/types/product";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const id = Number(params.id);

        if (!id) {
          setError("Invalid product ID.");
          return;
        }

        const data = await getProductById(id);

        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="hidden h-10 w-32 animate-pulse rounded-lg bg-gray-200 sm:block" />
          </div>

          {/* Main Skeleton */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2 lg:p-8">
              <div>
                <div className="h-[400px] animate-pulse rounded-2xl bg-gray-200" />

                <div className="mt-4 flex gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-20 w-20 animate-pulse rounded-xl bg-gray-200"
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
                <div className="mt-5 h-9 w-3/4 animate-pulse rounded-lg bg-gray-200" />
                <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                <div className="mt-8 h-10 w-32 animate-pulse rounded-lg bg-gray-200" />

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
                  <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />

              <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 h-5 w-28 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
              !
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              Product Not Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "The requested product could not be found."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? Array.from(new Set([product.thumbnail, ...product.images]))
      : [product.thumbnail];

  const discountedPrice =
    product.price -
    (product.price * product.discountPercentage) / 100;

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

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

              <span className="text-gray-700">Product Details</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Product Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View complete information about this product.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(`/products/edit/${product.id}`)
              }
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              ✏️ Edit Product
            </button>
          </div>
        </div>

        {/* Main Product Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="grid grid-cols-1 gap-8 p-5 sm:p-6 lg:grid-cols-2 lg:p-8">

            {/* Images */}
            <div>
              <div className="flex h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:h-[450px]">
                <img
                  src={selectedImage || product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-contain p-6"
                />
              </div>

              {/* Gallery */}
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-50 transition ${
                      selectedImage === image
                        ? "border-gray-900"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Information */}
            <div className="flex flex-col">

              {/* Category */}
              <div>
                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold capitalize text-gray-700">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-4 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                {product.title}
              </h2>

              {/* Brand */}
              <p className="mt-2 text-sm text-gray-500">
                Brand:{" "}
                <span className="font-medium text-gray-700">
                  {product.brand || "N/A"}
                </span>
              </p>

              {/* Description */}
              <p className="mt-5 text-sm leading-7 text-gray-600">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-7 border-t border-gray-100 pt-6">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </span>

                  {product.discountPercentage > 0 && (
                    <>
                      <span className="pb-1 text-base text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>

                      <span className="mb-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        {product.discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Final price after discount
                </p>
              </div>

              {/* Rating + Stock */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Customer Rating
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <span className="text-xl font-bold text-gray-900">
                      {product.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      / 5
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Inventory
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      {product.stock}
                    </span>

                    <span className="text-sm text-gray-500">
                      units
                    </span>
                  </div>
                </div>

              </div>

              {/* Status */}
              <div className="mt-5">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    product.stock > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      product.stock > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />

                  {product.stock > 0
                    ? "Currently In Stock"
                    : "Currently Out of Stock"}
                </span>
              </div>

              {/* Availability */}
              <div className="mt-auto pt-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Availability
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {product.availabilityStatus}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Product Information */}
          <section className="border-t border-gray-200 p-5 sm:p-6 lg:p-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Product Information
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Basic specifications and inventory information.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[
                ["Product ID", `#${product.id}`],
                ["SKU", product.sku],
                ["Brand", product.brand || "N/A"],
                ["Weight", `${product.weight}`],
                [
                  "Minimum Order Quantity",
                  `${product.minimumOrderQuantity}`,
                ],
                ["Category", product.category],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {label}
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold capitalize text-gray-900">
                    {value}
                  </p>
                </div>
              ))}

            </div>
          </section>

          {/* Dimensions */}
          <section className="border-t border-gray-200 p-5 sm:p-6 lg:p-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Dimensions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Physical dimensions of the product.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Width
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {product.dimensions.width}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Height
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {product.dimensions.height}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Depth
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {product.dimensions.depth}
                </p>
              </div>

            </div>
          </section>

          {/* Shipping / Warranty / Returns */}
          <section className="border-t border-gray-200 p-5 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  🚚
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Shipping
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {product.shippingInformation}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-lg">
                  🛡️
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Warranty
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {product.warrantyInformation}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-lg">
                  ↩
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Return Policy
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {product.returnPolicy}
                </p>
              </div>

            </div>
          </section>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <section className="border-t border-gray-200 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Reviews
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Feedback from customers who purchased this product.
                  </p>
                </div>

                <span className="text-sm font-medium text-gray-500">
                  {product.reviews.length} reviews
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {product.reviews.map((review, index) => (
                  <div
                    key={`${review.reviewerEmail}-${index}`}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.reviewerName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {review.reviewerEmail}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                        ⭐ {review.rating}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {review.comment}
                    </p>

                    <p className="mt-4 text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Products
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(`/products/edit/${product.id}`)
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            ✏️ Edit Product
          </button>
        </div>

      </div>
    </main>
  );
}