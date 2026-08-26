import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  inventoryAdjustmentService,
  type InventoryAdjustment,
  type InventoryAdjustmentCreate,
} from "../services/inventoryAdjustmentService";

import {
  inventoryService,
  type Inventory,
} from "../services/inventoryService";

const INITIAL_FORM: InventoryAdjustmentCreate = {
  inventory_item_id: 0,
  adjustment_type: "Stock Increase",
  quantity: 0,
  reason: "",
  adjusted_by: "",
};

const ADJUSTMENT_TYPES = [
  "Stock Increase",
  "Stock Decrease",
];

export default function InventoryAdjustments() {
  const [adjustments, setAdjustments] = useState<
    InventoryAdjustment[]
  >([]);

  const [inventory, setInventory] = useState<Inventory[]>([]);

  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const [formData, setFormData] =
    useState<InventoryAdjustmentCreate>({
      ...INITIAL_FORM,
    });

  useEffect(() => {
    void loadAdjustments();
  }, []);

  async function loadAdjustments() {
    try {
      setLoading(true);

      const data =
        await inventoryAdjustmentService.getAdjustments();

      setAdjustments(data);
    } catch (error) {
      console.error(
        "Failed to load inventory adjustments:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadInventory() {
    try {
      setInventoryLoading(true);

      const data = await inventoryService.getInventory();

      setInventory(data);
    } catch (error) {
      console.error(
        "Failed to load inventory items:",
        error
      );
    } finally {
      setInventoryLoading(false);
    }
  }

  async function openCreateForm() {
    setEditingId(null);

    setFormData({
      ...INITIAL_FORM,
    });

    setShowForm(true);

    await loadInventory();
  }

  function openEditForm(
    adjustment: InventoryAdjustment
  ) {
    setEditingId(adjustment.id);

    setFormData({
      inventory_item_id:
        adjustment.inventory_item_id,
      adjustment_type:
        adjustment.adjustment_type,
      quantity: adjustment.quantity,
      reason: adjustment.reason ?? "",
      adjusted_by: adjustment.adjusted_by,
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setFormData({
      ...INITIAL_FORM,
    });
  }

  function handleChange(
    field: keyof InventoryAdjustmentCreate,
    value: string | number
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !formData.inventory_item_id ||
      formData.inventory_item_id <= 0
    ) {
      return;
    }

    if (
      !formData.quantity ||
      formData.quantity <= 0
    ) {
      return;
    }

    if (!formData.adjusted_by.trim()) {
      return;
    }

    try {
      setSaving(true);

      if (editingId !== null) {
        await inventoryAdjustmentService.updateAdjustment(
          editingId,
          {
            adjustment_type:
              formData.adjustment_type,
            quantity: formData.quantity,
            reason: formData.reason,
            adjusted_by: formData.adjusted_by,
          }
        );
      } else {
        await inventoryAdjustmentService.createAdjustment(
          formData
        );
      }

      await loadAdjustments();

      setShowForm(false);
      setEditingId(null);

      setFormData({
        ...INITIAL_FORM,
      });
    } catch (error) {
      console.error(
        "Failed to save inventory adjustment:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory adjustment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await inventoryAdjustmentService.deleteAdjustment(
        id
      );

      await loadAdjustments();
    } catch (error) {
      console.error(
        "Failed to delete inventory adjustment:",
        error
      );
    }
  }

  const adjustmentTypes = useMemo(() => {
    return Array.from(
      new Set(
        adjustments
          .map(
            (adjustment) =>
              adjustment.adjustment_type
          )
          .filter(Boolean)
      )
    );
  }, [adjustments]);

  const filteredAdjustments = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    const result = adjustments.filter(
      (adjustment) => {
        const matchesSearch =
          !search ||
          String(
            adjustment.inventory_item_id
          )
            .toLowerCase()
            .includes(search) ||
          (adjustment.item_name ?? "")
            .toLowerCase()
            .includes(search) ||
          (adjustment.sku ?? "")
            .toLowerCase()
            .includes(search) ||
          (adjustment.category ?? "")
            .toLowerCase()
            .includes(search) ||
          (adjustment.warehouse ?? "")
            .toLowerCase()
            .includes(search) ||
          adjustment.adjustment_type
            .toLowerCase()
            .includes(search) ||
          (adjustment.reason ?? "")
            .toLowerCase()
            .includes(search) ||
          adjustment.adjusted_by
            .toLowerCase()
            .includes(search);

        const matchesType =
          typeFilter === "All Types" ||
          adjustment.adjustment_type ===
            typeFilter;

        return (
          matchesSearch &&
          matchesType
        );
      }
    );

    return result.sort((a, b) =>
      sortOrder === "Oldest First"
        ? a.id - b.id
        : b.id - a.id
    );
  }, [
    adjustments,
    searchTerm,
    typeFilter,
    sortOrder,
  ]);

  const selectedInventoryItem = useMemo(() => {
    if (!formData.inventory_item_id) {
      return null;
    }

    return (
      inventory.find(
        (item) =>
          item.id ===
          formData.inventory_item_id
      ) ?? null
    );
  }, [
    inventory,
    formData.inventory_item_id,
  ]);

  const projectedQuantity = useMemo(() => {
    if (!selectedInventoryItem) {
      return null;
    }

    const currentQuantity =
      Number(
        selectedInventoryItem.quantity ?? 0
      );

    const adjustmentQuantity =
      Number(
        formData.quantity ?? 0
      );

    if (
      !adjustmentQuantity ||
      adjustmentQuantity <= 0
    ) {
      return currentQuantity;
    }

    if (
      isDecreaseType(
        formData.adjustment_type
      )
    ) {
      return (
        currentQuantity -
        adjustmentQuantity
      );
    }

    return (
      currentQuantity +
      adjustmentQuantity
    );
  }, [
    selectedInventoryItem,
    formData.quantity,
    formData.adjustment_type,
  ]);

  const totalAdjustments =
    adjustments.length;

  const increaseAdjustments =
    adjustments.filter((adjustment) =>
      isIncreaseType(
        adjustment.adjustment_type
      )
    ).length;

  const decreaseAdjustments =
    adjustments.filter((adjustment) =>
      isDecreaseType(
        adjustment.adjustment_type
      )
    ).length;

  const totalUnits = adjustments.reduce(
    (total, adjustment) =>
      total +
      Math.abs(
        Number(
          adjustment.quantity || 0
        )
      ),
    0
  );

  return (
    <div style={page}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={headerRow}>
        <div>
          <h1 style={pageTitle}>
            Inventory Adjustments
          </h1>

          <p style={pageSubtitle}>
            Adjust the actual stock quantity of an inventory item.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void openCreateForm();
          }}
          style={addButton}
        >
          <span style={plusIcon}>+</span>
          Add Inventory Adjustment
        </button>
      </div>

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div style={statsGrid}>
        <StatCard
          title="Total Adjustments"
          value={totalAdjustments}
          subtitle="All recorded stock adjustments"
          icon="adjustment"
          iconBackground="#EFF6FF"
          iconColor="#2563EB"
        />

        <StatCard
          title="Stock Increase"
          value={increaseAdjustments}
          subtitle="Stock added to inventory"
          icon="up"
          iconBackground="#ECFDF5"
          iconColor="#16A34A"
        />

        <StatCard
          title="Stock Decrease"
          value={decreaseAdjustments}
          subtitle="Stock removed from inventory"
          icon="down"
          iconBackground="#FEF2F2"
          iconColor="#DC2626"
        />

        <StatCard
          title="Units Adjusted"
          value={formatNumber(totalUnits)}
          subtitle="Total quantity adjusted"
          icon="boxes"
          iconBackground="#F5F3FF"
          iconColor="#7C3AED"
        />
      </div>

      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <div style={filterRow}>
        <div style={searchBox}>
          <SearchIcon />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search item, SKU, category, warehouse, type..."
            aria-label="Search inventory adjustments"
            style={searchInput}
          />
        </div>

        <div style={selectWrapper}>
          <FilterIcon />

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
            aria-label="Filter by adjustment type"
            style={selectInput}
          >
            <option value="All Types">
              All Types
            </option>

            {adjustmentTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div style={selectWrapper}>
          <SortIcon />

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value
              )
            }
            aria-label="Sort adjustments"
            style={selectInput}
          >
            <option value="Newest First">
              Newest First
            </option>

            <option value="Oldest First">
              Oldest First
            </option>
          </select>
        </div>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div style={tableCard}>
        <div style={tableHeaderRow}>
          <div style={tableTitleWrapper}>
            <div style={tableTitleIcon}>
              <AdjustmentIcon color="#2563EB" />
            </div>

            <div>
              <h2 style={tableTitle}>
                Inventory Stock Adjustments
              </h2>

              <span style={tableSubtitle}>
                Actual inventory items and their stock movements
              </span>
            </div>
          </div>

          <span style={resultCount}>
            {filteredAdjustments.length}{" "}
            adjustment
            {filteredAdjustments.length !==
            1
              ? "s"
              : ""}
          </span>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div style={tableScroll}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={headerCell}>
                    Inventory Item
                  </th>

                  <th style={headerCell}>
                    SKU
                  </th>

                  <th style={headerCell}>
                    Category
                  </th>

                  <th style={headerCell}>
                    Warehouse
                  </th>

                  <th style={headerCell}>
                    Adjustment Type
                  </th>

                  <th style={headerCell}>
                    Adjustment Qty
                  </th>

                  <th style={headerCell}>
                    Actual Stock
                  </th>

                  <th style={headerCell}>
                    Reason
                  </th>

                  <th style={headerCell}>
                    Adjusted By
                  </th>

                  <th style={headerCell}>
                    Date
                  </th>

                  <th
                    style={{
                      ...headerCell,
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAdjustments.length ===
                0 ? (
                  <EmptyState />
                ) : (
                  filteredAdjustments.map(
                    (adjustment) => (
                      <tr
                        key={
                          adjustment.id
                        }
                      >
                        <td style={bodyCell}>
                          <div style={itemCell}>
                            <div
                              style={itemAvatar}
                            >
                              #
                            </div>

                            <div>
                              <strong
                                style={itemName}
                              >
                                {adjustment.item_name ||
                                  `Inventory Item #${adjustment.inventory_item_id}`}
                              </strong>

                              <span
                                style={itemId}
                              >
                                Inventory Item ID:{" "}
                                {
                                  adjustment.inventory_item_id
                                }
                              </span>
                            </div>
                          </div>
                        </td>

                        <td style={bodyCell}>
                          <span
                            style={skuText}
                          >
                            {adjustment.sku ||
                              "—"}
                          </span>
                        </td>

                        <td style={bodyCell}>
                          <span
                            style={
                              categoryBadge
                            }
                          >
                            {adjustment.category ||
                              "—"}
                          </span>
                        </td>

                        <td style={bodyCell}>
                          <span
                            style={
                              warehouseText
                            }
                          >
                            {adjustment.warehouse ||
                              "—"}
                          </span>
                        </td>

                        <td style={bodyCell}>
                          <AdjustmentBadge
                            type={
                              adjustment.adjustment_type
                            }
                          />
                        </td>

                        <td style={bodyCell}>
                          <strong
                            style={{
                              color:
                                getQuantityColor(
                                  adjustment.adjustment_type
                                ),
                              fontSize:
                                "15px",
                            }}
                          >
                            {getQuantityPrefix(
                              adjustment.adjustment_type
                            )}

                            {formatNumber(
                              Math.abs(
                                Number(
                                  adjustment.quantity ||
                                    0
                                )
                              )
                            )}
                          </strong>
                        </td>

                        <td style={bodyCell}>
                          <div
                            style={
                              movementCell
                            }
                          >
                            <span
                              style={
                                previousQuantity
                              }
                            >
                              {formatStockQuantity(
                                adjustment.previous_quantity
                              )}
                            </span>

                            <span
                              style={
                                movementArrow
                              }
                            >
                              →
                            </span>

                            <strong
                              style={
                                currentQuantity
                              }
                            >
                              {formatStockQuantity(
                                adjustment.new_quantity
                              )}
                            </strong>
                          </div>

                          <span
                            style={
                              movementLabel
                            }
                          >
                            previous stock → new stock
                          </span>
                        </td>

                        <td style={bodyCell}>
                          <span
                            style={
                              reasonText
                            }
                            title={
                              adjustment.reason ??
                              "No reason provided"
                            }
                          >
                            {adjustment.reason ||
                              "No reason provided"}
                          </span>
                        </td>

                        <td style={bodyCell}>
                          <div
                            style={
                              userCell
                            }
                          >
                            <div
                              style={
                                userAvatar
                              }
                            >
                              {getInitials(
                                adjustment.adjusted_by
                              )}
                            </div>

                            <span>
                              {
                                adjustment.adjusted_by
                              }
                            </span>
                          </div>
                        </td>

                        <td style={bodyCell}>
                          <span
                            style={dateText}
                          >
                            {formatDate(
                              adjustment.created_at
                            )}
                          </span>
                        </td>

                        <td
                          style={{
                            ...bodyCell,
                            textAlign:
                              "center",
                          }}
                        >
                          <div
                            style={
                              actionButtons
                            }
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  adjustment
                                )
                              }
                              style={
                                iconButton
                              }
                              title="Edit inventory adjustment"
                              aria-label="Edit inventory adjustment"
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleDelete(
                                  adjustment.id
                                )
                              }
                              style={{
                                ...iconButton,
                                ...deleteIconButton,
                              }}
                              title="Delete inventory adjustment"
                              aria-label="Delete inventory adjustment"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading &&
          filteredAdjustments.length > 0 && (
            <div style={tableFooter}>
              <span>
                Showing{" "}
                <strong>
                  {
                    filteredAdjustments.length
                  }
                </strong>{" "}
                of{" "}
                <strong>
                  {adjustments.length}
                </strong>{" "}
                adjustments
              </span>
            </div>
          )}
      </div>

      {/* ======================================================
          ADD / EDIT INVENTORY ADJUSTMENT MODAL
      ====================================================== */}

      {showForm && (
        <div
          style={modalOverlay}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >
          <div style={modal}>
            <div style={modalHeader}>
              <div>
                <h2 style={modalTitle}>
                  {editingId !== null
                    ? "Edit Inventory Adjustment"
                    : "Add Inventory Adjustment"}
                </h2>

                <p
                  style={
                    modalSubtitle
                  }
                >
                  {editingId !== null
                    ? "Update the stock adjustment for the selected inventory item."
                    : "Adjust the actual stock quantity of an inventory item."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                style={modalClose}
                disabled={saving}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div style={modalBody}>
                <div style={formGrid}>
                  {/* ==================================================
                      INVENTORY ITEM
                  ================================================== */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <FormField
                      label="Inventory Item"
                      required
                    >
                      <select
                        value={
                          formData.inventory_item_id ||
                          ""
                        }
                        onChange={(event) =>
                          handleChange(
                            "inventory_item_id",
                            Number(
                              event.target.value
                            )
                          )
                        }
                        disabled={
                          editingId !== null ||
                          saving ||
                          inventoryLoading
                        }
                        required
                        style={formInput}
                      >
                        <option value="">
                          {inventoryLoading
                            ? "Loading inventory items..."
                            : inventory.length ===
                              0
                            ? "No inventory items available"
                            : "Select inventory item"}
                        </option>

                        {inventory.map(
                          (item) => (
                            <option
                              key={
                                item.id
                              }
                              value={
                                item.id
                              }
                            >
                              {item.item_name}{" "}
                              —{" "}
                              {item.sku}{" "}
                              —{" "}
                              {item.warehouse}{" "}
                              — Stock:{" "}
                              {formatStockQuantity(
                                item.quantity
                              )}
                            </option>
                          )
                        )}
                      </select>

                      <span
                        style={
                          formHelpText
                        }
                      >
                        Select the actual inventory item. The complete inventory list returned by the inventory service is available here.
                      </span>
                    </FormField>
                  </div>

                  {/* ==================================================
                      SELECTED INVENTORY PREVIEW
                  ================================================== */}

                  {selectedInventoryItem && (
                    <div
                      style={{
                        gridColumn:
                          "1 / -1",
                      }}
                    >
                      <div
                        style={
                          selectedInventoryCard
                        }
                      >
                        <div
                          style={
                            selectedInventoryHeader
                          }
                        >
                          <div
                            style={
                              selectedInventoryIcon
                            }
                          >
                            <BoxesIcon color="#2563EB" />
                          </div>

                          <div>
                            <strong
                              style={
                                selectedInventoryTitle
                              }
                            >
                              {
                                selectedInventoryItem.item_name
                              }
                            </strong>

                            <span
                              style={
                                selectedInventorySubtitle
                              }
                            >
                              Inventory Item ID:{" "}
                              {
                                selectedInventoryItem.id
                              }
                            </span>
                          </div>
                        </div>

                        <div
                          style={
                            selectedInventoryGrid
                          }
                        >
                          <InventoryPreviewField
                            label="SKU"
                            value={
                              selectedInventoryItem.sku ||
                              "—"
                            }
                          />

                          <InventoryPreviewField
                            label="Category"
                            value={
                              selectedInventoryItem.category ||
                              "—"
                            }
                          />

                          <InventoryPreviewField
                            label="Warehouse"
                            value={
                              selectedInventoryItem.warehouse ||
                              "—"
                            }
                          />

                          <InventoryPreviewField
                            label="Current Stock"
                            value={formatStockQuantity(
                              selectedInventoryItem.quantity
                            )}
                          />

                          <InventoryPreviewField
                            label="Minimum Stock"
                            value={formatStockQuantity(
                              selectedInventoryItem.minimum_stock
                            )}
                          />

                          <InventoryPreviewField
                            label="Maximum Stock"
                            value={formatStockQuantity(
                              selectedInventoryItem.maximum_stock
                            )}
                          />
                        </div>

                        {formData.quantity > 0 && (
                          <div
                            style={
                              projectedStockBox
                            }
                          >
                            <div>
                              <span
                                style={
                                  projectedStockLabel
                                }
                              >
                                Stock movement
                              </span>

                              <strong
                                style={
                                  projectedStockValue
                                }
                              >
                                {formatStockQuantity(
                                  selectedInventoryItem.quantity
                                )}{" "}
                                <span
                                  style={
                                    projectedArrow
                                  }
                                >
                                  →
                                </span>{" "}
                                <span
                                  style={{
                                    color:
                                      isDecreaseType(
                                        formData.adjustment_type
                                      )
                                        ? "#DC2626"
                                        : "#16A34A",
                                  }}
                                >
                                  {formatStockQuantity(
                                    projectedQuantity
                                  )}
                                </span>
                              </strong>
                            </div>

                            <span
                              style={
                                projectedStockHint
                              }
                            >
                              Projected stock after this adjustment
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ==================================================
                      ADJUSTMENT TYPE
                  ================================================== */}

                  <FormField
                    label="Adjustment Type"
                    required
                  >
                    <select
                      value={
                        formData.adjustment_type
                      }
                      onChange={(event) =>
                        handleChange(
                          "adjustment_type",
                          event.target.value
                        )
                      }
                      disabled={saving}
                      required
                      style={formInput}
                    >
                      {ADJUSTMENT_TYPES.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                    </select>

                    <span
                      style={
                        formHelpText
                      }
                    >
                      Choose whether stock is being added or removed.
                    </span>
                  </FormField>

                  {/* ==================================================
                      QUANTITY
                  ================================================== */}

                  <FormField
                    label="Adjustment Quantity"
                    required
                  >
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={
                        formData.quantity ||
                        ""
                      }
                      onChange={(event) =>
                        handleChange(
                          "quantity",
                          Number(
                            event.target.value
                          )
                        )
                      }
                      disabled={saving}
                      placeholder="Enter quantity"
                      required
                      style={formInput}
                    />

                    <span
                      style={
                        formHelpText
                      }
                    >
                      Enter the number of units to add or remove.
                    </span>
                  </FormField>

                  {/* ==================================================
                      ADJUSTED BY
                  ================================================== */}

                  <FormField
                    label="Adjusted By"
                    required
                  >
                    <input
                      type="text"
                      value={
                        formData.adjusted_by
                      }
                      onChange={(event) =>
                        handleChange(
                          "adjusted_by",
                          event.target.value
                        )
                      }
                      placeholder="Name"
                      disabled={saving}
                      required
                      style={formInput}
                    />
                  </FormField>

                  {/* ==================================================
                      REASON
                  ================================================== */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <FormField label="Reason">
                      <textarea
                        value={
                          formData.reason ??
                          ""
                        }
                        onChange={(event) =>
                          handleChange(
                            "reason",
                            event.target.value
                          )
                        }
                        placeholder="Explain why the actual stock quantity is being adjusted"
                        rows={4}
                        disabled={saving}
                        style={
                          formTextarea
                        }
                      />
                    </FormField>
                  </div>
                </div>

                {/* ==================================================
                    STOCK ADJUSTMENT EXPLANATION
                ================================================== */}

                <div
                  style={
                    adjustmentInfoBox
                  }
                >
                  <div
                    style={
                      adjustmentInfoIcon
                    }
                  >
                    <AdjustmentIcon
                      color="#2563EB"
                    />
                  </div>

                  <div>
                    <strong
                      style={
                        adjustmentInfoTitle
                      }
                    >
                      Actual stock adjustment
                    </strong>

                    <p
                      style={
                        adjustmentInfoText
                      }
                    >
                      This adjustment is applied to the selected inventory item.
                      The backend should record the stock before the adjustment
                      and the new stock quantity after the adjustment.
                    </p>
                  </div>
                </div>
              </div>

              <div style={modalFooter}>
                <button
                  type="button"
                  onClick={closeForm}
                  style={
                    modalCancelButton
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={
                    modalSaveButton
                  }
                  disabled={
                    saving ||
                    inventoryLoading ||
                    !formData.inventory_item_id ||
                    !formData.quantity ||
                    formData.quantity <= 0
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Adjustment"
                    : "Save Inventory Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   STAT CARD
========================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBackground,
  iconColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
}) {
  return (
    <div style={statCard}>
      <div
        style={{
          ...statIcon,
          background:
            iconBackground,
          color: iconColor,
        }}
      >
        {icon === "up" && (
          <ArrowUpIcon
            color={iconColor}
          />
        )}

        {icon === "down" && (
          <ArrowDownIcon
            color={iconColor}
          />
        )}

        {icon === "boxes" && (
          <BoxesIcon
            color={iconColor}
          />
        )}

        {icon === "adjustment" && (
          <AdjustmentIcon
            color={iconColor}
          />
        )}
      </div>

      <div style={statContent}>
        <span style={statTitle}>
          {title}
        </span>

        <strong style={statValue}>
          {value}
        </strong>

        <span style={statSubtitle}>
          {subtitle}
        </span>
      </div>
    </div>
  );
}

/* ==========================================================
   FORM FIELD
========================================================== */

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label style={formLabel}>
        {label}

        {required && (
          <span style={requiredMark}>
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* ==========================================================
   INVENTORY PREVIEW FIELD
========================================================== */

function InventoryPreviewField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={
        inventoryPreviewField
      }
    >
      <span
        style={
          inventoryPreviewLabel
        }
      >
        {label}
      </span>

      <strong
        style={
          inventoryPreviewValue
        }
      >
        {value}
      </strong>
    </div>
  );
}

/* ==========================================================
   ADJUSTMENT BADGE
========================================================== */

function AdjustmentBadge({
  type,
}: {
  type: string;
}) {
  const increase =
    isIncreaseType(type);

  const decrease =
    isDecreaseType(type);

  let background = "#F1F5F9";
  let color = "#475569";
  let border = "#E2E8F0";

  if (increase) {
    background = "#ECFDF5";
    color = "#15803D";
    border = "#BBF7D0";
  } else if (decrease) {
    background = "#FEF2F2";
    color = "#DC2626";
    border = "#FECACA";
  }

  return (
    <span
      style={{
        ...badge,
        background,
        color,
        borderColor: border,
      }}
    >
      <span
        style={{
          ...badgeDot,
          background: color,
        }}
      />

      {type}
    </span>
  );
}

/* ==========================================================
   LOADING STATE
========================================================== */

function LoadingState() {
  return (
    <div style={loadingContainer}>
      <div style={spinner} />

      <p style={loadingText}>
        Loading inventory adjustments...
      </p>
    </div>
  );
}

/* ==========================================================
   EMPTY STATE
========================================================== */

function EmptyState() {
  return (
    <tr>
      <td
        colSpan={11}
        style={emptyCell}
      >
        <div style={emptyState}>
          <div style={emptyIcon}>
            <AdjustmentIcon
              color="#94A3B8"
            />
          </div>

          <strong>
            No inventory adjustments found
          </strong>

          <span>
            Add an inventory adjustment to record an actual stock change.
          </span>
        </div>
      </td>
    </tr>
  );
}

/* ==========================================================
   HELPERS
========================================================== */

function isIncreaseType(
  type: string
) {
  const value =
    type
      .trim()
      .toLowerCase();

  return (
    value ===
      "stock increase" ||
    value === "increase" ||
    value === "stock in" ||
    value === "add" ||
    value === "addition" ||
    value === "receiving"
  );
}

function isDecreaseType(
  type: string
) {
  const value =
    type
      .trim()
      .toLowerCase();

  return (
    value ===
      "stock decrease" ||
    value === "decrease" ||
    value === "stock out" ||
    value === "remove" ||
    value === "removal" ||
    value === "write off" ||
    value === "write-off" ||
    value === "damage" ||
    value === "loss"
  );
}

function getQuantityColor(
  type: string
) {
  if (isIncreaseType(type)) {
    return "#16A34A";
  }

  if (isDecreaseType(type)) {
    return "#DC2626";
  }

  return "#334155";
}

function getQuantityPrefix(
  type: string
) {
  if (isIncreaseType(type)) {
    return "+";
  }

  if (isDecreaseType(type)) {
    return "-";
  }

  return "";
}

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-ZA",
    {
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function formatStockQuantity(
  value?: number | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return formatNumber(
    Number(value)
  );
}

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function getInitials(
  name: string
) {
  if (!name?.trim()) {
    return "?";
  }

  const parts =
    name
      .trim()
      .split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

/* ==========================================================
   ICONS
========================================================== */

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M8 6v12" />
      <path d="m5 9 3-3 3 3" />
      <path d="M16 18V6" />
      <path d="m13 15 3 3 3-3" />
    </svg>
  );
}

function AdjustmentIcon({
  color = "#2563EB",
}: {
  color?: string;
}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M5 8h14" />
      <path d="M5 16h14" />

      <circle
        cx="8"
        cy="8"
        r="2"
      />

      <circle
        cx="16"
        cy="16"
        r="2"
      />
    </svg>
  );
}

function ArrowUpIcon({
  color = "#16A34A",
}: {
  color?: string;
}) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

function ArrowDownIcon({
  color = "#DC2626",
}: {
  color?: string;
}) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m18 13-6 6-6-6" />
    </svg>
  );
}

function BoxesIcon({
  color = "#7C3AED",
}: {
  color?: string;
}) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5" />
      <path d="M12 12v9" />
      <path d="m8 5.2 8 4.6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#DC2626"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

/* ==========================================================
   PAGE STYLES
========================================================== */

const page: CSSProperties = {
  padding:
    "32px 36px 40px",
  background: "#F8FAFC",
  minHeight: "100%",
  boxSizing: "border-box",
};

const headerRow: CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: "24px",
  marginBottom: "28px",
};

const pageTitle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "34px",
  lineHeight: 1.15,
  fontWeight: 750,
  letterSpacing:
    "-0.8px",
};

const pageSubtitle: CSSProperties = {
  margin: "8px 0 0",
  color: "#64748B",
  fontSize: "15px",
};

const addButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  background:
    "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "10px",
  padding:
    "13px 20px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow:
    "0 7px 16px rgba(37, 99, 235, 0.22)",
};

const plusIcon: CSSProperties = {
  fontSize: "22px",
  lineHeight: 1,
  fontWeight: 400,
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "18px",
  marginBottom: "26px",
};

const statCard: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  background: "#FFFFFF",
  border:
    "1px solid #E8EEF6",
  borderRadius: "14px",
  padding: "20px",
  minHeight: "118px",
  boxSizing: "border-box",
  boxShadow:
    "0 6px 18px rgba(15, 23, 42, 0.055)",
};

const statIcon: CSSProperties = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const statContent: CSSProperties = {
  display: "flex",
  flexDirection:
    "column",
  minWidth: 0,
};

const statTitle: CSSProperties = {
  color: "#2563EB",
  fontSize: "14px",
  fontWeight: 650,
  marginBottom: "5px",
};

const statValue: CSSProperties = {
  color: "#0F172A",
  fontSize: "27px",
  lineHeight: 1.1,
  fontWeight: 750,
};

const statSubtitle: CSSProperties = {
  color: "#94A3B8",
  fontSize: "12px",
  marginTop: "8px",
};

const filterRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(280px, 1fr) 210px 210px",
  gap: "14px",
  marginBottom: "20px",
};

const searchBox: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  height: "52px",
  background: "#FFFFFF",
  border:
    "1px solid #E2E8F0",
  borderRadius: "11px",
  padding: "0 16px",
  boxSizing: "border-box",
  color: "#64748B",
};

const searchInput: CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "14px",
  color: "#334155",
  background:
    "transparent",
};

const selectWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  height: "52px",
  background: "#FFFFFF",
  border:
    "1px solid #E2E8F0",
  borderRadius: "11px",
  padding: "0 13px",
  boxSizing: "border-box",
  color: "#64748B",
};

const selectInput: CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  background:
    "transparent",
  color: "#334155",
  fontSize: "14px",
  cursor: "pointer",
};

const tableCard: CSSProperties = {
  background: "#FFFFFF",
  border:
    "1px solid #E8EEF6",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow:
    "0 7px 20px rgba(15, 23, 42, 0.055)",
};

const tableHeaderRow: CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  padding:
    "20px 22px",
  borderBottom:
    "1px solid #EEF2F7",
};

const tableTitleWrapper: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const tableTitleIcon: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const tableTitle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "17px",
  fontWeight: 700,
};

const tableSubtitle: CSSProperties = {
  display: "block",
  marginTop: "3px",
  color: "#94A3B8",
  fontSize: "11px",
};

const resultCount: CSSProperties = {
  color: "#64748B",
  fontSize: "13px",
};

const tableScroll: CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const table: CSSProperties = {
  width: "100%",
  borderCollapse:
    "collapse",
  minWidth:
    "1450px",
};

const headerCell: CSSProperties = {
  padding:
    "16px 16px",
  background: "#F8FAFC",
  color: "#475569",
  fontSize: "11px",
  fontWeight: 700,
  textAlign: "left",
  whiteSpace: "nowrap",
  textTransform:
    "uppercase",
  letterSpacing:
    "0.35px",
};

