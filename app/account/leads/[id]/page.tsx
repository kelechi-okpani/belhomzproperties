"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowLeft, Phone, Mail, Calendar } from "lucide-react";
import {
  LEAD_DETAIL_QUERY,
  ADD_LEAD_ACTIVITY_MUTATION,
  SCHEDULE_INSPECTION_MUTATION,
} from "../../../../dashboard/lib/graphql/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "../../../../dashboard/components/ui/input";
import { Can } from "../../../../dashboard/components/auth/can";
import { formatDistanceToNow } from "date-fns";




export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, refetch } = useQuery<any>(LEAD_DETAIL_QUERY, { variables: { id } });
  const [addActivity, { loading: addingNote }] = useMutation<any>(ADD_LEAD_ACTIVITY_MUTATION);
  const [scheduleInspection, { loading: scheduling }] = useMutation<any>(SCHEDULE_INSPECTION_MUTATION);

  const [note, setNote] = useState("");
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionLocation, setInspectionLocation] = useState("");

  if (loading) return <p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>;

  const lead = data?.lead;
  if (!lead) return <p className="text-sm text-[var(--color-ink-muted)]">Lead not found.</p>;

  const handleAddNote = async () => {
    if (!note.trim()) return;
    await addActivity({ variables: { id, note } });
    setNote("");
    refetch();
  };

  const handleScheduleInspection = async () => {
    if (!inspectionDate || !inspectionLocation) return;
    await scheduleInspection({
      variables: {
        id,
        input: { scheduledAt: new Date(inspectionDate).toISOString(), location: inspectionLocation },
      },
    });
    setShowInspectionForm(false);
    refetch();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/leads"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to leads
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-medium">{lead.clientName}</h1>
              <Badge className="mt-2">
                {lead.stage.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-ink-muted)]">
            <span className="flex items-center gap-1.5 font-mono">
              <Phone className="h-4 w-4" /> {lead.clientPhone}
            </span>
            {lead.clientEmail && (
              <span className="flex items-center gap-1.5 font-mono">
                <Mail className="h-4 w-4" /> {lead.clientEmail}
              </span>
            )}
          </div>

          {lead.inspection && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--color-brass-soft)] px-3 py-2 text-sm text-[var(--color-brass-dark)]">
              <Calendar className="h-4 w-4" />
              Inspection at {lead.inspection.location} —{" "}
              {new Date(lead.inspection.scheduledAt).toLocaleString()}
            </div>
          )}

          <Can do="scheduleInspections">
            <div className="mt-4">
              {!showInspectionForm ? (
                <Button variant="outline" size="sm" onClick={() => setShowInspectionForm(true)}>
                  <Calendar className="h-3.5 w-3.5" />
                  Schedule inspection
                </Button>
              ) : (
                <div className="space-y-3 rounded-lg border border-[var(--color-border)] p-3">
                  <div>
                    <Label htmlFor="inspectionDate">Date &amp; time</Label>
                    <Input
                      id="inspectionDate"
                      type="datetime-local"
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inspectionLocation">Location</Label>
                    <Input
                      id="inspectionLocation"
                      value={inspectionLocation}
                      onChange={(e) => setInspectionLocation(e.target.value)}
                      placeholder="Property address"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" disabled={scheduling} onClick={handleScheduleInspection}>
                      Confirm
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowInspectionForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Can>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-medium">Activity</h2>

          <Can do="addLeadNotes">
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Add a note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
              <Button variant="default" size="sm" disabled={addingNote} onClick={handleAddNote}>
                Add
              </Button>
            </div>
          </Can>

          <ul className="mt-4 space-y-3">
            {[...lead.activities].reverse().map((activity: any, i: number) => (
              <li key={i} className="border-l-2 border-[var(--color-brass-soft)] pl-3 text-sm">
                <p className="text-[var(--color-ink)]">{activity.note}</p>
                <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </li>
            ))}
            {lead.activities.length === 0 && (
              <p className="text-sm text-[var(--color-ink-muted)]">No activity logged yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
