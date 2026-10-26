"use client";

export type ApplyPhaseId = "deal" | "profile" | "package";

export type ApplySubStep = {
  id: string;
  label: string;
};

export type ApplyPhase = {
  id: ApplyPhaseId;
  label: string;
  estimate?: string;
  subSteps: ApplySubStep[];
};

type Props = {
  phases: ApplyPhase[];
  activePhaseId: ApplyPhaseId;
  activeSubStepId: string;
  onSelectPhase: (phaseId: ApplyPhaseId) => void;
  onSelectSubStep: (phaseId: ApplyPhaseId, subStepId: string) => void;
};

export function ApplyProgress({
  phases,
  activePhaseId,
  activeSubStepId,
  onSelectPhase,
  onSelectSubStep,
}: Props) {
  return (
    <nav aria-label="Application phases" className="space-y-3">
      <ol className="space-y-2">
        {phases.map((phase, index) => {
          const active = phase.id === activePhaseId;
          const phaseIndex = phases.findIndex((p) => p.id === activePhaseId);
          const done = index < phaseIndex;

          if (!active) {
            return (
              <li key={phase.id}>
                <button
                  type="button"
                  onClick={() => onSelectPhase(phase.id)}
                  className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left transition hover:bg-paper"
                >
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold ${
                      done ? "bg-green-soft text-green" : "bg-paper text-steel"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-medium text-charcoal">
                      {phase.label}
                    </span>
                    {phase.estimate ? (
                      <span className="block text-[0.75rem] text-steel">{phase.estimate}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          }

          return (
            <li
              key={phase.id}
              className="rounded-[1.25rem] bg-green-mist/70 px-3 py-3 ring-1 ring-green/15"
            >
              <div className="flex items-center gap-3 px-1">
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-[0.75rem] font-semibold text-white"
                  aria-current="step"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9375rem] font-semibold text-ink">{phase.label}</p>
                  {phase.estimate ? (
                    <p className="text-[0.75rem] text-steel">{phase.estimate}</p>
                  ) : null}
                </div>
              </div>
              <ol className="mt-3 flex flex-wrap gap-2" aria-label={`${phase.label} steps`}>
                {phase.subSteps.map((sub) => {
                  const subActive = sub.id === activeSubStepId;
                  const subIdx = phase.subSteps.findIndex((s) => s.id === activeSubStepId);
                  const thisIdx = phase.subSteps.findIndex((s) => s.id === sub.id);
                  const subDone = thisIdx < subIdx;
                  return (
                    <li key={sub.id}>
                      <button
                        type="button"
                        onClick={() => onSelectSubStep(phase.id, sub.id)}
                        aria-current={subActive ? "step" : undefined}
                        className={`rounded-full px-3 py-1.5 text-[0.8125rem] font-medium transition ${
                          subActive
                            ? "bg-white text-ink shadow-sm ring-1 ring-green/30"
                            : subDone
                              ? "bg-white/70 text-green"
                              : "bg-white/40 text-steel hover:bg-white/80"
                        }`}
                      >
                        {sub.label}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
