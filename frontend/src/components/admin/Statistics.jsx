import React, { useEffect, useState } from "react";
import { getStatistics } from "../../services/statisticsServices";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const LOW_STOCK_COLORS = ["#ef4444", "#f97316", "#facc15"];

const tip = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 13, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" };
const gridTick = { fontSize: 11, fill: "#9ca3af" };

const LowStockChart = ({ data }) => {
  const [selected, setSelected] = useState(null);
  const entry = data.find((d) => d.name === selected);
  const color = entry ? LOW_STOCK_COLORS[data.indexOf(entry)] : "#06b6d4";
  const h = Math.max(160, data.length * 48);

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
      <div style={{ flex: "0 0 55%" }}>
        <ResponsiveContainer width="100%" height={h}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" tick={gridTick} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(6,182,212,0.05)", radius: 6 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const c = LOW_STOCK_COLORS[data.indexOf(d)];
                return (
                  <div style={tip}>
                    <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 3 }}>{d.name}</div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: c }}>
                      {d.value}<span style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>products</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11, color: "#06b6d4" }}>Click to see list →</div>
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={24} style={{ cursor: "pointer" }}
              onClick={(d) => setSelected(selected === d.name ? null : d.name)}>
              {data.map((e, i) => (
                <Cell key={i} fill={LOW_STOCK_COLORS[i]} opacity={selected && selected !== e.name ? 0.3 : 1} style={{ transition: "opacity 0.2s" }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        flex: "0 0 calc(45% - 16px)", borderRadius: 12, border: `1.5px solid ${entry ? `${color}40` : "#f0f0f0"}`,
        background: entry ? "#fafafa" : "#f9fafb", display: "flex", flexDirection: "column",
        height: h, boxSizing: "border-box", overflow: "hidden", transition: "border-color 0.2s",
      }}>
        {!entry ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>←</div>
            <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", lineHeight: 1.5 }}>Click a bar to view<br />product details</div>
          </div>
        ) : (
          <>
            <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${color}20`, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>
                    {entry.value}<span style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af", marginLeft: 5 }}>items</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 14, padding: "2px 4px", borderRadius: 4 }}>✕</button>
              </div>
              <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${color}40)` }} />
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "8px 16px 12px" }}>
              {entry.products?.length ? entry.products.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < entry.products.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, opacity: 0.7 }} />
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{p}</span>
                </div>
              )) : (
                <div style={{ fontSize: 12, color: "#d1d5db", textAlign: "center", paddingTop: 20 }}>No products</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Statistics = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenueData, setRevenueData] = useState([]);
  const [topSellersData, setTopSellersData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);

  const fetchStatistics = async () => {
    if (!startDate || !endDate) return;
    try {
      const res = await getStatistics(startDate, endDate);
      setRevenueData(res.data.revenueChart);
      setTopSellersData(res.data.topProducts);
      setLowStockData(res.data.lowStock);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const pastMonth = new Date();
    pastMonth.setMonth(today.getMonth() - 1);
    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(pastMonth.toISOString().split("T")[0]);
  }, []);

  useEffect(() => { if (startDate && endDate) fetchStatistics(); }, [startDate, endDate]);

  const card = { background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", padding: "24px 28px" };
  const accent = (c) => c === "cyan" ? "#06b6d4" : "#a855f7";

  const SectionHeader = ({ title, color = "purple" }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <span style={{ display: "inline-block", width: 3, height: 18, borderRadius: 2, background: accent(color) }} />
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: accent(color) }}>{title}</h3>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Filter bar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "flex-end", gap: 12, background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "16px 20px" }}>
        {[["Start Date", startDate, setStartDate], ["End Date", endDate, setEndDate]].map(([label, value, setter]) => (
          <div key={label}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</label>
            <input type="date" value={value} onChange={(e) => setter(e.target.value)}
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none", color: "#374151" }} />
          </div>
        ))}
        <button onClick={fetchStatistics}
          style={{ background: "#a855f7", color: "#fff", border: "none", borderRadius: 10, padding: "8px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Apply
        </button>
      </div>

      {/* Revenue */}
      <div style={card}>
        <SectionHeader title="Revenue" />
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenueData} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="label" tick={(p) => <text x={p.x} y={p.y + 10} textAnchor="middle" fontSize={11} fill="#9ca3af">{p.payload.value}</text>} axisLine={false} tickLine={false} />
            <YAxis tick={gridTick} axisLine={false} tickLine={false} />
            <Tooltip content={({ active, payload }) =>
              active && payload?.length ? (
                <div style={tip}>
                  <div style={{ color: "#9ca3af", marginBottom: 2 }}>{payload[0].payload.fullLabel || payload[0].payload.label}</div>
                  <div style={{ fontWeight: 600, color: "#a855f7", fontSize: 15 }}>₹{payload[0].value?.toLocaleString()}</div>
                </div>
              ) : null
            } />
            <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2.5} fill="url(#revGrad)" dot={false}
              activeDot={{ r: 6, fill: "#a855f7", stroke: "#fff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Sellers */}
      <div style={card}>
        <SectionHeader title="Top Sellers" />
        <ResponsiveContainer width="100%" height={Math.max(200, topSellersData.length * 44)}>
          <BarChart data={topSellersData} layout="vertical" margin={{ left: 8, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" tick={gridTick} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="product" tick={{ fontSize: 12, fill: "#6b7280" }} width={120} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(129,140,248,0.06)", radius: 6 }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div style={tip}>
                    <div style={{ color: "#9ca3af", marginBottom: 2 }}>{payload[0].payload.product}</div>
                    <div style={{ fontWeight: 600, color: "#6366f1", fontSize: 15 }}>{payload[0].value?.toLocaleString()} sales</div>
                  </div>
                ) : null
              }
            />
            <Bar dataKey="salesCount" fill="#818cf8" radius={[0, 8, 8, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock */}
      <div style={card}>
        <SectionHeader title="Low Stock Products" color="cyan" />
        <LowStockChart data={lowStockData} />
      </div>
    </div>
  );
};

export default Statistics;