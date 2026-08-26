"use client";

import { useState } from "react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const sections = [
    {
      name: "Profile",
      icon: "👤",
      description: "Personal information",
    },
    {
      name: "Company",
      icon: "🏢",
      description: "Business information",
    },
    {
      name: "Users",
      icon: "👥",
      description: "Manage system users",
    },
    {
      name: "Notifications",
      icon: "🔔",
      description: "Notification preferences",
    },
    {
      name: "Appearance",
      icon: "🎨",
      description: "Customize your workspace",
    },
    {
      name: "Security",
      icon: "🔐",
      description: "Security preferences",
    },
    {
      name: "Backup & Restore",
      icon: "💾",
      description: "Protect your data",
    },
    {
      name: "Integrations",
      icon: "🔗",
      description: "Connected platforms",
    },
    {
      name: "Audit Logs",
      icon: "📋",
      description: "System activity",
    },
    {
      name: "About",
      icon: "ℹ️",
      description: "SmartChain Nexus",
    },
  ];

  const integrations = [
    {
      name: "Power BI",
      type: "Business Intelligence",
      status: "Connected",
      icon: "📊",
    },
    {
      name: "PostgreSQL",
      type: "Database",
      status: "Connected",
      icon: "🐘",
    },
  ];

  const auditLogs = [
    {
      action: "User Login",
      user: "Blessing",
      time: "Today, 08:42",
    },
    {
      action: "Purchase Order Approved",
      user: "Blessing",
      time: "Yesterday, 16:21",
    },
    {
      action: "Inventory Adjustment",
      user: "Blessing",
      time: "Yesterday, 11:08",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Profile":
        return (
          <SettingsCard
            title="Profile Information"
            description="Manage your personal information and administrator profile."
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="First Name" value="Blessing" />
              <Input label="Last Name" value="Mudarikwa" />
              <Input
                label="Email Address"
                value="blessingmudarikwa23@gmail.com"
              />
              <Input label="Phone Number" value="+27 00 000 0000" />
              <Input label="Job Title" value="Administrator" />
              <Input label="Department" value="Supply Chain" />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Bio
              </label>

              <textarea
                defaultValue="Supply Chain Management professional and technology enthusiast managing SmartChain Nexus."
                className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <ActionButtons />
          </SettingsCard>
        );

      case "Company":
        return (
          <SettingsCard
            title="Company Information"
            description="Configure the organization details used throughout SmartChain Nexus."
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="Company Name" value="SmartChain Nexus" />
              <Input label="Industry" value="Supply Chain" />
              <Input label="Registration Number" value="Not configured" />
              <Input label="Company Email" value="info@smartchainnexus.com" />
              <Input label="Phone" value="+27 00 000 0000" />
              <Input label="Country" value="South Africa" />
            </div>

            <div className="mt-6">
              <Input label="Website" value="www.smartchainnexus.com" />
            </div>

            <ActionButtons />
          </SettingsCard>
        );

      case "Users":
        return (
          <SettingsCard
            title="User Management"
            description="Manage users, roles and access to the SmartChain Nexus platform."
          >
            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              <StatCard
                label="Total Users"
                value="25"
                icon="👥"
                bg="bg-blue-50"
              />

              <StatCard
                label="Active Users"
                value="18"
                icon="🟢"
                bg="bg-emerald-50"
              />

              <StatCard
                label="Administrators"
                value="3"
                icon="🛡️"
                bg="bg-violet-50"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm">User</th>
                    <th className="px-5 py-4 text-left text-sm">Role</th>
                    <th className="px-5 py-4 text-left text-sm">Status</th>
                    <th className="px-5 py-4 text-left text-sm">Last Login</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        Blessing Mudarikwa
                      </div>
                      <div className="text-xs text-slate-500">
                        blessingmudarikwa23@gmail.com
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      Administrator
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status="Active" />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      Today, 08:42
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SettingsCard>
        );

      case "Notifications":
        return (
          <SettingsCard
            title="Notification Preferences"
            description="Choose how SmartChain Nexus keeps you informed."
          >
            <SettingToggle
              title="Email Notifications"
              description="Receive important platform notifications by email."
              enabled={emailNotifications}
              setEnabled={setEmailNotifications}
            />

            <SettingToggle
              title="System Notifications"
              description="Receive important system and platform alerts."
              enabled={systemNotifications}
              setEnabled={setSystemNotifications}
            />

            <SettingToggle
              title="Workflow Notifications"
              description="Receive updates when workflow actions require attention."
              enabled={true}
              setEnabled={() => {}}
            />

            <SettingToggle
              title="Weekly Summary"
              description="Receive a weekly overview of business performance."
              enabled={true}
              setEnabled={() => {}}
            />
          </SettingsCard>
        );

      case "Appearance":
        return (
          <SettingsCard
            title="Appearance"
            description="Customize how SmartChain Nexus looks and behaves."
          >
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-bold text-slate-800">
                Theme
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <ThemeOption
                  name="Light"
                  active={true}
                  preview="bg-white"
                />

                <ThemeOption
                  name="Dark"
                  active={false}
                  preview="bg-slate-900"
                />

                <ThemeOption
                  name="System"
                  active={false}
                  preview="bg-gradient-to-r from-white to-slate-900"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-3 text-sm font-bold text-slate-800">
                Accent Colour
              </h3>

              <div className="flex gap-4">
                {["bg-blue-600", "bg-emerald-500", "bg-violet-600", "bg-orange-500"].map(
                  (color) => (
                    <button
                      key={color}
                      className={`h-10 w-10 rounded-full ${color} ring-4 ring-offset-2 ring-transparent transition hover:ring-slate-200`}
                    />
                  )
                )}
              </div>
            </div>

            <SettingToggle
              title="Compact Mode"
              description="Reduce spacing throughout the dashboard."
              enabled={compactMode}
              setEnabled={setCompactMode}
            />

            <SettingToggle
              title="Collapsed Sidebar"
              description="Use a compact navigation sidebar."
              enabled={false}
              setEnabled={() => {}}
            />
          </SettingsCard>
        );

      case "Security":
        return (
          <SettingsCard
            title="Security"
            description="Protect your SmartChain Nexus account and platform access."
          >
            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-xl text-white">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-emerald-900">
                    Security Status: Strong
                  </h3>

                  <p className="text-sm text-emerald-700">
                    Your account has two-factor authentication enabled.
                  </p>
                </div>
              </div>
            </div>

            <SettingToggle
              title="Two-Factor Authentication"
              description="Require an additional verification step when signing in."
              enabled={twoFactor}
              setEnabled={setTwoFactor}
            />

            <SettingToggle
              title="Login Alerts"
              description="Receive alerts when your account is accessed."
              enabled={true}
              setEnabled={() => {}}
            />

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input label="Session Timeout" value="30 minutes" />
              <Input label="Password Expiry" value="90 days" />
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last Login
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                03 August 2026
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Administrator account
              </p>
            </div>
          </SettingsCard>
        );

      case "Backup & Restore":
        return (
          <SettingsCard
            title="Backup & Restore"
            description="Protect your SmartChain Nexus data with reliable backups."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <StatCard
                label="Backup Status"
                value="Successful"
                icon="✓"
                bg="bg-emerald-50"
              />

              <StatCard
                label="Last Backup"
                value="02 Aug"
                icon="💾"
                bg="bg-blue-50"
              />

              <StatCard
                label="Backup Type"
                value="Database"
                icon="🗄️"
                bg="bg-violet-50"
              />
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-bold text-slate-800">
                  Create New Backup
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create a secure snapshot of your current SmartChain Nexus data.
                </p>
              </div>

              <button className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                Create Backup
              </button>
            </div>
          </SettingsCard>
        );

      case "Integrations":
        return (
          <SettingsCard
            title="Integrations"
            description="Manage external platforms connected to SmartChain Nexus."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                        {integration.icon}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-800">
                          {integration.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {integration.type}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={integration.status} />
                  </div>

                  <button className="mt-6 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Configure Integration
                  </button>
                </div>
              ))}
            </div>
          </SettingsCard>
        );

      case "Audit Logs":
        return (
          <SettingsCard
            title="Audit Logs"
            description="Review important activity across the SmartChain Nexus platform."
          >
            <div className="space-y-4">
              {auditLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      ✓
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {log.action}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Performed by {log.user}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </SettingsCard>
        );

      case "About":
        return (
          <SettingsCard
            title="About SmartChain Nexus"
            description="Application information and platform details."
          >
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur">
                ⚡
              </div>

              <h2 className="text-3xl font-bold">
                SmartChain Nexus
              </h2>

              <p className="mt-3 max-w-2xl text-slate-300">
                An intelligent supply chain management and analytics platform
                designed to connect operational data, business intelligence,
                automation and decision-making.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <InfoBox label="Version" value="1.0.0" />
                <InfoBox label="Industry" value="Supply Chain" />
                <InfoBox label="Region" value="South Africa" />
              </div>
            </div>
          </SettingsCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 bg-white px-6 py-7 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <span>SmartChain Nexus</span>
                <span>/</span>
                <span className="font-medium text-slate-600">
                  Settings
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Settings
              </h1>

              <p className="mt-2 text-sm text-slate-500 md:text-base">
                Manage your SmartChain Nexus workspace, users, security and
                integrations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm md:block">
                <span className="text-slate-400">System status</span>
                <span className="ml-2 font-bold text-emerald-600">
                  ● Operational
                </span>
              </div>

              <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-7 px-6 py-7 md:px-10 lg:flex-row">
        {/* SETTINGS NAVIGATION */}
        <aside className="w-full shrink-0 lg:w-[280px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="px-4 pb-4 pt-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Settings
              </p>
            </div>

            <div className="space-y-1">
              {sections.map((section) => {
                const active = activeSection === section.name;

                return (
                  <button
                    key={section.name}
                    onClick={() => setActiveSection(section.name)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                        active
                          ? "bg-white/15"
                          : "bg-slate-100 group-hover:bg-white"
                      }`}
                    >
                      {section.icon}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-bold ${
                          active ? "text-white" : "text-slate-800"
                        }`}
                      >
                        {section.name}
                      </p>

                      <p
                        className={`truncate text-xs ${
                          active ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACCOUNT CARD */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                BM
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  Blessing Mudarikwa
                </p>

                <p className="truncate text-xs text-slate-400">
                  Administrator
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              ● Account Active
            </div>
          </div>
        </aside>

        {/* SETTINGS PANEL */}
        <main className="min-w-0 flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

/* ==========================================================
   REUSABLE COMPONENTS
========================================================== */

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-6 md:px-8">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="px-6 py-7 md:px-8">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        defaultValue={value}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
      <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
        Cancel
      </button>

      <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
        Save Changes
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: string;
  icon: string;
  bg: string;
}) {
  return (
    <div className={`rounded-2xl ${bg} p-5`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>

        <span className="text-xl">{icon}</span>
      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const connected =
    status === "Connected" ||
    status === "Active" ||
    status === "Successful";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        connected
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      ● {status}
    </span>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  setEnabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 py-5 last:border-b-0">
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ThemeOption({
  name,
  active,
  preview,
}: {
  name: string;
  active: boolean;
  preview: string;
}) {
  return (
    <button
      className={`rounded-2xl border-2 p-3 text-left transition ${
        active
          ? "border-blue-600 shadow-md shadow-blue-600/10"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className={`h-20 rounded-xl ${preview}`} />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{name}</span>

        {active && (
          <span className="text-xs font-bold text-blue-600">
            Selected
          </span>
        )}
      </div>
    </button>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-white">{value}</p>
    </div>
  );
}