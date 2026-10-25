
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  CloudUpload,
  File,
  FileCheck2,
  FileSearch,
  FileText,
  Fingerprint,
  FolderOpen,
  Gauge,
  GraduationCap,
  History,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import "./App.css";

const initialApplications = [
  {
    id: "APP-2026-1001",
    institution: "Eastern Technical Institute",
    category: "Extension of Approval",
    submitted: "22 Oct 2026",
    status: "Missing documents",
    progress: 42,
    documents: 4,
    flags: 3,
  },
  {
    id: "APP-2026-1002",
    institution: "Sunrise Engineering College",
    category: "Extension of Approval",
    submitted: "21 Oct 2026",
    status: "Manual review",
    progress: 76,
    documents: 7,
    flags: 2,
  },
  {
    id: "APP-2026-1003",
    institution: "Coastal Institute of Technology",
    category: "New programme",
    submitted: "20 Oct 2026",
    status: "Pending verification",
    progress: 58,
    documents: 5,
    flags: 1,
  },
  {
    id: "APP-2026-1004",
    institution: "Greenfield Technical College",
    category: "Extension of Approval",
    submitted: "19 Oct 2026",
    status: "Checks complete",
    progress: 100,
    documents: 8,
    flags: 0,
  },
];

const initialDocuments = [
  {
    id: "DOC-001",
    name: "Institution_Approval_Letter.pdf",
    type: "Approval letter",
    date: "22 Oct 2026",
    status: "Review required",
    application: "APP-2026-1002",
    size: "1.8 MB",
  },
  {
    id: "DOC-002",
    name: "Infrastructure_Report.pdf",
    type: "Infrastructure report",
    date: "22 Oct 2026",
    status: "Checks complete",
    application: "APP-2026-1002",
    size: "2.4 MB",
  },
  {
    id: "DOC-003",
    name: "Faculty_Declaration.pdf",
    type: "Faculty declaration",
    date: "21 Oct 2026",
    status: "Pending review",
    application: "APP-2026-1002",
    size: "950 KB",
  },
];

const initialFindings = [
  {
    id: "F-001",
    severity: "Review",
    title: "Institution identifier mismatch",
    detail:
      "The identifier shown in the extracted document differs from the illustrative reference record.",
    extracted: "INST-2086",
    reference: "INST-2068",
    source: "Institution registry · Demo record",
    recommendation:
      "Confirm the identifier against an authorized source before recording a conclusion.",
  },
  {
    id: "F-002",
    severity: "Attention",
    title: "Issuing authority not confirmed",
    detail:
      "No live connection to the issuing authority is configured in this prototype.",
    extracted: "Not verified",
    reference: "Source unavailable",
    source: "External source check",
    recommendation:
      "Use the official issuing-source verification process where authorized.",
  },
];

const navItems = [
  { id: "Overview", label: "Overview", icon: LayoutDashboard },
  { id: "Applications", label: "Applications", icon: FolderOpen },
  { id: "Workspace", label: "Verification workspace", icon: FileSearch },
  { id: "Intake", label: "Document intake", icon: CloudUpload },
  { id: "Activity", label: "Verification log", icon: History },
];

const statusStyles = {
  "Missing documents": "amber",
  "Manual review": "blue",
  "Pending verification": "slate",
  "Checks complete": "green",
  "Review required": "amber",
  "Pending review": "blue",
};

function StatusBadge({ status }) {
  const tone = statusStyles[status] || "slate";
  return <span className={`status-badge ${tone}`}>{status}</span>;
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

function MetricCard({ label, value, note, icon: Icon, tone = "green" }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="metric-value">{value}</div>
      <p className="metric-note">{note}</p>
    </div>
  );
}

