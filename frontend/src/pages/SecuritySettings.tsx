import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartchain-nexus-3.onrender.com";

export default function SecuritySettings() {
  // ==========================================================
  // API CONFIGURATION
  // ==========================================================

  const SECURITY_SETTINGS_URL = `${API_URL}/settings/security`;
  const PASSWORD_UPDATE_URL = `${API_URL}/auth/change-password`;

  // ==========================================================
  // SECURITY SETTINGS STATE
  // ==========================================================

  const [securityId, setSecurityId] = useState<number | null>(null);

  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // ==========================================================
  // PASSWORD STATE
  // ==========================================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [loading, setLoading] = useState(true);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD SECURITY SETTINGS
  // ==========================================================

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

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
          let errorMessage =
            "Failed to load security settings.";

          try {
            const errorData = await response.json();

            errorMessage =
              errorData.detail ||
              errorData.message ||
              errorMessage;
          } catch {
            // Keep default error message
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        const security =
          Array.isArray(data) ? data[0] : data;

        if (security) {
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
            Boolean(
              security.login_alerts ??
                true
            )
          );

          setSecurityAlerts(
            Boolean(
              security.security_alerts ??
                true
            )
          );

          setSessionTimeout(
            String(
              security.session_timeout_minutes ??
                security.session_timeout ??
                "30"
            )
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unable to load security settings.";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSecuritySettings();
  }, []);

  // ==========================================================
  // SAVE SECURITY SETTINGS
  // ==========================================================

  const handleSaveSecurity = async () => {
    try {
      setSavingSecurity(true);
      setError("");
      setMessage("");

      const payload = {
        two_factor_enabled: twoFactor,
        login_alerts: loginAlerts,
        security_alerts: securityAlerts,
        session_timeout_minutes:
          Number(sessionTimeout),
      };

      let response: Response;

      if (securityId) {
        response = await fetch(
          `${SECURITY_SETTINGS_URL}/${securityId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(
          SECURITY_SETTINGS_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              user_id: 1,
              ...payload,
            }),
          }
        );
      }

      if (!response.ok) {
        let errorMessage =
          "Failed to save security settings.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData.detail ||
            errorData.message ||
            errorMessage;
        } catch {
          // Keep default error
        }

        throw new Error(errorMessage);
      }

      const savedSecurity =
        await response.json();

      setSecurityId(
        savedSecurity.id ??
          securityId
      );

      setMessage(
        "Security settings saved successfully."
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to save security settings.";

      setError(errorMessage);
    } finally {
      setSavingSecurity(false);
    }
  };

  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  const handleChangePassword = async () => {
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

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const payload = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      const response = await fetch(
        PASSWORD_UPDATE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to update password.";

        try {
          const errorData =
            await response.json();

          errorMessage =
            errorData.detail ||
            errorData.message ||
            errorMessage;
        } catch {
          // Keep default error
        }

        throw new Error(errorMessage);
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Password updated successfully."
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to update password.";

      setError(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1 style={pageTitleStyle}>
          Security Settings
        </h1>

        <div style={mainCardStyle}>
          <div style={loadingStyle}>
            <div style={spinnerStyle}>
              ⟳
            </div>

            <h3>
              Loading security settings...
            </h3>

            <p style={mutedTextStyle}>
              Please wait while SmartChain Nexus
              retrieves your security configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <div style={eyebrowStyle}>
            SYSTEM CONFIGURATION
          </div>

          <h1 style={pageTitleStyle}>
            Security Settings
          </h1>

          <p style={pageSubtitleStyle}>
            Manage your account security, password,
            authentication and session preferences.
          </p>
        </div>

        <div style={securityBadgeStyle}>
          <span style={statusDotStyle}></span>
          Security Centre
        </div>
      </div>

      {message && (
        <div style={successMessageStyle}>
          <div style={messageIconStyle}>
            ✓
          </div>

          <div>
            <strong>Success</strong>

            <div style={{ marginTop: "3px" }}>
              {message}
            </div>
          </div>

          <button
            onClick={() => setMessage("")}
            style={messageCloseButtonStyle}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div style={errorMessageStyle}>
          <div style={errorIconStyle}>
            !
          </div>

          <div>
            <strong>
              Security Action Failed
            </strong>

            <div style={{ marginTop: "3px" }}>
              {error}
            </div>
          </div>

          <button
            onClick={() => setError("")}
            style={messageCloseButtonStyle}
          >
            ×
          </button>
        </div>
      )}

      <div style={overviewGridStyle}>
        <div style={overviewCardStyle}>
          <div style={overviewIconStyle}>
            🔐
          </div>

          <div>
            <div style={overviewLabelStyle}>
              Two-Factor Authentication
            </div>

            <div style={overviewValueStyle}>
              {twoFactor
                ? "Enabled"
                : "Disabled"}
            </div>
          </div>

          <div
            style={{
              ...overviewStatusStyle,
              background: twoFactor
                ? "#DCFCE7"
                : "#FEE2E2",
              color: twoFactor
                ? "#166534"
                : "#991B1B",
            }}
          >
            {twoFactor
              ? "Protected"
              : "Action Required"}
          </div>
        </div>

        <div style={overviewCardStyle}>
          <div style={overviewIconStyle}>
            🛡️
          </div>

          <div>
            <div style={overviewLabelStyle}>
              Login Alerts
            </div>

            <div style={overviewValueStyle}>
              {loginAlerts
                ? "Enabled"
                : "Disabled"}
            </div>
          </div>

          <div
            style={{
              ...overviewStatusStyle,
              background: loginAlerts
                ? "#DCFCE7"
                : "#F1F5F9",
              color: loginAlerts
                ? "#166534"
                : "#475569",
            }}
          >
            {loginAlerts
              ? "Monitoring"
              : "Off"}
          </div>
        </div>

        <div style={overviewCardStyle}>
          <div style={overviewIconStyle}>
            ⏱️
          </div>

          <div>
            <div style={overviewLabelStyle}>
              Session Timeout
            </div>

            <div style={overviewValueStyle}>
              {sessionTimeout} minutes
            </div>
          </div>

          <div style={overviewStatusStyle}>
            Active
          </div>
        </div>
      </div>

      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>
              Password Security
            </h2>

            <p style={sectionDescriptionStyle}>
              Update your account password and
              maintain secure access to SmartChain
              Nexus.
            </p>
          </div>

          <div style={sectionIconStyle}>
            🔑
          </div>
        </div>

        <div style={formGridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Current Password
            </label>

            <div style={passwordWrapperStyle}>
              <input
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                placeholder="Enter current password"
                autoComplete="current-password"
                style={passwordInputStyle}
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
                style={passwordToggleStyle}
              >
                {showCurrentPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              New Password
            </label>

            <div style={passwordWrapperStyle}>
              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="Enter new password"
                autoComplete="new-password"
                style={passwordInputStyle}
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
                style={passwordToggleStyle}
              >
                {showNewPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            <small style={helpTextStyle}>
              Minimum 8 characters recommended.
            </small>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Confirm New Password
            </label>

            <div style={passwordWrapperStyle}>
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
                style={passwordInputStyle}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                style={passwordToggleStyle}
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {confirmPassword &&
              newPassword ===
                confirmPassword && (
                <small
                  style={{
                    ...helpTextStyle,
                    color: "#16A34A",
                  }}
                >
                  ✓ Passwords match
                </small>
              )}
          </div>
        </div>

        <div style={passwordRequirementsStyle}>
          <strong>
            Password Security
          </strong>

          <div style={requirementsGridStyle}>
            <span>
              {newPassword.length >= 8
                ? "✓"
                : "○"}{" "}
              At least 8 characters
            </span>

            <span>
              {newPassword &&
              newPassword ===
                confirmPassword
                ? "✓"
                : "○"}{" "}
              Passwords match
            </span>
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={changingPassword}
          style={{
            ...primaryButtonStyle,
            opacity: changingPassword
              ? 0.65
              : 1,
            cursor: changingPassword
              ? "not-allowed"
              : "pointer",
          }}
        >
          {changingPassword
            ? "Updating Password..."
            : "Update Password"}
        </button>
      </div>

      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>
              Authentication & Alerts
            </h2>

            <p style={sectionDescriptionStyle}>
              Control how SmartChain Nexus
              protects your account and notifies
              you about security events.
            </p>
          </div>

          <div style={sectionIconStyle}>
            🛡️
          </div>
        </div>

        <div style={settingRowStyle}>
          <div style={settingInformationStyle}>
            <div style={settingTitleStyle}>
              Enable Two-Factor Authentication
            </div>

            <div style={settingDescriptionStyle}>
              Add an additional authentication
              layer to protect your SmartChain
              Nexus account.
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setTwoFactor(!twoFactor)
            }
            style={{
              ...toggleStyle,
              background: twoFactor
                ? "#2563EB"
                : "#CBD5E1",
            }}
            aria-pressed={twoFactor}
          >
            <span
              style={{
                ...toggleCircleStyle,
                transform: twoFactor
                  ? "translateX(22px)"
                  : "translateX(0)",
              }}
            />
          </button>
        </div>

        <div style={settingRowStyle}>
          <div style={settingInformationStyle}>
            <div style={settingTitleStyle}>
              Login Alerts
            </div>

            <div style={settingDescriptionStyle}>
              Receive notifications when your
              account is accessed from a new
              session or device.
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setLoginAlerts(!loginAlerts)
            }
            style={{
              ...toggleStyle,
              background: loginAlerts
                ? "#2563EB"
                : "#CBD5E1",
            }}
            aria-pressed={loginAlerts}
          >
            <span
              style={{
                ...toggleCircleStyle,
                transform: loginAlerts
                  ? "translateX(22px)"
                  : "translateX(0)",
              }}
            />
          </button>
        </div>

        <div style={settingRowStyle}>
          <div style={settingInformationStyle}>
            <div style={settingTitleStyle}>
              Critical Security Alerts
            </div>

            <div style={settingDescriptionStyle}>
              Receive important alerts relating
              to account security and suspicious
              activity.
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSecurityAlerts(
                !securityAlerts
              )
            }
            style={{
              ...toggleStyle,
              background: securityAlerts
                ? "#2563EB"
                : "#CBD5E1",
            }}
            aria-pressed={securityAlerts}
          >
            <span
              style={{
                ...toggleCircleStyle,
                transform: securityAlerts
                  ? "translateX(22px)"
                  : "translateX(0)",
              }}
            />
          </button>
        </div>

        <div style={settingRowStyle}>
          <div style={settingInformationStyle}>
            <div style={settingTitleStyle}>
              Session Timeout
            </div>

            <div style={settingDescriptionStyle}>
              Automatically expire inactive
              sessions after the selected period.
            </div>
          </div>

          <select
            value={sessionTimeout}
            onChange={(e) =>
              setSessionTimeout(
                e.target.value
              )
            }
            style={selectStyle}
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

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
          }}
        >
          <button
            onClick={handleSaveSecurity}
            disabled={savingSecurity}
            style={{
              ...primaryButtonStyle,
              opacity: savingSecurity
                ? 0.65
                : 1,
              cursor: savingSecurity
                ? "not-allowed"
                : "pointer",
            }}
          >
            {savingSecurity
              ? "Saving Security Settings..."
              : "Save Security Settings"}
          </button>
        </div>
      </div>

      <div style={securityInfoCardStyle}>
        <div style={securityInfoIconStyle}>
          ℹ
        </div>

        <div>
          <h3
            style={{
              margin: "0 0 8px 0",
              color: "#0F172A",
            }}
          >
            SmartChain Nexus Security
          </h3>

          <p
            style={{
              margin: 0,
              color: "#475569",
              lineHeight: "1.7",
            }}
          >
            Your security preferences are
            managed through the SmartChain Nexus
            backend. Password changes and security
            configuration updates are sent directly
            to the API rather than being stored
            only in the browser.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// PAGE STYLES
// ==========================================================

const pageStyle = {
  padding: "30px",
  minHeight: "100%",
  background: "#F8FAFC",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  marginBottom: "30px",
};

const eyebrowStyle = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#2563EB",
  letterSpacing: "1.5px",
  marginBottom: "8px",
};

const pageTitleStyle = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#0F172A",
  margin: 0,
};

const pageSubtitleStyle = {
  marginTop: "10px",
  color: "#64748B",
  fontSize: "15px",
  lineHeight: "1.6",
};

const securityBadgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#EFF6FF",
  color: "#1D4ED8",
  padding: "10px 15px",
  borderRadius: "20px",
  fontWeight: "700",
  fontSize: "13px",
  whiteSpace: "nowrap" as const,
};

const statusDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#16A34A",
};

const mainCardStyle = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "30px",
  boxShadow:
    "0 8px 20px rgba(15,23,42,.06)",
  maxWidth: "1000px",
};

const loadingStyle = {
  textAlign: "center" as const,
  padding: "50px 20px",
};

const spinnerStyle = {
  fontSize: "35px",
  color: "#2563EB",
  marginBottom: "10px",
};

const mutedTextStyle = {
  color: "#64748B",
  margin: 0,
};

const successMessageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#F0FDF4",
  color: "#166534",
  border: "1px solid #BBF7D0",
  padding: "14px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
};

const errorMessageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#FEF2F2",
  color: "#991B1B",
  border: "1px solid #FECACA",
  padding: "14px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
};

const messageIconStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#DCFCE7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const errorIconStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#FEE2E2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const messageCloseButtonStyle = {
  marginLeft: "auto",
  border: "none",
  background: "transparent",
  fontSize: "22px",
  color: "inherit",
  cursor: "pointer",
};

const overviewGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const overviewCardStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow:
    "0 6px 18px rgba(15,23,42,.06)",
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const overviewIconStyle = {
  width: "45px",
  height: "45px",
  borderRadius: "10px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
};

const overviewLabelStyle = {
  fontSize: "12px",
  color: "#64748B",
  marginBottom: "4px",
};

const overviewValueStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#0F172A",
};

const overviewStatusStyle = {
  marginLeft: "auto",
  padding: "6px 9px",
  borderRadius: "20px",
  background: "#F1F5F9",
  color: "#475569",
  fontSize: "11px",
  fontWeight: "700",
};

const sectionCardStyle = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "30px",
  marginBottom: "25px",
  boxShadow:
    "0 8px 20px rgba(15,23,42,.06)",
  maxWidth: "1000px",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "30px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "700",
  color: "#0F172A",
};

const sectionDescriptionStyle = {
  marginTop: "7px",
  color: "#64748B",
  lineHeight: "1.6",
  fontSize: "14px",
};

const sectionIconStyle = {
  width: "45px",
  height: "45px",
  borderRadius: "10px",
  background: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: "22px",
};

const formGroupStyle = {
  marginBottom: "5px",
};

const labelStyle = {
  display: "block",
  marginBottom: "9px",
  fontWeight: "700",
  color: "#334155",
  fontSize: "14px",
};

const passwordWrapperStyle = {
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
};

const passwordInputStyle = {
  width: "100%",
  padding: "12px 70px 12px 12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box" as const,
};

const passwordToggleStyle = {
  position: "absolute" as const,
  right: "8px",
  border: "none",
  background: "transparent",
  color: "#2563EB",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "12px",
};

const helpTextStyle = {
  display: "block",
  marginTop: "7px",
  color: "#64748B",
  fontSize: "12px",
};

const passwordRequirementsStyle = {
  marginTop: "25px",
  padding: "15px",
  background: "#F8FAFC",
  borderRadius: "10px",
  color: "#334155",
};

const requirementsGridStyle = {
  display: "flex",
  gap: "25px",
  flexWrap: "wrap" as const,
  marginTop: "10px",
  color: "#64748B",
  fontSize: "13px",
};

const primaryButtonStyle = {
  background: "#2563EB",
  color: "#ffffff",
  border: "none",
  padding: "12px 25px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow:
    "0 4px 10px rgba(37,99,235,.18)",
};

const settingRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "25px",
  padding: "20px 0",
  borderBottom: "1px solid #E2E8F0",
};

const settingInformationStyle = {
  flex: 1,
};

const settingTitleStyle = {
  fontWeight: "700",
  color: "#0F172A",
  marginBottom: "5px",
};

const settingDescriptionStyle = {
  color: "#64748B",
  fontSize: "13px",
  lineHeight: "1.6",
};

const toggleStyle = {
  width: "48px",
  height: "27px",
  border: "none",
  borderRadius: "20px",
  padding: "2px",
  cursor: "pointer",
  transition: "background .2s ease",
  flexShrink: 0,
};

const toggleCircleStyle = {
  display: "block",
  width: "23px",
  height: "23px",
  borderRadius: "50%",
  background: "#ffffff",
  transition: "transform .2s ease",
  boxShadow:
    "0 2px 5px rgba(0,0,0,.2)",
};

const selectStyle = {
  minWidth: "150px",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  background: "#ffffff",
  color: "#334155",
  cursor: "pointer",
};

const securityInfoCardStyle = {
  maxWidth: "1000px",
  display: "flex",
  gap: "15px",
  alignItems: "flex-start",
  background: "#EFF6FF",
  border: "1px solid #BFDBFE",
  borderRadius: "12px",
  padding: "20px",
};

const securityInfoIconStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "#DBEAFE",
  color: "#1D4ED8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  flexShrink: 0,
};