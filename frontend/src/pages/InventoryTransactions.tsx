import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

type InventoryTransaction = {
  id: number;
  transaction_id: string;
  inventory_item_id: number;
  transaction_type: string;
  quantity: number;
  reference: string | null;
  notes: string | null;
  transaction_date: string;
  created_at: string | null;
};

type TransactionForm = {
  transaction_id: string;
  inventory_item_id: string;
  transaction_type: string;
  quantity: string;
  reference: string;
  notes: string;
  transaction_date: string;
};

const API_URL =
  "http://127.0.0.1:8000/inventory/transactions";

const getCurrentDateTime = (): string => {
  const now = new Date();

  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
};

const createEmptyForm = (): TransactionForm => ({
  transaction_id: "",
  inventory_item_id: "",
  transaction_type: "Stock In",
  quantity: "",
  reference: "",
  notes: "",
  transaction_date: getCurrentDateTime(),
});

export default function InventoryTransactions() {
  const [transactions, setTransactions] = useState<
    InventoryTransaction[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] =
    useState<string>("");

  const [form, setForm] = useState<TransactionForm>(
    createEmptyForm()
  );

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  /*
   * ============================================================
   * LOAD TRANSACTIONS
   * ============================================================
   */

  const loadTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const responseText = await response.text();

      console.log(
        "Inventory transactions status:",
        response.status
      );

      console.log(
        "Inventory transactions response:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load transactions: ${response.status} - ${responseText}`
        );
      }

      const data: InventoryTransaction[] =
        responseText.trim()
          ? JSON.parse(responseText)
          : [];

      setTransactions(data);
    } catch (err: unknown) {
      console.error(
        "Inventory transactions error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to load inventory transactions."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTransactions();
  }, []);

  /*
   * ============================================================
   * FORM INPUT
   * ============================================================
   */

  const handleInputChange = (
    field: keyof TransactionForm,
    value: string
  ): void => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccessMessage("");
  };

  /*
   * ============================================================
   * RESET FORM
   * ============================================================
   */

  const resetForm = (): void => {
    setForm(createEmptyForm());
    setEditingId(null);
    setError("");
    setSuccessMessage("");
  };

  /*
   * ============================================================
   * SUBMIT TRANSACTION
   * ============================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setSuccessMessage("");

    /*
     * Validate before sending anything to the API.
     */

    if (!form.transaction_id.trim()) {
      setError("Please enter a Transaction ID.");
      return;
    }

    if (!form.inventory_item_id.trim()) {
      setError("Please enter an Inventory Item ID.");
      return;
    }

    if (!form.quantity.trim()) {
      setError("Please enter a quantity.");
      return;
    }

    const inventoryItemId = Number(
      form.inventory_item_id
    );

    const quantity = Number(form.quantity);

    if (
      !Number.isInteger(inventoryItemId) ||
      inventoryItemId <= 0
    ) {
      setError(
        "Inventory Item ID must be a valid positive number."
      );
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setError(
        "Quantity must be greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      const isEditing = editingId !== null;

      /*
       * This is the exact JSON payload sent to FastAPI.
       */

      const payload = {
        transaction_id:
          form.transaction_id.trim(),

        inventory_item_id:
          inventoryItemId,

        transaction_type:
          form.transaction_type,

        quantity,

        reference:
          form.reference.trim() || null,

        notes:
          form.notes.trim() || null,

        transaction_date:
          new Date(
            form.transaction_date
          ).toISOString(),
      };

      console.log(
        "Submitting transaction payload:",
        payload
      );

      const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const responseText =
        await response.text();

      console.log(
        "Transaction save status:",
        response.status
      );

      console.log(
        "Transaction save response:",
        responseText
      );

      if (!response.ok) {
        let message =
          responseText ||
          "The server rejected the transaction.";

        try {
          const errorData: unknown =
            JSON.parse(responseText);

          if (
            typeof errorData === "object" &&
            errorData !== null &&
            "detail" in errorData
          ) {
            const detail = (
              errorData as {
                detail?: unknown;
              }
            ).detail;

            if (typeof detail === "string") {
              message = detail;
            } else if (detail !== undefined) {
              message =
                JSON.stringify(detail);
            }
          }
        } catch {
          // Keep original response text.
        }

        throw new Error(
          `Failed to ${
            isEditing ? "update" : "create"
          } transaction: ${response.status} - ${message}`
        );
      }

      /*
       * IMPORTANT:
       * Only clear the form AFTER the backend confirms success.
       */

      resetForm();

      setSuccessMessage(
        isEditing
          ? "Transaction updated successfully."
          : "Transaction added successfully."
      );

      await loadTransactions();
    } catch (err: unknown) {
      console.error(
        "Transaction save error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to save inventory transaction."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * EDIT
   * ============================================================
   */

  const handleEdit = (
    transaction: InventoryTransaction
  ): void => {
    setEditingId(transaction.id);

    setForm({
      transaction_id:
        transaction.transaction_id,

      inventory_item_id:
        String(
          transaction.inventory_item_id
        ),

      transaction_type:
        transaction.transaction_type,

      quantity:
        String(transaction.quantity),

      reference:
        transaction.reference ?? "",

      notes:
        transaction.notes ?? "",

      transaction_date:
        transaction.transaction_date
          ? new Date(
              transaction.transaction_date
            )
              .toISOString()
              .slice(0, 16)
          : getCurrentDateTime(),
    });

    setError("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  const handleDelete = async (
    transactionId: number
  ): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(transactionId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Transaction delete status:",
        response.status
      );

      console.log(
        "Transaction delete response:",
        responseText
      );

      if (!response.ok) {
        let message =
          responseText ||
          "Unable to delete transaction.";

        try {
          const errorData: unknown =
            JSON.parse(responseText);

          if (
            typeof errorData === "object" &&
            errorData !== null &&
            "detail" in errorData
          ) {
            const detail = (
              errorData as {
                detail?: unknown;
              }
            ).detail;

            if (typeof detail === "string") {
              message = detail;
            } else if (detail !== undefined) {
              message =
                JSON.stringify(detail);
            }
          }
        } catch {
          // Keep original response.
        }

        throw new Error(
          `Failed to delete transaction: ${response.status} - ${message}`
        );
      }

      if (editingId === transactionId) {
        resetForm();
      }

      setSuccessMessage(
        "Transaction deleted successfully."
      );

      await loadTransactions();
    } catch (err: unknown) {
      console.error(
        "Transaction delete error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to delete inventory transaction."
        );
      }
    } finally {
      setDeleting(null);
    }
  };

  /*
   * ============================================================
   * FILTERING
   * ============================================================
   */

  const filteredTransactions =
    useMemo<InventoryTransaction[]>(() => {
      const term =
        searchTerm.trim().toLowerCase();

      if (!term) {
        return transactions;
      }

      return transactions.filter(
        (transaction) =>
          [
            transaction.transaction_id,
            transaction.inventory_item_id,
            transaction.transaction_type,
            transaction.quantity,
            transaction.reference,
            transaction.notes,
          ].some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(term)
          )
      );
    }, [transactions, searchTerm]);

  /*
   * ============================================================
   * STATISTICS
   * ============================================================
   */

  const totalTransactions =
    transactions.length;

  const stockInCount =
    transactions.filter((transaction) =>
      transaction.transaction_type
        .toLowerCase()
        .includes("stock in")
    ).length;

  const stockOutCount =
    transactions.filter((transaction) =>
      transaction.transaction_type
        .toLowerCase()
        .includes("stock out")
    ).length;

  const adjustmentCount =
    transactions.filter((transaction) =>
      transaction.transaction_type
        .toLowerCase()
        .includes("adjustment")
    ).length;

  const totalQuantity =
    transactions.reduce(
      (total, transaction) =>
        total +
        Number(transaction.quantity || 0),
      0
    );

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div style={page}>
      {/* HEADER */}

      <div style={pageHeader}>
        <div style={titleSection}>
          <div style={titleIcon}>
            ↕
          </div>

          <div>
            <h1 style={pageTitle}>
              Inventory Transactions
            </h1>

            <p style={pageSubtitle}>
              Track and manage inventory stock
              movements
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          style={addButton}
        >
          <span style={addButtonIcon}>
            +
          </span>

          Add Transaction
        </button>
      </div>

      {/* STATISTICS */}

      <div style={statsGrid}>
        <StatCard
          title="Total Transactions"
          value={totalTransactions}
          description="All recorded movements"
          icon="↕"
          iconBackground="#EFF6FF"
          iconColor="#2563EB"
          accent="#2563EB"
        />

        <StatCard
          title="Stock In"
          value={stockInCount}
          description="Incoming inventory"
          icon="↓"
          iconBackground="#ECFDF5"
          iconColor="#10B981"
          accent="#10B981"
        />

        <StatCard
          title="Stock Out"
          value={stockOutCount}
          description="Outgoing inventory"
          icon="↑"
          iconBackground="#FFF7ED"
          iconColor="#F59E0B"
          accent="#F59E0B"
        />

        <StatCard
          title="Adjustments"
          value={adjustmentCount}
          description={`${totalQuantity.toLocaleString()} total units moved`}
          icon="⚙"
          iconBackground="#F5F3FF"
          iconColor="#7C3AED"
          accent="#7C3AED"
        />
      </div>

      {/* SUCCESS */}

      {successMessage && (
        <div style={successCard}>
          <div style={successIcon}>
            ✓
          </div>

          <div>
            <strong style={successTitle}>
              Success
            </strong>

            <div style={successMessageStyle}>
              {successMessage}
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div style={errorCard}>
          <div style={errorIcon}>
            !
          </div>

          <div>
            <strong style={errorTitle}>
              Inventory transaction error
            </strong>

            <div style={errorMessage}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* FORM */}

      <div style={formCard}>
        <div style={formHeader}>
          <div>
            <h2 style={sectionTitle}>
              {editingId !== null
                ? "Edit Inventory Transaction"
                : "Add Inventory Transaction"}
            </h2>

            <p style={sectionSubtitle}>
              {editingId !== null
                ? "Update the selected inventory movement."
                : "Record a new stock movement in your inventory."}
            </p>
          </div>

          {editingId !== null && (
            <span style={editingBadge}>
              Editing Transaction
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGrid}>
            <FormField label="Transaction ID">
              <input
                type="text"
                value={form.transaction_id}
                onChange={(event) =>
                  handleInputChange(
                    "transaction_id",
                    event.target.value
                  )
                }
                placeholder="e.g. TXN-0001"
                required
                disabled={saving}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Inventory Item ID">
              <input
                type="number"
                min="1"
                value={form.inventory_item_id}
                onChange={(event) =>
                  handleInputChange(
                    "inventory_item_id",
                    event.target.value
                  )
                }
                placeholder="Inventory item ID"
                required
                disabled={saving}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Transaction Type">
              <select
                value={form.transaction_type}
                onChange={(event) =>
                  handleInputChange(
                    "transaction_type",
                    event.target.value
                  )
                }
                required
                disabled={saving}
                style={inputStyle}
              >
                <option value="Stock In">
                  Stock In
                </option>

                <option value="Stock Out">
                  Stock Out
                </option>

                <option value="Adjustment">
                  Adjustment
                </option>
              </select>
            </FormField>

            <FormField label="Quantity">
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(event) =>
                  handleInputChange(
                    "quantity",
                    event.target.value
                  )
                }
                placeholder="Quantity"
                required
                disabled={saving}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Reference">
              <input
                type="text"
                value={form.reference}
                onChange={(event) =>
                  handleInputChange(
                    "reference",
                    event.target.value
                  )
                }
                placeholder="PO, invoice, order..."
                disabled={saving}
                style={inputStyle}
              />
            </FormField>

            <FormField label="Transaction Date">
              <input
                type="datetime-local"
                value={form.transaction_date}
                onChange={(event) =>
                  handleInputChange(
                    "transaction_date",
                    event.target.value
                  )
                }
                required
                disabled={saving}
                style={inputStyle}
              />
            </FormField>

            <div style={notesField}>
              <label style={labelStyle}>
                Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  handleInputChange(
                    "notes",
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Add any additional notes..."
                disabled={saving}
                style={textareaStyle}
              />
            </div>
          </div>

          <div style={formActions}>
            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                style={cancelButton}
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                ...saveButton,
                opacity: saving ? 0.7 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Transaction"
                : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>

      {/* TABLE */}

      <div style={tableCard}>
        <div style={tableTop}>
          <div>
            <h2 style={sectionTitle}>
              Transaction History
            </h2>

            <p style={sectionSubtitle}>
              View and manage recorded inventory
              movements
            </p>
          </div>

          <div style={transactionCount}>
            Showing{" "}
            <strong>
              {filteredTransactions.length}
            </strong>{" "}
            of{" "}
            <strong>
              {transactions.length}
            </strong>
          </div>
        </div>

        <div style={searchContainer}>
          <span style={searchIcon}>
            ⌕
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search transactions by ID, item, type or reference..."
            style={searchInput}
          />
        </div>

        <div style={tableWrapper}>
          {loading ? (
            <div style={loadingState}>
              <div style={loadingSpinner} />

              <p>
                Loading inventory transactions...
              </p>
            </div>
          ) : (
            <table style={table}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={headerStyle}>
                    Transaction
                  </th>

                  <th style={headerStyle}>
                    Inventory Item
                  </th>

                  <th style={headerStyle}>
                    Type
                  </th>

                  <th style={headerStyle}>
                    Quantity
                  </th>

                  <th style={headerStyle}>
                    Reference
                  </th>

                  <th style={headerStyle}>
                    Date
                  </th>

                  <th style={headerStyle}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={emptyCell}
                    >
                      <div style={emptyIcon}>
                        ↕
                      </div>

                      <strong style={emptyTitle}>
                        No transactions found
                      </strong>

                      <p style={emptyText}>
                        {searchTerm
                          ? "Try adjusting your search."
                          : "No inventory transactions have been recorded yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(
                    (transaction) => (
                      <tr
                        key={transaction.id}
                        style={tableRow}
                      >
                        <td style={cellStyle}>
                          <div
                            style={transactionCell}
                          >
                            <div
                              style={
                                transactionIcon
                              }
                            >
                              ↕
                            </div>

                            <div>
                              <strong
                                style={
                                  transactionIdStyle
                                }
                              >
                                {
                                  transaction.transaction_id
                                }
                              </strong>

                              <span
                                style={
                                  secondaryText
                                }
                              >
                                #{transaction.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td style={cellStyle}>
                          <div>
                            <strong>
                              Item #
                              {
                                transaction.inventory_item_id
                              }
                            </strong>

                            <span
                              style={
                                secondaryText
                              }
                            >
                              Inventory Item
                            </span>
                          </div>
                        </td>

                        <td style={cellStyle}>
                          <TransactionBadge
                            type={
                              transaction.transaction_type
                            }
                          />
                        </td>

                        <td style={cellStyle}>
                          <strong
                            style={{
                              fontSize: "15px",
                            }}
                          >
                            {Number(
                              transaction.quantity
                            ).toLocaleString()}
                          </strong>

                          <span
                            style={
                              secondaryText
                            }
                          >
                            units
                          </span>
                        </td>

                        <td style={cellStyle}>
                          <span
                            style={{
                              color: "#475569",
                            }}
                          >
                            {transaction.reference ||
                              "—"}
                          </span>
                        </td>

                        <td style={cellStyle}>
                          <div>
                            <strong>
                              {transaction.transaction_date
                                ? new Date(
                                    transaction.transaction_date
                                  ).toLocaleDateString()
                                : "—"}
                            </strong>

                            <span
                              style={
                                secondaryText
                              }
                            >
                              {transaction.transaction_date
                                ? new Date(
                                    transaction.transaction_date
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute:
                                        "2-digit",
                                    }
                                  )
                                : ""}
                            </span>
                          </div>
                        </td>

                        <td
                          style={{
                            ...cellStyle,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          <div
                            style={actionGroup}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  transaction
                                )
                              }
                              disabled={
                                saving ||
                                deleting !== null
                              }
                              style={editButton}
                              title="Edit transaction"
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleDelete(
                                  transaction.id
                                )
                              }
                              disabled={
                                deleting ===
                                  transaction.id ||
                                saving
                              }
                              style={{
                                ...deleteButton,
                                opacity:
                                  deleting ===
                                  transaction.id
                                    ? 0.6
                                    : 1,
                              }}
                              title="Delete transaction"
                            >
                              {deleting ===
                              transaction.id
                                ? "..."
                                : "🗑"}
                            </button>

                            <button
                              type="button"
                              style={moreButton}
                              title="More actions"
                            >
                              ⋮
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * STAT CARD
 * ============================================================
 */

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
  accent: string;
};

function StatCard({
  title,
  value,
  description,
  icon,
  iconBackground,
  iconColor,
  accent,
}: StatCardProps) {
  return (
    <div style={statCard}>
      <div style={statTop}>
        <div
          style={{
            ...statIcon,
            background: iconBackground,
            color: iconColor,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            ...statAccent,
            background: accent,
          }}
        />
      </div>

      <p style={statTitle}>
        {title}
      </p>

      <h2 style={statValue}>
        {value.toLocaleString()}
      </h2>

      <p style={statDescription}>
        {description}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * FORM FIELD
 * ============================================================
 */

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      {children}
    </div>
  );
}

/*
 * ============================================================
 * TRANSACTION BADGE
 * ============================================================
 */

function TransactionBadge({
  type,
}: {
  type: string;
}) {
  const normalized =
    type.toLowerCase();

  let background = "#EFF6FF";
  let color = "#1D4ED8";
  let icon = "↕";

  if (normalized.includes("stock in")) {
    background = "#ECFDF5";
    color = "#047857";
    icon = "↓";
  } else if (
    normalized.includes("stock out")
  ) {
    background = "#FFF7ED";
    color = "#C2410C";
    icon = "↑";
  } else if (
    normalized.includes("adjustment")
  ) {
    background = "#F5F3FF";
    color = "#6D28D9";
    icon = "⚙";
  }

  return (
    <span
      style={{
        ...transactionBadge,
        background,
        color,
      }}
    >
      <span>{icon}</span>
      {type}
    </span>
  );
}

/*
 * ============================================================
 * PAGE
 * ============================================================
 */

const page: CSSProperties = {
  padding: "28px",
  background: "#F8FAFC",
  minHeight: "100vh",
  boxSizing: "border-box",
};

/*
 * ============================================================
 * HEADER
 * ============================================================
 */

const pageHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "28px",
};

const titleSection: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const titleIcon: CSSProperties = {
  width: "62px",
  height: "62px",
  borderRadius: "18px",
  background:
    "linear-gradient(135deg, #2563EB, #60A5FA)",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  fontWeight: "700",
  boxShadow:
    "0 10px 25px rgba(37, 99, 235, 0.25)",
};

const pageTitle: CSSProperties = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "750",
  color: "#0F172A",
  letterSpacing: "-0.7px",
};

const pageSubtitle: CSSProperties = {
  margin: "6px 0 0",
  color: "#64748B",
  fontSize: "14px",
};

const addButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "11px",
  padding: "13px 20px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
  boxShadow:
    "0 8px 18px rgba(37, 99, 235, 0.22)",
};

