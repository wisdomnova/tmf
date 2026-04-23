"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { IconSearch, IconX, IconEdit, IconDownload, IconPlus, IconLogout, IconUserCheck, IconUsers, IconUserMinus, IconAlertCircle, IconAdjustmentsHorizontal } from "@tabler/icons-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4100/api";

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
    checkedInAt: string | null;
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
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<AttendeeForm>(initialNewForm);
  const [newForm, setNewForm] = useState<AttendeeForm>(initialNewForm);
  const [createdRecord, setCreatedRecord] = useState<{
    name: string;
    qrToken: string;
    uuid: string;
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState<"all" | "checked_in" | "not_checked_in" | "invited" | "not_invited">("all");

  async function loadAttendees(staffToken: string, filters: Record<string, string> = {}) {
    setLoading(true);
    setError("");
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/staff/attendees${query ? `?${query}` : ""}`, {
      headers: {
        Authorization: `Bearer ${staffToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Unable to load attendees");
    }

    if (Array.isArray(data)) {
      setItems(data);
      setStats({
        totalAttendees: data.length,
        checkedInCount: data.filter((item: StaffAttendeeItem) => item.registration.checkedInAt).length,
        notCheckedInCount: data.filter((item: StaffAttendeeItem) => !item.registration.checkedInAt).length,
        invitedCount: data.filter((item: StaffAttendeeItem) => (item.attendee.invitationStatus || "invited") === "invited").length,
        notInvitedCount: data.filter((item: StaffAttendeeItem) => ((item.attendee.invitationStatus || "invited") === "not_invited")).length,
      });
    } else {
      setItems(data.items || []);
      setStats({
        totalAttendees: data.stats?.totalAttendees || 0,
        checkedInCount: data.stats?.checkedInCount || 0,
        notCheckedInCount: data.stats?.notCheckedInCount || 0,
        invitedCount: data.stats?.invitedCount || 0,
        notInvitedCount: data.stats?.notInvitedCount || 0,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("tmf_staff_token");
    if (!storedToken) {
      router.replace("/staff/login");
      return;
    }
    setToken(storedToken);
    // Load attendees with initial filters
    const initialFilters: Record<string, string> = {};
    if (filterStatus !== "all") {
      if (filterStatus === "checked_in") initialFilters.checkedIn = "true";
      if (filterStatus === "not_checked_in") initialFilters.checkedIn = "false";
      if (filterStatus === "invited") initialFilters.invitationStatus = "invited";
      if (filterStatus === "not_invited") initialFilters.invitationStatus = "not_invited";
    }
    loadAttendees(storedToken, initialFilters).catch((fetchError: unknown) => {
      setError(
        fetchError instanceof Error ? fetchError.message : "Unable to load attendees",
      );
      setLoading(false);
    });
  }, [router, filterStatus]); // Re-run effect when filterStatus changes

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = !q || [
        item.attendee.name,
        item.attendee.organization,
        item.attendee.designation,
        item.attendee.phoneNumber,
        item.attendee.location,
        item.attendee.uuid,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);

      const matchesFilter =
        filterStatus === "all"
          ? true
          : filterStatus === "checked_in"
            ? Boolean(item.registration.checkedInAt)
            : filterStatus === "not_checked_in"
              ? !item.registration.checkedInAt
              : filterStatus === "invited"
                ? ((item.attendee.invitationStatus || "invited") === "invited")
                : ((item.attendee.invitationStatus || "invited") === "not_invited");

      return matchesSearch && matchesFilter;
    });
  }, [items, search, filterStatus]);

  const totalAttendees = stats.totalAttendees;
  const checkedInCount = stats.checkedInCount;
  const notCheckedInCount = stats.notCheckedInCount;
  const invitedCount = stats.invitedCount;
  const notInvitedCount = stats.notInvitedCount;

  function handleSignOut() {
    localStorage.removeItem("tmf_staff_token");
    router.replace("/staff/login");
  }

  async function handleDownloadQr(record: { name: string; qrToken: string }) {
    const response = await fetch(`${API_BASE_URL}/check-in/${record.qrToken}/qr.svg`);
    if (!response.ok) {
      throw new Error("Unable to download QR code");
    }
    const svg = await response.text();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${record.name.toLowerCase().replace(/\s+/g, "-")}-qr.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleCreateAttendee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setActionError("");
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/staff/attendees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attendee: newForm,
          eventSlug: "tmf-26",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to add attendee");
      }
      setCreatedRecord({
        name: data.attendee.name,
        qrToken: data.registration.qrToken,
        uuid: data.attendee.uuid,
      });
      setNewForm(initialNewForm);
      await loadAttendees(token); // Reload without filters first
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
    setActionError("");
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/staff/attendees/${editingUuid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attendee: editForm,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to update attendee");
      }
      setEditingUuid(null);
      await loadAttendees(token); // Reload without filters first
      setShowEditModal(false);
    } catch (updateError: unknown) {
      setActionError(updateError instanceof Error ? updateError.message : "Unable to update attendee");
    } finally {
      setActionLoading(false);
    }
  }

  function closeAddModal() {
    setShowAddModal(false);
    setActionError("");
  }

  function closeEditModal() {
    setShowEditModal(false);
    setEditingUuid(null);
    setActionError("");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <motion.section
        className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-md sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-[var(--accent-orange)]">Staff Console</p>
        <h1 className="mt-2 text-xl font-semibold text-gray-800 sm:text-2xl">Welcome to check-in desk</h1>
        <p className="mt-2 text-sm text-gray-600">
          Scan attendee QR cards, edit attendee details, and add new attendees
          directly from this dashboard.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardStatCard title="Attendees" value={totalAttendees} icon={<IconUsers size={20} className="text-gray-500" />} />
          <DashboardStatCard title="Checked in" value={checkedInCount} icon={<IconUserCheck size={20} className="text-emerald-600" />} />
          <DashboardStatCard title="Not checked in" value={notCheckedInCount} icon={<IconAlertCircle size={20} className="text-amber-600" />} />
          <DashboardStatCard title="Invited" value={invitedCount} icon={<IconUsers size={20} className="text-blue-600" />} />
          <DashboardStatCard title="Not invited" value={notInvitedCount} icon={<IconUserMinus size={20} className="text-red-600" />} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-opacity-90"
          >
            <IconPlus size={18} />
            Add new attendee
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="block text-sm flex-grow">
            <div className="relative">
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pl-9 text-sm"
                placeholder="Search by name, phone, organization, location..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </label>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "checked_in" | "not_checked_in" | "invited" | "not_invited")}
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Attendees</option>
              <option value="checked_in">Checked In</option>
              <option value="not_checked_in">Not Checked In</option>
              <option value="invited">Invited</option>
              <option value="not_invited">Not Invited</option>
            </select>
            <IconAdjustmentsHorizontal size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}

        <div className="mt-4 max-h-[62vh] overflow-auto rounded-lg border border-gray-200 bg-white">
          {loading ? (
            <div className="flex items-center gap-2 p-4 text-sm text-gray-600">
              <IconAlertCircle size={18} className="text-gray-400" /> Loading attendees...
            </div>
          ) : null}
          {!loading && error ? (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600">
              <IconAlertCircle size={18} /> {error}
            </div>
          ) : null}
          {!loading && !error && filteredItems.length === 0 ? (
            <div className="flex items-center gap-2 p-4 text-sm text-gray-600">
              <IconAlertCircle size={18} className="text-gray-400" /> No attendees found.
            </div>
          ) : null}
          {!loading && !error && filteredItems.length > 0 ? (
            <ul>
              {filteredItems.map((item) => (
                <li key={item.registration.qrToken} className="border-t first:border-t-0 px-3 py-3 sm:px-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium">{item.attendee.name}</p>
                      <p className="text-xs leading-5 text-gray-500 break-words">
                        {item.attendee.organization || "No organization"} ·{" "}
                        {item.attendee.phoneNumber || "No phone"} ·{" "}
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.registration.checkedInAt ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                          {item.registration.checkedInAt ? "Checked in" : "Not checked in"}
                        </span> ·{" "}
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${((item.attendee.invitationStatus || "invited") === 'invited') ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {((item.attendee.invitationStatus || "invited") === "invited") ? "Invited" : "Not invited"}
                        </span>
                      </p>
                    </div>
                    <div className="flex w-full gap-2 sm:w-auto">
                      <Link
                        href={`/staff/check-in/${item.registration.qrToken}`}
                        className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium sm:flex-none"
                        target="_blank"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:flex-none"
                      >
                        <IconEdit size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <motion.div
          className="mt-6"
        >
          <motion.button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <IconLogout size={18} />
            Sign out
          </motion.button>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {showAddModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleCreateAttendee}
              className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 md:p-6"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <p className="text-base font-semibold text-gray-800">Add new attendee</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Full name" required value={newForm.name} onChange={(event) => setNewForm((prev) => ({ ...prev, name: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Organization" value={newForm.organization} onChange={(event) => setNewForm((prev) => ({ ...prev, organization: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Designation" value={newForm.designation} onChange={(event) => setNewForm((prev) => ({ ...prev, designation: event.target.value }))} />
                <input type="email" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Email address" value={newForm.emailAddress} onChange={(event) => setNewForm((prev) => ({ ...prev, emailAddress: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Phone number" value={newForm.phoneNumber} onChange={(event) => setNewForm((prev) => ({ ...prev, phoneNumber: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Location" value={newForm.location} onChange={(event) => setNewForm((prev) => ({ ...prev, location: event.target.value }))} />
                <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={newForm.invitationStatus} onChange={(event) => setNewForm((prev) => ({ ...prev, invitationStatus: event.target.value as "invited" | "not_invited" }))}>
                  <option value="invited">Invited</option>
                  <option value="not_invited">Not invited</option>
                </select>
                <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={newForm.status} onChange={(event) => setNewForm((prev) => ({ ...prev, status: event.target.value }))}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
              {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}
              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 transition-colors hover:bg-opacity-90">
                  {actionLoading ? null : <IconPlus size={18} />}
                  {actionLoading ? "Saving..." : "Add attendee"}
                </button>
                <button type="button" onClick={closeAddModal} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <IconX size={18} />
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSaveEdit}
              className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 md:p-6"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <p className="text-base font-semibold text-gray-800">Edit attendee</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Full name" required value={editForm.name} onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Organization" value={editForm.organization} onChange={(event) => setEditForm((prev) => ({ ...prev, organization: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Designation" value={editForm.designation} onChange={(event) => setEditForm((prev) => ({ ...prev, designation: event.target.value }))} />
                <input type="email" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Email address" value={editForm.emailAddress} onChange={(event) => setEditForm((prev) => ({ ...prev, emailAddress: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Phone number" value={editForm.phoneNumber} onChange={(event) => setEditForm((prev) => ({ ...prev, phoneNumber: event.target.value }))} />
                <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Location" value={editForm.location} onChange={(event) => setEditForm((prev) => ({ ...prev, location: event.target.value }))} />
                <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={editForm.invitationStatus} onChange={(event) => setEditForm((prev) => ({ ...prev, invitationStatus: event.target.value as "invited" | "not_invited" }))}>
                  <option value="invited">Invited</option>
                  <option value="not_invited">Not invited</option>
                </select>
                <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={editForm.status} onChange={(event) => setEditForm((prev) => ({ ...prev, status: event.target.value }))}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
              {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}
              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 transition-colors hover:bg-opacity-90">
                  {actionLoading ? null : <IconEdit size={18} />}
                  {actionLoading ? "Saving..." : "Save changes"}
                </button>
                <button type="button" onClick={closeEditModal} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <IconX size={18} />
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {createdRecord ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <p className="text-base font-semibold text-gray-800">Attendee added</p>
              <p className="mt-2 text-sm text-gray-700">
                {createdRecord.name} has been added. Download the QR code now for card production.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadQr(createdRecord).catch((e)=>setActionError(e.message))}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-opacity-90"
                >
                  <IconDownload size={18} />
                  Download QR code
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedRecord(null)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <IconX size={18} />
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
     </main>
   );
 }
 
 // DashboardStatCard component definition
 function DashboardStatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
   return (
     <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm flex items-center justify-between">
       <div>
         <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
         <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
       </div>
       {icon}
     </div>
   );
 }