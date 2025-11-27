"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
}

interface Professional {
  id: number;
  name: string;
  email: string;
  city: string;
  serviceType: string;
  verified: boolean;
}

export function AdminUsersContent({ admin }: { admin: Admin }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"clients" | "professionals" | "all">("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, [activeTab]);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?type=${activeTab}`, {
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur API" }));
        throw new Error(errorData.error || "Erreur API");
      }
      const data = await response.json();
      if (data.clients) setClients(data.clients);
      if (data.professionals) setProfessionals(data.professionals);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
      alert(error instanceof Error ? error.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(professionalId: number, verified: boolean) {
    try {
      const response = await fetch(`/api/admin/professionals/${professionalId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ verified }),
      });
      if (response.ok) {
        loadUsers();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Erreur" }));
        alert(errorData.error || "Erreur lors de la vérification");
      }
    } catch (error) {
      console.error("Erreur vérification:", error);
      alert("Erreur lors de la vérification");
    }
  }

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfessionals = professionals.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              👥 Gestion des utilisateurs
            </h1>
            <p className="mt-2 text-sm text-zinc-600 font-medium">
              Gérez les clients et professionnels
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-semibold text-purple-700 shadow-lg hover-lift hover:shadow-xl transition-all"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b-2 border-purple-200/50">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "all"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-zinc-600 hover:text-purple-600"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "clients"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-zinc-600 hover:text-purple-600"
            }`}
          >
            Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab("professionals")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "professionals"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-zinc-600 hover:text-purple-600"
            }`}
          >
            Professionnels ({professionals.length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Rechercher par nom, email, service, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl font-bold text-purple-600">Chargement...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clients */}
            {(activeTab === "all" || activeTab === "clients") && (
              <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-purple-200/50">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  👥 Clients ({filteredClients.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="border-b border-purple-200/30 pb-3 last:border-0"
                    >
                      <div className="text-sm font-medium text-zinc-700">{client.name}</div>
                      <div className="text-xs text-zinc-500">{client.email}</div>
                    </div>
                  ))}
                  {filteredClients.length === 0 && (
                    <p className="text-sm text-zinc-500 text-center py-4">
                      Aucun client trouvé
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Professionnels */}
            {(activeTab === "all" || activeTab === "professionals") && (
              <div className="rounded-3xl glass p-6 shadow-2xl border-2 border-pink-200/50">
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  💼 Professionnels ({filteredProfessionals.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredProfessionals.map((pro) => (
                    <div
                      key={pro.id}
                      className="border-b border-pink-200/30 pb-3 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-zinc-700">{pro.name}</div>
                            {pro.verified && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                ✓ Vérifié
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500">{pro.email}</div>
                          <div className="text-xs text-zinc-500">
                            {pro.serviceType} · {pro.city}
                          </div>
                        </div>
                        <button
                          onClick={() => handleVerify(pro.id, !pro.verified)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                            pro.verified
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                        >
                          {pro.verified ? "✗ Retirer" : "✓ Vérifier"}
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredProfessionals.length === 0 && (
                    <p className="text-sm text-zinc-500 text-center py-4">
                      Aucun professionnel trouvé
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

