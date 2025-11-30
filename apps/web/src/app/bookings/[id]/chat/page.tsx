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
    
    // Polling pour les nouveaux messages (toutes les 2 secondes pour plus de réactivité)
    const interval = setInterval(loadMessages, 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 font-sans text-zinc-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/my-bookings"
              className="text-sm text-primary hover:text-primary-dark mb-2 inline-block transition"
            >
              ← Retour aux réservations
            </Link>
            <h1 className="text-xl font-bold text-zinc-900">
              💬 Conversation avec {otherUser.name}
            </h1>
            <p className="text-sm text-zinc-600">
              Réservation du {new Date(booking.startTime).toLocaleDateString("fr-FR", { 
                day: "numeric", 
                month: "long", 
                year: "numeric" 
              })} à {new Date(booking.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
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
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg mb-2 font-medium">Aucun message pour le moment</p>
              <p className="text-sm">Commence la conversation !</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = currentUser && message.senderId === currentUser.id && message.senderType === currentUser.type;
              const messageDate = new Date(message.createdAt);
              const isToday = messageDate.toDateString() === new Date().toDateString();
              
              return (
                <div key={message.id}>
                  {/* Date separator */}
                  {messages.indexOf(message) === 0 || 
                   new Date(messages[messages.indexOf(message) - 1].createdAt).toDateString() !== messageDate.toDateString() ? (
                    <div className="text-center my-4">
                      <span className="text-xs text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
                        {isToday ? "Aujourd'hui" : messageDate.toLocaleDateString("fr-FR", { 
                          day: "numeric", 
                          month: "long", 
                          year: "numeric" 
                        })}
                      </span>
                    </div>
                  ) : null}
                  
                  <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        isOwnMessage
                          ? "bg-primary text-white"
                          : "bg-white border border-zinc-200 text-zinc-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        isOwnMessage ? "text-primary-light opacity-80" : "text-zinc-400"
                      }`}>
                        {messageDate.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
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
        <div className="bg-white border-t border-zinc-200 px-4 py-4 shadow-sm">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tape ton message..."
              className="flex-1 rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={sending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim() && !sending) {
                    handleSendMessage(e);
                  }
                }
              }}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <span>Envoyer</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}