const bodyCell: CSSProperties = {
  padding:
    "17px 16px",
  color: "#334155",
  fontSize: "13px",
  borderBottom:
    "1px solid #EEF2F7",
  verticalAlign:
    "middle",
};

const itemCell: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  minWidth: "210px",
};

const itemAvatar: CSSProperties = {
  width: "39px",
  height: "39px",
  borderRadius: "50%",
  background: "#EFF6FF",
  color: "#2563EB",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  fontSize: "13px",
  fontWeight: 750,
};

const itemName: CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "14px",
  marginBottom: "3px",
  whiteSpace:
    "nowrap",
};

const itemId: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "11px",
};

const skuText: CSSProperties = {
  color: "#334155",
  fontWeight: 650,
  whiteSpace:
    "nowrap",
};

const categoryBadge: CSSProperties = {
  display:
    "inline-flex",
  alignItems: "center",
  padding:
    "5px 9px",
  borderRadius: "7px",
  background: "#F1F5F9",
  color: "#475569",
  fontSize: "11px",
  fontWeight: 650,
  whiteSpace:
    "nowrap",
};

const warehouseText: CSSProperties = {
  color: "#475569",
  whiteSpace:
    "nowrap",
};

const reasonText: CSSProperties = {
  color: "#64748B",
  maxWidth: "220px",
  display: "block",
  overflow: "hidden",
  textOverflow:
    "ellipsis",
  whiteSpace:
    "nowrap",
};