const addButtonIcon: CSSProperties = {
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  background:
    "rgba(255,255,255,.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
};

/*
 * ============================================================
 * STATS
 * ============================================================
 */

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "24px",
};

const statCard: CSSProperties = {
  position: "relative",
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid #E5EAF2",
  boxShadow:
    "0 8px 22px rgba(15, 23, 42, 0.055)",
  overflow: "hidden",
};

const statTop: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const statIcon: CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  fontWeight: "700",
};

const statAccent: CSSProperties = {
  width: "45px",
  height: "3px",
  borderRadius: "10px",
  opacity: 0.75,
};

const statTitle: CSSProperties = {
  margin: "18px 0 3px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#64748B",
};

const statValue: CSSProperties = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "750",
  color: "#0F172A",
};

const statDescription: CSSProperties = {
  margin: "8px 0 0",
  color: "#94A3B8",
  fontSize: "12px",
};

/*
 * ============================================================
 * SUCCESS
 * ============================================================
 */

const successCard: CSSProperties = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  background: "#ECFDF5",
  border: "1px solid #A7F3D0",
  color: "#065F46",
  padding: "16px 18px",
  borderRadius: "13px",
  marginBottom: "22px",
};

const successIcon: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#D1FAE5",
  color: "#059669",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
};

const successTitle: CSSProperties = {
  fontSize: "14px",
};

