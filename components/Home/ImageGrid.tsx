"use client";

import { MapPin, ArrowUpRight } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_INSTAGRAM_FEED } from "@/dashboard/lib/graphql/documents";

export default function ShowcaseGrid() {
    const [page] = useState<number>(1);
    const [failedMedia, setFailedMedia] = useState<Record<string, boolean>>({});

    const { data, loading, error } = useQuery(GET_INSTAGRAM_FEED, {
        variables: { page, limit: 30 },
    }) as any;

    if (error) {
        console.error("Error loading feed:", error);
    }

    const posts = data?.getInstagramFeed?.posts || [];

    const handleMediaError = (key: string) => {
        setFailedMedia((prev) => ({ ...prev, [key]: true }));
    };

    return (
        <section className="w-full py-12 md:py-20 bg-background">
            {/* Header Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
                    Featured <span className="font-serif italic text-primary">Showcase</span>
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl">
                    Browse our full media library. Select any video to play directly.
                </p>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center p-16 text-center space-y-4 min-h-[400px]">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-zinc-200">Syncing Showcase</h3>
                        <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                            Please wait while we pull our latest highlights...
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[#1c1212] border border-red-900/40 rounded-2xl max-w-md mx-auto my-6 space-y-4 shadow-xl">
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

            {!loading && !error && posts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Responsive Grid layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {posts
                            .filter((_: any, idx: number) => idx !== 3)
                            .slice(0, 6)
                            .map((post: any, idx: number) => {
                            const uniqueKey = post._id || post.id || idx;
                            const isVideo = post.mediaType?.toUpperCase() === "VIDEO";
                            const hasFailed = failedMedia[uniqueKey];

                            return (
                                <div
                                    key={uniqueKey}
                                    className="w-full group bg-secondary/10 border border-border/40 rounded-[2rem] overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-2xl"
                                >
                                    {/* MEDIA LAYER */}
                                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                                        {hasFailed ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src="/placeholders.jpg"
                                                    alt="Media unavailable"
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 bg-zinc-950/95 font-medium px-4 text-center">
                                                    Showcase Media Unavailable
                                                </span>
                                            </div>
                                        ) : isVideo ? (
                                            <video
                                                src={post.mediaUrl}
                                                poster={post.thumbnailUrl}
                                                controls
                                                playsInline
                                                preload="metadata"
                                                className="w-full h-full object-cover relative z-20"
                                                onError={() => handleMediaError(uniqueKey)}
                                            />
                                        ) : (
                                            <img
                                                src={post.thumbnailUrl || post.mediaUrl || "/slide/1.jpg"}
                                                alt="Instagram Post Showcase"
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                                                onClick={() => post.permalink && window.open(post.permalink, "_blank")}
                                                onError={() => handleMediaError(uniqueKey)}
                                            />
                                        )}

                                        {/* Location Badge */}
                                        <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
                                                <MapPin size={10} className="text-primary" /> ABV / SHOWCASE
                                            </div>
                                        </div>

                                        {/* Media Type Badge */}
                                        <span className="absolute top-4 right-4 bg-black/70 backdrop-blur text-[10px] text-white px-2.5 py-1 rounded-full uppercase font-bold tracking-wider pointer-events-none z-10 border border-white/5">
                                            {post.mediaType}
                                        </span>
                                    </div>

                                    {/* CAPTION BLOCK */}
                                    <div
                                        className="p-5 sm:p-6 bg-secondary/5 flex-1 flex flex-col justify-between border-t border-border/20 cursor-pointer"
                                        onClick={() => post.permalink && window.open(post.permalink, "_blank")}
                                    >
                                        <p className="text-sm text-zinc-600/90 leading-relaxed line-clamp-3 font-medium">
                                            {post.caption || "Exclusive publication portfolio placeholder."}
                                        </p>

                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/10 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                                View Original Publication
                                            </span>
                                            <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}

