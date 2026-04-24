"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import * as XLSX from "xlsx";
import {
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconDownload,
  IconEdit,
  IconLogout,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
  IconUserCheck,
  IconUserMinus,
  IconUsers,
  IconX,
  IconSignature,
} from "@tabler/icons-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4100/api";

type StaffAttendeeItem = {
  attendee: {
    uuid: string;
    name: string;
    organization: string;
    designation: string;
    emailAddress: string;
    phoneNumber: string;
    location: string;
    invitationStatus: "invited" | "not_invited";
    status: string;
  };
  registration: {
    qrToken: string;
    checkedInToday?: boolean;
    hasSignatureOnFile?: boolean;
  };
};

type StaffStats = {
  totalAttendees: number;
  checkedInCount: number;
  notCheckedInCount: number;
  invitedCount: number;
  notInvitedCount: number;
};

type AttendeeForm = {
  name: string;
  organization: string;
  designation: string;
  emailAddress: string;
  phoneNumber: string;
  location: string;
  invitationStatus: "invited" | "not_invited";
  status: string;
};

type ConfirmAction = null | {
  title: string;
  message: string;
  action: () => Promise<void>;
  tone?: "default" | "danger";
};

const initialNewForm: AttendeeForm = {
  name: "",
  organization: "",
  designation: "",
  emailAddress: "",
  phoneNumber: "",
  location: "",
  invitationStatus: "not_invited",
  status: "Pending",
};

function watDateToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getAttendanceRelativeLabel(attendanceDate: string) {
  const today = watDateToday();
  const todayDate = new Date(`${today}T00:00:00`);
  const targetDate = new Date(`${attendanceDate}T00:00:00`);
  const msPerDay = 24 * 60 * 60 * 1000;
  const dayDiff = Math.round((todayDate.getTime() - targetDate.getTime()) / msPerDay);

  if (dayDiff <= 0) return "today";
  if (dayDiff === 1) return "yesterday";
  return `${dayDiff} days ago`;
}

