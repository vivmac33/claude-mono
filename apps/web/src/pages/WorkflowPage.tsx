// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW PAGE V3
// Full-screen workflow builder page with React Flow canvas
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { WorkflowBuilder } from '@/components/workflow';
import { OnboardingModal, useOnboarding } from '@/components/onboarding';

export default function WorkflowPageV3() {
  const onboarding = useOnboarding();

  return (
    <>
      <WorkflowBuilder />
      <OnboardingModal isOpen={onboarding.isOpen} onClose={onboarding.close} />
    </>
  );
}
