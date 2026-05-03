"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";

import { useAuth } from "@/lib/hooks/useAuth";
import { useChat } from "@/lib/hooks/useChat";
import ChatWindow from "@/components/organisms/ChatWindow";

interface Message {
  text: string;
  isUser: boolean;
}

const FAB_SIZE = 56;
const DRAG_THRESHOLD = 5;
const MIN_DRAWER_W = 360;
const DEFAULT_DRAWER_W = 420;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `prerec-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Routes where the post-recommendation FloatingChat is mounted; hide here
// so only one chat surface is visible at a time.
const HIDE_ON_PREFIXES = ["/results"];

export default function PreRecChat() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const chat = useChat();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const localSessionId = useMemo(() => uuid(), []);

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [drawerW, setDrawerW] = useState(DEFAULT_DRAWER_W);

  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);
  const resizeStartRef = useRef<{
    startX: number;
    startW: number;
    pointerId: number;
  } | null>(null);

  useEffect(() => {
    if (pos !== null) return;
    if (typeof window === "undefined") return;
    setPos({
      x: window.innerWidth - FAB_SIZE - 24,
      y: window.innerHeight - FAB_SIZE - 24,
    });
  }, [pos]);

  // Hide on routes where the post-recommendation chat owns the surface,
  // and while auth is still resolving / when the visitor is not signed in.
  const onPostRecRoute = HIDE_ON_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (loading || !user || onPostRecRoute) return null;

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    try {
      const result = await chat.mutateAsync({
        session_id: localSessionId,
        message,
      });
      setMessages((prev) => [
        ...prev,
        { text: result.response, isUser: false },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again.",
          isUser: false,
        },
      ]);
    }
  };

  // ── FAB drag handlers ────────────────────────────────────────────────────
  const onFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pos) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
      pointerId: e.pointerId,
    };
  };

  const onFabPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const ds = dragStateRef.current;
    if (!ds || ds.pointerId !== e.pointerId) return;
    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;
    if (!ds.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    ds.moved = true;
    const maxX = window.innerWidth - FAB_SIZE;
    const maxY = window.innerHeight - FAB_SIZE;
    setPos({
      x: clamp(ds.origX + dx, 0, maxX),
      y: clamp(ds.origY + dy, 0, maxY),
    });
  };

  const onFabPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const ds = dragStateRef.current;
    if (!ds || ds.pointerId !== e.pointerId) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    const wasDrag = ds.moved;
    dragStateRef.current = null;
    if (!wasDrag) setOpen(true);
  };

  // ── Drawer resize handlers ───────────────────────────────────────────────
  const onResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resizeStartRef.current = {
      startX: e.clientX,
      startW: drawerW,
      pointerId: e.pointerId,
    };
    e.preventDefault();
  };

  const onResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rs = resizeStartRef.current;
    if (!rs || rs.pointerId !== e.pointerId) return;
    const dx = rs.startX - e.clientX;
    const maxW = Math.max(MIN_DRAWER_W, window.innerWidth - 24);
    setDrawerW(clamp(rs.startW + dx, MIN_DRAWER_W, maxW));
  };

  const onResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const rs = resizeStartRef.current;
    if (!rs || rs.pointerId !== e.pointerId) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    resizeStartRef.current = null;
  };

  return (
    <>
      {pos && (
        <button
          type="button"
          onPointerDown={onFabPointerDown}
          onPointerMove={onFabPointerMove}
          onPointerUp={onFabPointerUp}
          onPointerCancel={onFabPointerUp}
          aria-label="Open advisor chat (drag to move)"
          style={{
            left: pos.x,
            top: pos.y,
            width: FAB_SIZE,
            height: FAB_SIZE,
          }}
          className="fixed z-40 flex items-center justify-center rounded-full bg-purple-600 text-white shadow-lg ring-1 ring-black/5 transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 touch-none select-none cursor-grab active:cursor-grabbing"
        >
          <Sparkles className="h-6 w-6 pointer-events-none" />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px] animate-in fade-in duration-150"
          onClick={() => setOpen(false)}
        />
      )}

      {/* On mobile (<md) the drawer is full-width; on md+ use the draggable width */}
      <aside
        aria-hidden={!open}
        style={{ ["--drawer-w" as string]: `${drawerW}px` }}
        className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col border-l border-purple-200 bg-white shadow-2xl transition-transform duration-200 ease-out w-full md:w-[var(--drawer-w)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat drawer"
          className="absolute left-0 top-0 bottom-0 w-1.5 -translate-x-1/2 cursor-ew-resize bg-transparent hover:bg-purple-400/40 touch-none"
        />

        <div className="flex items-center justify-between border-b border-purple-200 bg-purple-50 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-purple-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Insurance Advisor
            </h3>
            <p className="text-xs text-purple-700/80">
              Ask anything before getting your recommendation
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-md p-1 text-purple-700 hover:bg-purple-100 hover:text-purple-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            isLoading={chat.isPending}
            embedded
            accent="purple"
            emptyHint='e.g. "I am a cancer patient — which policy suits me?"'
          />
        </div>
      </aside>
    </>
  );
}
