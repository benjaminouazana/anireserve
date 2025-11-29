"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface Message {
  id: number;
  content: string;
  senderId: number;
  senderType: "client" | "professional";
  createdAt: string;
}

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  professional: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    name: string;
  };
}

export default function BookingChatPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const bookingId = parseInt(params.id as string);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; type: "client" | "professional" } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadBooking();
    loadMessages();
    checkCurrentUser();
    
    // Polling pour les nouveaux messages (toutes les 3 secondes)
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function checkCurrentUser() {
    try {
      // Vérifier si c'est un client
      const clientRes = await fetch("/api/client/me", { credentials: "include" });
      if (clientRes.ok) {
        const client = await clientRes.json();
        setCurrentUser({ id: client.id, type: "client" });
        return;
      }

      // Vérifier si c'est un professionnel
      const proRes = await fetch("/api/pro/me", { credentials: "include" });
      if (proRes.ok) {
        const pro = await proRes.json();
        setCurrentUser({ id: pro.id, type: "professional" });
        return;
      }

      // Pas connecté
      router.push("/client/login");
    } catch (error) {
      console.error("Erreur vérification utilisateur:", error);
    }
  }

  async function loadBooking() {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Réservation introuvable");
      }

      const data = await response.json();
      setBooking(data.booking);
    } catch (error) {
      toast.showToast("Erreur lors du chargement de la réservation", "error");
      router.push("/my-bookings");
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/messages`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    setSending(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage.trim(),
          senderId: currentUser.id,
          senderType: currentUser.type,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi");
      }

      setNewMessage("");
      loadMessages(); // Recharger les messages
    } catch (error) {
      toast.showToast("Erreur lors de l'envoi du message", "error");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl font-bold text-purple-600">Chargement...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Réservation introuvable</h1>
          <Link
            href="/my-bookings"
            className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover-lift transition"
          >
            Retour aux réservations
          </Link>
        </div>
      </div>
    );
  }

  const otherUser = currentUser?.type === "client" ? booking.professional : booking.client;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-sans text-zinc-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-purple-200/50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/my-bookings"
              className="text-sm text-purple-600 hover:text-purple-700 mb-2 inline-block"
            >
              ← Retour aux réservations
            </Link>
            <h1 className="text-xl font-bold text-zinc-900">
              💬 Conversation avec {otherUser.name}
            </h1>
            <p className="text-sm text-zinc-600">
              Réservation du {new Date(booking.startTime).toLocaleDateString("fr-FR")} à {new Date(booking.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
            booking.status === "pending" ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          }`}>
            {booking.status === "confirmed" ? "✅ Confirmé" :
             booking.status === "pending" ? "⏳ En attente" :
             "❌ Annulé"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-lg mb-2">Aucun message pour le moment</p>
              <p className="text-sm">Commence la conversation !</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = currentUser && message.senderId === currentUser.id && message.senderType === currentUser.type;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white border-2 border-purple-200/50 text-zinc-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? "text-purple-100" : "text-zinc-400"
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {booking.status !== "cancelled" && currentUser && (
        <div className="bg-white border-t border-purple-200/50 px-4 py-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tape ton message..."
              className="flex-1 rounded-xl glass border-2 border-purple-200/50 px-4 py-2 text-sm shadow-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover-lift transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}




