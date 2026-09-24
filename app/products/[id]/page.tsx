"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getProductById } from "@/services/product.service";
import { Product } from "@/types/product";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
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
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-600">
              {error || "Product not found."}
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
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Details
            </h1>

            <p className="mt-1 text-gray-600">
              View complete product information.
            </p>
          </div>

          <div className="flex gap-3">

            {/* Edit Button */}
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/products/edit/${product.id}`
                )
              }
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              ✏️ Edit Product
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ← Back
            </button>

          </div>
        </div>

        {/* Product Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2">

            {/* Product Image */}
            <div>
              <div className="flex h-[450px] items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              </div>

              {product.images &&
                product.images.length > 0 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto">
                    {product.images.map(
                      (image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                        />
                      )
                    )}
                  </div>
                )}
            </div>

            {/* Product Main Information */}
            <div>

              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                {product.category}
              </span>

              <h2 className="mt-4 text-3xl font-bold text-gray-900">
                {product.title}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-6">
                <p className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>

                <p className="mt-2 text-sm font-medium text-green-600">
                  {product.discountPercentage}% discount
                </p>
              </div>

              {/* Rating + Stock */}
              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Rating
                  </p>

                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    ⭐ {product.rating}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Stock
                  </p>

                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {product.stock}
                  </p>
                </div>

              </div>

              {/* Status */}
              <div className="mt-6">
                <span
                  className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

            </div>
          </div>

          {/* Product Information */}
          <div className="border-t border-gray-200 p-6">

            <h3 className="text-xl font-semibold text-gray-900">
              Product Information
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className="text-sm text-gray-500">
                  Product ID
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {product.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  SKU
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {product.sku}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Brand
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {product.brand || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Weight
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {product.weight}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Minimum Order Quantity
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {product.minimumOrderQuantity}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Availability
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {product.availabilityStatus}
                </p>
              </div>

            </div>
          </div>

          {/* Shipping + Warranty */}
          <div className="grid grid-cols-1 gap-6 border-t border-gray-200 p-6 md:grid-cols-2">

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Shipping Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {product.shippingInformation}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Warranty
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {product.warrantyInformation}
              </p>
            </div>

          </div>

          {/* Return Policy */}
          <div className="border-t border-gray-200 p-6">

            <h3 className="text-lg font-semibold text-gray-900">
              Return Policy
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {product.returnPolicy}
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}