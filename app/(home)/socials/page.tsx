"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_INSTAGRAM_FEED } from "@/dashboard/lib/graphql/documents";

export default function InstagramPage() {
  const [page, setPage] = useState<number>(1);

  const { data, loading, error } = useQuery(GET_INSTAGRAM_FEED, {
    variables: { page, limit: 30 },
  }) as any;

  if (error) {
    console.error("Error :", error);
  }

  const posts = data?.getInstagramFeed?.posts || [];

  return (
      <div className="space-y-6 pt-26 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div>
          <h2 className="text-1xl font-bold ">Instagram Feed</h2>
        </div>

        {loading && (
            <div className="flex flex-col items-center justify-center p-16 text-center space-y-4 min-h-[300px]">
              {/* Clean custom loading spinner */}
              <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-200">Loading Instagram Feeds</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Please wait while we sync the latest showcase items for you...
                </p>
              </div>
            </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1c1212] border border-red-900/40 rounded-2xl max-w-md mx-auto my-6 space-y-4 shadow-xl">
              {/* Alert Warning Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-950/60 border border-red-800/60">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Couldn't load Instagram feed</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We encountered a temporary connection issue while reaching out to the feed server.
                </p>
              </div>


            </div>
        )}

        {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((post: any) => {
                // 🚀 Check if the item is an Instagram video layout type
                const isVideo = post.mediaType?.toUpperCase() === "VIDEO";

                return (
                    <div
                        key={post._id}
                        className="bg-[#12151a] border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                          {isVideo ? (
                              /* 🚀 VIDEO LAYER: Plays directly inline inside the frame layout grid */
                              <video
                                  src={post.mediaUrl}
                                  poster={post.thumbnailUrl}
                                  controls
                                  playsInline
                                  preload="metadata"
                                  // referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLVideoElement;
                                    // 🚀 FIX: Prevent video stream crash loops
                                    target.onerror = null;

                                    // Switch out broken video to show a clean placeholder image card instead
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `
              <img 
                src="/placeholders.jpg" 
                alt="Video unavailable" 
                class="w-full h-full object-cover" 
              />
              <span class="absolute inset-0 flex items-center justify-center text-xs text-zinc-500 bg-zinc-900/90 font-medium">
                Video Unavailable
              </span>`;
                                    }
                                  }}
                              />
                          ) : (
                              /* IMAGE LAYER */
                              <img
                                  src={post.thumbnailUrl || post.mediaUrl}
                                  alt="Instagram Post"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; // 🚀 Safely breaks the infinite 404 loop
                                    target.src = "/placeholders.jpg"; // Next.js automatically maps the public folder to "/"
                                  }}
                              />
                          )}
                          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded uppercase font-bold pointer-events-none z-10">
                          {post.mediaType}
                        </span>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-zinc-300 line-clamp-3">
                            {post.caption || "No caption provided."}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                        <a
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:underline font-semibold"
                        >
                          View on IG ↗
                        </a>
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}