const successMessageStyle: CSSProperties = {
  marginTop: "5px",
  fontSize: "13px",
};

/*
 * ============================================================
 * ERROR
 * ============================================================
 */

const errorCard: CSSProperties = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  color: "#991B1B",
  padding: "16px 18px",
  borderRadius: "13px",
  marginBottom: "22px",
};

const errorIcon: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#FEE2E2",
  color: "#DC2626",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
};

const errorTitle: CSSProperties = {
  fontSize: "14px",
};

const errorMessage: CSSProperties = {
  marginTop: "5px",
  fontSize: "13px",
  whiteSpace: "pre-wrap",
};

/*
 * ============================================================
 * FORM
 * ============================================================
 */

const formCard: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "24px",
  border: "1px solid #E5EAF2",
  boxShadow:
    "0 8px 22px rgba(15, 23, 42, 0.055)",
};

const formHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  marginBottom: "22px",
};

const sectionTitle: CSSProperties = {
  margin: 0,
  fontSize: "19px",
  fontWeight: "750",
  color: "#0F172A",
};

const sectionSubtitle: CSSProperties = {
  margin: "5px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const editingBadge: CSSProperties = {
  background: "#EFF6FF",
  color: "#2563EB",
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const formGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "18px",
};

const notesField: CSSProperties = {
  gridColumn: "1 / -1",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: "650",
  color: "#334155",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 13px",
  border: "1px solid #D9E0EA",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#0F172A",
  background: "#FFFFFF",
  outline: "none",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "82px",
};

