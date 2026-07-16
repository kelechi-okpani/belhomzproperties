"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Bell, Check, Volume2, VolumeX } from "lucide-react";
import {
    ACTIVITIES_HISTORY_QUERY,
    ACTIVITY_FEED_SUBSCRIPTION,
} from "@/dashboard/lib/graphql/documents";

// Helper to safely format relative time without crashing on invalid dates
function formatRelativeTime(dateInput: any): string {
    if (!dateInput) return "Just now";

    let date: Date;

    if (dateInput instanceof Date) {
        date = dateInput;
    } else if (typeof dateInput === "number") {
        date = new Date(dateInput);
    } else if (typeof dateInput === "string") {
        // Check if the string is purely numeric (Unix timestamp string)
        const num = Number(dateInput);
        date = !isNaN(num) ? new Date(num) : new Date(dateInput);
    } else {
        return "Just now";
    }

    // Verify Date is valid before passing to date-fns
    return !isNaN(date.getTime())
        ? formatDistanceToNow(date, { addSuffix: true })
        : "Just now";
}

export function NotificationDropdown() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Web Audio API Synth Generator for zero-dependency sound playback
    const playNotificationSound = () => {
        if (!soundEnabled) return;
        try {
            const AudioContext =
                window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5 note

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch {
            // Browser autoplay policy catch
        }
    };

    // 1. Fetch initial activities history
    const { data, loading, subscribeToMore } = useQuery<any>(
        ACTIVITIES_HISTORY_QUERY,
        {
            variables: { limit: 15 },
            fetchPolicy: "cache-and-network",
        }
    );

    // 2. Subscribe to live activity feed updates
    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: ACTIVITY_FEED_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data?.activityFeed) return prev;

                const newNotif = subscriptionData.data.activityFeed;

                // Prevent duplicate items
                if (
                    prev?.activities?.some((item: any) => item.id === newNotif.id)
                ) {
                    return prev;
                }

                // Trigger sound & toast alert for live incoming notifications
                playNotificationSound();
                toast(newNotif.entityType || "New Activity", {
                    description: newNotif.message,
                    duration: 4000,
                });

                // Increment unread counter badge
                setUnreadCount((count) => count + 1);

                // Prepend incoming live item to current query cache
                return {
                    ...prev,
                    activities: [newNotif, ...(prev?.activities || [])].slice(0, 15),
                };
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore, soundEnabled]);

    const notifications = data?.activities ?? [];

    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setIsOpen((prev) => !prev);
                    if (!isOpen && unreadCount > 0) {
                        markAllAsRead();
                    }
                }}
                className="relative rounded-lg border border-border bg-background p-2 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 shadow-sm transition-all duration-200"
                aria-label="View notifications"
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
                )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop closer */}
                    <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 z-30 w-80 sm:w-96 rounded-lg border border-border bg-card shadow-lg animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border p-3 bg-muted/40">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                    Notifications
                                </h3>
                                <button
                                    onClick={() => setSoundEnabled((prev) => !prev)}
                                    title={
                                        soundEnabled ? "Mute audio alerts" : "Enable audio alerts"
                                    }
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {soundEnabled ? (
                                        <Volume2 className="h-3.5 w-3.5 text-primary" />
                                    ) : (
                                        <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                </button>
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    <Check className="h-3 w-3" /> Mark read
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-border">
                            {loading && notifications.length === 0 ? (
                                <div className="p-6 text-center text-xs text-muted-foreground">
                                    Loading notifications...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-6 text-center text-xs text-muted-foreground">
                                    No notifications found
                                </div>
                            ) : (
                                notifications
                                    .slice(0, 6)
                                    .map((item: any, idx: number) => (
                                    <div
                                        key={item.id || idx}
                                        className="p-3 text-left transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-primary uppercase">
                        {item.entityType}
                      </span>
                                            <span className="font-mono text-[10px] text-muted-foreground">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                                        </div>
                                        <p className="mt-1 text-xs text-foreground leading-snug">
                                            {item.message}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}