export default function StaffHomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [token, setToken] = useState("");
  const [items, setItems] = useState<StaffAttendeeItem[]>([]);
  const [stats, setStats] = useState<StaffStats>({
    totalAttendees: 0,
    checkedInCount: 0,
    notCheckedInCount: 0,
    invitedCount: 0,
    notInvitedCount: 0,
  });
  const [eventSlug, setEventSlug] = useState("tmf-26");
  const [eventStartDate, setEventStartDate] = useState("2026-04-23");
  const [eventEndDate, setEventEndDate] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(watDateToday());
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEventDatesModal, setShowEventDatesModal] = useState(false);
  const [editForm, setEditForm] = useState<AttendeeForm>(initialNewForm);
  const [newForm, setNewForm] = useState<AttendeeForm>(initialNewForm);
  const [editSignatureData, setEditSignatureData] = useState("");
  const [editSignatureDirty, setEditSignatureDirty] = useState(false);
  const [editSignatureLocked, setEditSignatureLocked] = useState(false);
  const [parsedImportRows, setParsedImportRows] = useState<AttendeeForm[]>([]);
  const [importFileName, setImportFileName] = useState("");

  const [filterStatus, setFilterStatus] = useState<"all" | "checked_in" | "not_checked_in" | "invited" | "not_invited">("all");
  const attendanceRelativeLabel = getAttendanceRelativeLabel(attendanceDate);

  async function loadAttendees(staffToken: string) {
    setLoading(true);
    setError("");
    const filters: Record<string, string> = { eventSlug, attendanceDate, eventStartDate, eventEndDate };
    if (filterStatus === "checked_in") filters.checkedIn = "true";
    if (filterStatus === "not_checked_in") filters.checkedIn = "false";
    if (filterStatus === "invited") filters.invitationStatus = "invited";
    if (filterStatus === "not_invited") filters.invitationStatus = "not_invited";

    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/staff/attendees?${query}`, {
      headers: { Authorization: `Bearer ${staffToken}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || "Unable to load attendees");

    setItems(data.items || []);
    setStats({
      totalAttendees: data.stats?.totalAttendees || 0,
      checkedInCount: data.stats?.checkedInCount || 0,
      notCheckedInCount: data.stats?.notCheckedInCount || 0,
      invitedCount: data.stats?.invitedCount || 0,
      notInvitedCount: data.stats?.notInvitedCount || 0,
    });
    if (data.event?.startsAt) {
      setEventStartDate(String(data.event.startsAt).slice(0, 10));
    }
    if (data.event?.endsAt) {
      setEventEndDate(String(data.event.endsAt).slice(0, 10));
    }
    setSelectedUuids([]);
    setLoading(false);
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("tmf_staff_token");
    if (!storedToken) {
      router.replace("/staff/login");
      return;
    }
    setToken(storedToken);
    loadAttendees(storedToken).catch((e: unknown) => {
      setError(e instanceof Error ? e.message : "Unable to load attendees");
      setLoading(false);
    });
  }, [router, filterStatus, eventSlug, attendanceDate, eventStartDate, eventEndDate]);

  async function handleSaveEventDates() {
    if (!token) return;
    setActionLoading(true);
    setActionError("");
    try {
      const response = await fetch(`${API_BASE_URL}/staff/events/dates`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventSlug, eventStartDate: eventStartDate || undefined, eventEndDate: eventEndDate || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to save event dates");
      await loadAttendees(token);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unable to save event dates");
    } finally {
      setActionLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) =>
      [
        item.attendee.name,
        item.attendee.organization,
        item.attendee.designation,
        item.attendee.phoneNumber,
        item.attendee.location,
        item.attendee.uuid,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, search]);

  const allVisibleSelected =
    filteredItems.length > 0 && filteredItems.every((item) => selectedUuids.includes(item.attendee.uuid));

  function toggleSelect(uuid: string) {
    setSelectedUuids((prev) => (prev.includes(uuid) ? prev.filter((x) => x !== uuid) : [...prev, uuid]));
  }

  function toggleSelectAllVisible() {
    if (allVisibleSelected) {
      setSelectedUuids((prev) => prev.filter((uuid) => !filteredItems.some((item) => item.attendee.uuid === uuid)));
      return;
    }
    const visibleUuids = filteredItems.map((item) => item.attendee.uuid);
    setSelectedUuids((prev) => Array.from(new Set([...prev, ...visibleUuids])));
  }

  function handleSignOut() {
    localStorage.removeItem("tmf_staff_token");
    router.replace("/staff/login");
  }

  async function handleCreateAttendee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setActionError("");
    setActionLoading(true);
    try {
      const primary = await fetch(`${API_BASE_URL}/staff/attendees`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ attendee: newForm, eventSlug, eventStartDate, eventEndDate }),
      });

      // Fallback for stale backend deployments missing /staff/attendees.
      const response =
        primary.status === 404
          ? await fetch(`${API_BASE_URL}/attendees/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ attendee: newForm, eventSlug, eventStartDate, eventEndDate }),
            })
          : primary;

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to add attendee");
      setNewForm(initialNewForm);
      await loadAttendees(token);
      setShowAddModal(false);
    } catch (createError: unknown) {
      setActionError(createError instanceof Error ? createError.message : "Unable to add attendee");
    } finally {
      setActionLoading(false);
    }
  }

  async function startEdit(item: StaffAttendeeItem) {
    setEditingUuid(item.attendee.uuid);
    setEditForm({
      name: item.attendee.name || "",
      organization: item.attendee.organization || "",
      designation: item.attendee.designation || "",
      emailAddress: item.attendee.emailAddress || "",
      phoneNumber: item.attendee.phoneNumber || "",
      location: item.attendee.location || "",
      invitationStatus: item.attendee.invitationStatus || "invited",
      status: item.attendee.status || "Pending",
    });
    setEditSignatureData("");
    setEditSignatureDirty(false);
    setEditSignatureLocked(Boolean(item.registration.hasSignatureOnFile));
    try {
      const response = await fetch(`${API_BASE_URL}/staff/attendees/${item.attendee.uuid}/signature?eventSlug=${eventSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const asDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.readAsDataURL(blob);
        });
        setEditSignatureData(asDataUrl);
        setEditSignatureLocked(true);
      }
    } catch {
      // non-fatal: editing can continue without preloaded signature
    }
    setShowEditModal(true);
  }

  async function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !editingUuid) return;
    setActionLoading(true);
    setActionError("");
    try {
      const response = await fetch(`${API_BASE_URL}/staff/attendees/${editingUuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ attendee: editForm }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to update attendee");
      if (editSignatureDirty) {
        const sigResponse = await fetch(`${API_BASE_URL}/staff/attendees/${editingUuid}/signature`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ eventSlug, signatureData: editSignatureData || "" }),
        });
        const sigData = await sigResponse.json();
        if (!sigResponse.ok) throw new Error(sigData?.error || "Unable to update signature");
      }
      await loadAttendees(token);
      setShowEditModal(false);
      setEditingUuid(null);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unable to update attendee");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteUuids(uuids: string[]) {
    if (!token || !uuids.length) return;
    setActionLoading(true);
    setActionError("");
    try {
      if (uuids.length === 1) {
        const response = await fetch(`${API_BASE_URL}/staff/attendees/${uuids[0]}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Unable to delete attendee");
      } else {
        const response = await fetch(`${API_BASE_URL}/staff/attendees/bulk-delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ uuids }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Unable to delete attendees");
      }
      await loadAttendees(token);
      setSelectedUuids([]);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unable to delete attendees");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBulkCheckIn(uuids: string[]) {
    if (!token || !uuids.length) return;
    setActionLoading(true);
    setActionError("");
    try {
      const response = await fetch(`${API_BASE_URL}/staff/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventSlug, eventStartDate, eventEndDate, uuids, attendanceDate }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to mark attendance");
      await loadAttendees(token);
      setSelectedUuids([]);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Unable to mark attendance");
    } finally {
      setActionLoading(false);
    }
  }

  function getAttendeeRowsForExport(source: StaffAttendeeItem[]) {
    return source.map((item) => ({
      uuid: item.attendee.uuid,
      name: item.attendee.name,
      organization: item.attendee.organization || "",
      designation: item.attendee.designation || "",
      emailAddress: item.attendee.emailAddress || "",
      phoneNumber: item.attendee.phoneNumber || "",
      location: item.attendee.location || "",
      invitationStatus: item.attendee.invitationStatus || "invited",
      checkedIn: item.registration.checkedInToday ? "yes" : "no",
      attendanceDate,
      eventSlug,
    }));
  }

  function exportAttendeesSheet(selectedOnly: boolean) {
    const base = selectedOnly
      ? filteredItems.filter((item) => selectedUuids.includes(item.attendee.uuid))
      : items;

    if (!base.length) {
      setActionError(selectedOnly ? "No selected attendees to export" : "No attendees to export");
      return;
    }

    const rows = getAttendeeRowsForExport(base);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "attendees");
    const safeDate = attendanceDate || watDateToday();
    const scope = selectedOnly ? "selected" : "all";
    const fileName = `${eventSlug}-${safeDate}-${scope}-attendees.xlsx`;
    XLSX.writeFile(workbook, fileName, { bookType: "xlsx" });
  }

  async function handleDownloadSignature(uuid: string, name: string) {
    if (!token) return;
    const response = await fetch(`${API_BASE_URL}/staff/attendees/${uuid}/signature?eventSlug=${eventSlug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Signature not found");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-signature.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleDownloadSelectedSignatures(uuids: string[]) {
    if (!token || !uuids.length) return;
    const qs = new URLSearchParams({ eventSlug, uuids: uuids.join(",") });
    const response = await fetch(`${API_BASE_URL}/staff/signatures/export?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to export selected signatures");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventSlug}-selected-signatures.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function normalizeImportedRows(rows: Record<string, unknown>[]): AttendeeForm[] {
    return rows
      .map((row) => ({
        name: String(row.name || row.Name || "").trim(),
        organization: String(row.organization || row.Organization || "").trim(),
        designation: String(row.designation || row.Designation || "").trim(),
        emailAddress: String(row.emailAddress || row.email || row.Email || "").trim(),
        phoneNumber: String(row.phoneNumber || row.phone || row.Phone || "").trim(),
        location: String(row.location || row.Location || "").trim(),
        invitationStatus:
          String(row.invitationStatus || row.invitation_status || "invited").trim() === "not_invited"
            ? ("not_invited" as const)
            : ("invited" as const),
        status: String(row.status || row.Status || "Pending").trim() || "Pending",
      }))
      .filter((row) => row.name);
  }

  async function handleParseImportFile(file: File) {
    setActionError("");
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: "" });
      const attendees = normalizeImportedRows(rows);
      if (!attendees.length) {
        throw new Error("No valid rows found. Ensure at least the name column is provided.");
      }
      setParsedImportRows(attendees);
      setImportFileName(file.name);
    } catch (e: unknown) {
      setParsedImportRows([]);
      setImportFileName("");
      setActionError(e instanceof Error ? e.message : "Unable to parse import file");
    }
  }

  async function handleImportConfirm() {
    if (!token || !parsedImportRows.length) return;
    setActionLoading(true);
    setActionError("");
    try {
      const response = await fetch(`${API_BASE_URL}/staff/attendees/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventSlug, eventStartDate, eventEndDate, attendees: parsedImportRows }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Import failed");
      await loadAttendees(token);
      setShowImportModal(false);
      setParsedImportRows([]);
      setImportFileName("");
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <motion.section className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-[var(--accent-orange)]">Staff Console</p>
        <h1 className="mt-2 text-xl font-semibold text-gray-800 sm:text-2xl">Welcome to check-in desk</h1>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input value={eventSlug} onChange={(e) => setEventSlug(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Event slug (e.g. tmf-26)" />
          <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button
            type="button"
            onClick={() => setShowEventDatesModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:opacity-60 hover:bg-gray-50"
          >
            Edit event dates
          </button>
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <IconUpload size={16} /> Upload CSV/Excel
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Event window: from {eventStartDate || "not set"} to {eventEndDate || "not set"}.
        </p>
        <p className="mt-2 text-xs text-gray-600">
          Choose any date above to view/edit attendance for that day (including past days like yesterday).
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardStatCard title="Attendees" value={stats.totalAttendees} icon={<IconUsers size={20} className="text-gray-500" />} />
          <DashboardStatCard title={`Checked in ${attendanceRelativeLabel}`} value={stats.checkedInCount} icon={<IconUserCheck size={20} className="text-emerald-600" />} />
          <DashboardStatCard title={`Not checked in ${attendanceRelativeLabel}`} value={stats.notCheckedInCount} icon={<IconAlertCircle size={20} className="text-amber-600" />} />
          <DashboardStatCard title="Invited" value={stats.invitedCount} icon={<IconUsers size={20} className="text-blue-600" />} />
          <DashboardStatCard title="Not invited" value={stats.notInvitedCount} icon={<IconUserMinus size={20} className="text-red-600" />} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-90"><IconPlus size={16} /> Add new attendee</button>
          <button
            disabled={!selectedUuids.length || actionLoading}
            onClick={() => setConfirmAction({ title: "Delete selected", message: `Delete ${selectedUuids.length} attendee(s)?`, tone: "danger", action: () => handleDeleteUuids(selectedUuids) })}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
          ><IconTrash size={16} /> Delete selected</button>
          <button
            disabled={!selectedUuids.length || actionLoading}
            onClick={() => setConfirmAction({ title: "Mark selected present", message: `Mark ${selectedUuids.length} attendee(s) as present for ${attendanceDate}?`, action: () => handleBulkCheckIn(selectedUuids) })}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
          ><IconCheck size={16} /> Mark selected present</button>
          <button
            disabled={!selectedUuids.length || actionLoading}
            onClick={() => handleDownloadSelectedSignatures(selectedUuids).catch((e) => setActionError(e.message))}
            title={!selectedUuids.length ? "Select attendees first" : undefined}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none"
          ><IconDownload size={16} /> Download selected signatures</button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pl-9 text-sm" placeholder="Search attendees..." />
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </label>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-sm"
            >
              <option value="all">All attendees</option>
              <option value="checked_in">Checked in</option>
              <option value="not_checked_in">Not checked in</option>
              <option value="invited">Invited</option>
              <option value="not_invited">Not invited</option>
            </select>
            <IconAdjustmentsHorizontal size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}

        <div className="mt-4 max-h-[72vh] overflow-auto rounded-lg border border-gray-200 bg-white">
          {loading ? <div className="p-4 text-sm text-gray-600">Loading attendees...</div> : null}
          {!loading && error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
          {!loading && !error && !filteredItems.length ? <div className="p-4 text-sm text-gray-600">No attendees found.</div> : null}

          {!loading && !error && filteredItems.length ? (
            <ul>
              <li className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAllVisible} />
                Select all visible ({filteredItems.length})
              </li>
              {filteredItems.map((item, index) => (
                <li key={item.registration.qrToken} className="px-2 py-2.5 sm:px-3 sm:py-3">
                  <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3.5">
                      <input type="checkbox" checked={selectedUuids.includes(item.attendee.uuid)} onChange={() => toggleSelect(item.attendee.uuid)} className="mt-1" />
                      <div className="space-y-1">
                        <p className="font-medium">{index + 1}. {item.attendee.name}</p>
                        <p className="text-sm leading-6 text-gray-500 break-words">
                          {item.attendee.organization || "No organization"} · {item.attendee.phoneNumber || "No phone"} ·{" "}
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.registration.checkedInToday
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {item.registration.checkedInToday ? `Checked in ${attendanceRelativeLabel}` : `Not checked in ${attendanceRelativeLabel}`}
                          </span>{" "}
                          ·{" "}
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.registration.hasSignatureOnFile
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.registration.hasSignatureOnFile ? "Signed" : "No signature"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-3 lg:grid-cols-5">
                      <button onClick={() => setConfirmAction({ title: "Mark present", message: `Mark ${item.attendee.name} present for ${attendanceDate} without signature?`, action: () => handleBulkCheckIn([item.attendee.uuid]) })} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-gray-300 px-3 text-xs">Check in</button>
                      <Link href={`/staff/check-in/${item.registration.qrToken}`} target="_blank" className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 px-3 text-xs">Open</Link>
                      <button onClick={() => startEdit(item)} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-gray-300 px-3 text-xs"><IconEdit size={14} />Edit</button>
                      <button onClick={() => handleDownloadSignature(item.attendee.uuid, item.attendee.name).catch((e) => setActionError(e.message))} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-gray-300 px-3 text-xs"><IconDownload size={14} />Signature</button>
                      <button onClick={() => setConfirmAction({ title: "Delete attendee", message: `Delete ${item.attendee.name}?`, tone: "danger", action: () => handleDeleteUuids([item.attendee.uuid]) })} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-red-200 px-3 text-xs text-red-700"><IconTrash size={14} />Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-6">
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"><IconLogout size={18} />Sign out</button>
        </div>
      </motion.section>

      <ConfirmModal confirmAction={confirmAction} setConfirmAction={setConfirmAction} loading={actionLoading} />

      <AnimatePresence>
        {showAddModal ? (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.form onSubmit={handleCreateAttendee} className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
              <p className="text-base font-semibold text-gray-800">Add new attendee</p>
              <AttendeeFormFields form={newForm} setForm={setNewForm} />
              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{actionLoading ? "Saving..." : "Add attendee"}</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"><IconX size={18} />Cancel</button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal ? (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.form onSubmit={handleSaveEdit} className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
              <p className="text-base font-semibold text-gray-800">Edit attendee</p>
              <AttendeeFormFields form={editForm} setForm={setEditForm} />
              <SignatureEditorBox
                signatureData={editSignatureData}
                locked={editSignatureLocked}
                onSignatureChange={(value) => {
                  setEditSignatureData(value);
                  setEditSignatureDirty(true);
                }}
              />
              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{actionLoading ? "Saving..." : "Save changes"}</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"><IconX size={18} />Cancel</button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showImportModal ? (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 md:p-6" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-gray-800">Upload attendee list</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Accepted formats: CSV, XLSX, XLS. Required field: <span className="font-medium">name</span>.
                  </p>
                </div>
                <button type="button" onClick={() => setShowImportModal(false)} className="inline-flex rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50">
                  <IconX size={16} />
                </button>
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
                <p className="font-medium text-gray-800">Column format we accept</p>
                <p className="mt-1">name, organization, designation, emailAddress (or email), phoneNumber (or phone), location, invitationStatus, status</p>
                <p className="mt-1">Header names are case-insensitive and common variants are supported.</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-700">
                  Event start date (optional, for new events)
                  <input
                    type="date"
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="mt-3 block text-sm text-gray-700">
                  Event end date (optional)
                  <input
                    type="date"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <IconUpload size={16} /> Choose file
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleParseImportFile(file);
                  }}
                />
              </label>

              {importFileName ? (
                <p className="mt-3 text-sm text-gray-700">
                  Parsed <span className="font-medium">{parsedImportRows.length}</span> rows from <span className="font-medium">{importFileName}</span>.
                </p>
              ) : (
                <p className="mt-3 text-sm text-gray-500">No file parsed yet.</p>
              )}

              {parsedImportRows.length ? (
                <div className="mt-3 max-h-40 overflow-auto rounded-lg border border-gray-200">
                  <ul className="divide-y divide-gray-100 text-sm">
                    {parsedImportRows.slice(0, 8).map((row, idx) => (
                      <li key={`${row.name}-${idx}`} className="px-3 py-2 text-gray-700">
                        {idx + 1}. {row.name} {row.organization ? `· ${row.organization}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={!parsedImportRows.length || actionLoading}
                  onClick={handleImportConfirm}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {actionLoading ? "Uploading..." : "Upload parsed rows"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    setParsedImportRows([]);
                    setImportFileName("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showEventDatesModal ? (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 md:p-6" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}>
              <p className="text-base font-semibold text-gray-800">Edit event dates</p>
              <p className="mt-1 text-sm text-gray-600">Set the event date range for <span className="font-medium">{eventSlug}</span>.</p>

              <div className="mt-4 space-y-3">
                <label className="block text-sm text-gray-700">
                  Event start date
                  <input type="date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
                <label className="block text-sm text-gray-700">
                  Event end date
                  <input type="date" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
              </div>

              <div className="mt-4 flex gap-2">
                <button type="button" onClick={async () => { await handleSaveEventDates(); setShowEventDatesModal(false); }} disabled={actionLoading} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {actionLoading ? "Saving..." : "Save dates"}
                </button>
                <button type="button" onClick={() => setShowEventDatesModal(false)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function AttendeeFormFields({ form, setForm }: { form: AttendeeForm; setForm: (fn: (prev: AttendeeForm) => AttendeeForm) => void }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Full name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Organization" value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} />
      <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Designation" value={form.designation} onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))} />
      <input type="email" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Email" value={form.emailAddress} onChange={(e) => setForm((p) => ({ ...p, emailAddress: e.target.value }))} />
      <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Phone" value={form.phoneNumber} onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
      <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
      <div className="relative">
        <select className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm" value={form.invitationStatus} onChange={(e) => setForm((p) => ({ ...p, invitationStatus: e.target.value as "invited" | "not_invited" }))}><option value="invited">Invited</option><option value="not_invited">Not invited</option></select>
        <IconChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <div className="relative">
        <select className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option value="Pending">Pending</option><option value="Confirmed">Confirmed</option></select>
        <IconChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function SignatureEditorBox({ signatureData, locked, onSignatureChange }: { signatureData: string; locked: boolean; onSignatureChange: (value: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;

    let drawing = false;
    const point = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const down = (event: PointerEvent) => {
      drawing = true;
      const p = point(event);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };
    const move = (event: PointerEvent) => {
      if (!drawing) return;
      const p = point(event);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };
    const up = () => {
      drawing = false;
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", up);
    };
  }, []);

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-800">Signature</p>
      <p className="mt-1 text-xs text-gray-600">
        {locked
          ? "Existing signature is locked and cannot be edited."
          : "Upload an image, draw a new signature, or clear existing signature."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700">
          <IconUpload size={14} /> Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={locked}
            onChange={(e) => {
              if (locked) return;
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onSignatureChange(String(reader.result || ""));
              reader.readAsDataURL(file);
            }}
          />
        </label>
        <button
          type="button"
          disabled={locked}
          onClick={() => {
            if (locked) return;
            if (!canvasRef.current) return;
            onSignatureChange(canvasRef.current.toDataURL("image/png"));
          }}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconSignature size={14} /> Use drawn signature
        </button>
        <button type="button" disabled={locked} onClick={() => onSignatureChange("")} className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
          <IconX size={14} /> Clear
        </button>
      </div>
      {!locked ? (
        <canvas ref={canvasRef} width={600} height={140} className="mt-3 h-[110px] w-full touch-none rounded-md border border-gray-200 bg-white" />
      ) : null}
      <div className="mt-3 min-h-[80px] rounded-md border border-gray-200 bg-white p-2">
        {signatureData ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={signatureData} alt="Signature preview" className="max-h-[100px] w-full object-contain" />
        ) : (
          <p className="text-xs text-gray-400">No signature set</p>
        )}
      </div>
    </div>
  );
}

function ConfirmModal({ confirmAction, setConfirmAction, loading }: { confirmAction: ConfirmAction; setConfirmAction: (value: ConfirmAction) => void; loading: boolean }) {
  return (
    <AnimatePresence>
      {confirmAction ? (
        <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h3 className="text-base font-semibold text-gray-900">{confirmAction.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{confirmAction.message}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  await confirmAction.action();
                  setConfirmAction(null);
                }}
                disabled={loading}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${confirmAction.tone === "danger" ? "bg-red-600" : "bg-[var(--accent-orange)]"}`}
              >
                {loading ? "Please wait..." : "Confirm"}
              </button>
              <button type="button" onClick={() => setConfirmAction(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700">Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DashboardStatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
        <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
  );
}
