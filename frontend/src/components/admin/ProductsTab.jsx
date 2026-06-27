import React, { useEffect, useState } from "react";
import { Search, Package, Pencil } from "lucide-react";
import { getProducts } from "../../services/productService";
import AddProduct from "./AddProduct";

const ProductsTab = () => {
  const [search, setSearch] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [view, setView] = useState(null); // null | { mode: "add" } | { mode: "edit", product }

  // 1. Extract the fetching logic into a reusable function
  const fetchProductsData = async () => {
    try {
      const res = await getProducts();
      setProductsData(res.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  if (!productsData) {
    return <div className="absolute top-1/2 left-1/2">loading..............</div>;
  }

  if (view) {
    return (
      <AddProduct
        mode={view.mode}
        product={view.product ?? null}
        onClose={(shouldRefresh) => {
          setView(null);
          // 2. Refresh the data if the product was successfully saved/updated
          if (shouldRefresh) {
            fetchProductsData();
          }
        }}
      />
    );
  }

  const filtered = productsData.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 px-1">
      {/* Header row: search + add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Search by name or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setView({ mode: "add" })}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition whitespace-nowrap"
        >
          <Package size={15} /> Add Product
        </button>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Image", "Name", "Category", "Price", "Stock", "Rating", ""].map(h => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p._id} className="hover:bg-blue-50/40 transition-colors group">
                <td className="px-5 py-3">
                  <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={p.coverImage} alt={p.name} className="h-10 w-10 object-contain" />
                  </div>
                </td>
                <td className="px-5 py-3 font-semibold text-gray-800">{p.name}</td>
                <td className="px-5 py-3">
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-gray-800">₹{p.price}</td>
                <td className="px-5 py-3 text-gray-500">{p.stock}</td>
                <td className="px-5 py-3 text-amber-400 tracking-tight">{"★".repeat(Math.round(p.rating))}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setView({ mode: "edit", product: p })}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg bg-white hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 group-hover:border-gray-300 transition"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;