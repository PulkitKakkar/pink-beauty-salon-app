import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import "../styles/CustomersList.css";

export default function CustomersList() {
  const fieldLabels = {
    clientName: "Client Name",
    phone: "Phone Number",
    email: "Email",
    doctorCare: "Under Doctor’s Care?",
    doctorCareForWhat: "Reason for Doctor Care",
    hormoneMedication: "Hormone Medication?",
    hormoneMedicationDetails: "Hormone Medication Details",
    allMedications: "All Medications?",
    medications: "Current Medications",
    surgery: "Surgery?",
    surgeryExplain: "Surgery Details",
    sensitiveSoaps: "Sensitive to Soaps?",
    skinIrritated: "Skin Irritated?",
    sunExposure6Weeks: "Sun Exposure (Last 6 Weeks)",
    waxedAreasMonth: "Waxed Areas (Last Month)",
    allergies: "Allergies",
    tanning: "Tanning",
    tattoos: "Tattoos",
    pregnant: "Pregnant?",
    treatments: "Treatments",
    skinTypeScore: "Skin Type Score",
    disclaimerAccepted: "Disclaimer Accepted",
    date: "Form Date",
  };
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [serviceModalCustomer, setServiceModalCustomer] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [newServiceEntry, setNewServiceEntry] = useState("");

  // Define the desired order of fields for display/edit
  const fieldOrder = [
    "clientName",
    "phone",
    "email",
    "date",
    "doctorCare",
    "doctorCareForWhat",
    "hormoneMedication",
    "hormoneMedicationDetails",
    "allMedications",
    "medications",
    "surgery",
    "surgeryExplain",
    "sensitiveSoaps",
    "skinIrritated",
    "sunExposure6Weeks",
    "waxedAreasMonth",
    "allergies",
    "tanning",
    "tattoos",
    "pregnant",
    "treatments",
    "skinTypeScore",
    "disclaimerAccepted"
  ];
  useEffect(() => {
    const fetchServiceHistory = async () => {
      if (serviceModalCustomer) {
        const historySnap = await getDocs(collection(db, "consultations", serviceModalCustomer.id, "serviceHistory"));
        const historyData = historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServiceHistory(historyData);
      }
    };
    fetchServiceHistory();
  }, [serviceModalCustomer]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, "consultations"));
      const customerData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerData);
    };
    fetchCustomers();
  }, []);


  return (
    <div style={{
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%)"
    }}>
      <h2 style={{
        color: "#d63384",
        textAlign: "center",
        fontSize: "28px",
        marginBottom: "20px",
        fontWeight: "700",
        letterSpacing: "1px"
      }}>
        👥 Customers List
      </h2>
      <input
        type="text"
        placeholder="Search by name, phone, or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 0",
          marginTop: "10px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
          boxShadow: "0 2px 6px rgba(214, 51, 132, 0.2)",
          outline: "none",
        }}
        onFocus={e => {
          e.target.style.borderColor = "#d63384";
          e.target.style.outline = "none";
        }}
        onBlur={e => {
          e.target.style.borderColor = "#ccc";
        }}
      />
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers
                .filter((customer) => {
                  const query = searchTerm.toLowerCase();
                  return (
                    customer.clientName?.toLowerCase().includes(query) ||
                    customer.phone?.toLowerCase().includes(query) ||
                    customer.email?.toLowerCase().includes(query)
                  );
                })
                .map((customer) => (
                  <tr key={customer.id}>
                    <td data-label="Name">{customer.clientName}</td>
                    <td data-label="Phone">{customer.phone}</td>
                    <td data-label="Email">{customer.email}</td>
                    <td data-label="Actions">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        style={{
                          background: "#f8bbd0",
                          color: "#d63384",
                          padding: "8px 14px",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "600",
                          marginRight: "8px",
                          boxShadow: "0 2px 5px rgba(214, 51, 132, 0.08)",
                          transition: "transform 0.12s, box-shadow 0.12s",
                          cursor: "pointer",
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                        onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.08)"; }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => setServiceModalCustomer(customer)}
                        style={{
                          background: "#d63384",
                          color: "white",
                          padding: "8px 14px",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "600",
                          boxShadow: "0 2px 5px rgba(214, 51, 132, 0.10)",
                          transition: "transform 0.12s, box-shadow 0.12s",
                          cursor: "pointer",
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                        onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.10)"; }}
                      >
                        Service History
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedCustomer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "20px",
              boxShadow: "0 8px 20px rgba(214, 51, 132, 0.2)",
              borderTop: "6px solid #d63384"
            }}
          >
            <h3 style={{ color: "#d63384", textAlign: "center", fontWeight: "700", marginBottom: "20px" }}>Customer Details</h3>
            {fieldOrder.map((field) =>
              selectedCustomer[field] !== undefined && (
                <div key={field} style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {fieldLabels[field] || field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={selectedCustomer[field]}
                    onChange={(e) =>
                      setSelectedCustomer({ ...selectedCustomer, [field]: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              )
            )}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <button
                onClick={async () => {
                  await updateDoc(doc(db, "consultations", selectedCustomer.id), selectedCustomer);
                  setCustomers(
                    customers.map((c) => (c.id === selectedCustomer.id ? selectedCustomer : c))
                  );
                  setSelectedCustomer(null);
                  toast.success("Customer details updated!");
                }}
                style={{
                  background: "#d63384",
                  color: "white",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  width: "50%",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(214, 51, 132, 0.2)",
                  transition: "transform 0.12s, box-shadow 0.12s",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.2)"; }}
              >
                Save
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                style={{
                  background: "#f8bbd0",
                  color: "#d63384",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  width: "50%",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(214, 51, 132, 0.12)",
                  transition: "transform 0.12s, box-shadow 0.12s",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.12)"; }}
              >
                Close
              </button>
            </div>
            {/* Modal action row for Delete only */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "20px",
              borderTop: "1px solid #f8bbd0",
              paddingTop: "16px"
            }}>
              <button
                onClick={() => setDeleteTarget(selectedCustomer)}
                style={{
                  background: "#f8bbd0",
                  color: "#d63384",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 14px",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(214, 51, 132, 0.14)",
                  transition: "transform 0.12s, box-shadow 0.12s",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.14)"; }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          padding: "10px", zIndex: 1100
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "400px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(214, 51, 132, 0.2)",
            borderTop: "6px solid #d63384"
          }}>
            <h3 style={{ color: "#d63384", textAlign: "center", fontWeight: "700", marginBottom: "20px" }}>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{deleteTarget.clientName}</strong>?</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "10px" }}>
              <button
                onClick={async () => {
                  await deleteDoc(doc(db, "consultations", deleteTarget.id));
                  setCustomers(customers.filter((c) => c.id !== deleteTarget.id));
                  setDeleteTarget(null);
                  toast.success("Customer deleted successfully!");
                }}
                style={{
                  backgroundColor: "#d63384",
                  color: "white",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  width: "50%",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(214, 51, 132, 0.2)",
                  transition: "transform 0.12s, box-shadow 0.12s",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.2)"; }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setDeleteTarget(null);
                  toast("Deletion cancelled", { icon: "⚠️" });
                }}
                style={{
                  backgroundColor: "#f8bbd0",
                  color: "#d63384",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  width: "50%",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(214, 51, 132, 0.12)",
                  transition: "transform 0.12s, box-shadow 0.12s",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.12)"; }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {serviceModalCustomer && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          padding: "10px", zIndex: 1200
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(214, 51, 132, 0.2)",
            borderTop: "6px solid #6a1b9a"
          }}>
            <h3 style={{ color: "#6a1b9a", textAlign: "center", fontWeight: "700", marginBottom: "20px" }}>
              Service History for {serviceModalCustomer.clientName}
            </h3>

            {/* List existing service history */}
            {serviceHistory.length === 0 ? (
              <p>No service history yet.</p>
            ) : (
              <ul style={{ padding: 0, listStyle: "none" }}>
                {serviceHistory.map(service => (
                  <li key={service.id} style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span>{service.entry}</span>
                    <button
                      onClick={async () => {
                        await deleteDoc(doc(db, "consultations", serviceModalCustomer.id, "serviceHistory", service.id));
                        setServiceHistory(serviceHistory.filter(s => s.id !== service.id));
                        toast.success("Service entry removed");
                      }}
                      style={{
                        background: "#d63384",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        boxShadow: "0 1px 2px rgba(214, 51, 132, 0.10)",
                        transition: "transform 0.12s, box-shadow 0.12s",
                        cursor: "pointer",
                      }}
                      onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 2px 6px #f8bbd0"; }}
                      onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(214, 51, 132, 0.10)"; }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add new service entry */}
            <div style={{ marginTop: "20px" }}>
              <input
                type="text"
                placeholder="New service entry"
                value={newServiceEntry}
                onChange={(e) => setNewServiceEntry(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
              <button
                onClick={async () => {
                  if (!newServiceEntry.trim()) return;
                  const docRef = await addDoc(collection(db, "consultations", serviceModalCustomer.id, "serviceHistory"), {
                    entry: newServiceEntry,
                    createdAt: new Date()
                  });
                  setServiceHistory([...serviceHistory, { id: docRef.id, entry: newServiceEntry }]);
                  setNewServiceEntry("");
                  toast.success("Service entry added");
                }}
                style={{
                  background: "#d63384",
                  color: "white",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  width: "100%",
                  fontWeight: "600",
                  boxShadow: "0 2px 5px rgba(214, 51, 132, 0.16)",
                  transition: "transform 0.12s, box-shadow 0.12s",
                  cursor: "pointer",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.16)"; }}
              >
                Add Service Entry
              </button>
            </div>

            <button
              onClick={() => setServiceModalCustomer(null)}
              style={{
                marginTop: "15px",
                background: "#f8bbd0",
                color: "#d63384",
                padding: "10px 16px",
                border: "none",
                borderRadius: "6px",
                width: "100%",
                fontWeight: "600",
                boxShadow: "0 2px 5px rgba(214, 51, 132, 0.08)",
                transition: "transform 0.12s, box-shadow 0.12s",
                cursor: "pointer",
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 10px #f8bbd0"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(214, 51, 132, 0.08)"; }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}