const formActions: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "22px",
};

const cancelButton: CSSProperties = {
  background: "#F1F5F9",
  color: "#334155",
  border: "1px solid #E2E8F0",
  padding: "11px 18px",
  borderRadius: "9px",
  fontWeight: "650",
  cursor: "pointer",
};

const saveButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#FFFFFF",
  border: "none",
  padding: "11px 20px",
  borderRadius: "9px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 7px 15px rgba(37, 99, 235, 0.18)",
};

/*
 * ============================================================
 * TABLE
 * ============================================================
 */

const tableCard: CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #E5EAF2",
  boxShadow:
    "0 8px 22px rgba(15, 23, 42, 0.055)",
  overflow: "hidden",
};

const tableTop: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "22px 24px 18px",
};

const transactionCount: CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  padding: "8px 12px",
  borderRadius: "999px",
};

const searchContainer: CSSProperties = {
  margin: "0 24px 18px",
  position: "relative",
};

const searchIcon: CSSProperties = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748B",
  fontSize: "22px",
};

const searchInput: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px 12px 42px",
  borderRadius: "10px",
  border: "1px solid #E2E8F0",
  background: "#F8FAFC",
  color: "#0F172A",
  outline: "none",
  fontSize: "14px",
};

const tableWrapper: CSSProperties = {
  overflowX: "auto",
};