const badge: CSSProperties = {
  display:
    "inline-flex",
  alignItems:
    "center",
  gap: "7px",
  border: "1px solid",
  borderRadius: "20px",
  padding:
    "6px 10px",
  fontSize: "11px",
  fontWeight: 650,
  whiteSpace:
    "nowrap",
};

const badgeDot: CSSProperties = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
};

const movementCell: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  whiteSpace:
    "nowrap",
};

const previousQuantity: CSSProperties = {
  color: "#64748B",
  fontWeight: 600,
};

const movementArrow: CSSProperties = {
  color: "#94A3B8",
  fontSize: "16px",
};

const currentQuantity: CSSProperties = {
  color: "#0F172A",
  fontWeight: 750,
};

const movementLabel: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "10px",
  marginTop: "4px",
};

const userCell: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  whiteSpace:
    "nowrap",
};

const userAvatar: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#EDE9FE",
  color: "#7C3AED",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  fontSize: "10px",
  fontWeight: 750,
};

const dateText: CSSProperties = {
  color: "#64748B",
  whiteSpace:
    "nowrap",
  fontSize: "12px",
};

const actionButtons: CSSProperties = {
  display: "flex",
  justifyContent:
    "center",
  alignItems: "center",
  gap: "7px",
};

const iconButton: CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "9px",
  border:
    "1px solid #DBEAFE",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  cursor: "pointer",
};

