"use client";

import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { formatDistanceToNow, format } from "date-fns";
import {
    Eye,
    Mail,
    Phone,
    User,
    Calendar,
    X,
    Filter,
    Loader2,
    Inbox,
} from "lucide-react";
import { GET_ENQUIRIES, GET_ENQUIRY_BY_ID } from "@/dashboard/lib/graphql/documents";
import { CustomPagination } from "@/dashboard/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Helper for safe date parsing
function formatRelativeTime(dateInput: any): string {
    if (!dateInput) return "N/A";
    const num = Number(dateInput);
    const date = !isNaN(num) ? new Date(num) : new Date(dateInput);
    return !isNaN(date.getTime()) ? formatDistanceToNow(date, { addSuffix: true }) : "N/A";
}

function formatDateFull(dateInput: any): string {
    if (!dateInput) return "N/A";
    const num = Number(dateInput);
    const date = !isNaN(num) ? new Date(num) : new Date(dateInput);
    return !isNaN(date.getTime()) ? format(date, "PPP 'at' p") : "N/A";
}

// Color mapping for Enquiry Statuses
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pending", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    IN_PROGRESS: { label: "In Progress", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    RESOLVED: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    CLOSED: { label: "Closed", color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20" },
};

export default function EnquiriesPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);

    // 1. Query enquiries with dynamic page, pageSize, and status filter
    const { data, loading } = useQuery<any>(GET_ENQUIRIES, {
        variables: {
            page,
            limit: pageSize,
            status: statusFilter || undefined,
        },
        fetchPolicy: "cache-and-network",
    });

    // 2. Query individual enquiry for the Modal detail view
    const [fetchEnquiryById, { data: singleData, loading: singleLoading }] =
        useLazyQuery<any>(GET_ENQUIRY_BY_ID);

    const handleOpenModal = (id: string) => {
        setSelectedEnquiryId(id);
        fetchEnquiryById({ variables: { getEnquiryByIdId: id } });
    };

    const handleCloseModal = () => {
        setSelectedEnquiryId(null);
    };

    const enquiriesList = data?.getEnquiries?.enquiries ?? [];
    const pagination = data?.getEnquiries?.pagination;
    const activeEnquiry = singleData?.getEnquiryById;

    // Pagination calculations based on GraphQL response
    const totalItems = pagination?.total ?? enquiriesList.length;
    const totalPages = pagination?.pages ?? Math.max(1, Math.ceil(totalItems / pageSize));

    const getStatusBadge = (statusKey?: string) => {
        const config = STATUS_CONFIG[statusKey || "PENDING"] || {
            label: statusKey || "Pending",
            color: "bg-secondary text-foreground border-border",
        };
        return (
            <span
                className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase",
                    config.color
                )}
            >
        {config.label}
      </span>
        );
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Enquiries
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and respond to incoming customer support questions and inquiries.
                    </p>
                </div>

                {/* Status Filter Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={statusFilter ?? ""}
                        onChange={(e) => {
                            setStatusFilter(e.target.value ? e.target.value : null);
                            setPage(1);
                        }}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Enquiries Card / Table Container */}
            <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-foreground">Inquiry Records</h2>
                    <span className="text-xs text-muted-foreground font-mono">
            Showing {enquiriesList.length} of {totalItems}
          </span>
                </div>

                {/* Desktop Table View (Hidden under `md` breakpoint) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/20 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                        <tr>
                            <th className="px-5 py-3.5">Sender</th>
                            <th className="px-5 py-3.5">Subject</th>
                            <th className="px-5 py-3.5">Status</th>
                            <th className="px-5 py-3.5">Received</th>
                            <th className="px-5 py-3.5 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {loading && enquiriesList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                                    Fetching enquiries...
                                </td>
                            </tr>
                        ) : enquiriesList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                    <Inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                                    No enquiries found matching criteria.
                                </td>
                            </tr>
                        ) : (
                            enquiriesList.map((item: any) => (
                                <tr
                                    key={item._id}
                                    className="hover:bg-muted/40 transition-colors duration-150"
                                >
                                    <td className="px-5 py-3.5">
                                        <div className="font-semibold text-foreground text-sm">
                                            {item.fullName || "Anonymous"}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono">
                                            {item.email}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 max-w-[240px]">
                      <span className="font-medium text-foreground line-clamp-1">
                        {item.subject || "No Subject"}
                      </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                        {formatRelativeTime(item.createdAt)}
                                    </td>
                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        <Button
                                            onClick={() => handleOpenModal(item._id)}
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-3 text-xs gap-1.5"
                                        >
                                            <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Data Cards View (Rendered strictly under `md` breakpoint) */}
                <div className="divide-y divide-border md:hidden">
                    {loading && enquiriesList.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                            Fetching enquiries...
                        </div>
                    ) : enquiriesList.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                            No enquiries found.
                        </div>
                    ) : (
                        enquiriesList.map((item: any) => (
                            <div key={item._id} className="p-4 space-y-3 bg-card">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            {item.fullName || "Anonymous"}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {item.email}
                                        </p>
                                    </div>
                                    {getStatusBadge(item.status)}
                                </div>

                                <div>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block">
                    Subject
                  </span>
                                    <p className="text-xs font-medium text-foreground line-clamp-2 mt-0.5">
                                        {item.subject || "No Subject"}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                                    <Button
                                        onClick={() => handleOpenModal(item._id)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-xs gap-1.5"
                                    >
                                        <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View Details
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Footer */}
                {totalItems > 0 && (
                    <div className="p-4 border-t border-border bg-muted/10">
                        <CustomPagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={(newPage) => setPage(newPage)}
                            onPageSizeChange={(newSize) => {
                                setPageSize(newSize);
                                setPage(1);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Enquiry Detail Modal */}
            {selectedEnquiryId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                        onClick={handleCloseModal}
                    />

                    {/* Modal Panel */}
                    <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card shadow-lg animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
                            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Enquiry Details
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            {singleLoading ? (
                                <div className="py-12 text-center text-xs text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                                    Fetching enquiry details...
                                </div>
                            ) : activeEnquiry ? (
                                <>
                                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                        {getStatusBadge(activeEnquiry.status)}
                                        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                                            {formatDateFull(activeEnquiry.createdAt)}
                    </span>
                                    </div>

                                    {/* Sender Info Grid */}
                                    <div className="grid grid-cols-1 gap-2.5 text-xs bg-muted/20 p-3.5 rounded-lg border border-border/50">
                                        <div className="flex items-center gap-2.5 text-foreground font-medium">
                                            <User className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm font-semibold">{activeEnquiry.fullName}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-muted-foreground">
                                            <Mail className="h-4 w-4 text-primary shrink-0" />
                                            <a
                                                href={`mailto:${activeEnquiry.email}`}
                                                className="hover:underline text-foreground font-mono"
                                            >
                                                {activeEnquiry.email}
                                            </a>
                                        </div>
                                        {activeEnquiry.phone && (
                                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                                <Phone className="h-4 w-4 text-primary shrink-0" />
                                                <a
                                                    href={`tel:${activeEnquiry.phone}`}
                                                    className="hover:underline text-foreground font-mono"
                                                >
                                                    {activeEnquiry.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Subject & Message Content */}
                                    <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Subject
                    </span>
                                        <h3 className="text-sm font-bold text-foreground">
                                            {activeEnquiry.subject || "No Subject"}
                                        </h3>
                                        <div className="mt-2 rounded-lg border border-border bg-muted/30 p-4 text-xs text-foreground leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                                            {activeEnquiry.message || "No message body provided."}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                    Unable to load enquiry details.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}