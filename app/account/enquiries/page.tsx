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
    Loader2
} from "lucide-react";
import { GET_ENQUIRIES, GET_ENQUIRY_BY_ID } from "@/dashboard/lib/graphql/documents";
import { CustomPagination } from "@/dashboard/components/ui/pagination";

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

    return (
        <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Enquiries
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage and respond to incoming user questions and support inquiries.
                    </p>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={statusFilter ?? ""}
                        onChange={(e) => {
                            setStatusFilter(e.target.value ? e.target.value : null);
                            setPage(1);
                        }}
                        className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Main Enquiries Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Sender</th>
                            <th className="px-4 py-3">Subject</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Received</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {loading && enquiriesList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                                    Loading enquiries...
                                </td>
                            </tr>
                        ) : enquiriesList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                    No enquiries found.
                                </td>
                            </tr>
                        ) : (
                            enquiriesList.map((item: any) => (
                                <tr
                                    key={item._id}
                                    className="hover:bg-muted/40 transition-colors duration-150"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-foreground">{item.fullName}</div>
                                        <div className="text-[11px] text-muted-foreground">{item.email}</div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[200px] truncate font-medium text-foreground">
                                        {item.subject || "No Subject"}
                                    </td>
                                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase">
                        {item.status || "PENDING"}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                                        {formatRelativeTime(item.createdAt)}
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => handleOpenModal(item._id)}
                                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                                        >
                                            <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Custom Pagination Footer */}
                {totalItems > 0 && (
                    <div className="p-4 border-t border-border bg-muted/20">
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
                        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseModal}
                    />

                    {/* Modal Panel */}
                    <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border p-4 bg-muted/40">
                            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                Enquiry Details
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {singleLoading ? (
                                <div className="py-10 text-center text-xs text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                                    Fetching enquiry details...
                                </div>
                            ) : activeEnquiry ? (
                                <>
                                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase">
                      {activeEnquiry.status || "PENDING"}
                    </span>
                                        <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                                            {formatDateFull(activeEnquiry.createdAt)}
                    </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 text-xs">
                                        <div className="flex items-center gap-2 text-foreground font-medium">
                                            <User className="h-4 w-4 text-primary" />
                                            <span>{activeEnquiry.fullName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <a href={`mailto:${activeEnquiry.email}`} className="hover:underline">
                                                {activeEnquiry.email}
                                            </a>
                                        </div>
                                        {activeEnquiry.phone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-4 w-4 text-primary" />
                                                <a href={`tel:${activeEnquiry.phone}`} className="hover:underline">
                                                    {activeEnquiry.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t border-border/60">
                                        <h3 className="text-xs font-bold text-foreground">
                                            {activeEnquiry.subject || "No Subject"}
                                        </h3>
                                        <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                                            {activeEnquiry.message}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-6 text-center text-xs text-muted-foreground">
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