const deleteIconButton: CSSProperties = {
  background: "#FEF2F2",
  borderColor:
    "#FECACA",
};

const emptyCell: CSSProperties = {
  padding: 0,
};

const emptyState: CSSProperties = {
  minHeight: "240px",
  display: "flex",
  flexDirection:
    "column",
  alignItems: "center",
  justifyContent:
    "center",
  gap: "8px",
  color: "#64748B",
};

const emptyIcon: CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  background: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  marginBottom: "5px",
};

const tableFooter: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent:
    "space-between",
  padding:
    "16px 20px",
  color: "#64748B",
  fontSize: "13px",
};

const loadingContainer: CSSProperties = {
  minHeight: "280px",
  display: "flex",
  flexDirection:
    "column",
  alignItems: "center",
  justifyContent:
    "center",
  gap: "14px",
};

const spinner: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border:
    "3px solid #DBEAFE",
  borderTopColor:
    "#2563EB",
};

const loadingText: CSSProperties = {
  color: "#64748B",
  fontSize: "14px",
  margin: 0,
};

/* ==========================================================
   SELECTED INVENTORY STYLES
========================================================== */

const selectedInventoryCard: CSSProperties = {
  background: "#F8FAFC",
  border:
    "1px solid #E2E8F0",
  borderRadius: "12px",
  padding: "16px",
};

