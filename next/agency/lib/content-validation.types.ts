/**
 * Content Validation Types for Enterprise Positioning Refinement
 * 
 * This module defines TypeScript interfaces and types for validating
 * website content against enterprise positioning requirements.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

/**
 * Result of a content validation check
 */
export interface ValidationResult {
  /** Whether the content passes the validation rule */
  passes: boolean;
  /** List of specific violations found in the content */
  violations: string[];
  /** List of suggestions for improving the content */
  suggestions: string[];
}

/**
 * A rule for refining content to meet enterprise positioning standards
 */
export interface ContentRefinementRule {
  /** Unique identifier for the rule */
  name: string;
  /** Function that checks if content meets the rule requirements */
  check: (content: string) => ValidationResult;
  /** Function that suggests improved content based on the rule */
  suggest: (content: string) => string;
}

/**
 * Checklist of enterprise signals that should be present in content
 */
export interface EnterpriseSignalChecklist {
  /** Signals end-to-end ownership capability */
  endToEndOwnership: boolean;
  /** Signals production experience */
  productionExperience: boolean;
  /** Signals technical judgment */
  technicalJudgment: boolean;
  /** Signals calm execution under ambiguity */
  calmExecution: boolean;
  /** Signals selectivity in partnerships */
  selectivity: boolean;
}

/**
 * Content section types that can be validated
 */
export type ContentSection =
  | 'hero'
  | 'selected-work'
  | 'project-card'
  | 'about'
  | 'services'
  | 'reviews'
  | 'contact'
  | 'footer';

/**
 * Priority level for content audit items
 */
export type AuditPriority = 'critical' | 'high' | 'medium' | 'low';

/**
 * Type of change made during content refinement
 */
export type ChangeType = 'shorten' | 'clarify' | 'harden' | 'remove';

/**
 * An item identified during content audit that needs refinement
 */
export interface ContentAuditItem {
  /** The section of the website being audited */
  section: ContentSection;
  /** The specific component within the section */
  component: string;
  /** The current content that needs refinement */
  currentContent: string;
  /** References to requirements this item addresses */
  requirementRefs: string[];
  /** List of rules this content violates */
  violatesRules: string[];
  /** Proposed improved content */
  proposedContent: string;
  /** Priority level for addressing this item */
  priority: AuditPriority;
}

/**
 * Validation report for a specific content section
 */
export interface ContentValidation {
  /** The section being validated */
  section: ContentSection;
  /** Whether the content passes global copy rules */
  passesGlobalRules: boolean;
  /** Whether the content meets section-specific requirements */
  passesSpecificRequirements: boolean;
  /** Enterprise signals detected in the content */
  enterpriseSignals: EnterpriseSignalChecklist;
  /** List of recommendations for improvement */
  recommendations: string[];
}

/**
 * Details of a content refinement operation
 */
export interface CopyRefinement {
  /** Original content before refinement */
  original: string;
  /** Refined content after applying rules */
  refined: string;
  /** Explanation of why the change was made */
  rationale: string;
  /** References to requirements this refinement addresses */
  requirementRefs: string[];
  /** Word count before refinement */
  beforeWordCount: number;
  /** Word count after refinement */
  afterWordCount: number;
  /** Type of change applied */
  changeType: ChangeType;
}

/**
 * Structure for project card content
 */
export interface ProjectCard {
  /** Project title */
  title: string;
  /** Clear statement of what problem this project solves */
  problemStatement: string;
  /** Implied type of organization this serves (not explicit) */
  organizationType: string;
  /** Technical stack used in the project */
  technicalStack: string[];
  /** Detailed project description */
  description: string;
}

/**
 * Emphasis area for review content
 */
export type ReviewEmphasis = 
  | 'professionalism' 
  | 'clarity' 
  | 'delivery' 
  | 'calm_execution';

/**
 * Structure for review/testimonial content
 */
export interface Review {
  /** The client's testimonial quote */
  quote: string;
  /** Client's name */
  clientName: string;
  /** Client's role/title */
  clientRole: string;
  /** What aspect of work this review emphasizes */
  emphasis: ReviewEmphasis;
}

/**
 * Structure for service package content
 */
export interface ServicePackage {
  /** Name of the service package */
  name: string;
  /** Language framing this as a starting point */
  startingPointFraming: string;
  /** Language signaling flexibility in approach */
  flexibilitySignal: string;
  /** Description of how scope is determined */
  scopeApproach: string;
  /** Typical items included in this package */
  typicalIncludes: string[];
}

/**
 * Complete validation report for all website content
 */
export interface ValidationReport {
  /** Timestamp when validation was performed */
  timestamp: Date;
  /** Validation results for each section */
  sectionValidations: ContentValidation[];
  /** Overall pass/fail status */
  overallPass: boolean;
  /** Total number of violations found */
  totalViolations: number;
  /** Total number of recommendations */
  totalRecommendations: number;
  /** Summary of enterprise signals across all content */
  enterpriseSignalsSummary: EnterpriseSignalChecklist;
}
