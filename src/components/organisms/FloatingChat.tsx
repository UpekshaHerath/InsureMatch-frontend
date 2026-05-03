"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { useChat } from "@/lib/hooks/useChat";
import ChatWindow from "@/components/organisms/ChatWindow";
import type { RecommendationResponse } from "@/lib/types/api";

interface Message {
  text: string;
  isUser: boolean;
  sources?: string[];
}

const FAB_SIZE = 56;
const DRAG_THRESHOLD = 8;
const MIN_DRAWER_W = 360;
const DEFAULT_DRAWER_W = 420;

function buildRecommendationContext(r: RecommendationResponse | null): string {
  if (!r) return "";
  const top = r.top_recommendation ? `Top recommendation: ${r.top_recommendation}` : "";
  const ranked = r.ranked_policies
    ?.slice(0, 5)
    .map(
      (p, i) =>
        `${i + 1}. ${p.policy_name} — score ${(p.suitability_score * 100).toFixed(0)}%${
          p.policy_type ? ` (${p.policy_type})` : ""
        }${p.company ? `, ${p.company}` : ""}`
    )
    .join("\n");

  const inbuiltBlocks: string[] = [];
  if (r.inbuilt_riders) {
    for (const [policyName, riders] of Object.entries(r.inbuilt_riders)) {
      if (!riders || riders.length === 0) continue;
      const lines = riders
        .map((rd) => `  - ${rd.rider_name} (${rd.category}) — bundled`)
        .join("\n");
      inbuiltBlocks.push(`${policyName}:\n${lines}`);
    }
  }
  const inbuiltSection = inbuiltBlocks.length
    ? `Inbuilt riders per policy (already covered, do not re-suggest):\n${inbuiltBlocks.join("\n")}`
    : "";

  const riderBlocks: string[] = [];
  if (r.rider_suggestions) {
    for (const [policyName, riders] of Object.entries(r.rider_suggestions)) {
      if (!riders || riders.length === 0) continue;
      const lines = riders
        .map(
          (rd) =>
            `  - ${rd.rider_name} (${rd.category}): ${
              rd.reasons.length > 0 ? rd.reasons.join("; ") : "suits profile"
            }`
        )
        .join("\n");
      riderBlocks.push(`${policyName}:\n${lines}`);
    }
  }
  const riderSection = riderBlocks.length
    ? `Recommended add-on riders per policy:\n${riderBlocks.join("\n")}`
    : "";

  const narrative = r.rag_narrative ? `Advisor narrative:\n${r.rag_narrative}` : "";
  return [
    top,
    ranked ? `Ranked policies:\n${ranked}` : "",
    inbuiltSection,
    riderSection,
    narrative,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function FloatingChat() {
  const { sessionId, recommendationResult, buildUserProfile } = useProfileStore();
  const chat = useChat();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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
  const justDraggedRef = useRef(false);
  const resizeStartRef = useRef<{ startX: number; startW: number; pointerId: number } | null>(null);

  useEffect(() => {
    if (pos !== null) return;
    if (typeof window === "undefined") return;
    setPos({
      x: window.innerWidth - FAB_SIZE - 24,
      y: window.innerHeight - FAB_SIZE - 24,
    });
  }, [pos]);

  if (!sessionId) return null;

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    try {
      const profile = buildUserProfile();
      const recommendation_context = buildRecommendationContext(recommendationResult);
      const result = await chat.mutateAsync({
        session_id: sessionId,
        message,
        user_profile: profile,
        recommendation_context,
      });
      setMessages((prev) => [
        ...prev,
        { text: result.response, isUser: false, sources: result.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong. Please try again.", isUser: false },
      ]);
    }
  };

  // ── FAB drag handlers ────────────────────────────────────────────────────
  const onFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos?.x ?? rect.left,
      origY: pos?.y ?? rect.top,
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
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // capture may already be released
    }
    justDraggedRef.current = ds.moved;
    dragStateRef.current = null;
  };

  const onFabClick = () => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    setOpen(true);
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
    const dx = rs.startX - e.clientX; // drag left = grow
    const maxW = Math.max(MIN_DRAWER_W, window.innerWidth - 24);
    setDrawerW(clamp(rs.startW + dx, MIN_DRAWER_W, maxW));
  };

  const onResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const rs = resizeStartRef.current;
    if (!rs || rs.pointerId !== e.pointerId) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    resizeStartRef.current = null;
  };

  const fabStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, width: FAB_SIZE, height: FAB_SIZE }
    : {
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        width: FAB_SIZE,
        height: FAB_SIZE,
      };

  return (
    <>
      {!open && (
        <button
          type="button"
          onPointerDown={onFabPointerDown}
          onPointerMove={onFabPointerMove}
          onPointerUp={onFabPointerUp}
          onPointerCancel={onFabPointerUp}
          onClick={onFabClick}
          aria-label="Open chat (drag to move)"
          style={fabStyle}
          className="fixed z-40 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-black/5 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 touch-none select-none cursor-grab active:cursor-grabbing"
        >
          <MessageCircle className="h-6 w-6 pointer-events-none" />
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
        className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col border-l border-border bg-white shadow-2xl transition-transform duration-200 ease-out w-full md:w-[var(--drawer-w)] ${
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
          className="absolute left-0 top-0 bottom-0 w-1.5 -translate-x-1/2 cursor-ew-resize bg-transparent hover:bg-primary/30 touch-none hidden md:block"
        />

        <div className="flex items-center justify-between border-b border-border bg-accent/50 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-secondary">
              InsureMatch AI
            </h3>
            <p className="text-xs text-muted-foreground">
              Ask about your recommendations
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
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
          />
        </div>
      </aside>
    </>
  );
}