const selectedInventoryHeader: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "11px",
  marginBottom: "15px",
};

const selectedInventoryIcon: CSSProperties = {
  width: "40px",
  height: "40px",
  minWidth: "40px",
  borderRadius: "10px",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const selectedInventoryTitle: CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "14px",
  fontWeight: 750,
};

const selectedInventorySubtitle: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "11px",
  marginTop: "3px",
};

const selectedInventoryGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "10px",
};

const inventoryPreviewField: CSSProperties = {
  background: "#FFFFFF",
  border:
    "1px solid #E2E8F0",
  borderRadius: "9px",
  padding: "10px 11px",
};

const inventoryPreviewLabel: CSSProperties = {
  display: "block",
  color: "#94A3B8",
  fontSize: "10px",
  textTransform:
    "uppercase",
  letterSpacing:
    "0.3px",
  fontWeight: 700,
  marginBottom: "4px",
};

const inventoryPreviewValue: CSSProperties = {
  display: "block",
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700,
  whiteSpace:
    "nowrap",
  overflow: "hidden",
  textOverflow:
    "ellipsis",
};

const projectedStockBox: CSSProperties = {
  marginTop: "12px",
  padding: "12px 14px",
  background: "#FFFFFF",
  border:
    "1px solid #DBEAFE",
  borderRadius: "9px",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "space-between",
  gap: "15px",
};

