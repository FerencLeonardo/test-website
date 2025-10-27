"use client";
import React, { useEffect, useMemo, useState } from "react";

interface Animal {
  id: number;
  name: string;
  created_at: string;
}

export default function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function loadAnimals() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/animals", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch failed: ${res.status} ${text}`);
      }
      const data: Animal[] = await res.json();
      setAnimals(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnimals();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) {
      return animals;
    }
    return animals.filter(a => a.name.toLowerCase().includes(q));
  }, [animals, filter]);

  const count = filtered.length;

  async function addAnimal(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch failed: ${res.status} ${text}`);
      }
      setNewName("");
      await loadAnimals();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3x1 p-6">
      <h1 className="mb-2 text-3x1 font-bold">Animals</h1>

      {loading && <p className="text-sm text-gray-600">Loading...</p>}
      {error && (
        <p>
          {error}
        </p>
      )}

      {/* Controls */}
      <section className="mt-4 mb-5 flex items-center gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name..."
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm outline-none ring-0 focus:border-gray-400 focus:ring-0"
        />
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
          {count} shown
        </span>
        <button 
          onClick={loadAnimals}
          className="rounded-lg border border-gray-300 bg-white pix-3 py-2 text-gray-900 text-sm hover:bg-gray-50 active:bg-gray-100">
            Refresh
        </button>
      </section>

      {/* Empty vs list */}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-gray-600">No animals yet.</p>
      )}

      <ul className="space-y-2">
        {filtered.map((a) => (
          <li
            key={a.id}
            className="rounded-x1 border border-gray-300 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <strong className="text-black text-base font-semibold">{a.name}</strong>
                <span className = "text-xs text-gray-700">
                  added {new Date(a.created_at).toLocaleString()}
                </span>
              </div>
          </li>
        ))}
      </ul>

      {/* Create form */}
      <form onSubmit={addAnimal} className="mt-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New animal name"
          disabled={submitting}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm outline-none foucs:border-gray-400 disabled:cursor-not-allowed disabled:opcaity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Adding..." : "Add"}
        </button>
      </form>
    </main>
  );
}