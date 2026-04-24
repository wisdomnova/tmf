"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import * as XLSX from "xlsx";
import {
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconCheck,
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
  const [attendanceDate, setAttendanceDate] = useState(watDateToday());
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<AttendeeForm>(initialNewForm);
  const [newForm, setNewForm] = useState<AttendeeForm>(initialNewForm);

  const [filterStatus, setFilterStatus] = useState<"all" | "checked_in" | "not_checked_in" | "invited" | "not_invited">("all");

  async function loadAttendees(staffToken: string) {
    setLoading(true);
    setError("");
    const filters: Record<string, string> = { eventSlug, attendanceDate };
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
  }, [router, filterStatus, eventSlug, attendanceDate]);

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
        body: JSON.stringify({ attendee: newForm, eventSlug }),
      });

      // Fallback for stale backend deployments missing /staff/attendees.
      const response =
        primary.status === 404
          ? await fetch(`${API_BASE_URL}/attendees/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ attendee: newForm, eventSlug }),
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

  function startEdit(item: StaffAttendeeItem) {
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
        body: JSON.stringify({ eventSlug, uuids, attendanceDate }),
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

  async function handleDownloadSignatures(uuids: string[]) {
    if (!token) return;
    const qs = new URLSearchParams({ eventSlug });
    if (uuids.length) qs.set("uuids", uuids.join(","));

    const response = await fetch(`${API_BASE_URL}/staff/signatures/export?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to export signatures");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventSlug}-signatures.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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

  function exportAttendeesSheet(format: "csv" | "xlsx", selectedOnly: boolean) {
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
    const fileName = `${eventSlug}-${safeDate}-${scope}-attendees.${format}`;
    XLSX.writeFile(workbook, fileName, { bookType: format });
  }

  async function handleImportFile(file: File) {
    if (!token) return;
    setActionLoading(true);
    setActionError("");
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: "" });

      const attendees = rows.map((row) => ({
        name: String(row.name || row.Name || "").trim(),
        organization: String(row.organization || row.Organization || "").trim(),
        designation: String(row.designation || row.Designation || "").trim(),
        emailAddress: String(row.emailAddress || row.email || row.Email || "").trim(),
        phoneNumber: String(row.phoneNumber || row.phone || row.Phone || "").trim(),
        location: String(row.location || row.Location || "").trim(),
        invitationStatus:
          String(row.invitationStatus || row.invitation_status || "invited").trim() === "not_invited"
            ? "not_invited"
            : "invited",
        status: String(row.status || row.Status || "Pending").trim() || "Pending",
      })).filter((row) => row.name);

      const response = await fetch(`${API_BASE_URL}/staff/attendees/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventSlug, attendees }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Import failed");
      await loadAttendees(token);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <motion.section className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-[var(--accent-orange)]">Staff Console</p>
        <h1 className="mt-2 text-xl font-semibold text-gray-800 sm:text-2xl">Welcome to check-in desk</h1>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input value={eventSlug} onChange={(e) => setEventSlug(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Event slug (e.g. tmf-26)" />
          <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <IconUpload size={16} /> Upload CSV/Excel
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
              }}
            />
          </label>
          <button onClick={() => handleDownloadSignatures([]).catch((e) => setActionError(e.message))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <IconDownload size={16} /> Download all signatures
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Choose any date above to view/edit attendance for that day (including past days like yesterday).
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardStatCard title="Attendees" value={stats.totalAttendees} icon={<IconUsers size={20} className="text-gray-500" />} />
          <DashboardStatCard title="Checked in today" value={stats.checkedInCount} icon={<IconUserCheck size={20} className="text-emerald-600" />} />
          <DashboardStatCard title="Not checked in today" value={stats.notCheckedInCount} icon={<IconAlertCircle size={20} className="text-amber-600" />} />
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
            onClick={() => handleDownloadSignatures(selectedUuids).catch((e) => setActionError(e.message))}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
          ><IconDownload size={16} /> Download selected</button>
          <button
            onClick={() => exportAttendeesSheet("csv", false)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
          >
            <IconDownload size={16} /> Export all CSV
          </button>
          <button
            onClick={() => exportAttendeesSheet("xlsx", false)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
          >
            <IconDownload size={16} /> Export all Excel
          </button>
          <button
            disabled={!selectedUuids.length}
            onClick={() => exportAttendeesSheet("csv", true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
          >
            <IconDownload size={16} /> Export selected CSV
          </button>
          <button
            disabled={!selectedUuids.length}
            onClick={() => exportAttendeesSheet("xlsx", true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
          >
            <IconDownload size={16} /> Export selected Excel
          </button>
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

        <div className="mt-4 max-h-[62vh] overflow-auto rounded-lg border border-gray-200 bg-white">
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
                <li key={item.registration.qrToken} className="px-2 py-2 sm:px-3">
                  <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:justify-between">
                    <div className="flex gap-3">
                      <input type="checkbox" checked={selectedUuids.includes(item.attendee.uuid)} onChange={() => toggleSelect(item.attendee.uuid)} className="mt-1" />
                      <div>
                        <p className="font-medium">{index + 1}. {item.attendee.name}</p>
                        <p className="text-xs leading-5 text-gray-500 break-words">
                          {item.attendee.organization || "No organization"} · {item.attendee.phoneNumber || "No phone"} ·{" "}
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.registration.checkedInToday
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {item.registration.checkedInToday ? "Checked in" : "Not checked in today"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                      <button onClick={() => setConfirmAction({ title: "Mark present", message: `Mark ${item.attendee.name} present for ${attendanceDate} without signature?`, action: () => handleBulkCheckIn([item.attendee.uuid]) })} className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-300 px-3 text-xs">Check in</button>
                      <Link href={`/staff/check-in/${item.registration.qrToken}`} target="_blank" className="inline-flex h-9 items-center rounded-md border border-gray-300 px-3 text-xs">Open</Link>
                      <button onClick={() => startEdit(item)} className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-300 px-3 text-xs"><IconEdit size={14} />Edit</button>
                      <button onClick={() => handleDownloadSignatures([item.attendee.uuid]).catch((e) => setActionError(e.message))} className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-300 px-3 text-xs"><IconDownload size={14} />Signature</button>
                      <button onClick={() => setConfirmAction({ title: "Delete attendee", message: `Delete ${item.attendee.name}?`, tone: "danger", action: () => handleDeleteUuids([item.attendee.uuid]) })} className="inline-flex h-9 items-center gap-1 rounded-md border border-red-200 px-3 text-xs text-red-700"><IconTrash size={14} />Delete</button>
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
              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{actionLoading ? "Saving..." : "Save changes"}</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"><IconX size={18} />Cancel</button>
              </div>
            </motion.form>
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
      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.invitationStatus} onChange={(e) => setForm((p) => ({ ...p, invitationStatus: e.target.value as "invited" | "not_invited" }))}><option value="invited">Invited</option><option value="not_invited">Not invited</option></select>
      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option value="Pending">Pending</option><option value="Confirmed">Confirmed</option></select>
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
