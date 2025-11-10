import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function AddMeasurementModal({ isOpen, onClose, onSave, defaultValues = {} }) {
  const [type, setType] = useState(defaultValues.type || "");
  const [value, setValue] = useState(
    defaultValues.value !== undefined && defaultValues.value !== null ? String(defaultValues.value) : ""
  );
  const [unit, setUnit] = useState(defaultValues.unit || "");
  const [timestamp, setTimestamp] = useState(
    defaultValues.timestamp ? new Date(defaultValues.timestamp).toISOString().slice(0, 16) : ""
  );
  const [notes, setNotes] = useState(defaultValues.notes || "");
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      // Restore values from defaults when opened
      setType(defaultValues.type || "");
      setValue(
        defaultValues.value !== undefined && defaultValues.value !== null ? String(defaultValues.value) : ""
      );
      setUnit(defaultValues.unit || "");
      setTimestamp(
        defaultValues.timestamp ? new Date(defaultValues.timestamp).toISOString().slice(0, 16) : ""
      );
      setNotes(defaultValues.notes || "");
      // focus first input
      setTimeout(() => firstInputRef.current && firstInputRef.current.focus(), 0);
      // trap focus simple: focus modal
    }
  }, [isOpen, defaultValues]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  function validate() {
    const newErrors = {};
    if (!type.trim()) newErrors.type = "Type is required.";
    if (!value.trim()) {
      newErrors.value = "Value is required.";
    } else if (Number.isNaN(Number(value))) {
      newErrors.value = "Value must be a number.";
    }
    if (!timestamp) newErrors.timestamp = "Timestamp is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const measurement = {
      type: type.trim(),
      value: Number(value),
      unit: unit.trim() || null,
      timestamp: new Date(timestamp).toISOString(),
      notes: notes.trim() || null,
    };
    onSave && onSave(measurement);
    onClose && onClose();
  }

  function handleOverlayClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-measurement-title"
      className="ap-modal-overlay"
      onMouseDown={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        ref={modalRef}
        className="ap-modal"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 8,
          width: 520,
          maxWidth: "90%",
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2 id="add-measurement-title" style={{ marginTop: 0 }}>
          Add Measurement
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="measurement-type" style={{ display: "block", fontSize: 14 }}>
              Type
            </label>
            <input
              id="measurement-type"
              ref={firstInputRef}
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. temperature, humidity"
              style={{ width: "100%", padding: 8, fontSize: 14 }}
            />
            {errors.type && <div style={{ color: "crimson", fontSize: 12 }}>{errors.type}</div>}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="measurement-value" style={{ display: "block", fontSize: 14 }}>
                Value
              </label>
              <input
                id="measurement-value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Numeric value"
                style={{ width: "100%", padding: 8, fontSize: 14 }}
              />
              {errors.value && <div style={{ color: "crimson", fontSize: 12 }}>{errors.value}</div>}
            </div>

            <div style={{ width: 120 }}>
              <label htmlFor="measurement-unit" style={{ display: "block", fontSize: 14 }}>
                Unit
              </label>
              <input
                id="measurement-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="°C, ppm, etc."
                style={{ width: "100%", padding: 8, fontSize: 14 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="measurement-timestamp" style={{ display: "block", fontSize: 14 }}>
              Timestamp
            </label>
            <input
              id="measurement-timestamp"
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              style={{ width: "100%", padding: 8, fontSize: 14 }}
            />
            {errors.timestamp && <div style={{ color: "crimson", fontSize: 12 }}>{errors.timestamp}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="measurement-notes" style={{ display: "block", fontSize: 14 }}>
              Notes (optional)
            </label>
            <textarea
              id="measurement-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 12px",
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                background: "#0078d4",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddMeasurementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  defaultValues: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.string,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    notes: PropTypes.string,
  }),
};