const projectedStockLabel: CSSProperties = {
  display: "block",
  color: "#64748B",
  fontSize: "10px",
  fontWeight: 700,
  textTransform:
    "uppercase",
  letterSpacing:
    "0.3px",
  marginBottom: "3px",
};

const projectedStockValue: CSSProperties = {
  display: "block",
  color: "#0F172A",
  fontSize: "16px",
  fontWeight: 750,
};

const projectedArrow: CSSProperties = {
  color: "#94A3B8",
  margin:
    "0 5px",
};

const projectedStockHint: CSSProperties = {
  color: "#94A3B8",
  fontSize: "11px",
  textAlign: "right",
};

/* ==========================================================
   MODAL STYLES
========================================================== */

const modalOverlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(15, 23, 42, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  padding: "24px",
  zIndex: 1000,
};

const modal: CSSProperties = {
  width:
    "min(760px, 100%)",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFFFFF",
  borderRadius: "16px",
  boxShadow:
    "0 25px 70px rgba(15, 23, 42, 0.25)",
};

const modalHeader: CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems:
    "flex-start",
  gap: "20px",
  padding: "24px",
  borderBottom:
    "1px solid #EEF2F7",
};

const modalTitle: CSSProperties = {
  margin: 0,
  color: "#0F172A",
  fontSize: "21px",
  fontWeight: 750,
};

