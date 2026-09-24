"use client";

import { usePathname, useRouter } from "next/navigation";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: "▦",
  },
  {
    name: "Products",
    path: "/",
    icon: "📦",
  },
  {
    name: "Add Product",
    path: "/products/add",
    icon: "+",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-gray-950 text-white lg:flex">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-800 px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Product Admin
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            Management Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Menu
        </p>

        <div className="space-y-2">

          {navigationItems.map((item) => {
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname === item.path ||
                  pathname.startsWith(`${item.path}/`);

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => router.push(item.path)}
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

      {/* Bottom Section */}
      <div className="border-t border-gray-800 p-4">

        <div className="rounded-lg bg-gray-900 p-4">

          <p className="text-xs font-medium text-gray-400">
            Admin Panel
          </p>

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

    </aside>
  );
}