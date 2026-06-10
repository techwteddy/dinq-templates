/**
 * Content Validation Module
 * 
 * Central export point for all content validation utilities used in
 * enterprise positioning refinement.
 * 
 * This module provides:
 * - Type definitions for validation results and content structures
 * - Forbidden terms detection (terms that should NOT appear)
 * - Required patterns detection (patterns that MUST appear)
 */

// Export types
export type {
  ValidationResult,
  ContentRefinementRule,
  EnterpriseSignalChecklist,
  ContentSection,
  AuditPriority,
  ChangeType,
  ContentAuditItem,
  ContentValidation,
  CopyRefinement,
  ProjectCard,
  ReviewEmphasis,
  Review,
  ServicePackage,
  ValidationReport,
} from '../content-validation.types';

// Export forbidden terms checker
export {
  FORBIDDEN_TERMS,
  UNVERIFIABLE_CLAIM_PATTERNS,
  MARKETING_JARGON_PATTERNS,
  checkForbiddenTerms,
  checkUnverifiableClaims,
  checkMarketingJargon,
  checkAllForbiddenPatterns,
  forbiddenTermsRule,
  unverifiableClaimsRule,
  marketingJargonRule,
  forbiddenPatternRules,
} from './forbidden-terms';

// Export required patterns checker
export {
  FLEXIBILITY_SIGNALS,
  END_TO_END_KEYWORDS,
  PRODUCTION_KEYWORDS,
  TECHNICAL_JUDGMENT_KEYWORDS,
  CALM_EXECUTION_KEYWORDS,
  SELECTIVITY_KEYWORDS,
  RISK_REDUCTION_PHRASES,
  checkFlexibilitySignals,
  checkEnterpriseSignals,
  validateEnterpriseSignals,
  checkRiskReductionLanguage,
  checkRequiredPatterns,
} from './required-patterns';
