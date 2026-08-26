import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { theme } from "../../styles/theme";

import {
  supplierService,
  type Supplier,
} from "../../services/supplierService";

import {
  productService,
  type Product,
} from "../../services/productService";

import {
  purchaseOrderService,
  type PurchaseOrder,
} from "../../services/purchaseOrderService";

/* ==========================================================
   TYPES
========================================================== */

type SearchResultType =
  | "Supplier"
  | "Product"
  | "Purchase Order";

type SearchResult = {
  type: SearchResultType;
  title: string;
  subtitle: string;
  path: string;
};

/* ==========================================================
   ICON
========================================================== */

const Icon = ({
  type,
  size = 20,
}: {
  type: string;
  size?: number;
}) => {
  const icons: Record<string, string> = {
    search:
      "M11 4a7 7 0 1 0 4.9 12L20 20M16 16l4 4",

    bell:
      "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4",

    chevron:
      "m9 18 6-6-6-6",

    profile:
      "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",

    close:
      "M6 6l12 12M18 6 6 18",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d={icons[type] ?? icons.search}
      />
    </svg>
  );
};

/* ==========================================================
   HEADER
========================================================== */

export default function Header() {
  const [searchOpen, setSearchOpen] =
    useState<boolean>(false);

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [searchResults, setSearchResults] =
    useState<SearchResult[]>([]);

  const [searching, setSearching] =
    useState<boolean>(false);

  const [searchCompleted, setSearchCompleted] =
    useState<boolean>(false);

  /* ========================================================
     SEARCH
  ======================================================== */

  async function handleSearch(): Promise<void> {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setSearchResults([]);
      setSearchCompleted(false);
      return;
    }

    try {
      setSearching(true);
      setSearchCompleted(false);

      const results = await Promise.allSettled([
        supplierService.getSuppliers(),
        productService.getProducts(),
        purchaseOrderService.getPurchaseOrders(),
      ]);

      const suppliers: Supplier[] =
        results[0].status === "fulfilled"
          ? results[0].value
          : [];

      const products: Product[] =
        results[1].status === "fulfilled"
          ? results[1].value
          : [];

      const purchaseOrders: PurchaseOrder[] =
        results[2].status === "fulfilled"
          ? results[2].value
          : [];

      const searchResultsList: SearchResult[] = [];

      /* ======================================================
         SUPPLIERS
      ====================================================== */

      suppliers.forEach(
        (supplier: Supplier) => {
          const matches =
            supplier.company_name
              .toLowerCase()
              .includes(term) ||
            supplier.supplier_code
              .toLowerCase()
              .includes(term) ||
            supplier.contact_person
              .toLowerCase()
              .includes(term) ||
            supplier.email
              .toLowerCase()
              .includes(term) ||
            supplier.phone
              .toLowerCase()
              .includes(term) ||
            supplier.address
              .toLowerCase()
              .includes(term) ||
            supplier.city
              .toLowerCase()
              .includes(term) ||
            supplier.country
              .toLowerCase()
              .includes(term) ||
            (supplier.tax_number ?? "")
              .toLowerCase()
              .includes(term) ||
            (supplier.payment_terms ?? "")
              .toLowerCase()
              .includes(term);

          if (matches) {
            searchResultsList.push({
              type: "Supplier",
              title: supplier.company_name,
              subtitle: `Supplier Code: ${supplier.supplier_code}`,
              path: "/suppliers",
            });
          }
        }
      );

      /* ======================================================
         PRODUCTS
      ====================================================== */

      products.forEach(
        (product: Product) => {
          const matches =
            product.product_name
              .toLowerCase()
              .includes(term) ||
            product.sku
              .toLowerCase()
              .includes(term) ||
            product.category
              .toLowerCase()
              .includes(term) ||
            String(product.unit_price)
              .toLowerCase()
              .includes(term) ||
            String(product.quantity_in_stock)
              .toLowerCase()
              .includes(term);

          if (matches) {
            searchResultsList.push({
              type: "Product",
              title: product.product_name,
              subtitle: `SKU: ${product.sku} • Category: ${product.category}`,
              path: "/products",
            });
          }
        }
      );

      /* ======================================================
         PURCHASE ORDERS
      ====================================================== */

      purchaseOrders.forEach(
        (order: PurchaseOrder) => {
          const matches =
            order.po_number
              .toLowerCase()
              .includes(term) ||
            order.status
              .toLowerCase()
              .includes(term) ||
            order.currency
              .toLowerCase()
              .includes(term) ||
            String(order.supplier_id)
              .toLowerCase()
              .includes(term) ||
            order.order_date
              .toLowerCase()
              .includes(term) ||
            order.expected_delivery
              .toLowerCase()
              .includes(term) ||
            String(order.total_amount)
              .toLowerCase()
              .includes(term) ||
            (order.notes ?? "")
              .toLowerCase()
              .includes(term);

          if (matches) {
            searchResultsList.push({
              type: "Purchase Order",
              title: order.po_number,
              subtitle: `Status: ${order.status} • Supplier ID: ${order.supplier_id}`,
              path: "/purchase-orders",
            });
          }
        }
      );

      setSearchResults(searchResultsList);
      setSearchCompleted(true);

      console.log(
        `Search completed: ${searchResultsList.length} result(s)`
      );
    } catch (error: unknown) {
      console.error(
        "Search failed:",
        error
      );

      setSearchResults([]);
      setSearchCompleted(true);
    } finally {
      setSearching(false);
    }
  }

  /* ========================================================
     SEARCH KEYBOARD
  ======================================================== */

  function handleSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ): void {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleSearch();
    }
  }

  /* ========================================================
     RESULT CLICK
  ======================================================== */

  function handleResultClick(
    path: string
  ): void {
    setSearchOpen(false);
    setSearchResults([]);
    setSearchCompleted(false);
    setSearchTerm("");

    window.location.href = path;
  }

  /* ========================================================
     TOGGLE SEARCH
  ======================================================== */

  function toggleSearch(): void {
    setSearchOpen(
      (previous: boolean) => {
        const next = !previous;

        if (!next) {
          setSearchResults([]);
          setSearchCompleted(false);
          setSearchTerm("");
        }

        return next;
      }
    );
  }

  /* ========================================================
     SEARCH BUTTON
  ======================================================== */

  function handleSearchButtonClick(): void {
    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }

    void handleSearch();
  }

  /* ========================================================
     STYLES
  ======================================================== */

  const headerStyle: CSSProperties = {
    minHeight: "82px",

    /* CHANGED: Navy blue replaced with charcoal/slate */
    background:
      "linear-gradient(90deg, #1E293B 0%, #334155 50%, #1E293B 100%)",

    padding: "0 30px",
    borderBottom:
      "1px solid rgba(148, 163, 184, 0.12)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    boxShadow:
      "0 8px 24px rgba(15, 23, 42, 0.16)",
    position: "relative",
    zIndex: 100,
  };

  const brandTitleStyle: CSSProperties = {
    margin: 0,
    color: "#FFFFFF",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.45px",
    lineHeight: 1.1,
  };

  const brandSubtitleStyle: CSSProperties = {
    marginTop: "5px",
    color: "#94A3B8",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.35px",
  };

  const searchWrapperStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const searchInputStyle: CSSProperties = {
    width: "310px",
    height: "42px",
    padding: "0 14px",
    border:
      "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "9px",
    outline: "none",
    fontSize: "14px",
    color: "#0F172A",
    background: "#FFFFFF",
    boxSizing: "border-box",
  };

  const searchButtonStyle: CSSProperties = {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background:
      "rgba(37, 99, 235, 0.14)",
    border:
      "1px solid rgba(59, 130, 246, 0.20)",
    borderRadius: "9px",
    cursor: "pointer",
    color: "#DBEAFE",
    fontSize: "14px",
    fontWeight: 650,
    boxSizing: "border-box",
  };

  const notificationStyle: CSSProperties = {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#CBD5E1",
    background:
      "rgba(37, 99, 235, 0.10)",
    border:
      "1px solid rgba(148, 163, 184, 0.12)",
    borderRadius: "9px",
    cursor: "pointer",
    boxSizing: "border-box",
  };

  const userContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    paddingLeft: "6px",
  };

  const avatarStyle: CSSProperties = {
    position: "relative",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #2563EB, #7C3AED)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: "13px",
    flexShrink: 0,
    boxShadow:
      "0 5px 14px rgba(37, 99, 235, 0.30)",
  };

  const userNameStyle: CSSProperties = {
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: 750,
    whiteSpace: "nowrap",
  };

  const onlineStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "3px",
    color: "#10B981",
    fontSize: "10px",
    fontWeight: 600,
  };

  /* ========================================================
     RETURN
  ======================================================== */

  return (
    <header style={headerStyle}>
      {/* ====================================================
          BRAND
      ==================================================== */}

      <div>
        <h2 style={brandTitleStyle}>
          SmartChain{" "}
          <span
            style={{
              color: "#3B82F6",
            }}
          >
            Nexus
          </span>
        </h2>

        <div style={brandSubtitleStyle}>
          ENTERPRISE SUPPLY CHAIN MANAGEMENT PLATFORM
        </div>
      </div>

      {/* ====================================================
          RIGHT SIDE
      ==================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* ==================================================
            SEARCH
        ================================================== */}

        <div style={searchWrapperStyle}>
          {searchOpen && (
            <div
              style={{
                position: "relative",
              }}
            >
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(
                  event
                ) => {
                  const value =
                    event.target.value;

                  setSearchTerm(value);

                  if (!value.trim()) {
                    setSearchResults([]);
                    setSearchCompleted(false);
                  }
                }}
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Search suppliers, products, POs..."
                style={searchInputStyle}
              />

              {/* ==========================================
                  SEARCH RESULTS
              ========================================== */}

              {(searching ||
                searchCompleted) && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: 0,
                    width: "390px",
                    maxHeight: "420px",
                    overflowY: "auto",
                    background: "#FFFFFF",
                    border:
                      "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow:
                      "0 16px 40px rgba(15,23,42,.22)",
                    zIndex: 1000,
                  }}
                >
                  {searching ? (
                    <div
                      style={{
                        padding: "22px",
                        textAlign: "center",
                        color: "#64748B",
                        fontSize: "13px",
                      }}
                    >
                      Searching...
                    </div>
                  ) : searchResults.length ===
                    0 ? (
                    <div
                      style={{
                        padding: "22px",
                        textAlign: "center",
                        color: "#64748B",
                        fontSize: "13px",
                      }}
                    >
                      No results found.
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          padding:
                            "13px 16px",
                          borderBottom:
                            "1px solid #E2E8F0",
                          fontSize: "13px",
                          fontWeight: 750,
                          color: "#475569",
                        }}
                      >
                        {searchResults.length}{" "}
                        result
                        {searchResults.length !==
                        1
                          ? "s"
                          : ""}{" "}
                        found
                      </div>

                      {searchResults.map(
                        (
                          result: SearchResult,
                          index: number
                        ) => (
                          <button
                            key={`${result.type}-${result.title}-${index}`}
                            type="button"
                            onClick={() =>
                              handleResultClick(
                                result.path
                              )
                            }
                            style={{
                              width: "100%",
                              border: "none",
                              background:
                                "#FFFFFF",
                              padding:
                                "14px 16px",
                              textAlign:
                                "left",
                              cursor:
                                "pointer",
                              borderBottom:
                                "1px solid #F1F5F9",
                            }}
                            onMouseEnter={(
                              event
                            ) => {
                              event.currentTarget.style.background =
                                "#F8FAFC";
                            }}
                            onMouseLeave={(
                              event
                            ) => {
                              event.currentTarget.style.background =
                                "#FFFFFF";
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "space-between",
                                alignItems:
                                  "center",
                                gap: "10px",
                              }}
                            >
                              <strong
                                style={{
                                  color:
                                    "#0F172A",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {
                                  result.title
                                }
                              </strong>

                              <span
                                style={{
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    700,
                                  color:
                                    "#2563EB",
                                  background:
                                    "#EFF6FF",
                                  padding:
                                    "4px 7px",
                                  borderRadius:
                                    "5px",
                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {
                                  result.type
                                }
                              </span>
                            </div>

                            <div
                              style={{
                                marginTop:
                                  "5px",
                                color:
                                  "#64748B",
                                fontSize:
                                  "12px",
                              }}
                            >
                              {
                                result.subtitle
                              }
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={
              handleSearchButtonClick
            }
            style={searchButtonStyle}
            title={
              searchOpen
                ? "Run search"
                : "Open search"
            }
          >
            <Icon
              type="search"
              size={17}
            />

            <span>
              {searchOpen
                ? "Search"
                : "Search"}
            </span>
          </button>
        </div>

        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        <button
          type="button"
          onClick={() => {
            console.log(
              "Notifications clicked"
            );
          }}
          style={notificationStyle}
          title="Notifications"
        >
          <Icon
            type="bell"
            size={19}
          />
        </button>

        {/* ==================================================
            USER
        ================================================== */}

        <div style={userContainerStyle}>
          <div style={avatarStyle}>
            BM

            <span
              style={{
                position: "absolute",
                right: "-1px",
                bottom: "0px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#10B981",

                /* CHANGED: matches the new charcoal header */
                border:
                  "2px solid #334155",
              }}
            />
          </div>

          <div>
            <div style={userNameStyle}>
              Blessing Mudarikwa
            </div>

            <div style={onlineStyle}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10B981",
                }}
              />

              Online
            </div>
          </div>

          <div
            style={{
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "2px",
            }}
          >
            <Icon
              type="chevron"
              size={16}
            />
          </div>
        </div>
      </div>
    </header>
  );
}