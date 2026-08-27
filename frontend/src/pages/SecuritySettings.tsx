import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const SECURITY_SETTINGS_URL =
  `${API_URL}/settings/security`;

const PASSWORD_UPDATE_URL =
  `${API_URL}/auth/change-password`;

type SecuritySettingsData = {
  id?: number;
  two_factor_enabled?: boolean;
  two_factor?: boolean;
  login_alerts?: boolean;
  security_alerts?: boolean;
  session_timeout_minutes?: number;
  session_timeout?: number;
};

export default function SecuritySettings() {
  const [securityId, setSecurityId] =
    useState<number | null>(null);

  const [twoFactor, setTwoFactor] =
    useState(false);

  const [loginAlerts, setLoginAlerts] =
    useState(true);

  const [securityAlerts, setSecurityAlerts] =
    useState(true);

  const [sessionTimeout, setSessionTimeout] =
    useState("30");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [savingSecurity, setSavingSecurity] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ========================================================
     LOAD SECURITY SETTINGS
  ======================================================== */

  useEffect(() => {
    let mounted = true;

    const loadSecuritySettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          SECURITY_SETTINGS_URL,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          let backendMessage =
            `Failed to load security settings (${response.status}).`;

          try {
            const data =
              await response.json();

            backendMessage =
              data?.detail ||
              data?.message ||
              backendMessage;
          } catch {
            // Keep default message.
          }

          throw new Error(
            backendMessage
          );
        }

        const data =
          await response.json();

        const security: SecuritySettingsData =
          Array.isArray(data)
            ? data[0]
            : data;

        if (!mounted || !security) {
          return;
        }

        setSecurityId(
          security.id ?? null
        );

        setTwoFactor(
          Boolean(
            security.two_factor_enabled ??
              security.two_factor ??
              false
          )
        );

        setLoginAlerts(
          security.login_alerts ??
            true
        );

        setSecurityAlerts(
          security.security_alerts ??
            true
        );

        setSessionTimeout(
          String(
            security.session_timeout_minutes ??
              security.session_timeout ??
              30
          )
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load security settings."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSecuritySettings();

    return () => {
      mounted = false;
    };
  }, []);

  /* ========================================================
     SAVE SECURITY SETTINGS
  ======================================================== */

  const handleSaveSecurity =
    async () => {
      try {
        setSavingSecurity(true);
        setError("");
        setMessage("");

        const payload = {
          two_factor_enabled:
            twoFactor,

          login_alerts:
            loginAlerts,

          security_alerts:
            securityAlerts,

          session_timeout_minutes:
            Number(sessionTimeout),
        };

        const url = securityId
          ? `${SECURITY_SETTINGS_URL}/${securityId}`
          : SECURITY_SETTINGS_URL;

        const method = securityId
          ? "PUT"
          : "POST";

        const body = securityId
          ? payload
          : {
              user_id: 1,
              ...payload,
            };

        const response =
          await fetch(url, {
            method,
            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },
            body:
              JSON.stringify(body),
          });

        if (!response.ok) {
          let backendMessage =
            `Failed to save security settings (${response.status}).`;

          try {
            const data =
              await response.json();

            backendMessage =
              data?.detail ||
              data?.message ||
              backendMessage;
          } catch {
            // Keep default message.
          }

          throw new Error(
            backendMessage
          );
        }

        const saved =
          await response.json();

        setSecurityId(
          saved?.id ??
            securityId
        );

        setMessage(
          "Security settings saved successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to save security settings."
        );
      } finally {
        setSavingSecurity(false);
      }
    };

  /* ========================================================
     CHANGE PASSWORD
  ======================================================== */

  const handleChangePassword =
    async () => {
      setError("");
      setMessage("");

      if (!currentPassword) {
        setError(
          "Please enter your current password."
        );
        return;
      }

      if (!newPassword) {
        setError(
          "Please enter a new password."
        );
        return;
      }

      if (newPassword.length < 8) {
        setError(
          "The new password must contain at least 8 characters."
        );
        return;
      }

      if (!confirmPassword) {
        setError(
          "Please confirm your new password."
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "New password and confirmation password do not match."
        );
        return;
      }

      try {
        setChangingPassword(true);

        const response =
          await fetch(
            PASSWORD_UPDATE_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  current_password:
                    currentPassword,

                  new_password:
                    newPassword,

                  confirm_password:
                    confirmPassword,
                }),
            }
          );

        if (!response.ok) {
          let backendMessage =
            `Failed to update password (${response.status}).`;

          try {
            const data =
              await response.json();

            backendMessage =
              data?.detail ||
              data?.message ||
              backendMessage;
          } catch {
            // Keep default message.
          }

          throw new Error(
            backendMessage
          );
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setMessage(
          "Password updated successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update password."
        );
      } finally {
        setChangingPassword(false);
      }
    };

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="text-4xl text-blue-600">
          ⟳
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Loading Security Settings
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          SmartChain Nexus is retrieving your
          security configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            System Configuration
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Security Settings
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your account security,
            password, authentication and
            session preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Security Centre
        </div>
      </div>

      {/* SUCCESS */}

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold">
            ✓
          </div>

          <div className="flex-1">
            <p className="font-bold">
              Success
            </p>

            <p className="mt-1 text-sm">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessage("")
            }
            className="text-xl"
          >
            ×
          </button>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
            !
          </div>

          <div className="flex-1">
            <p className="font-bold">
              Security Action Failed
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-xl"
          >
            ×
          </button>
        </div>
      )}

      {/* SECURITY OVERVIEW */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <OverviewCard
          icon="🔐"
          label="Two-Factor Authentication"
          value={
            twoFactor
              ? "Enabled"
              : "Disabled"
          }
          status={
            twoFactor
              ? "Protected"
              : "Action Required"
          }
          positive={twoFactor}
        />

        <OverviewCard
          icon="🛡️"
          label="Login Alerts"
          value={
            loginAlerts
              ? "Enabled"
              : "Disabled"
          }
          status={
            loginAlerts
              ? "Monitoring"
              : "Off"
          }
          positive={loginAlerts}
        />

        <OverviewCard
          icon="⏱️"
          label="Session Timeout"
          value={`${sessionTimeout} minutes`}
          status="Active"
          positive={true}
        />
      </div>

      {/* PASSWORD */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-6 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Password Security
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Update your account password
                and maintain secure access
                to SmartChain Nexus.
              </p>
            </div>

            <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl md:flex">
              🔑
            </div>
          </div>
        </div>

        <div className="px-6 py-7 md:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrentPassword}
              setVisible={setShowCurrentPassword}
              placeholder="Enter current password"
              autoComplete="current-password"
            />

            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNewPassword}
              setVisible={setShowNewPassword}
              placeholder="Enter new password"
              autoComplete="new-password"
            />

            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirmPassword}
              setVisible={setShowConfirmPassword}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="font-bold text-slate-700">
              Password Requirements
            </p>

            <div className="mt-3 flex flex-wrap gap-5 text-sm">
              <span
                className={
                  newPassword.length >= 8
                    ? "font-semibold text-emerald-600"
                    : "text-slate-500"
                }
              >
                {newPassword.length >= 8
                  ? "✓"
                  : "○"}{" "}
                At least 8 characters
              </span>

              <span
                className={
                  newPassword &&
                  newPassword ===
                    confirmPassword
                    ? "font-semibold text-emerald-600"
                    : "text-slate-500"
                }
              >
                {newPassword &&
                newPassword ===
                  confirmPassword
                  ? "✓"
                  : "○"}{" "}
                Passwords match
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={
                handleChangePassword
              }
              disabled={
                changingPassword
              }
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingPassword
                ? "Updating Password..."
                : "Update Password"}
            </button>
          </div>
        </div>
      </div>

      {/* AUTHENTICATION */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-6 md:px-8">
          <h3 className="text-xl font-bold text-slate-900">
            Authentication & Alerts
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Control how SmartChain Nexus
            protects your account and
            notifies you about security
            events.
          </p>
        </div>

        <div className="px-6 py-2 md:px-8">
          <SecurityToggle
            title="Two-Factor Authentication"
            description="Add an additional authentication layer to protect your account."
            enabled={twoFactor}
            onChange={setTwoFactor}
          />

          <SecurityToggle
            title="Login Alerts"
            description="Receive notifications when your account is accessed from a new session or device."
            enabled={loginAlerts}
            onChange={setLoginAlerts}
          />

          <SecurityToggle
            title="Critical Security Alerts"
            description="Receive important alerts relating to account security and suspicious activity."
            enabled={securityAlerts}
            onChange={setSecurityAlerts}
          />

          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 py-5 md:flex-row md:items-center">
            <div>
              <h4 className="font-semibold text-slate-800">
                Session Timeout
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Automatically expire inactive
                sessions after the selected
                period.
              </p>
            </div>

            <select
              value={sessionTimeout}
              onChange={(event) =>
                setSessionTimeout(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="15">
                15 Minutes
              </option>

              <option value="30">
                30 Minutes
              </option>

              <option value="60">
                1 Hour
              </option>

              <option value="120">
                2 Hours
              </option>

              <option value="240">
                4 Hours
              </option>
            </select>
          </div>

          <div className="flex justify-end py-6">
            <button
              type="button"
              onClick={
                handleSaveSecurity
              }
              disabled={
                savingSecurity
              }
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingSecurity
                ? "Saving Security Settings..."
                : "Save Security Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* INFORMATION */}

      <div className="flex gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
          ℹ
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            SmartChain Nexus Security
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Your security preferences are
            managed through the SmartChain
            Nexus backend. Password changes
            and security configuration
            updates are sent directly to the
            API rather than being stored only
            in the browser.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   OVERVIEW CARD
========================================================== */

function OverviewCard({
  icon,
  label,
  value,
  status,
  positive,
}: {
  icon: string;
  label: string;
  value: string;
  status: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-bold text-slate-900">
          {value}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          positive
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

/* ==========================================================
   PASSWORD FIELD
========================================================== */

function PasswordField({
  label,
  value,
  onChange,
  visible,
  setVisible,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        />

        <button
          type="button"
          onClick={() =>
            setVisible(!visible)
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"
        >
          {visible
            ? "Hide"
            : "Show"}
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   SECURITY TOGGLE
========================================================== */

function SecurityToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 border-b border-slate-100 py-5 md:flex-row md:items-center">
      <div>
        <h4 className="font-semibold text-slate-800">
          {title}
        </h4>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        aria-pressed={enabled}
        className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}