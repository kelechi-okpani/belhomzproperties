"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_INSTAGRAM_FEED } from "@/dashboard/lib/graphql/documents";

export default function InstagramPage() {
    const [hasMore, setHasMore] = useState<boolean>(true);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const LIMIT = 30;

    const { data, loading, error, fetchMore } = useQuery(GET_INSTAGRAM_FEED, {
        variables: { page: 1, limit: LIMIT },
        notifyOnNetworkStatusChange: true,
    }) as any;

    if (error) {
        console.error("Error :", error);
    }

    const rawPosts = data?.getInstagramFeed?.posts || [];

    // ✅ Extract and process ONLY video posts right away
    const videoPosts = rawPosts.filter(
        (post: any) => post.mediaType?.toUpperCase() === "VIDEO"
    );

    useEffect(() => {
        if (loading || !hasMore || error) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Base pagination offset on total raw items pulled from DB
                    const nextPage = Math.ceil(rawPosts.length / LIMIT) + 1;

                    fetchMore({
                        variables: { page: nextPage, limit: LIMIT },
                        updateQuery: (prevResult: any, { fetchMoreResult }: any) => {
                            const newPosts = fetchMoreResult?.getInstagramFeed?.posts || [];

                            if (newPosts.length < LIMIT) {
                                setHasMore(false);
                            }

                            if (!newPosts.length) return prevResult;

                            return {
                                getInstagramFeed: {
                                    ...prevResult.getInstagramFeed,
                                    posts: [...prevResult.getInstagramFeed.posts, ...newPosts],
                                },
                            };
                        },
                    }).catch((err: any) => {
                        console.error("Error fetching more posts:", err);
                    });
                }
            },
            { rootMargin: "200px" }
        );

        const currentTarget = loadMoreRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loading, hasMore, error, rawPosts.length, fetchMore]);

    return (
        <div className="space-y-6 pt-26 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
            <div>
                <h2 className="text-1xl font-bold">Instagram Video Feed</h2>
            </div>

            {error && videoPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1c1212] border border-red-900/40 rounded-2xl max-w-md mx-auto my-6 space-y-4 shadow-xl">
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

            {videoPosts.length > 0 && (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {/* ✅ Map through exclusively video arrays */}
                    {videoPosts.map((post: any) => (
                        <div
                            key={post._id}
                            className="break-inside-avoid bg-[#12151a] border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition flex flex-col mb-4 shadow-sm"
                        >
                            <div>
                                <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                                    <video
                                        key={post._id}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        className="w-full h-full object-cover animate-fade-in"
                                        src={`/api/media-proxy?url=${encodeURIComponent(post.mediaUrl)}`}
                                        poster={`/api/media-proxy?url=${encodeURIComponent(post.thumbnailUrl || '')}`}
                                        onError={(e) => {
                                            console.error("Video dynamic playback error for post:", post._id);
                                        }}
                                    />
                                    <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded uppercase font-bold pointer-events-none z-10">
                                        VIDEO
                                    </span>
                                </div>

                                <div className="p-4 space-y-2">
                                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap break-words tracking-wide">
                                        {post.caption || <span className="italic text-zinc-500">No caption provided.</span>}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 mt-auto">
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
                    ))}
                </div>
            )}

            <div ref={loadMoreRef} className="w-full pt-6">
                {loading && (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                        <p className="text-xs text-zinc-400">Loading more feeds...</p>
                    </div>
                )}

                {!hasMore && videoPosts.length > 0 && (
                    <p className="text-center text-xs text-zinc-500 p-4">
                        You've caught up with all latest videos!
                    </p>
                )}
            </div>
        </div>
    );
}




// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useQuery } from "@apollo/client/react";
// import { GET_INSTAGRAM_FEED } from "@/dashboard/lib/graphql/documents";
//
// export default function InstagramPage() {
//     const [hasMore, setHasMore] = useState<boolean>(true);
//     const loadMoreRef = useRef<HTMLDivElement | null>(null);
//
//     const LIMIT = 30;
//
//     const { data, loading, error, fetchMore } = useQuery(GET_INSTAGRAM_FEED, {
//         variables: { page: 1, limit: LIMIT },
//         notifyOnNetworkStatusChange: true,
//     }) as any;
//
//     if (error) {
//         console.error("Error :", error);
//     }
//
//     console.log(data, "data..")
//     const posts = data?.getInstagramFeed?.posts || [];
//
//     useEffect(() => {
//         if (loading || !hasMore || error) return;
//
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 if (entries[0].isIntersecting) {
//                     const nextPage = Math.ceil(posts.length / LIMIT) + 1;
//
//                     fetchMore({
//                         variables: { page: nextPage, limit: LIMIT },
//                         updateQuery: (prevResult: { getInstagramFeed: { posts: any; }; }, {fetchMoreResult}: any) => {
//                             const newPosts = fetchMoreResult?.getInstagramFeed?.posts || [];
//
//                             if (newPosts.length < LIMIT) {
//                                 setHasMore(false);
//                             }
//
//                             if (!newPosts.length) return prevResult;
//
//                             return {
//                                 getInstagramFeed: {
//                                     ...prevResult.getInstagramFeed,
//                                     posts: [...prevResult.getInstagramFeed.posts, ...newPosts],
//                                 },
//                             };
//                         },
//                     }).catch((err:any) => {
//                         console.error("Error fetching more posts:", err);
//                     });
//                 }
//             },
//             { rootMargin: "200px" }
//         );
//
//         const currentTarget = loadMoreRef.current;
//         if (currentTarget) {
//             observer.observe(currentTarget);
//         }
//
//         return () => {
//             if (currentTarget) {
//                 observer.unobserve(currentTarget);
//             }
//         };
//     }, [loading, hasMore, error, posts.length, fetchMore]);
//
//     return (
//         <div className="space-y-6 pt-26 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
//             <div>
//                 <h2 className="text-1xl font-bold">Instagram Feed</h2>
//             </div>
//
//             {error && posts.length === 0 && (
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
//             {posts.length > 0 && (
//                 /* 🔥 Modern Masonry Layout Using Multi-Column Layouts */
//                 <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
//                     {posts.map((post: any) => {
//                         const normalizedType = post.mediaType?.toUpperCase();
//                         const isVideo = normalizedType === "VIDEO";
//                         const videoPosts = posts.filter((post: any) => post.mediaType?.toUpperCase() === "VIDEO");
//
//                         return (
//                             <div
//                                 key={post._id}
//                                 /* 🚨 break-inside-avoid prevents cards from splitting awkwardly across layout columns */
//                                 className="break-inside-avoid bg-[#12151a] border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition flex flex-col mb-4 shadow-sm"
//                             >
//                                 <div>
//                                     <div className="relative aspect-square bg-zinc-900 overflow-hidden">
//                                         {isVideo ? (
//                                             <video
//                                                 key={post._id}
//                                                 controls
//                                                 playsInline
//                                                 preload="metadata"
//                                                 className="w-full h-full object-cover"
//                                                 // ✅ The primary track source handled safely by your local proxy
//                                                 src={`/api/media-proxy?url=${encodeURIComponent(post.mediaUrl)}`}
//                                                 poster={`/api/media-proxy?url=${encodeURIComponent(post.thumbnailUrl)}`}
//                                                 onError={(e) => {
//                                                     const target = e.target as HTMLVideoElement;
//                                                     target.onerror = null;
//                                                     const parent = target.parentElement;
//                                                     if (parent) {
//                                                         parent.innerHTML = `
//                   <img src="/placeholders.jpg" alt="Video unavailable" class="w-full h-full object-cover" />
//                   <span class="absolute inset-0 flex items-center justify-center text-xs text-zinc-500 bg-zinc-900/90 font-medium">
//                     Video Expired/Unavailable
//                   </span>`;
//                                                     }
//                                                 }}
//                                             /> /* ❌ Removed the nested <source /> tag that was passing raw, unproxied URLs */
//                                         ) : (
//                                             /* Image Component layer updated to use the proxy safely too */
//                                             <img
//                                                 src={`/api/media-proxy?url=${encodeURIComponent(post.mediaUrl)}`}
//                                                 alt="Instagram Post"
//                                                 referrerPolicy="no-referrer"
//                                                 className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//                                                 onError={(e) => {
//                                                     const target = e.target as HTMLImageElement;
//                                                     target.onerror = null;
//                                                     target.src = "/placeholders.jpg";
//                                                 }}
//                                             />
//                                         )}
//                                         <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded uppercase font-bold pointer-events-none z-10">
//                                             {post.mediaType}
//                                         </span>
//                                     </div>
//
//                                     {/* Captions expand natively here with dynamic heights */}
//                                     <div className="p-4 space-y-2">
//                                         <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap break-words tracking-wide">
//                                             {post.caption || <span className="italic text-zinc-500">No caption provided.</span>}
//                                         </p>
//                                     </div>
//                                 </div>
//
//                                 <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 mt-auto">
//                                     <a
//                                         href={post.permalink}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-orange-500 hover:underline font-semibold"
//                                     >
//                                         View on IG ↗
//                                     </a>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}
//
//             <div ref={loadMoreRef} className="w-full pt-6">
//                 {loading && (
//                     <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
//                         <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
//                         <p className="text-xs text-zinc-400">Loading more feeds...</p>
//                     </div>
//                 )}
//
//                 {!hasMore && posts.length > 0 && (
//                     <p className="text-center text-xs text-zinc-500 p-4">
//                         You've caught up with all latest posts!
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }