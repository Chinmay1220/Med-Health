import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Download,
  Edit3,
  FileCheck2,
  FileText,
  HeartPulse,
  ListChecks,
  LogOut,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { demoCases, generateCareSteps } from './data/demoCases.js';

const patientTabs = [
  { id: 'home', label: 'Home', icon: HeartPulse },
  { id: 'plan', label: 'Care plan', icon: ListChecks },
  { id: 'questions', label: 'Questions', icon: MessageSquareText },
  { id: 'update', label: 'Update doctor', icon: Stethoscope },
];

const doctorTabs = [
  { id: 'review', label: 'Review draft', icon: ShieldCheck },
  { id: 'brief', label: 'Follow-up brief', icon: FileCheck2 },
  { id: 'raw', label: 'Raw note', icon: FileText },
];

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function App() {
  const [role, setRole] = useState(null);
  const [activeCaseId, setActiveCaseId] = useState(demoCases[0].id);
  const activeCase = useMemo(
    () => demoCases.find((item) => item.id === activeCaseId) ?? demoCases[0],
    [activeCaseId],
  );
  const [patientTab, setPatientTab] = useState('home');
  const [doctorTab, setDoctorTab] = useState('review');
  const [carePlan, setCarePlan] = useState(() => cloneData(generateCareSteps(activeCaseId)));
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [followUpDraft, setFollowUpDraft] = useState(() =>
    cloneData(activeCase.followUp.checkIn),
  );
  const [followUpStatus, setFollowUpStatus] = useState('');

  useEffect(() => {
    setCarePlan(cloneData(generateCareSteps(activeCaseId)));
    setFollowUpDraft(cloneData(activeCase.followUp.checkIn));
    setIsEditing(false);
    setIsApproved(false);
    setSelectedQuestions([]);
    setCustomQuestion('');
    setCopyStatus('');
    setCompletedSteps([]);
    setFollowUpStatus('');
    setPatientTab('home');
    setDoctorTab('review');
  }, [activeCaseId]);

  const selectedQuestionText = selectedQuestions.map((index) => carePlan.questions[index]);
  const finalQuestions = [
    ...selectedQuestionText,
    ...(customQuestion.trim() ? [customQuestion.trim()] : []),
  ];
  const questionCard = buildQuestionCard(activeCase, carePlan, finalQuestions);
  const followUpBrief = buildFollowUpBrief(activeCase, followUpDraft);

  function updatePlanField(field, value) {
    setCarePlan((plan) => ({ ...plan, [field]: value }));
  }

  function updateArrayField(field, index, value) {
    setCarePlan((plan) => ({
      ...plan,
      [field]: plan[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }

  function updateNextStep(index, value) {
    setCarePlan((plan) => ({
      ...plan,
      nextSteps: plan.nextSteps.map((item, itemIndex) =>
        itemIndex === index ? { ...item, action: value } : item,
      ),
    }));
  }

  function updateFollowUpField(field, value) {
    setFollowUpStatus('');
    setFollowUpDraft((draft) => ({ ...draft, [field]: value }));
  }

  function toggleCompletedStep(index) {
    setCompletedSteps((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  }

  function toggleQuestion(index) {
    setCopyStatus('');
    setSelectedQuestions((current) => {
      if (current.includes(index)) {
        return current.filter((item) => item !== index);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, index];
    });
  }

  function approveDraft() {
    setIsApproved(true);
    setIsEditing(false);
    setDoctorTab('brief');
  }

  function resetDraft() {
    setCarePlan(cloneData(generateCareSteps(activeCaseId)));
    setIsEditing(false);
    setIsApproved(false);
    setSelectedQuestions([]);
    setCustomQuestion('');
    setCopyStatus('');
  }

  async function copyCard() {
    try {
      await navigator.clipboard.writeText(questionCard);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Select and copy');
    }
  }

  function downloadCard() {
    const blob = new Blob([questionCard], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `caresteps-${activeCase.id}-question-card.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setCopyStatus('Downloaded');
  }

  async function copyFollowUpBrief() {
    try {
      await navigator.clipboard.writeText(followUpBrief);
      setFollowUpStatus('Copied');
    } catch {
      setFollowUpStatus('Select and copy');
    }
  }

  function downloadFollowUpBrief() {
    const blob = new Blob([followUpBrief], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `caresteps-${activeCase.id}-follow-up-brief.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFollowUpStatus('Downloaded');
  }

  function loginAs(nextRole) {
    if (nextRole === 'patient') {
      setActiveCaseId(demoCases[0].id);
    }

    setRole(nextRole);
  }

  if (!role) {
    return <LoginView onLogin={loginAs} />;
  }

  if (role === 'patient') {
    return (
      <PatientPortal
        activeCase={activeCase}
        carePlan={carePlan}
        completedSteps={completedSteps}
        copyStatus={copyStatus}
        customQuestion={customQuestion}
        finalQuestions={finalQuestions}
        followUpDraft={followUpDraft}
        followUpStatus={followUpStatus}
        isApproved={isApproved}
        onCopyCard={copyCard}
        onCustomQuestion={setCustomQuestion}
        onDownloadCard={downloadCard}
        onFollowUpCopy={copyFollowUpBrief}
        onFollowUpDownload={downloadFollowUpBrief}
        onLogout={() => setRole(null)}
        onToggleCompleted={toggleCompletedStep}
        onToggleQuestion={toggleQuestion}
        onUpdateFollowUp={updateFollowUpField}
        questionCard={questionCard}
        selectedQuestions={selectedQuestions}
        setPatientTab={setPatientTab}
        patientTab={patientTab}
      />
    );
  }

  return (
    <DoctorPortal
      activeCase={activeCase}
      activeCaseId={activeCaseId}
      carePlan={carePlan}
      doctorTab={doctorTab}
      followUpBrief={followUpBrief}
      followUpDraft={followUpDraft}
      followUpStatus={followUpStatus}
      isApproved={isApproved}
      isEditing={isEditing}
      onApprove={approveDraft}
      onCopyBrief={copyFollowUpBrief}
      onDownloadBrief={downloadFollowUpBrief}
      onEdit={() => setIsEditing((value) => !value)}
      onLogout={() => setRole(null)}
      onReset={resetDraft}
      onSelectCase={setActiveCaseId}
      setDoctorTab={setDoctorTab}
      updateArrayField={updateArrayField}
      updateNextStep={updateNextStep}
      updatePlanField={updatePlanField}
    />
  );
}

function LoginView({ onLogin }) {
  return (
    <main className="login-shell">
      <section className="login-hero">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">
            <HeartPulse size={24} />
          </span>
          <div>
            <p className="eyebrow">CareSteps</p>
            <h1>Clarity after every visit</h1>
          </div>
        </div>
        <p>
          A patient-first portal that turns after-visit instructions into clear
          next steps, questions, and updates for the care team.
        </p>
        <div className="login-proof">
          <MetricTile icon={<ListChecks size={18} />} label="next steps" value="Clear" />
          <MetricTile icon={<ShieldCheck size={18} />} label="reviewed" value="Safe" />
          <MetricTile icon={<Stethoscope size={18} />} label="doctor brief" value="Ready" />
        </div>
      </section>

      <section className="login-panel" aria-label="Choose login role">
        <p className="section-kicker">Demo login</p>
        <h2>Who is using CareSteps?</h2>
        <div className="role-grid">
          <button className="role-card patient-role" onClick={() => onLogin('patient')} type="button">
            <span aria-hidden="true">
              <UserRound size={28} />
            </span>
            <strong>Patient</strong>
            <small>View my care plan, pick questions, track tasks, and update my doctor.</small>
            <em>Open patient portal</em>
          </button>
          <button className="role-card doctor-role" onClick={() => onLogin('doctor')} type="button">
            <span aria-hidden="true">
              <UsersRound size={28} />
            </span>
            <strong>Doctor</strong>
            <small>Review the AI draft, approve patient instructions, and read the follow-up brief.</small>
            <em>Open doctor portal</em>
          </button>
        </div>
      </section>
    </main>
  );
}

function PatientPortal({
  activeCase,
  carePlan,
  completedSteps,
  copyStatus,
  customQuestion,
  finalQuestions,
  followUpDraft,
  followUpStatus,
  isApproved,
  onCopyCard,
  onCustomQuestion,
  onDownloadCard,
  onFollowUpCopy,
  onFollowUpDownload,
  onLogout,
  onToggleCompleted,
  onToggleQuestion,
  onUpdateFollowUp,
  patientTab,
  questionCard,
  selectedQuestions,
  setPatientTab,
}) {
  return (
    <div className="portal-shell">
      <PortalHeader
        activeCase={activeCase}
        isApproved={isApproved}
        onLogout={onLogout}
        roleLabel="Patient portal"
      />

      <main className="workspace patient-workspace">
        <PatientProfileCard activeCase={activeCase} />
        <section className="main-panel portal-panel">
          <TabBar activeTab={patientTab} onSelect={setPatientTab} tabs={patientTabs} />

          {patientTab === 'home' && (
            <PatientHome
              activeCase={activeCase}
              carePlan={carePlan}
              completedSteps={completedSteps}
              isApproved={isApproved}
              onGoToPlan={() => setPatientTab('plan')}
              onGoToQuestions={() => setPatientTab('questions')}
              onGoToUpdate={() => setPatientTab('update')}
            />
          )}

          {patientTab === 'plan' && (
            <PatientCarePlan
              carePlan={carePlan}
              completedSteps={completedSteps}
              onToggleCompleted={onToggleCompleted}
            />
          )}

          {patientTab === 'questions' && (
            <PatientQuestions
              activeCase={activeCase}
              carePlan={carePlan}
              copyStatus={copyStatus}
              customQuestion={customQuestion}
              finalQuestions={finalQuestions}
              onCopy={onCopyCard}
              onCustomQuestion={onCustomQuestion}
              onDownload={onDownloadCard}
              onToggleQuestion={onToggleQuestion}
              questionCard={questionCard}
              selectedQuestions={selectedQuestions}
            />
          )}

          {patientTab === 'update' && (
            <PatientUpdateDoctor
              activeCase={activeCase}
              followUpDraft={followUpDraft}
              followUpStatus={followUpStatus}
              onCopy={onFollowUpCopy}
              onDownload={onFollowUpDownload}
              onUpdate={onUpdateFollowUp}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function DoctorPortal({
  activeCase,
  activeCaseId,
  carePlan,
  doctorTab,
  followUpBrief,
  followUpDraft,
  followUpStatus,
  isApproved,
  isEditing,
  onApprove,
  onCopyBrief,
  onDownloadBrief,
  onEdit,
  onLogout,
  onReset,
  onSelectCase,
  setDoctorTab,
  updateArrayField,
  updateNextStep,
  updatePlanField,
}) {
  return (
    <div className="portal-shell doctor-shell">
      <PortalHeader
        activeCase={activeCase}
        isApproved={isApproved}
        onLogout={onLogout}
        roleLabel="Doctor portal"
      />

      <main className="workspace">
        <CaseSidebar
          activeCase={activeCase}
          activeCaseId={activeCaseId}
          onSelectCase={onSelectCase}
        />
        <section className="main-panel portal-panel">
          <TabBar activeTab={doctorTab} onSelect={setDoctorTab} tabs={doctorTabs} />

          {doctorTab === 'review' && (
            <ReviewView
              carePlan={carePlan}
              isEditing={isEditing}
              onApprove={onApprove}
              onEdit={onEdit}
              onReset={onReset}
              updateArrayField={updateArrayField}
              updateNextStep={updateNextStep}
              updatePlanField={updatePlanField}
            />
          )}

          {doctorTab === 'brief' && (
            <DoctorBrief
              activeCase={activeCase}
              briefText={followUpBrief}
              followUpDraft={followUpDraft}
              followUpStatus={followUpStatus}
              onCopy={onCopyBrief}
              onDownload={onDownloadBrief}
            />
          )}

          {doctorTab === 'raw' && (
            <RawNoteView activeCase={activeCase} carePlan={carePlan} />
          )}
        </section>
      </main>
    </div>
  );
}

function PortalHeader({ activeCase, isApproved, onLogout, roleLabel }) {
  return (
    <header className="topbar portal-header">
      <div className="brand-block">
        <span className="brand-mark" aria-hidden="true">
          <HeartPulse size={22} />
        </span>
        <div>
          <p className="eyebrow">CareSteps</p>
          <h1>{roleLabel}</h1>
        </div>
      </div>
      <div className="topbar-actions">
        <div className="approval-pill" data-approved={isApproved}>
          <ShieldCheck size={18} />
          <span>{isApproved ? 'Clinician reviewed' : 'Pending review'}</span>
        </div>
        <div className="approval-pill">
          <CalendarClock size={18} />
          <span>{activeCase.followUp.nextVisit}</span>
        </div>
        <button className="ghost-action" onClick={onLogout} type="button">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}

function CaseSidebar({ activeCase, activeCaseId, onSelectCase }) {
  return (
    <aside className="sidebar" aria-label="Demo cases">
      <div className="sidebar-header">
        <p className="section-kicker">Synthetic patients</p>
        <h2>Choose profile</h2>
      </div>
      <div className="case-list">
        {demoCases.map((demoCase) => (
          <button
            className="case-button"
            data-active={demoCase.id === activeCaseId}
            key={demoCase.id}
            onClick={() => onSelectCase(demoCase.id)}
            type="button"
          >
            <span className="case-icon" aria-hidden="true">
              <UserRound size={18} />
            </span>
            <span className="case-copy">
              <strong>{demoCase.label}</strong>
              <small>{demoCase.context}</small>
              <em>{demoCase.accent}</em>
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="patient-snapshot">
        <p className="section-kicker">Current patient</p>
        <h3>{activeCase.patient}</h3>
        <dl>
          <div>
            <dt>Age</dt>
            <dd>{activeCase.age}</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>{activeCase.accent}</dd>
          </div>
          <div>
            <dt>Next visit</dt>
            <dd>{activeCase.followUp.nextVisit}</dd>
          </div>
        </dl>
        <div className="snapshot-callout">
          <Activity size={18} aria-hidden="true" />
          <p>{activeCase.followUp.clinicianFocus[0]}</p>
        </div>
      </div>
    </aside>
  );
}

function PatientProfileCard({ activeCase }) {
  return (
    <section className="patient-profile-card" aria-label="Patient profile">
      <div className="patient-avatar" aria-hidden="true">
        {getInitials(activeCase.patient)}
      </div>
      <div className="patient-profile-copy">
        <p className="section-kicker">My CareSteps profile</p>
        <h2>{activeCase.patient}</h2>
        <div className="journey-tags">
          <span>Age {activeCase.age}</span>
          <span>{activeCase.accent}</span>
          <span>{activeCase.followUp.nextVisit}</span>
        </div>
      </div>
      <div className="snapshot-callout">
        <Activity size={18} aria-hidden="true" />
        <p>{activeCase.context}</p>
      </div>
    </section>
  );
}

function TabBar({ activeTab, onSelect, tabs }) {
  return (
    <div className="stepper portal-tabs" aria-label="Portal tabs">
      {tabs.map((tab) => {
        const TabIcon = tab.icon;

        return (
          <button
            className="step-button"
            data-active={activeTab === tab.id}
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            type="button"
          >
            <TabIcon size={17} aria-hidden="true" />
            <strong>{tab.label}</strong>
          </button>
        );
      })}
    </div>
  );
}

function PatientHome({
  activeCase,
  carePlan,
  completedSteps,
  isApproved,
  onGoToPlan,
  onGoToQuestions,
  onGoToUpdate,
}) {
  const nextIncompleteStep =
    carePlan.nextSteps.find((_, index) => !completedSteps.includes(index)) ??
    carePlan.nextSteps[0];

  return (
    <div className="patient-layout">
      <section className="patient-hero">
        <div>
          <p className="section-kicker">Welcome, {activeCase.patient}</p>
          <h2>Your visit plan is ready</h2>
          <p>{carePlan.summary}</p>
        </div>
        <div className="hero-side">
          <div className="review-stamp" data-approved={isApproved}>
            <ShieldCheck size={20} />
            <span>{isApproved ? 'Reviewed' : 'Draft preview'}</span>
          </div>
          <div className="hero-stats">
            <span>
              <CalendarClock size={16} />
              {activeCase.followUp.nextVisit}
            </span>
            <span>
              <ListChecks size={16} />
              {completedSteps.length}/{carePlan.nextSteps.length} done
            </span>
          </div>
        </div>
      </section>

      <div className="patient-dashboard-grid">
        <button className="patient-home-card highlight-card" onClick={onGoToPlan} type="button">
          <span>
            <CheckCircle2 size={22} />
          </span>
          <small>Today&apos;s next step</small>
          <strong>{nextIncompleteStep.timeframe}</strong>
          <p>{nextIncompleteStep.action}</p>
        </button>
        <button className="patient-home-card" onClick={onGoToQuestions} type="button">
          <span>
            <MessageSquareText size={22} />
          </span>
          <small>Prepare for next visit</small>
          <strong>Pick your top questions</strong>
          <p>Choose up to 3 questions and create a card to bring to your clinician.</p>
        </button>
        <button className="patient-home-card" onClick={onGoToUpdate} type="button">
          <span>
            <Stethoscope size={22} />
          </span>
          <small>Before your next visit</small>
          <strong>Update your doctor</strong>
          <p>Share symptoms, home readings, completed tasks, and your main concern.</p>
        </button>
      </div>

      <section className="patient-section urgent">
        <h3>When to call for help</h3>
        {carePlan.warningSigns.map((warning) => (
          <div className="warning-row" key={warning}>
            <AlertTriangle size={18} aria-hidden="true" />
            <p>{warning}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function PatientCarePlan({ carePlan, completedSteps, onToggleCompleted }) {
  return (
    <div className="patient-layout">
      <section className="patient-section wide">
        <p className="section-kicker">What changed today</p>
        <h2>Understand the visit</h2>
        <p>{carePlan.changed}</p>
      </section>

      <section className="questions-panel">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">{completedSteps.length}/{carePlan.nextSteps.length} completed</p>
            <h2>My action checklist</h2>
          </div>
          <ListChecks size={22} aria-hidden="true" />
        </div>
        <div className="patient-task-list">
          {carePlan.nextSteps.map((step, index) => {
            const isDone = completedSteps.includes(index);

            return (
              <button
                className="patient-task"
                data-done={isDone}
                key={`${step.timeframe}-${step.action}`}
                onClick={() => onToggleCompleted(index)}
                type="button"
              >
                <span>{isDone ? <Check size={17} /> : index + 1}</span>
                <div>
                  <strong>{step.timeframe}</strong>
                  <p>{step.action}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PatientQuestions({
  activeCase,
  carePlan,
  copyStatus,
  customQuestion,
  finalQuestions,
  onCopy,
  onCustomQuestion,
  onDownload,
  onToggleQuestion,
  questionCard,
  selectedQuestions,
}) {
  return (
    <div className="card-layout">
      <section className="questions-panel">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">{selectedQuestions.length}/3 selected</p>
            <h2>Questions to ask your clinician</h2>
          </div>
          <MessageSquareText size={22} aria-hidden="true" />
        </div>
        <div className="question-grid">
          {carePlan.questions.map((question, index) => {
            const isSelected = selectedQuestions.includes(index);
            const isDisabled = !isSelected && selectedQuestions.length >= 3;
            return (
              <button
                className="question-choice"
                data-selected={isSelected}
                disabled={isDisabled}
                key={question}
                onClick={() => onToggleQuestion(index)}
                type="button"
              >
                <span>{isSelected ? <Check size={16} /> : index + 1}</span>
                {question}
              </button>
            );
          })}
        </div>
        <label className="custom-question">
          <span>Optional custom question</span>
          <input
            value={customQuestion}
            onChange={(event) => onCustomQuestion(event.target.value)}
            placeholder="Add one more question for your clinician"
          />
        </label>
      </section>

      <QuestionCardView
        activeCase={activeCase}
        cardText={questionCard}
        copyStatus={copyStatus}
        finalQuestions={finalQuestions}
        onCopy={onCopy}
        onDownload={onDownload}
      />
    </div>
  );
}

function PatientUpdateDoctor({
  activeCase,
  followUpDraft,
  followUpStatus,
  onCopy,
  onDownload,
  onUpdate,
}) {
  return (
    <FollowUpView
      activeCase={activeCase}
      briefText={buildFollowUpBrief(activeCase, followUpDraft)}
      followUpDraft={followUpDraft}
      followUpStatus={followUpStatus}
      onCopy={onCopy}
      onDownload={onDownload}
      onUpdate={onUpdate}
      patientMode
    />
  );
}

function RawNoteView({ activeCase, carePlan }) {
  return (
    <div className="view-grid">
      <section className="note-panel">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">Clinical source</p>
            <h2>Raw visit note</h2>
          </div>
          <FileText size={22} aria-hidden="true" />
        </div>
        <div className="note-labels">
          <span>Clinical language</span>
          <span>Dense follow-up details</span>
          <span>Patient has to decode it</span>
        </div>
        <pre>{activeCase.clinicalNote}</pre>
      </section>

      <section className="preview-panel">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">CareSteps output</p>
            <h2>Patient-ready translation</h2>
          </div>
          <Sparkles size={22} aria-hidden="true" />
        </div>
        <div className="draft-flow">
          <span>
            <FileText size={17} />
            Note
          </span>
          <ChevronRight size={18} />
          <span>
            <Sparkles size={17} />
            CareSteps
          </span>
          <ChevronRight size={18} />
          <span>
            <ShieldCheck size={17} />
            Reviewed
          </span>
        </div>
        <div className="summary-band">
          <h3>What changed today</h3>
          <p>{carePlan.changed}</p>
        </div>
        <div className="insight-grid">
          <div>
            <strong>{carePlan.nextSteps.length}</strong>
            <span>actions</span>
          </div>
          <div>
            <strong>{carePlan.warningSigns.length}</strong>
            <span>warning groups</span>
          </div>
          <div>
            <strong>{carePlan.questions.length}</strong>
            <span>questions</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewView({
  carePlan,
  isEditing,
  onApprove,
  onEdit,
  onReset,
  updateArrayField,
  updateNextStep,
  updatePlanField,
}) {
  return (
    <div className="review-layout">
      <section className="review-main">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">Human reviewer</p>
            <h2>Approve or edit the AI draft</h2>
          </div>
          <div className="button-row">
            <button className="icon-button" onClick={onEdit} title="Edit draft" type="button">
              <Edit3 size={18} />
              <span>{isEditing ? 'Done editing' : 'Edit'}</span>
            </button>
            <button className="icon-button" onClick={onReset} title="Reset draft" type="button">
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <EditableBlock
          label="Plain-language summary"
          value={carePlan.summary}
          isEditing={isEditing}
          onChange={(value) => updatePlanField('summary', value)}
        />
        <EditableBlock
          label="What changed today"
          value={carePlan.changed}
          isEditing={isEditing}
          onChange={(value) => updatePlanField('changed', value)}
        />

        <div className="review-section">
          <h3>What to do next</h3>
          <div className="action-stack">
            {carePlan.nextSteps.map((step, index) => (
              <div className="action-item" key={`${step.timeframe}-${index}`}>
                <span>{step.timeframe}</span>
                {isEditing ? (
                  <textarea
                    value={step.action}
                    onChange={(event) => updateNextStep(index, event.target.value)}
                    rows={2}
                  />
                ) : (
                  <p>{step.action}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <EditableList
          field="warningSigns"
          icon={<AlertTriangle size={18} />}
          isEditing={isEditing}
          items={carePlan.warningSigns}
          label="When to call for help"
          onChange={updateArrayField}
        />
        <EditableList
          field="questions"
          icon={<ListChecks size={18} />}
          isEditing={isEditing}
          items={carePlan.questions}
          label="Suggested questions"
          onChange={updateArrayField}
        />
      </section>

      <aside className="review-aside">
        <div className="review-note">
          <p className="section-kicker">Reviewer note</p>
          <p>{carePlan.reviewerNote}</p>
        </div>
        <div className="quality-card">
          <p className="section-kicker">Approval checks</p>
          <div>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Medication instructions match the note</span>
          </div>
          <div>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>Follow-up timing is visible</span>
          </div>
          <div>
            <AlertTriangle size={17} aria-hidden="true" />
            <span>Urgent symptoms stay clinician-reviewed</span>
          </div>
        </div>
        <button className="primary-action full-width" onClick={onApprove} type="button">
          <Check size={18} />
          Approve patient view
        </button>
      </aside>
    </div>
  );
}

function QuestionCardView({
  activeCase,
  cardText,
  copyStatus,
  finalQuestions,
  onCopy,
  onDownload,
}) {
  return (
    <section className="question-card">
      <div className="card-header">
        <div>
          <p className="section-kicker">Visit Question Card</p>
          <h2>{activeCase.patient}</h2>
        </div>
        <span className="card-badge">
          <MessageSquareText size={18} aria-hidden="true" />
          {finalQuestions.length} picked
        </span>
      </div>
      <div className="card-meta">
        <span>Age {activeCase.age}</span>
        <span>{activeCase.accent}</span>
        <span>{activeCase.followUp.nextVisit}</span>
      </div>
      {finalQuestions.length > 0 ? (
        <ol>
          {finalQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      ) : (
        <p className="empty-state">No questions selected yet.</p>
      )}
      <textarea className="question-card-copy" readOnly value={cardText} rows={8} />
      <div className="button-row">
        <button className="icon-button" onClick={onCopy} type="button">
          <Copy size={18} />
          <span>Copy</span>
        </button>
        <button className="primary-action compact" onClick={onDownload} type="button">
          <Download size={18} />
          Download
        </button>
      </div>
      {copyStatus && <p className="status-text">{copyStatus}</p>}
    </section>
  );
}

function FollowUpView({
  activeCase,
  briefText,
  followUpDraft,
  followUpStatus,
  onCopy,
  onDownload,
  onUpdate,
  patientMode = false,
}) {
  const fields = [
    {
      id: 'medication',
      label: 'Medication or care plan',
      placeholder: 'Example: I took the new medicine most days, but missed two doses.',
    },
    {
      id: 'symptoms',
      label: 'Symptoms or side effects',
      placeholder: 'Example: I felt dizzy twice and noticed a dry cough.',
    },
    {
      id: 'measurements',
      label: 'Home readings or tracking',
      placeholder: 'Example: My blood pressure was usually around 135/85.',
    },
    {
      id: 'completedTasks',
      label: 'Tasks completed',
      placeholder: 'Example: I completed the blood test and kept a home log.',
    },
    {
      id: 'topConcern',
      label: 'Main concern for next visit',
      placeholder: 'Example: I want to know if the cough could be from the medicine.',
    },
  ];

  return (
    <div className="followup-layout">
      <section className="followup-intake">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">Between visits</p>
            <h2>{patientMode ? 'Update my doctor' : 'Patient check-in'}</h2>
          </div>
          <UserRound size={22} aria-hidden="true" />
        </div>
        <div className="checkin-status">
          <span>
            <CalendarClock size={16} />
            {activeCase.followUp.nextVisit}
          </span>
          <span>
            <FileCheck2 size={16} />
            {fields.length} updates
          </span>
        </div>

        <div className="checkin-fields">
          {fields.map((field) => (
            <label className="checkin-field" key={field.id}>
              <span>{field.label}</span>
              <textarea
                value={followUpDraft[field.id]}
                onChange={(event) => onUpdate?.(field.id, event.target.value)}
                placeholder={field.placeholder}
                readOnly={!onUpdate}
                rows={3}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="followup-brief">
        <div className="panel-title-row">
          <div>
            <p className="section-kicker">Before next visit</p>
            <h2>{patientMode ? 'Preview sent to care team' : 'Doctor-ready brief'}</h2>
          </div>
          <FileText size={22} aria-hidden="true" />
        </div>

        <div className="brief-metrics">
          <MetricTile
            icon={<Activity size={18} />}
            label="patient updates"
            value={fields.length}
          />
          <MetricTile
            icon={<Stethoscope size={18} />}
            label="prep points"
            value={activeCase.followUp.clinicianFocus.length}
          />
        </div>

        <div className="brief-card">
          <div className="brief-heading">
            <div>
              <p className="section-kicker">Care team preview</p>
              <h3>{activeCase.patient}</h3>
            </div>
            <span>{activeCase.followUp.nextVisit}</span>
          </div>

          <BriefLine label="Medication or plan" value={followUpDraft.medication} />
          <BriefLine label="Symptoms or side effects" value={followUpDraft.symptoms} />
          <BriefLine label="Home readings" value={followUpDraft.measurements} />
          <BriefLine label="Completed tasks" value={followUpDraft.completedTasks} />
          <BriefLine label="Patient concern" value={followUpDraft.topConcern} />

          <div className="clinician-focus">
            <h3>Clinician prep</h3>
            {activeCase.followUp.clinicianFocus.map((item) => (
              <div className="mini-row" key={item}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <textarea className="brief-copy-box" readOnly value={briefText} rows={10} />
        <div className="button-row">
          <button className="icon-button" onClick={onCopy} type="button">
            <Copy size={18} />
            <span>Copy brief</span>
          </button>
          <button className="primary-action compact" onClick={onDownload} type="button">
            <Download size={18} />
            Download
          </button>
        </div>
        {followUpStatus && <p className="status-text">{followUpStatus}</p>}
      </section>
    </div>
  );
}

function DoctorBrief({ activeCase, briefText, followUpDraft, followUpStatus, onCopy, onDownload }) {
  return (
    <FollowUpView
      activeCase={activeCase}
      briefText={briefText}
      followUpDraft={followUpDraft}
      followUpStatus={followUpStatus}
      onCopy={onCopy}
      onDownload={onDownload}
    />
  );
}

function MetricTile({ icon, label, value }) {
  return (
    <div className="metric-tile">
      <span aria-hidden="true">{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

function BriefLine({ label, value }) {
  return (
    <div className="brief-line">
      <span>{label}</span>
      <p>{value.trim() || 'No update entered yet.'}</p>
    </div>
  );
}

function EditableBlock({ label, value, isEditing, onChange }) {
  return (
    <div className="review-section">
      <h3>{label}</h3>
      {isEditing ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
}

function EditableList({ field, icon, isEditing, items, label, onChange }) {
  return (
    <div className="review-section">
      <h3>{label}</h3>
      <div className="review-list">
        {items.map((item, index) => (
          <div className="review-list-row" key={`${field}-${index}`}>
            <span aria-hidden="true">{icon}</span>
            {isEditing ? (
              <textarea
                value={item}
                onChange={(event) => onChange(field, index, event.target.value)}
                rows={2}
              />
            ) : (
              <p>{item}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function buildQuestionCard(activeCase, carePlan, questions) {
  const questionLines = questions.length
    ? questions.map((question, index) => `${index + 1}. ${question}`).join('\n')
    : 'No questions selected yet.';

  return `CareSteps Visit Question Card
Patient: ${activeCase.patient}, age ${activeCase.age}
Focus: ${activeCase.accent}

What changed today:
${carePlan.changed}

Questions to ask:
${questionLines}`;
}

function buildFollowUpBrief(activeCase, followUpDraft) {
  const focusLines = activeCase.followUp.clinicianFocus
    .map((item, index) => `${index + 1}. ${item}`)
    .join('\n');

  return `CareSteps Follow-Up Brief
Patient: ${activeCase.patient}, age ${activeCase.age}
Next visit: ${activeCase.followUp.nextVisit}
Focus: ${activeCase.accent}

Patient-reported updates since last visit:
Medication or care plan:
${briefValue(followUpDraft.medication)}

Symptoms or side effects:
${briefValue(followUpDraft.symptoms)}

Home readings or tracking:
${briefValue(followUpDraft.measurements)}

Tasks completed:
${briefValue(followUpDraft.completedTasks)}

Main concern:
${briefValue(followUpDraft.topConcern)}

Clinician prep:
${focusLines}`;
}

function briefValue(value) {
  return value.trim() || 'No update entered yet.';
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .replace('.', '')
    .slice(0, 2)
    .toUpperCase();
}

export default App;