const modalSubtitle: CSSProperties = {
  margin: "6px 0 0",
  color: "#64748B",
  fontSize: "13px",
};

const modalClose: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  border:
    "1px solid #E2E8F0",
  background: "#FFFFFF",
  color: "#64748B",
  fontSize: "23px",
  lineHeight: 1,
  cursor: "pointer",
};

const modalBody: CSSProperties = {
  padding: "24px",
};

const formGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "19px",
};

const formLabel: CSSProperties = {
  display: "block",
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "7px",
};

const requiredMark: CSSProperties = {
  color: "#DC2626",
  marginLeft: "3px",
};

const formInput: CSSProperties = {
  width: "100%",
  height: "44px",
  boxSizing:
    "border-box",
  border:
    "1px solid #CBD5E1",
  borderRadius: "9px",
  padding: "0 12px",
  outline: "none",
  color: "#334155",
  fontSize: "14px",
  background:
    "#FFFFFF",
};

const formTextarea: CSSProperties = {
  width: "100%",
  boxSizing:
    "border-box",
  border:
    "1px solid #CBD5E1",
  borderRadius: "9px",
  padding:
    "11px 12px",
  outline: "none",
  color: "#334155",
  fontSize: "14px",
  resize: "vertical",
};

const formHelpText: CSSProperties = {
  display: "block",
  marginTop: "6px",
  color: "#94A3B8",
  fontSize: "11px",
  lineHeight: 1.4,
};

const adjustmentInfoBox: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginTop: "22px",
  padding: "14px",
  background: "#EFF6FF",
  border:
    "1px solid #DBEAFE",
  borderRadius: "10px",
};

const adjustmentInfoIcon: CSSProperties = {
  width: "36px",
  height: "36px",
  minWidth: "36px",
  borderRadius: "9px",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const adjustmentInfoTitle: CSSProperties = {
  display: "block",
  color: "#1E40AF",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "3px",
};

const adjustmentInfoText: CSSProperties = {
  margin: 0,
  color: "#475569",
  fontSize: "12px",
  lineHeight: 1.5,
};

const modalFooter: CSSProperties = {
  display: "flex",
  justifyContent:
    "flex-end",
  gap: "10px",
  padding:
    "18px 24px",
  borderTop:
    "1px solid #EEF2F7",
};

const modalCancelButton: CSSProperties = {
  height: "42px",
  padding:
    "0 18px",
  borderRadius: "9px",
  border:
    "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#475569",
  fontWeight: 650,
  cursor: "pointer",
};

const modalSaveButton: CSSProperties = {
  height: "42px",
  padding:
    "0 19px",
  borderRadius: "9px",
  border: "none",
  background: "#2563EB",
  color: "#FFFFFF",
  fontWeight: 700,
  cursor: "pointer",
};