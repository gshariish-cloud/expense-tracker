import { useEffect, useState } from "react";
import API from "../services/api";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_META = {
  Food: { color: "#C9A227", icon: "🍽" },
  Travel: { color: "#4E8CA8", icon: "✈️" },
  Shopping: { color: "#B5679D", icon: "🛍" },
  Bills: { color: "#6B8F71", icon: "🧾" }
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [dark, setDark] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food"
  });

  const loadExpenses = async () => {
    const res = await API.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExpense = async () => {
    await API.post("/expenses", {
      ...form,
      amount: Number(form.amount),
      date: new Date()
    });

    setForm({ title: "", amount: "", category: "Food" });
    loadExpenses();
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`);
    loadExpenses();
  };

  const filtered = expenses.filter((e) => {
    return (
      (category === "All" || e.category === category) &&
      e.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  const chartData = {
    labels: [...new Set(filtered.map((e) => e.category))],
    datasets: [
      {
        data: [...new Set(filtered.map((e) => e.category))].map((cat) =>
          filtered
            .filter((e) => e.category === cat)
            .reduce((a, b) => a + b.amount, 0)
        ),
        backgroundColor: ["#C9A227", "#4E8CA8", "#B5679D", "#6B8F71"],
        borderWidth: 0
      }
    ]
  };

  const total = filtered.reduce((a, b) => a + b.amount, 0);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className={dark ? "et dark" : "et"}>
     

      <div className="wrap">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="brand">
            <h1>Expense Tracker</h1>
        
          </div>

          <div>
            <button className="icon-btn" onClick={() => setDark(!dark)}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button className="icon-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="grid">
          {/* LEFT COLUMN: FORM + FILTERS */}
          <div>
            <div className="panel">
              <h3>Add Expense</h3>

              <label>Title</label>
              <input
                placeholder="e.g. Groceries"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <label>Amount (₹)</label>
              <input
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />

              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
              </select>

              <button className="add-btn" onClick={addExpense}>
                + Add Expense
              </button>
            </div>

            <div className="panel">
              <h3>Breakdown</h3>
              <div className="chart-box">
                <Pie data={chartData} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SEARCH/FILTER + LIST */}
          <div className="panel">
            <h3>Expenses</h3>

            <div className="filter-row">
              <input
                placeholder="Search expenses..."
                onChange={(e) => setSearch(e.target.value)}
              />

              <select onChange={(e) => setCategory(e.target.value)}>
                <option>All</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
              </select>
            </div>

            <div className="total-line">
              <span className="label">Total ({filtered.length} entries)</span>
              <span className="amount">₹{total.toFixed(2)}</span>
            </div>

            {filtered.length === 0 && (
              <div className="empty">No expenses match — add one to get started.</div>
            )}

            {filtered.map((e) => {
              const meta = CATEGORY_META[e.category] || { color: "#999", icon: "•" };
              return (
                <div className="entry" key={e._id}>
                  <div className="stamp" style={{ color: meta.color }}>
                    {meta.icon}
                  </div>

                  <div className="entry-info">
                    <h4>{e.title}</h4>
                    <small>{e.category}</small>
                  </div>

                  <div className="entry-amount" style={{ color: meta.color }}>
                    ₹{e.amount}
                  </div>

                  <button className="del-btn" onClick={() => deleteExpense(e._id)}>
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}