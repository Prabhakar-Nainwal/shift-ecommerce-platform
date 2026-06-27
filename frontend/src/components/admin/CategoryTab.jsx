import React, { useState } from "react";

import { Search, Tag } from "lucide-react";

import { categoriesData } from "../../data/dashboardData";

const CategoryTab = () => {
  const [search, setSearch] = useState("");
  const filtered = categoriesData.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <div className="relative max-w-xl mx-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search Categories"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-blue-600 font-semibold text-base">Add new category</span>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <Tag size={16} /> ADD
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["#", "Name", "Product Count", "Created On"].map(h => (
                <th key={h} className="text-blue-600 font-semibold text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.productCount}</td>
                <td className="px-4 py-3 text-gray-500">{c.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default CategoryTab