const table: CSSProperties = {
  width: "100%",
  minWidth: "1050px",
  borderCollapse: "collapse",
};

const tableHeaderRow: CSSProperties = {
  background:
    "linear-gradient(90deg, #F8FAFC, #F1F5F9)",
};

const headerStyle: CSSProperties = {
  padding: "14px 18px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "750",
  color: "#475569",
  whiteSpace: "nowrap",
  borderBottom:
    "1px solid #E2E8F0",
};

const tableRow: CSSProperties = {
  borderBottom:
    "1px solid #EDF2F7",
};

const cellStyle: CSSProperties = {
  padding: "15px 18px",
  color: "#334155",
  fontSize: "13px",
  verticalAlign: "middle",
};

const transactionCell: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const transactionIcon: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "11px",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  fontWeight: "700",
};

const transactionIdStyle: CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "13px",
};

const secondaryText: CSSProperties = {
  display: "block",
  marginTop: "3px",
  color: "#94A3B8",
  fontSize: "11px",
};

const transactionBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "750",
  whiteSpace: "nowrap",
};

const actionGroup: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const editButton: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "9px",
  border: "1px solid #DBEAFE",
  background: "#EFF6FF",
  color: "#2563EB",
  cursor: "pointer",
  fontSize: "17px",
  fontWeight: "700",
};

const deleteButton: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "9px",
  border: "1px solid #FECACA",
  background: "#FEF2F2",
  color: "#DC2626",
  cursor: "pointer",
  fontSize: "15px",
};

const moreButton: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "9px",
  border: "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#475569",
  cursor: "pointer",
  fontSize: "20px",
};

const loadingState: CSSProperties = {
  padding: "65px 20px",
  textAlign: "center",
  color: "#64748B",
};

const loadingSpinner: CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "3px solid #DBEAFE",
  borderTop: "3px solid #2563EB",
  margin: "0 auto 15px",
};

const emptyCell: CSSProperties = {
  padding: "65px 20px",
  textAlign: "center",
};

const emptyIcon: CSSProperties = {
  width: "54px",
  height: "54px",
  margin: "0 auto 12px",
  borderRadius: "16px",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "25px",
};

const emptyTitle: CSSProperties = {
  display: "block",
  color: "#334155",
  fontSize: "15px",
};

const emptyText: CSSProperties = {
  margin: "6px 0 0",
  color: "#94A3B8",
  fontSize: "13px",
};