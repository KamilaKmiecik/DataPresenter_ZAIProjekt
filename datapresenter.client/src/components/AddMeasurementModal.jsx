import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Plus, X } from "lucide-react";

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
            setType(defaultValues.type || "");
            setValue(
                defaultValues.value !== undefined && defaultValues.value !== null ? String(defaultValues.value) : ""
            );
            setUnit(defaultValues.unit || "");
            setTimestamp(
                defaultValues.timestamp ? new Date(defaultValues.timestamp).toISOString().slice(0, 16) : ""
            );
            setNotes(defaultValues.notes || "");
            setTimeout(() => firstInputRef.current && firstInputRef.current.focus(), 0);
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
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                animation: "fadeIn 0.2s ease"
            }}
        >
            <div
                ref={modalRef}
                className="ap-modal"
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    borderRadius: 24,
                    width: 560,
                    maxWidth: "90%",
                    padding: 32,
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                    animation: "slideUp 0.3s ease"
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        border: "none",
                        background: "rgba(102, 126, 234, 0.1)",
                        color: "#667eea",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = "rgba(102, 126, 234, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "rgba(102, 126, 234, 0.1)";
                    }}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 8
                    }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                        }}>
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <h2 id="add-measurement-title" style={{
                            margin: 0,
                            fontSize: 28,
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                        }}>
                            Add Measurement
                        </h2>
                    </div>
                    <p style={{ margin: 0, color: "#9ca3af", fontSize: 14 }}>
                        Fill in the details to add a new measurement
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div style={{ marginBottom: 16 }}>
                        <label htmlFor="measurement-type" style={{
                            display: "block",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#374151",
                            marginBottom: 8
                        }}>
                            Type
                        </label>
                        <input
                            id="measurement-type"
                            ref={firstInputRef}
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="e.g. temperature, humidity"
                            className="input-field"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                fontSize: 14,
                                border: errors.type ? "2px solid #ef4444" : "2px solid #e5e7eb"
                            }}
                        />
                        {errors.type && (
                            <div style={{
                                color: "#ef4444",
                                fontSize: 12,
                                marginTop: 6,
                                fontWeight: 600
                            }}>
                                {errors.type}
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="measurement-value" style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 8
                            }}>
                                Value
                            </label>
                            <input
                                id="measurement-value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Numeric value"
                                className="input-field"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    border: errors.value ? "2px solid #ef4444" : "2px solid #e5e7eb"
                                }}
                            />
                            {errors.value && (
                                <div style={{
                                    color: "#ef4444",
                                    fontSize: 12,
                                    marginTop: 6,
                                    fontWeight: 600
                                }}>
                                    {errors.value}
                                </div>
                            )}
                        </div>

                        <div style={{ width: 140 }}>
                            <label htmlFor="measurement-unit" style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 8
                            }}>
                                Unit
                            </label>
                            <input
                                id="measurement-unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="°C, ppm, etc."
                                className="input-field"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    border: "2px solid #e5e7eb"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label htmlFor="measurement-timestamp" style={{
                            display: "block",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#374151",
                            marginBottom: 8
                        }}>
                            Timestamp
                        </label>
                        <input
                            id="measurement-timestamp"
                            type="datetime-local"
                            value={timestamp}
                            onChange={(e) => setTimestamp(e.target.value)}
                            className="input-field"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                fontSize: 14,
                                border: errors.timestamp ? "2px solid #ef4444" : "2px solid #e5e7eb"
                            }}
                        />
                        {errors.timestamp && (
                            <div style={{
                                color: "#ef4444",
                                fontSize: 12,
                                marginTop: 6,
                                fontWeight: 600
                            }}>
                                {errors.timestamp}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label htmlFor="measurement-notes" style={{
                            display: "block",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#374151",
                            marginBottom: 8
                        }}>
                            Notes (optional)
                        </label>
                        <textarea
                            id="measurement-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="input-field"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                fontSize: 14,
                                border: "2px solid #e5e7eb",
                                resize: "vertical"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "12px 24px",
                                background: "#f3f4f6",
                                color: "#6b7280",
                                border: "none",
                                borderRadius: 12,
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 14,
                                transition: "all 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = "#e5e7eb";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "#f3f4f6";
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: "12px 24px",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 12,
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 14,
                                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                            }}
                        >
                            Save Measurement
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