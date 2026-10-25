
import { useState } from "react";
import {
  LayoutDashboard,
  Files,
  Upload,
  ClipboardCheck,
  Search,
  Bell,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const applications = [
  {
    id: "APP-2026-1001",
    institution: "Eastern Technical Institute",
    type: "Extension of Approval",
    date: "22 Oct 2026",
    status: "Missing documents",
  },
  {
    id: "APP-2026-1002",
    institution: "Sunrise Engineering College",
    type: "Extension of Approval",
    date: "21 Oct 2026",
    status: "Manual review",
  },
  {
    id: "APP-2026-1003",
    institution: "Coastal Institute of Technology",
    type: "Change in intake",
    date: "20 Oct 2026",
    status: "Pending verification",
  },
  {
    id: "APP-2026-1004",
    institution: "Greenfield Technical College",
    type: "Extension of Approval",
    date: "19 Oct 2026",
    status: "Checks complete",
  },
];

const colors = {
  green: "#243B32",
  ivory: "#F5F3ED",
  brass: "#9B7B4F",
  text: "#374151",
  muted: "#777C75",
  border: "#E4E0D6",
};

const statusColors = {
  "Missing documents": ["#F5EBD8", "#805D20"],
  "Manual review": ["#F5E5E2", "#963D35"],
  "Pending verification": ["#E9ECEF", "#4B5563"],
  "Checks complete": ["#E8F1E9", "#245B38"],
};

const cardStyle = {
  background: "#FFFFFF",
  border: `1px solid ${colors.border}`,
  padding: 20,
};

const buttonStyle = {
  background: colors.green,
  color: "#FFFFFF",
  padding: "11px 15px",
  border: "none",
  cursor: "pointer",
  fontSize: 11,
};

function StatusBadge({ status }) {
  const badgeColors = statusColors[status] || ["#E9ECEF", "#4B5563"];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 8px",
        background: badgeColors[0],
        color: badgeColors[1],
        fontSize: 10,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 25,
      }}
    >
      <div>
        <p
          style={{
            color: colors.muted,
            fontSize: 10,
            letterSpacing: 0.8,
          }}
        >
          {eyebrow}
        </p>

        <h1
          style={{
            color: colors.green,
            fontSize: 27,
            fontWeight: 500,
            margin: "10px 0",
          }}
        >
          {title}
        </h1>

        <p style={{ color: colors.muted, lineHeight: 1.6 }}>
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Overview");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [observation, setObservation] = useState("");
  const [savedObservation, setSavedObservation] = useState("");
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("Extension of Approval");
  const [validationRun, setValidationRun] = useState(false);

  const filteredApplications = applications.filter((app) =>
    `${app.id} ${app.institution} ${app.status}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Applications", icon: Files },
    { name: "Document intake", icon: Upload },
    { name: "Verification log", icon: ClipboardCheck },
  ];

  function openApplication(app) {
    setSelected(app);
    setObservation("");
    setSavedObservation("");
  }

  function goToPage(nextPage) {
    setPage(nextPage);
    setSelected(null);
  }

  function handleFiles(event) {
    const incoming = Array.from(event.target.files || []);

    setFiles((current) => {
      const combined = [...current, ...incoming];

      return combined.filter(
        (file, index, array) =>
          array.findIndex(
            (other) =>
              other.name === file.name &&
              other.size === file.size &&
              other.lastModified === file.lastModified
          ) === index
      );
    });

    setValidationRun(false);
    event.target.value = "";
  }

  function removeFile(indexToRemove) {
    setFiles((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );

    setValidationRun(false);
  }

  function startValidation() {
    if (files.length === 0) return;
    setValidationRun(true);
  }

  function downloadDemoReport() {
    const report = {
      reportType: "DocuLens demonstration report",
      generatedAt: new Date().toISOString(),
      application: selected
        ? {
            id: selected.id,
            institution: selected.institution,
            type: selected.type,
            status: selected.status,
          }
        : null,
      observation: savedObservation || null,
      notice:
        "Demonstration data only. This report is not an official AICTE determination.",
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${selected?.id || "doculens"}-demo-report.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.ivory,
        color: colors.text,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        display: "flex",
        fontSize: 13,
      }}
    >
      <aside
        style={{
          width: 235,
          minHeight: "100vh",
          background: colors.green,
          color: "#E7E9E2",
          padding: "24px 16px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            marginBottom: 45,
          }}
        >
          <ShieldCheck size={30} color="#D4BD91" />

          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: 0.2,
              }}
            >
              DocuLens
            </div>

            <div
              style={{
                fontSize: 9,
                letterSpacing: 1.3,
                marginTop: 3,
              }}
            >
              DOCUMENT INTELLIGENCE
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            letterSpacing: 1.5,
            color: "#A8B7AA",
            margin: "0 12px 14px",
          }}
        >
          WORKSPACE
        </div>

        {navItems.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => goToPage(name)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px",
              marginBottom: 4,
              color: "#FFFFFF",
              background: page === name ? "#354D40" : "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            <Icon size={17} />
            {name}
          </button>
        ))}

        <div
          style={{
            marginTop: 40,
            padding: 14,
            border: "1px solid #526456",
            color: "#D0D9D1",
            fontSize: 11,
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: "#FFFFFF", marginBottom: 5 }}>
            ● Demo environment
          </div>
          Fictional records only. No live authority connection.
        </div>

        <div
          style={{
            marginTop: 25,
            fontSize: 10,
            color: "#A8B7AA",
          }}
        >
          DOCULENS · PROTOTYPE 0.1
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <header
          style={{
            minHeight: 64,
            background: "#FDFCF9",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 28px",
            gap: 15,
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {selected ? "Application review" : page}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
            }}
          >
            <span style={{ fontSize: 10, color: colors.muted }}>
              ● Prototype environment
            </span>

            <Bell size={17} />

            <span
              style={{
                background: "#E4E8DD",
                padding: 9,
                color: colors.green,
                fontWeight: 600,
              }}
            >
              RO
            </span>

            <span style={{ fontSize: 11 }}>Reviewing Officer</span>
          </div>
        </header>

        <main
          style={{
            padding: "32px 28px",
            maxWidth: 1500,
            margin: "0 auto",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {selected ? (
            <div>
              <button
                onClick={() => {
                  setSelected(null);
                  setObservation("");
                  setSavedObservation("");
                }}
                style={{
                  border: "none",
                  background: "none",
                  color: colors.green,
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: 22,
                  fontSize: 12,
                }}
              >
                ← Back to application register
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <p
                    style={{
                      color: colors.brass,
                      fontFamily: "monospace",
                      fontSize: 11,
                    }}
                  >
                    {selected.id}
                  </p>

                  <h1
                    style={{
                      color: colors.green,
                      fontSize: 27,
                      margin: "9px 0",
                      fontWeight: 500,
                    }}
                  >
                    Application review
                  </h1>

                  <p style={{ color: colors.muted }}>
                    {selected.institution}
                  </p>
                </div>

                <StatusBadge status={selected.status} />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                {[
                  ["APPLICATION TYPE", selected.type],
                  ["SUBMISSION DATE", selected.date],
                  ["REVIEW ASSIGNMENT", "Demo reviewing officer"],
                ].map(([label, value]) => (
                  <div key={label} style={cardStyle}>
                    <p
                      style={{
                        color: colors.muted,
                        fontSize: 10,
                        letterSpacing: 0.7,
                      }}
                    >
                      {label}
                    </p>

                    <p
                      style={{
                        color: colors.green,
                        fontWeight: 600,
                        marginTop: 10,
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(290px, 1fr))",
                  gap: 18,
                  marginTop: 22,
                  alignItems: "start",
                }}
              >
                <section style={{ ...cardStyle, padding: 0 }}>
                  <div
                    style={{
                      padding: 19,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <h2
                      style={{
                        color: colors.green,
                        fontSize: 15,
                        margin: 0,
                      }}
                    >
                      Document checklist
                    </h2>

                    <p
                      style={{
                        color: colors.muted,
                        fontSize: 11,
                        marginTop: 6,
                      }}
                    >
                      Illustrative requirements for this demo.
                    </p>
                  </div>

                  {[
                    ["Institution identification record", "Available"],
                    ["Approval / affiliation document", "Available"],
                    ["Infrastructure details", "Available"],
                    ["Faculty information", "Available"],
                    [
                      "Supporting compliance evidence",
                      selected.id === "APP-2026-1001"
                        ? "Missing"
                        : "Available",
                    ],
                    [
                      "Additional supporting record",
                      selected.id === "APP-2026-1001"
                        ? "Missing"
                        : "Available",
                    ],
                  ].map(([name, status]) => (
                    <div
                      key={name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        padding: "15px 18px",
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      <span style={{ fontSize: 11, lineHeight: 1.5 }}>
                        {name}
                      </span>

                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color:
                            status === "Missing" ? "#963D35" : "#55765A",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {status}
                      </span>
                    </div>
                  ))}

                  <p
                    style={{
                      padding: 16,
                      color: colors.muted,
                      fontSize: 10,
                      lineHeight: 1.6,
                    }}
                  >
                    Checklist items are illustrative. Actual requirements
                    must be configured against the applicable approval
                    category and rules.
                  </p>
                </section>

                <div style={{ display: "grid", gap: 18 }}>
                  <section style={cardStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <ShieldCheck size={19} color={colors.brass} />

                      <h2
                        style={{
                          color: colors.green,
                          fontSize: 15,
                          margin: 0,
                        }}
                      >
                        Preliminary findings
                      </h2>
                    </div>

                    {selected.id === "APP-2026-1002" ? (
                      <div
                        style={{
                          marginTop: 18,
                          padding: 15,
                          background: "#FAF5F2",
                          borderLeft: "3px solid #A65B4B",
                        }}
                      >
                        <p
                          style={{
                            color: "#833D32",
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          Identifier mismatch flagged
                        </p>

                        <p
                          style={{
                            color: "#6F514A",
                            fontSize: 11,
                            lineHeight: 1.7,
                            marginTop: 9,
                          }}
                        >
                          The illustrative identifier extracted from a
                          document differs from the reference value. The
                          discrepancy requires human review and does not
                          establish fraud or non-compliance.
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                            marginTop: 18,
                          }}
                        >
                          <div>
                            <p
                              style={{
                                color: colors.muted,
                                fontSize: 10,
                              }}
                            >
                              Extracted value
                            </p>

                            <p
                              style={{
                                color: "#963D35",
                                fontFamily: "monospace",
                                marginTop: 5,
                              }}
                            >
                              INST-2086
                            </p>
                          </div>

                          <div>
                            <p
                              style={{
                                color: colors.muted,
                                fontSize: 10,
                              }}
                            >
                              Demo reference
                            </p>

                            <p
                              style={{
                                color: colors.green,
                                fontFamily: "monospace",
                                marginTop: 5,
                              }}
                            >
                              INST-2068
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            borderTop: "1px solid #E9DAD3",
                            marginTop: 15,
                            paddingTop: 12,
                            color: "#806B62",
                            fontSize: 10,
                          }}
                        >
                          Evidence reference: Sample document · Page 2
                          (illustrative)
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: 18,
                          padding: 15,
                          background: "#F6F6F0",
                        }}
                      >
                        <p
                          style={{
                            color: colors.green,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {selected.status === "Checks complete"
                            ? "No open findings in this sample"
                            : selected.status === "Missing documents"
                              ? "Missing items identified"
                              : "Further review may be required"}
                        </p>

                        <p
                          style={{
                            color: colors.muted,
                            fontSize: 11,
                            lineHeight: 1.7,
                            marginTop: 8,
                          }}
                        >
                          Consult the original records and applicable
                          checklist before reaching a conclusion.
                        </p>
                      </div>
                    )}

                    <p
                      style={{
                        color: colors.muted,
                        fontSize: 10,
                        lineHeight: 1.6,
                        marginTop: 14,
                      }}
                    >
                      Automated findings are preliminary decision-support
                      signals, not official regulatory determinations.
                    </p>
                  </section>

                  <section style={cardStyle}>
                    <h2
                      style={{
                        color: colors.green,
                        fontSize: 15,
                        margin: 0,
                      }}
                    >
                      Officer observation
                    </h2>

                    <p
                      style={{
                        color: colors.muted,
                        fontSize: 11,
                        lineHeight: 1.6,
                        marginTop: 7,
                      }}
                    >
                      Record a note for this demonstration review.
                    </p>

                    <textarea
                      value={observation}
                      onChange={(event) => {
                        setObservation(event.target.value);
                        setSavedObservation("");
                      }}
                      placeholder="Enter your observation or follow-up action..."
                      rows={4}
                      style={{
                        display: "block",
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "vertical",
                        padding: 12,
                        marginTop: 15,
                        border: `1px solid ${colors.border}`,
                        background: "#FDFCF9",
                        outlineColor: "#64856B",
                        fontFamily: "inherit",
                        fontSize: 12,
                        lineHeight: 1.6,
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        marginTop: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          color: colors.muted,
                        }}
                      >
                        Demo session only
                      </span>

                      <button
                        disabled={!observation.trim()}
                        onClick={() =>
                          setSavedObservation(observation.trim())
                        }
                        style={{
                          ...buttonStyle,
                          background: observation.trim()
                            ? colors.green
                            : "#A5AEA6",
                          cursor: observation.trim()
                            ? "pointer"
                            : "not-allowed",
                        }}
                      >
                        Save observation
                      </button>
                    </div>

                    {savedObservation && (
                      <div
                        style={{
                          marginTop: 15,
                          padding: 12,
                          background: "#E8F1E9",
                          color: "#245B38",
                          fontSize: 11,
                          lineHeight: 1.6,
                        }}
                      >
                        Observation saved in the current screen state. It is
                        not persisted to a database or official audit trail.
                      </div>
                    )}

                    <button
                      onClick={downloadDemoReport}
                      style={{
                        ...buttonStyle,
                        marginTop: 15,
                        background: "#FDFCF9",
                        color: colors.green,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      Download demo review report
                    </button>
                  </section>
                </div>
              </div>
            </div>
          ) : page === "Document intake" ? (
            <div>
              <PageHeading
                eyebrow="WORKSPACE / DOCUMENT INTAKE"
                title="Document intake"
                description="Prepare supporting documents for preliminary validation."
              />

              <section
                style={{
                  ...cardStyle,
                  maxWidth: 760,
                  marginBottom: 20,
                }}
              >
                <label
                  htmlFor="application-category"
                  style={{ fontWeight: 600 }}
                >
                  Application category
                </label>

                <select
                  id="application-category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setValidationRun(false);
                  }}
                  style={{
                    display: "block",
                    marginTop: 10,
                    padding: 12,
                    width: "100%",
                    border: `1px solid ${colors.border}`,
                    background: "#FDFCF9",
                    color: colors.text,
                  }}
                >
                  <option>Extension of Approval</option>
                  <option>New course approval</option>
                  <option>Change in intake</option>
                  <option>Institutional change request</option>
                </select>

                <div
                  style={{
                    border: `1px dashed ${colors.brass}`,
                    padding: 24,
                    marginTop: 22,
                    textAlign: "center",
                    background: "#FAF9F5",
                  }}
                >
                  <Upload
                    size={27}
                    color={colors.brass}
                    style={{ marginBottom: 12 }}
                  />

                  <p style={{ color: colors.green, fontWeight: 600 }}>
                    Select supporting documents
                  </p>

                  <p
                    style={{
                      color: colors.muted,
                      fontSize: 11,
                      margin: "9px 0 17px",
                    }}
                  >
                    PDF, PNG or JPEG files
                  </p>

                  <label
                    style={{
                      ...buttonStyle,
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    Browse files

                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFiles}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {files.length > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <h3
                      style={{
                        color: colors.green,
                        fontSize: 13,
                      }}
                    >
                      Selected documents ({files.length})
                    </h3>

                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 0",
                          borderBottom: `1px solid ${colors.border}`,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              overflowWrap: "anywhere",
                              fontSize: 11,
                            }}
                          >
                            {file.name}
                          </p>

                          <p
                            style={{
                              color: colors.muted,
                              fontSize: 10,
                              marginTop: 5,
                            }}
                          >
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>

                        <button
                          onClick={() => removeFile(index)}
                          style={{
                            border: "none",
                            background: "none",
                            color: "#963D35",
                            cursor: "pointer",
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  disabled={files.length === 0}
                  onClick={startValidation}
                  style={{
                    ...buttonStyle,
                    marginTop: 22,
                    opacity: files.length === 0 ? 0.55 : 1,
                    cursor: files.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Run demo validation
                </button>

                <p
                  style={{
                    color: colors.muted,
                    fontSize: 10,
                    lineHeight: 1.6,
                    marginTop: 13,
                  }}
                >
                  Prototype only. Selecting files does not upload them to a
                  server. OCR, document analysis and official source
                  verification are not connected.
                </p>
              </section>

              {validationRun && (
                <section
                  style={{
                    ...cardStyle,
                    maxWidth: 760,
                    borderLeft: `3px solid ${colors.brass}`,
                  }}
                >
                  <h2
                    style={{
                      color: colors.green,
                      fontSize: 16,
                      margin: 0,
                    }}
                  >
                    Demo validation summary
                  </h2>

                  <p
                    style={{
                      color: colors.muted,
                      fontSize: 11,
                      marginTop: 10,
                    }}
                  >
                    Category: {category}
                  </p>

                  <p
                    style={{
                      marginTop: 16,
                      lineHeight: 1.7,
                    }}
                  >
                    {files.length} file(s) selected for the demonstration.
                  </p>

                  <p
                    style={{
                      color: "#805D20",
                      background: "#F5EBD8",
                      padding: 12,
                      marginTop: 15,
                      fontSize: 11,
                      lineHeight: 1.7,
                    }}
                  >
                    No actual validation was performed. A real validation
                    result requires a connected backend, document extraction
                    and configured rules.
                  </p>
                </section>
              )}
            </div>
          ) : page === "Verification log" ? (
            <div>
              <PageHeading
                eyebrow="WORKSPACE / AUDIT"
                title="Verification log"
                description="A demonstration view of verification activity."
              />

              <section style={cardStyle}>
                <h2
                  style={{
                    color: colors.green,
                    fontSize: 16,
                    margin: 0,
                  }}
                >
                  Audit trail integration
                </h2>

                <p
                  style={{
                    color: colors.muted,
                    lineHeight: 1.7,
                    marginTop: 12,
                  }}
                >
                  A persistent audit trail will be connected through the
                  backend. A production implementation should record the
                  reviewer, timestamp, action, evidence reference and
                  applicable rule version.
                </p>

                <StatusBadge status="Pending verification" />
              </section>
            </div>
          ) : (
            <div>
              <PageHeading
                eyebrow={`WORKSPACE / ${page.toUpperCase()}`}
                title={
                  page === "Applications"
                    ? "Application register"
                    : "Approval overview"
                }
                description={
                  page === "Applications"
                    ? "Search submissions and open records for preliminary review."
                    : "Review submissions, identify discrepancies and track verification."
                }
              >
                {page === "Overview" && (
                  <button
                    onClick={() => goToPage("Document intake")}
                    style={buttonStyle}
                  >
                    + New document intake
                  </button>
                )}
              </PageHeading>

              {page === "Overview" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(175px, 1fr))",
                    gap: 14,
                    marginTop: 28,
                    marginBottom: 25,
                  }}
                >
                  {[
                    [
                      "Total applications",
                      applications.length,
                      "Illustrative demo records",
                    ],
                    [
                      "Require attention",
                      2,
                      "Missing items or discrepancies",
                    ],
                    [
                      "Awaiting verification",
                      1,
                      "Source verification pending",
                    ],
                    [
                      "Checks complete",
                      1,
                      "Preliminary checks only",
                    ],
                  ].map(([label, value, note]) => (
                    <section key={label} style={cardStyle}>
                      <p style={{ color: colors.muted, fontSize: 11 }}>
                        {label}
                      </p>

                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 500,
                          color: colors.green,
                          margin: "14px 0 8px",
                        }}
                      >
                        {value}
                      </div>

                      <p style={{ color: colors.muted, fontSize: 10 }}>
                        {note}
                      </p>
                    </section>
                  ))}
                </div>
              )}

              <section
                style={{
                  ...cardStyle,
                  marginTop: page === "Applications" ? 0 : 25,
                  padding: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 15,
                    padding: 20,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 16,
                        color: colors.green,
                      }}
                    >
                      Application register
                    </h2>

                    <p
                      style={{
                        fontSize: 11,
                        color: colors.muted,
                        marginTop: 6,
                      }}
                    >
                      {filteredApplications.length} demonstration record(s)
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      border: `1px solid ${colors.border}`,
                      background: "#FFFFFF",
                      padding: "9px 12px",
                    }}
                  >
                    <Search size={15} color={colors.muted} />

                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search applications..."
                      aria-label="Search applications"
                      style={{
                        border: "none",
                        outline: "none",
                        width: 190,
                        maxWidth: "100%",
                        fontSize: 11,
                      }}
                    />
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      minWidth: 720,
                      textAlign: "left",
                    }}
                  >
                    <thead style={{ background: "#FAF9F6" }}>
                      <tr>
                        {[
                          "Application / Institution",
                          "Application type",
                          "Submitted",
                          "Status",
                          "",
                        ].map((heading) => (
                          <th
                            key={heading}
                            style={{
                              padding: 14,
                              color: colors.muted,
                              fontSize: 10,
                              fontWeight: 500,
                              textTransform: "uppercase",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map((app) => (
                        <tr key={app.id}>
                          <td
                            style={{
                              padding: 15,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <div
                              style={{
                                color: colors.brass,
                                fontFamily: "monospace",
                                fontSize: 10,
                              }}
                            >
                              {app.id}
                            </div>

                            <div
                              style={{
                                marginTop: 6,
                                fontWeight: 500,
                              }}
                            >
                              {app.institution}
                            </div>
                          </td>

                          <td
                            style={{
                              padding: 15,
                              borderBottom: `1px solid ${colors.border}`,
                              fontSize: 11,
                            }}
                          >
                            {app.type}
                          </td>

                          <td
                            style={{
                              padding: 15,
                              borderBottom: `1px solid ${colors.border}`,
                              fontSize: 11,
                            }}
                          >
                            {app.date}
                          </td>

                          <td
                            style={{
                              padding: 15,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <StatusBadge status={app.status} />
                          </td>

                          <td
                            style={{
                              padding: 15,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <button
                              onClick={() => openApplication(app)}
                              style={{
                                background: "none",
                                border: "none",
                                color: colors.green,
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                fontSize: 11,
                              }}
                            >
                              Review{" "}
                              <ArrowUpRight
                                size={13}
                                style={{ verticalAlign: "middle" }}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredApplications.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            style={{
                              padding: 30,
                              textAlign: "center",
                              color: colors.muted,
                            }}
                          >
                            No matching applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <p
                  style={{
                    padding: "12px 20px",
                    color: colors.muted,
                    fontSize: 10,
                  }}
                >
                  Fictional records for demonstration · No live AICTE data
                </p>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