//
//
//
// "use client";
// import { motion } from "framer-motion";
// import { MapPin, ArrowUpRight } from "lucide-react";
// import React, { useState } from "react";
// import { useQuery } from "@apollo/client/react";
// import { GET_INSTAGRAM_FEED } from "@/dashboard/lib/graphql/documents";
//
// export default function ContinuousCarousel() {
//     const [page] = useState<number>(1);
//     // Track active video playback state to pause marquee scroll
//     const [isPlaying, setIsPlaying] = useState<boolean>(false);
//
//     const { data, loading, error } = useQuery(GET_INSTAGRAM_FEED, {
//         variables: { page, limit: 30 },
//     }) as any;
//
//     if (error) {
//         console.error("Error loading feed:", error);
//     }
//
//     const posts = data?.getInstagramFeed?.posts || [];
//
//     // Duplicate the dynamic data array stream to ensure seamless infinite looping marquee spacing
//     const infinitePosts = [...posts, ...posts];
//
//     return (
//         <div className="relative w-full overflow-hidden py-12 bg-background">
//             {/* Header Info */}
//             <div className="max-w-7xl mx-auto px-6 mb-10">
//                 <h2 className="text-4xl font-light tracking-tight">
//                     Featured <span className="font-serif italic text-primary">Showcase</span>
//                 </h2>
//             </div>
//
//             {loading && (
//                 <div className="flex flex-col items-center justify-center p-16 text-center space-y-4 min-h-[300px]">
//                     <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
//                     <div className="space-y-1">
//                         <h3 className="text-base font-semibold text-zinc-200">Syncing Showcase</h3>
//                         <p className="text-xs text-zinc-400 max-w-xs mx-auto">
//                             Please wait while we pull our latest structural highlights...
//                         </p>
//                     </div>
//                 </div>
//             )}
//
//             {error && (
//                 <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1c1212] border border-red-900/40 rounded-2xl max-w-md mx-auto my-6 space-y-4 shadow-xl">
//                     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-950/60 border border-red-800/60">
//                         <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                         </svg>
//                     </div>
//                     <div className="space-y-1.5">
//                         <h3 className="text-base font-bold text-white">Couldn't load Instagram feed</h3>
//                         <p className="text-xs text-zinc-400 leading-relaxed">
//                             We encountered a temporary connection issue while reaching out to the feed server.
//                         </p>
//                     </div>
//                 </div>
//             )}
//
//             {!loading && !error && posts.length > 0 && (
//                 <motion.div
//                     className="flex gap-8"
//                     animate={isPlaying ? false : { x: ["0%", "-50%"] }}
//                     transition={{
//                         duration: 400,
//                         ease: "linear",
//                         repeat: Infinity,
//                     }}
//                     style={{ width: "fit-content" }}
//                 >
//                     {infinitePosts.map((post: any, idx: number) => {
//                         const isVideo = post.mediaType?.toUpperCase() === "VIDEO";
//
//                         return (
//                             <div
//                                 key={`${post._id || post.id}-${idx}`}
//                                 className="w-[380px] flex-shrink-0 group cursor-pointer bg-secondary/10 border border-border/40 rounded-[2rem] overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:border-primary/30"
//                             >
//                                 {/* MEDIA WRAPPER LAYER CONTEXT */}
//                                 <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
//                                     {isVideo ? (
//                                         <video
//                                             src={post.mediaUrl}
//                                             poster={post.thumbnailUrl}
//                                             controls
//                                             playsInline
//                                             preload="metadata"
//                                             className="w-full h-full object-cover relative z-20"
//                                             onPlay={() => setIsPlaying(true)}
//                                             onPause={() => setIsPlaying(false)}
//                                             onEnded={() => setIsPlaying(false)}
//                                             onError={(e) => {
//                                                 const target = e.target as HTMLVideoElement;
//                                                 target.onerror = null;
//
//                                                 const parent = target.parentElement;
//                                                 if (parent) {
//                                                     parent.innerHTML = `
//                             <img
//                               src="/placeholders.jpg"
//                               alt="Video unavailable"
//                               class="w-full h-full object-cover"
//                             />
//                             <span class="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 bg-zinc-950/95 font-medium">
//                               Video Showcase Currently Unavailable
//                             </span>
//                           `;
//                                                 }
//                                             }}
//                                         />
//                                     ) : (
//                                         <img
//                                             src={post.thumbnailUrl || post.mediaUrl || "/slide/1.jpg"}
//                                             alt="Instagram Post Showcase"
//                                             referrerPolicy="no-referrer"
//                                             className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//                                             onClick={() => post.permalink && window.open(post.permalink, "_blank")}
//                                             onError={(e) => {
//                                                 const target = e.target as HTMLImageElement;
//                                                 target.onerror = null;
//                                                 target.src = "/placeholders.jpg";
//                                             }}
//                                         />
//                                     )}
//
//                                     {/* Location Overlay Badge */}
//                                     <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//                                         <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
//                                             <MapPin size={10} className="text-primary" /> ABV / SHOWCASE
//                                         </div>
//                                     </div>
//
//                                     {/* Media Type Badge Overlay */}
//                                     <span className="absolute top-4 right-4 bg-black/70 backdrop-blur text-[10px] text-white px-2.5 py-1 rounded-full uppercase font-bold tracking-wider pointer-events-none z-10 border border-white/5">
//                                         {post.mediaType}
//                                     </span>
//                                 </div>
//
//                                 {/* CAPTION TEXT BLOCK */}
//                                 <div
//                                     className="p-6 bg-secondary/5 flex-1 flex flex-col justify-between border-t border-border/20"
//                                     onClick={() => post.permalink && window.open(post.permalink, "_blank")}
//                                 >
//                                     <p className="text-sm text-zinc-600/90 leading-relaxed line-clamp-3 font-medium">
//                                         {post.caption || "Exclusive publication portfolio placeholder."}
//                                     </p>
//
//                                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/10 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
//                                         <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
//                                             View Original Publication
//                                         </span>
//                                         <ArrowUpRight size={14} className="text-zinc-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </motion.div>
//             )}
//
//             {/* Frame Vignette Masking Gradients */}
//             <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/40 to-transparent z-20" />
//             <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/40 to-transparent z-20" />
//         </div>
//     );
// }