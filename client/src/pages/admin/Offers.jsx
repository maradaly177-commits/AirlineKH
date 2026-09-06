import { useState } from "react";
import { Table, Modal, Button } from "react-bootstrap";

function Offers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      code: "SKYLINK2026",
      title: "New Year Sky Sale",
      discount: "20% OFF",
      minBooking: "1,500,000 ₫",
      validUntil: "2026-12-31",
      usageCount: 142,
      status: "Active",
    },
    {
      id: 2,
      code: "SUMMERVIBES",
      title: "Summer Vacation Special",
      discount: "500,000 ₫",
      minBooking: "3,000,000 ₫",
      validUntil: "2026-09-30",
      usageCount: 89,
      status: "Active",
    },
    {
      id: 3,
      code: "VIPMEMBER",
      title: "Gold & VIP Member Privilege",
      discount: "15% OFF",
      minBooking: "0 ₫",
      validUntil: "2026-11-15",
      usageCount: 54,
      status: "Active",
    },
    {
      id: 4,
      code: "EARLYBIRD",
      title: "Early Flight Booking Deal",
      discount: "10% OFF",
      minBooking: "1,000,000 ₫",
      validUntil: "2026-08-01",
      usageCount: 210,
      status: "Expired",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    code: "",
    title: "",
    discount: "",
    minBooking: "",
    validUntil: "",
  });

  const handleCreateOffer = (e) => {
    e.preventDefault();
    if (!newOffer.code || !newOffer.title) return;

    const offerObj = {
      id: Date.now(),
      code: newOffer.code.toUpperCase(),
      title: newOffer.title,
      discount: newOffer.discount || "10% OFF",
      minBooking: newOffer.minBooking || "1,000,000 ₫",
      validUntil: newOffer.validUntil || "2026-12-31",
      usageCount: 0,
      status: "Active",
    };

    setOffers([offerObj, ...offers]);
    setShowModal(false);
    setNewOffer({ code: "", title: "", discount: "", minBooking: "", validUntil: "" });
  };

  const toggleStatus = (id) => {
    setOffers(
      offers.map((o) =>
        o.id === id ? { ...o, status: o.status === "Active" ? "Inactive" : "Active" } : o
      )
    );
  };

  const deleteOffer = (id) => {
    if (window.confirm("Are you sure you want to delete this promotion offer?")) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Offers & Promotions Management
          </h3>
          <div
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              fontWeight: "500",
              marginTop: "4px",
            }}
          >
            Home / Dashboard / <span style={{ color: "#475569" }}>Offers</span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
          }}
        >
          <i className="fas fa-plus" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* PROMO CODE TABLE CARD */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <Table hover responsive style={{ marginBottom: 0, verticalAlign: "middle" }}>
          <thead>
            <tr style={{ background: "#fafafa", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Promo Code
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Campaign Title
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Discount Value
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Min Booking
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Valid Until
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Usages
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Status
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none", textAlign: "right" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {offers.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                {/* PROMO CODE */}
                <td style={{ padding: "16px 24px" }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      fontWeight: "800",
                      color: "#2563eb",
                      background: "#eff6ff",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px dashed #bfdbfe",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <i className="fas fa-ticket-alt" style={{ marginRight: "6px", fontSize: "12px" }} />
                    {o.code}
                  </span>
                </td>

                {/* TITLE */}
                <td style={{ padding: "16px 24px", fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>
                  {o.title}
                </td>

                {/* DISCOUNT */}
                <td style={{ padding: "16px 24px", fontWeight: "800", color: "#ec4899", fontSize: "14px" }}>
                  {o.discount}
                </td>

                {/* MIN BOOKING */}
                <td style={{ padding: "16px 24px", color: "#475569", fontSize: "14px", fontWeight: "500" }}>
                  {o.minBooking}
                </td>

                {/* VALID UNTIL */}
                <td style={{ padding: "16px 24px", color: "#64748b", fontSize: "13px" }}>
                  {o.validUntil}
                </td>

                {/* USAGES */}
                <td style={{ padding: "16px 24px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>
                  {o.usageCount} times
                </td>

                {/* STATUS */}
                <td style={{ padding: "16px 24px" }}>
                  <span
                    onClick={() => toggleStatus(o.id)}
                    style={{
                      cursor: "pointer",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background:
                        o.status === "Active"
                          ? "#dcfce7"
                          : o.status === "Inactive"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        o.status === "Active"
                          ? "#15803d"
                          : o.status === "Inactive"
                          ? "#b45309"
                          : "#b91c1c",
                    }}
                  >
                    {o.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  <button
                    onClick={() => deleteOffer(o.id)}
                    style={{
                      border: "none",
                      background: "#fee2e2",
                      color: "#ef4444",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    title="Delete Offer"
                  >
                    <i className="fas fa-trash-alt" style={{ fontSize: "13px" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* CREATE OFFER MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "1px solid #f1f5f9" }}>
          <Modal.Title style={{ fontWeight: "800", color: "#0f172a", fontSize: "18px" }}>
            Create New Promotional Offer
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleCreateOffer}>
          <Modal.Body style={{ padding: "24px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px", display: "block" }}>
                Promo Code (e.g. SUMMER2026)
              </label>
              <input
                type="text"
                required
                placeholder="SUMMER2026"
                value={newOffer.code}
                onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px", display: "block" }}>
                Campaign Title
              </label>
              <input
                type="text"
                required
                placeholder="Summer Flight Special Discount"
                value={newOffer.title}
                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px", display: "block" }}>
                  Discount (e.g. 20% OFF or 200k)
                </label>
                <input
                  type="text"
                  placeholder="20% OFF"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px", display: "block" }}>
                  Valid Until
                </label>
                <input
                  type="date"
                  value={newOffer.validUntil}
                  onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer style={{ borderTop: "1px solid #f1f5f9" }}>
            <Button variant="light" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" style={{ fontWeight: "700" }}>
              Save Promotion
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Offers;