function EmptyState({ icon: Icon = FileText, title, description }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={23} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [applications, setApplications] = useState(initialApplications);
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedApplication, setSelectedApplication] = useState(
    initialApplications[1]
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState("DOC-001");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [category, setCategory] = useState("Approval letter");
  const [reviewNote, setReviewNote] = useState("");
  const [toast, setToast] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [reviewDecisions, setReviewDecisions] = useState({});
  const fileInputRef = useRef(null);

  const selectedDocument =
    documents.find((document) => document.id === selectedDocumentId) ||
    documents[0];

  const filteredApplications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.id.toLowerCase().includes(query) ||
        application.institution.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All statuses" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const logItems = useMemo(
    () =>
      Object.entries(reviewDecisions).map(([documentId, decision]) => {
        const doc = documents.find((item) => item.id === documentId);
        return {
          id: `LOG-${documentId}`,
          document: doc?.name || documentId,
          decision: decision.decision,
          note: decision.note,
          time: decision.time,
        };
      }),
    [reviewDecisions, documents]
  );

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function openApplication(application) {
    setSelectedApplication(application);
    setActivePage("Workspace");
    const relatedDocument = documents.find(
      (document) => document.application === application.id
    );
    if (relatedDocument) setSelectedDocumentId(relatedDocument.id);
  }

  function goTo(page) {
    setActivePage(page);
    setMobileNavOpen(false);
  }

  function updateDocumentStatus(documentId, status) {
    setDocuments((current) =>
      current.map((document) =>
        document.id === documentId ? { ...document, status } : document
      )
    );
  }

  function saveDecision(decision) {
    if (!selectedDocument) {
      notify("Select a document first.");
      return;
    }

    const entry = {
      decision,
      note: reviewNote.trim(),
      time: new Date().toLocaleString(),
    };

    setReviewDecisions((current) => ({
      ...current,
      [selectedDocument.id]: entry,
    }));

    if (decision === "Checks complete") {
      updateDocumentStatus(selectedDocument.id, "Checks complete");
    } else {
      updateDocumentStatus(selectedDocument.id, "Review required");
    }

    setReviewNote("");
    notify(`Demo review recorded: ${decision}`);
  }

  function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const queued = files.map((file, index) => ({
      id: `UPLOAD-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: category,
      status: "Ready for demo intake",
      application: selectedApplication.id,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    setUploadQueue((current) => [...current, ...queued]);
    notify(`${files.length} file${files.length > 1 ? "s" : ""} added to the demo queue.`);
    event.target.value = "";
  }

  function processUploadQueue() {
    if (!uploadQueue.length) {
      notify("Choose a file before adding it to the intake queue.");
      return;
    }

    const newDocuments = uploadQueue.map((item, index) => ({
      ...item,
      id: `DOC-${String(documents.length + index + 1).padStart(3, "0")}`,
      status: "Pending review",
    }));

    setDocuments((current) => [...newDocuments, ...current]);
    setUploadQueue([]);
    setSelectedDocumentId(newDocuments[0].id);
    setActivePage("Workspace");
    notify("Files added to the prototype document register.");
  }

  function downloadDemoReport() {
    const report = {
      product: "DocuLens",
      reportType: "Illustrative preliminary review report",
      generatedAt: new Date().toISOString(),
      application: selectedApplication,
      document: selectedDocument,
      findings: initialFindings,
      reviewerDecision:
        reviewDecisions[selectedDocument?.id]?.decision || "Not recorded",
      reviewerNote: reviewDecisions[selectedDocument?.id]?.note || "",
      disclaimer:
        "Synthetic demo data only. This report is not a regulatory decision and does not establish authenticity, fraud, or non-compliance.",
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedApplication.id}-demo-review.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify("Demo review report downloaded.");
  }

  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={22} strokeWidth={2.1} />
          </div>
          <div>
            <div className="brand-name">DocuLens</div>
            <div className="brand-subtitle">DOCUMENT INTELLIGENCE</div>
          </div>
          <button
            className="icon-button mobile-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? "active" : ""}`}
              onClick={() => goTo(id)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {id === "Activity" && logItems.length > 0 && (
                <span className="nav-count">{logItems.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-assurance">
          <div className="assurance-icon">
            <Shield size={17} />
          </div>
          <div>
            <strong>Human-led review</strong>
            <p>AI assists. Reviewers decide.</p>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">DR</div>
          <div className="user-meta">
            <strong>Demo Reviewer</strong>
            <span>Review officer</span>
          </div>
          <MoreHorizontal size={19} className="muted-icon" />
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <span>DocuLens</span>
              <ChevronRight size={14} />
              <strong>{activePage}</strong>
            </div>
          </div>
          <div className="topbar-right">
            <span className="environment-pill">
              <span className="environment-dot" />
              DEMO ENVIRONMENT
            </span>
            <button
              className="icon-button notification-button"
              onClick={() => notify("No new notifications in this demo.")}
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span />
            </button>
          </div>
        </header>

        <div className="page-content">
          {activePage === "Overview" && (
            <OverviewPage
              applications={applications}
              documents={documents}
              onOpenApplication={openApplication}
              onGo={goTo}
            />
          )}

          {activePage === "Applications" && (
            <ApplicationsPage
              applications={filteredApplications}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onOpenApplication={openApplication}
              onAddApplication={() =>
                notify("Application creation is not connected in this prototype.")
              }
            />
          )}

          {activePage === "Workspace" && (
            <WorkspacePage
              applications={applications}
              selectedApplication={selectedApplication}
              setSelectedApplication={setSelectedApplication}
              documents={documents}
              selectedDocument={selectedDocument}
              selectedDocumentId={selectedDocumentId}
              setSelectedDocumentId={setSelectedDocumentId}
              reviewNote={reviewNote}
              setReviewNote={setReviewNote}
              reviewDecisions={reviewDecisions}
              onSaveDecision={saveDecision}
              onDownloadReport={downloadDemoReport}
              onGoToIntake={() => goTo("Intake")}
              onNotify={notify}
            />
          )}

          {activePage === "Intake" && (
            <IntakePage
              documents={documents}
              applications={applications}
              selectedApplication={selectedApplication}
              setSelectedApplication={setSelectedApplication}
              category={category}
              setCategory={setCategory}
              uploadQueue={uploadQueue}
              fileInputRef={fileInputRef}
              onFiles={handleFiles}
              onRemoveQueued={(id) =>
                setUploadQueue((current) => current.filter((item) => item.id !== id))
              }
              onProcess={processUploadQueue}
              onBrowse={() => fileInputRef.current?.click()}
            />
          )}

          {activePage === "Activity" && (
            <ActivityPage logItems={logItems} documents={documents} />
          )}
        </div>

        <footer className="app-footer">
          <span>DocuLens · Preliminary document review</span>
          <span>
            <ShieldCheck size={13} /> Demo mode · No live authority integrations
          </span>
        </footer>
      </main>

      {toast && (
        <div className="toast-message" role="status">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function OverviewPage({ applications, documents, onOpenApplication, onGo }) {
  const pending = applications.filter(
    (app) => app.status !== "Checks complete"
  ).length;
  const flagged = applications.reduce((sum, app) => sum + app.flags, 0);
  const complete = applications.filter(
    (app) => app.status === "Checks complete"
  ).length;

  return (
    <>
      <SectionHeading
        eyebrow="MONITORING OVERVIEW"
        title="Good morning, reviewer."
        description="A clear view of application readiness and preliminary verification activity."
        action={
          <button className="primary-button" onClick={() => onGo("Intake")}>
            <Plus size={16} /> New document intake
          </button>
        }
      />

      <div className="notice-banner">
        <div className="notice-symbol">
          <ShieldCheck size={20} />
        </div>
        <div>
          <strong>Preliminary review workspace</strong>
          <p>
            Automated indicators support review; they do not determine approval,
            authenticity, or regulatory compliance.
          </p>
        </div>
        <span className="demo-tag">SYNTHETIC DATA</span>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="Total applications"
          value={applications.length.toString().padStart(2, "0")}
          note="Across demo application categories"
          icon={FolderOpen}
          tone="green"
        />
        <MetricCard
          label="Awaiting review"
          value={pending.toString().padStart(2, "0")}
          note="Require reviewer attention"
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Review indicators"
          value={flagged.toString().padStart(2, "0")}
          note="Preliminary flags, not conclusions"
          icon={AlertCircle}
          tone="blue"
        />
        <MetricCard
          label="Checks complete"
          value={complete.toString().padStart(2, "0")}
          note="Demo checks marked complete"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      <div className="content-grid overview-grid">
        <section className="panel application-panel">
          <div className="panel-header">
            <div>
              <h2>Application register</h2>
              <p>Recent submissions and their current review state</p>
            </div>
            <button className="text-button" onClick={() => onGo("Applications")}>
              View all <ArrowRight size={15} />
            </button>
          </div>
          <div className="application-list">
            {applications.slice(0, 4).map((app) => (
              <button
                key={app.id}
                className="application-row"
                onClick={() => onOpenApplication(app)}
              >
                <div className="institution-icon">
                  <GraduationCap size={19} />
                </div>
                <div className="application-main">
                  <strong>{app.institution}</strong>
                  <span>
                    {app.id} <span className="bullet">·</span> {app.submitted}
                  </span>
                </div>
                <div className="application-row-end">
                  <StatusBadge status={app.status} />
                  <ChevronRight size={16} className="muted-icon" />
                </div>
              </button>
            ))}
          </div>
          <div className="panel-footer">
            <span>Showing {Math.min(4, applications.length)} demo applications</span>
            <button className="text-button" onClick={() => onGo("Applications")}>
              Open register <ArrowRight size={14} />
            </button>
          </div>
        </section>

        <section className="panel readiness-panel">
          <div className="panel-header">
            <div>
              <h2>Review readiness</h2>
              <p>Current application-level check progress</p>
            </div>
            <Gauge size={18} className="muted-icon" />
          </div>
          <div className="readiness-total">
            <div>
              <span>Average completion</span>
              <strong>
                {applications.length
                  ? Math.round(
                      applications.reduce((sum, app) => sum + app.progress, 0) /
                        applications.length
                    )
                  : 0}
                %
              </strong>
            </div>
            <span className="readiness-caption">Illustrative only</span>
          </div>
          <div className="readiness-bar">
            <span
              style={{
                width: `${
                  applications.length
                    ? applications.reduce((sum, app) => sum + app.progress, 0) /
                      applications.length
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="readiness-legend">
            <div>
              <span className="legend-dot green-dot" /> Complete
              <strong>{applications.filter((a) => a.progress === 100).length}</strong>
            </div>
            <div>
              <span className="legend-dot amber-dot" /> In progress
              <strong>{applications.filter((a) => a.progress < 100).length}</strong>
            </div>
          </div>
          <div className="mini-divider" />
          <div className="quick-action">
            <div className="quick-action-icon">
              <FileSearch size={19} />
            </div>
            <div>
              <strong>Open verification workspace</strong>
              <p>Inspect document fields and review flags.</p>
            </div>
            <button
              className="round-arrow"
              onClick={() => onOpenApplication(applications[1] || applications[0])}
              aria-label="Open workspace"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>

      <section className="panel documents-panel">
        <div className="panel-header">
          <div>
            <h2>Recent document activity</h2>
            <p>Documents currently in the demo register</p>
          </div>
          <button className="text-button" onClick={() => onGo("Workspace")}>
            Open workspace <ArrowRight size={15} />
          </button>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Document type</th>
                <th>Last updated</th>
                <th>Review status</th>
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 4).map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="file-cell">
                      <span className="file-type-icon">
                        <FileText size={17} />
                      </span>
                      <div>
                        <strong>{doc.name}</strong>
                        <span>{doc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{doc.type}</td>
                  <td>{doc.date}</td>
                  <td>
                    <StatusBadge status={doc.status} />
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={4}>No documents have been added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ApplicationsPage({
  applications,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onOpenApplication,
  onAddApplication,
}) {
  return (
    <>
      <SectionHeading
        eyebrow="APPLICATION MANAGEMENT"
        title="Application register"
        description="Review submissions, track readiness, and open an application workspace."
        action={
          <button className="primary-button" onClick={onAddApplication}>
            <Plus size={16} /> New application
          </button>
        }
      />

      <section className="panel register-panel">
        <div className="register-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search institution or application ID"
              aria-label="Search applications"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="filter-field">
            <SlidersHorizontal size={15} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option>All statuses</option>
              <option>Missing documents</option>
              <option>Manual review</option>
              <option>Pending verification</option>
              <option>Checks complete</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="register-summary">
          <span>
            <strong>{applications.length}</strong> applications found
          </span>
          <span className="demo-tag">ILLUSTRATIVE RECORDS</span>
        </div>

        <div className="table-scroll">
          <table className="data-table applications-table">
            <thead>
              <tr>
                <th>Institution / Application</th>
                <th>Category</th>
                <th>Submitted</th>
                <th>Documents</th>
                <th>Readiness</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="institution-cell">
                      <span className="institution-icon">
                        <GraduationCap size={18} />
                      </span>
                      <div>
                        <strong>{app.institution}</strong>
                        <span>{app.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{app.category}</td>
                  <td>{app.submitted}</td>
                  <td>{app.documents}</td>
                  <td>
                    <div className="table-progress">
                      <div className="readiness-bar">
                        <span style={{ width: `${app.progress}%` }} />
                      </div>
                      <span>{app.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                  <td>
                    <button
                      className="small-outline-button"
                      onClick={() => onOpenApplication(app)}
                    >
                      Review <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!applications.length && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={Search}
                      title="No applications found"
                      description="Try a different search term or status filter."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="inline-disclaimer">
        <ShieldCheck size={16} />
        All institution names and application records shown here are fictional demo data.
      </div>
    </>
  );
}

function WorkspacePage({
  applications,
  selectedApplication,
  setSelectedApplication,
  documents,
  selectedDocument,
  selectedDocumentId,
  setSelectedDocumentId,
  reviewNote,
  setReviewNote,
  reviewDecisions,
  onSaveDecision,
  onDownloadReport,
  onGoToIntake,
  onNotify,
}) {
  const applicationDocuments = documents.filter(
    (doc) => doc.application === selectedApplication?.id
  );
  const currentDecision = selectedDocument
    ? reviewDecisions[selectedDocument.id]
    : null;

  return (
    <>
      <div className="workspace-back-row">
        <button
          className="back-button"
          onClick={() => onNotify("Use the application register to choose another case.")}
        >
          <ArrowLeft size={15} /> Review workspace
        </button>
        <span className="case-reference">{selectedApplication?.id}</span>
      </div>

      <SectionHeading
        eyebrow="DOCUMENT REVIEW"
        title="Verification workspace"
        description="Inspect extracted information, compare reference values, and record a human-led review."
        action={
          <button className="outline-button" onClick={onDownloadReport}>
            <ArrowDownToLine size={16} /> Export demo report
          </button>
        }
      />

      <div className="workspace-case-header">
        <div className="case-institution-mark">
          <GraduationCap size={25} />
        </div>
        <div className="case-title-block">
          <h2>{selectedApplication?.institution || "Select an application"}</h2>
          <p>
            {selectedApplication?.category} <span className="bullet">·</span>{" "}
            Submitted {selectedApplication?.submitted}
          </p>
        </div>
        <div className="case-status-block">
          <span className="field-label">APPLICATION STATUS</span>
          <StatusBadge status={selectedApplication?.status || "Pending verification"} />
        </div>
      </div>

      <div className="workspace-selectors">
        <label className="selector-group">
          <span>Application</span>
          <select
            value={selectedApplication?.id || ""}
            onChange={(event) => {
              const app = applications.find((item) => item.id === event.target.value);
              if (app) {
                setSelectedApplication(app);
                const firstDoc = documents.find(
                  (doc) => doc.application === app.id
                );
                if (firstDoc) setSelectedDocumentId(firstDoc.id);
              }
            }}
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.id} — {app.institution}
              </option>
            ))}
          </select>
        </label>
        <label className="selector-group">
          <span>Document under review</span>
          <select
            value={selectedDocumentId}
            onChange={(event) => setSelectedDocumentId(event.target.value)}
          >
            {applicationDocuments.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
            {applicationDocuments.length === 0 && (
              <option value="">No documents for this application</option>
            )}
          </select>
        </label>
        <button className="outline-button add-document-button" onClick={onGoToIntake}>
          <Plus size={15} /> Add document
        </button>
      </div>

      {!selectedDocument ? (
        <section className="panel">
          <EmptyState
            icon={FileSearch}
            title="No document selected"
            description="Add a document through Document intake, then return here to review it."
          />
          <div className="center-action">
            <button className="primary-button" onClick={onGoToIntake}>
              <CloudUpload size={16} /> Open document intake
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="workspace-main-grid">
            <section className="panel document-preview-panel">
              <div className="panel-header">
                <div>
                  <h2>Document preview</h2>
                  <p>Selected file and intake details</p>
                </div>
                <button
                  className="icon-button"
                  onClick={() => onNotify("Preview refresh is a demo action.")}
                  aria-label="Refresh preview"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              <div className="document-preview">
                <div className="preview-topline">
                  <span className="preview-doc-chip">
                    <FileText size={15} /> PDF DOCUMENT
                  </span>
                  <span className="preview-page-count">Preview placeholder</span>
                </div>
                <div className="paper">
                  <div className="paper-seal">
                    <ShieldCheck size={25} />
                  </div>
                  <div className="paper-overline">DEMO DOCUMENT</div>
                  <div className="paper-heading">
                    {selectedDocument.type.toUpperCase()}
                  </div>
                  <div className="paper-rule" />
                  <div className="paper-lines">
                    <span className="paper-line short" />
                    <span className="paper-line" />
                    <span className="paper-line medium" />
                  </div>
                  <div className="paper-section-title">Document details</div>
                  <div className="paper-lines">
                    <span className="paper-line medium" />
                    <span className="paper-line" />
                    <span className="paper-line short" />
                    <span className="paper-line" />
                  </div>
                  <div className="paper-signature">
                    <span />
                    <small>Signature area — not validated</small>
                  </div>
                  <div className="paper-footer">ILLUSTRATIVE PREVIEW ONLY</div>
                </div>
                <p className="preview-caption">
                  This is a visual placeholder. The uploaded file is not rendered,
                  OCR-processed, or cryptographically verified in this prototype.
                </p>
              </div>

              <div className="document-meta">
                <div>
                  <span>File name</span>
                  <strong>{selectedDocument.name}</strong>
                </div>
                <div>
                  <span>Document type</span>
                  <strong>{selectedDocument.type}</strong>
                </div>
                <div>
                  <span>File size</span>
                  <strong>{selectedDocument.size || "Not available"}</strong>
                </div>
                <div>
                  <span>Intake date</span>
                  <strong>{selectedDocument.date}</strong>
                </div>
              </div>
            </section>

            <section className="panel extraction-panel">
              <div className="panel-header">
                <div>
                  <h2>Extracted information</h2>
                  <p>Example fields for reviewer comparison</p>
                </div>
                <span className="demo-tag">MOCK OCR</span>
              </div>

              <div className="extraction-alert">
                <AlertCircle size={17} />
                <span>
                  Values below are illustrative. No OCR has been run on the selected file.
                </span>
              </div>

              <div className="extraction-table">
                <div className="extraction-head">
                  <span>FIELD</span>
                  <span>EXTRACTED VALUE</span>
                </div>
                <div className="extraction-row">
                  <span>Institution name</span>
                  <strong>{selectedApplication.institution}</strong>
                  <span className="field-confidence">Demo value</span>
                </div>
                <div className="extraction-row flagged-field">
                  <span>Institution identifier</span>
                  <strong className="flagged-value">
                    {selectedDocument.id === "DOC-001" &&
                    selectedApplication.id === "APP-2026-1002"
                      ? "INST-2086"
                      : "Not extracted"}
                  </strong>
                  <span className="field-confidence attention-text">
                    <AlertCircle size={13} /> Review
                  </span>
                </div>
                <div className="extraction-row">
                  <span>Document category</span>
                  <strong>{selectedDocument.type}</strong>
                  <span className="field-confidence">Demo value</span>
                </div>
                <div className="extraction-row">
                  <span>Issuing authority</span>
                  <strong>Not independently verified</strong>
                  <span className="field-confidence muted-text">Unavailable</span>
                </div>
                <div className="extraction-row">
                  <span>Expiry date</span>
                  <strong>Not extracted</strong>
                  <span className="field-confidence muted-text">Not assessed</span>
                </div>
              </div>

              <div className="panel-subheading">
                <div>
                  <h3>Reference comparison</h3>
                  <p>Illustrative registry value</p>
                </div>
                <span className="reference-chip">
                  <Fingerprint size={14} /> DEMO SOURCE
                </span>
              </div>

              <div className="comparison-card">
                <div className="comparison-value">
                  <span>Extracted identifier</span>
                  <strong>
                    {selectedDocument.id === "DOC-001" &&
                    selectedApplication.id === "APP-2026-1002"
                      ? "INST-2086"
                      : "Unavailable"}
                  </strong>
                </div>
                <div className="comparison-divider">
                  <ArrowRight size={16} />
                </div>
                <div className="comparison-value">
                  <span>Reference identifier</span>
                  <strong>
                    {selectedDocument.id === "DOC-001" &&
                    selectedApplication.id === "APP-2026-1002"
                      ? "INST-2068"
                      : "Unavailable"}
                  </strong>
                </div>
              </div>

              <div className="comparison-note">
                <AlertCircle size={16} />
                <p>
                  {selectedDocument.id === "DOC-001" &&
                  selectedApplication.id === "APP-2026-1002"
                    ? "The example values differ. This is a discrepancy to review, not evidence of forgery or non-compliance."
                    : "No comparison has been configured for this document. An unavailable result is not a failed verification."}
                </p>
              </div>
            </section>
          </div>

          <section className="panel findings-panel">
            <div className="panel-header">
              <div>
                <h2>Preliminary findings</h2>
                <p>Potential issues that may require human attention</p>
              </div>
              <span className="findings-count">
                <AlertCircle size={14} /> 2 demo indicators
              </span>
            </div>

            <div className="findings-list">
              {initialFindings.map((finding, index) => (
                <div className="finding-row" key={finding.id}>
                  <span className={`finding-number ${index === 0 ? "amber" : "slate"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="finding-content">
                    <div className="finding-title-line">
                      <h3>{finding.title}</h3>
                      <span
                        className={`finding-label ${
                          finding.severity === "Review" ? "amber" : "slate"
                        }`}
                      >
                        {finding.severity}
                      </span>
                    </div>
                    <p>{finding.detail}</p>
                    <span className="finding-source">
                      Source: {finding.source}
                    </span>
                    <div className="finding-recommendation">
                      <CheckCircle2 size={14} />
                      {finding.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel reviewer-panel">
            <div className="panel-header">
              <div>
                <h2>Reviewer assessment</h2>
                <p>Record your assessment of this document's preliminary indicators.</p>
              </div>
              <span className="human-review-tag">
                <UserRound size={14} /> HUMAN REVIEW
              </span>
            </div>

            {currentDecision && (
              <div className="previous-decision">
                <CheckCircle2 size={16} />
                <div>
                  <strong>Latest demo decision: {currentDecision.decision}</strong>
                  <span>{currentDecision.time}</span>
                  {currentDecision.note && <p>{currentDecision.note}</p>}
                </div>
              </div>
            )}

            <label className="review-note-label" htmlFor="review-note">
              Review notes <span>Optional</span>
            </label>
            <textarea
              id="review-note"
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
              placeholder="Record the discrepancy reviewed, evidence consulted, or next step required..."
              rows={3}
            />

            <div className="review-actions">
              <p>
                <ShieldCheck size={14} />
                Demo decisions are stored in this browser session only.
              </p>
              <div className="review-action-buttons">
                <button
                  className="outline-button"
                  onClick={() => onSaveDecision("Further evidence required")}
                >
                  <AlertCircle size={15} /> Request evidence
                </button>
                <button
                  className="primary-button"
                  onClick={() => onSaveDecision("Checks complete")}
                >
                  <Check size={16} /> Mark checks complete
                </button>
              </div>
            </div>
          </section>

          <div className="inline-disclaimer">
            <ShieldCheck size={16} />
            Completing checks does not mean the application is approved. Final regulatory
            decisions remain with the authorized authority.
          </div>
        </>
      )}
    </>
  );
}

function IntakePage({
  documents,
  applications,
  selectedApplication,
  setSelectedApplication,
  category,
  setCategory,
  uploadQueue,
  fileInputRef,
  onFiles,
  onRemoveQueued,
  onProcess,
  onBrowse,
}) {
  return (
    <>
      <SectionHeading
        eyebrow="DOCUMENT INTAKE"
        title="Add documents for review"
        description="Organize incoming files and add them to the demo document register."
      />

      <div className="intake-layout">
        <div className="intake-main-column">
          <section className="panel intake-panel">
            <div className="panel-header">
              <div>
                <h2>Upload documents</h2>
                <p>Select local files to add to the prototype intake queue.</p>
              </div>
              <span className="step-indicator">STEP 01 / 02</span>
            </div>

            <button className="upload-dropzone" onClick={onBrowse}>
              <span className="upload-symbol">
                <CloudUpload size={26} />
              </span>
              <strong>Choose documents from your device</strong>
              <span>Click to select one or more files</span>
              <span className="upload-format-note">
                File types depend on your selection; files remain unprocessed by AI in this demo.
              </span>
            </button>

            <input
              ref={fileInputRef}
              className="hidden-file-input"
              type="file"
              multiple
              onChange={onFiles}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            />

            <div className="intake-fields">
              <label className="selector-group">
                <span>Application</span>
                <select
                  value={selectedApplication.id}
                  onChange={(event) => {
                    const app = applications.find(
                      (item) => item.id === event.target.value
                    );
                    if (app) setSelectedApplication(app);
                  }}
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.id} — {app.institution}
                    </option>
                  ))}
                </select>
              </label>
              <label className="selector-group">
                <span>Document category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option>Approval letter</option>
                  <option>Infrastructure report</option>
                  <option>Faculty declaration</option>
                  <option>Land or building document</option>
                  <option>Financial statement</option>
                  <option>Affidavit or undertaking</option>
                  <option>Other supporting document</option>
                </select>
              </label>
            </div>
          </section>

          <section className="panel queue-panel">
            <div className="panel-header">
              <div>
                <h2>Intake queue</h2>
                <p>
                  {uploadQueue.length} file{uploadQueue.length === 1 ? "" : "s"} ready
                  to add
                </p>
              </div>
              <span className="step-indicator">STEP 02 / 02</span>
            </div>

            {uploadQueue.length ? (
              <div className="queue-list">
                {uploadQueue.map((file) => (
                  <div className="queue-item" key={file.id}>
                    <span className="file-type-icon">
                      <FileText size={18} />
                    </span>
                    <div className="queue-file-details">
                      <strong>{file.name}</strong>
                      <span>
                        {file.size} <span className="bullet">·</span> {file.type}
                      </span>
                    </div>
                    <button
                      className="icon-button"
                      onClick={() => onRemoveQueued(file.id)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={File}
                title="Your queue is empty"
                description="Choose files above to prepare a demo intake."
              />
            )}

            <div className="queue-footer">
              <p>Files will be listed in the app only. No OCR or external verification runs.</p>
              <button
                className="primary-button"
                disabled={!uploadQueue.length}
                onClick={onProcess}
              >
                <Plus size={16} /> Add to register
              </button>
            </div>
          </section>
        </div>

        <aside className="intake-side-column">
          <section className="panel checklist-panel">
            <div className="panel-header">
              <div>
                <h2>Intake checklist</h2>
                <p>Before starting review</p>
              </div>
              <ClipboardCheck size={18} className="muted-icon" />
            </div>
            <div className="checklist-items">
              <div>
                <CheckCircle2 size={17} />
                <span>Choose the correct application</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Select the closest document category</span>
              </div>
              <div>
                <Clock3 size={17} />
                <span>Confirm document legibility during manual review</span>
              </div>
              <div>
                <Clock3 size={17} />
                <span>Check required fields against applicable rules</span>
              </div>
            </div>
          </section>

          <section className="privacy-card">
            <div className="privacy-card-icon">
              <ShieldCheck size={20} />
            </div>
            <h3>Data handling reminder</h3>
            <p>
              For demonstrations, use synthetic or authorized anonymized documents.
              This frontend does not upload files to a server, but production deployment
              needs a reviewed storage and privacy design.
            </p>
          </section>

          <section className="panel register-count-panel">
            <div className="register-count-top">
              <span className="register-count-icon">
                <FileCheck2 size={18} />
              </span>
              <span>Current document register</span>
            </div>
            <strong>{documents.length}</strong>
            <p>Documents currently listed in this session</p>
          </section>
        </aside>
      </div>
    </>
  );
}

function ActivityPage({ logItems, documents }) {
  return (
    <>
      <SectionHeading
        eyebrow="TRACEABILITY"
        title="Verification log"
        description="A session-level view of review actions recorded in this demo."
        action={
          <span className="demo-tag">
            <Activity size={13} /> SESSION ONLY
          </span>
        }
      />

      <div className="notice-banner">
        <div className="notice-symbol">
          <History size={20} />
        </div>
        <div>
          <strong>Prototype activity log</strong>
          <p>
            This log is held in React state and is not persistent or tamper-evident.
            Production audit logging requires a secured backend.
          </p>
        </div>
      </div>

      <div className="metric-grid log-metrics">
        <MetricCard
          label="Documents in register"
          value={String(documents.length).padStart(2, "0")}
          note="Current session"
          icon={FileText}
        />
        <MetricCard
          label="Recorded decisions"
          value={String(logItems.length).padStart(2, "0")}
          note="Reviewer actions in this session"
          icon={ClipboardCheck}
          tone="blue"
        />
        <MetricCard
          label="Live source checks"
          value="00"
          note="No authority connection configured"
          icon={Fingerprint}
          tone="amber"
        />
        <MetricCard
          label="Audit persistence"
          value="Off"
          note="Backend integration pending"
          icon={Shield}
          tone="slate"
        />
      </div>

      <section className="panel activity-panel">
        <div className="panel-header">
          <div>
            <h2>Recorded reviewer actions</h2>
            <p>Most recent decisions recorded in the current session</p>
          </div>
        </div>

        {logItems.length ? (
          <div className="activity-list">
            {logItems.map((item) => (
              <div className="activity-row" key={item.id}>
                <span className="activity-icon">
                  <ClipboardCheck size={18} />
                </span>
                <div className="activity-details">
                  <strong>{item.decision}</strong>
                  <span>{item.document}</span>
                  {item.note && <p>{item.note}</p>}
                </div>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={History}
            title="No review actions yet"
            description="Record an assessment in the verification workspace to see it appear here."
          />
        )}
      </section>

      <div className="inline-disclaimer">
        <AlertCircle size={16} />
        A production audit trail should record user identity, timestamps, document versions,
        source checks, changes, and decision history with appropriate access controls.
      </div>
    </>
  );
}
