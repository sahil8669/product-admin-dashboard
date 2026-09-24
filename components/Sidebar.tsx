"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: "▦" },
  { name: "Products", path: "/", icon: "📦" },
  { name: "Add Product", path: "/products/add", icon: "+" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (path: string, name: string) => {
    if (name === "Products") {
      if (pathname === "/") {
        document
          .getElementById("products-section")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/");
      }
    } else {
      router.push(path);
    }

    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="flex h-20 items-center border-b border-gray-800 px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Product Admin</h1>
          <p className="mt-1 text-xs text-gray-500">
            Management Dashboard
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Menu
        </p>

        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isDashboard = item.name === "Dashboard";
            const isAddProduct = item.name === "Add Product";

            const isActive =
              (isDashboard && pathname === "/") ||
              (isAddProduct &&
                (pathname === "/products/add" ||
                  pathname.startsWith("/products/edit/")));

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavigation(item.path, item.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-gray-950"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <span className="flex w-6 justify-center text-base">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="rounded-lg bg-gray-900 p-4">
          <p className="text-xs font-medium text-gray-400">Admin Panel</p>

          <p className="mt-1 text-sm font-semibold text-white">
            Product Management
          </p>
        </div>

        <a
          href="https://github.com/sahil8669/product-admin-dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
        >
          <span>GitHub</span>
          <span className="ml-auto">↗</span>
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-gray-950 text-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Product Admin
          </h1>

          <p className="text-[11px] text-gray-500">
            Management Dashboard
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl text-gray-700 transition hover:bg-gray-100"
        >
          ☰
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 z-[60] flex h-screen w-72 flex-col bg-gray-950 text-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute right-4 top-5">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            ✕
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  );
}