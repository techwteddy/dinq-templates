/**
 * Required Language Pattern Checker
 * 
 * Utilities to detect REQUIRED language patterns that must be present
 * in website content for enterprise positioning.
 * 
 * Requirements: 5.1, 5.2, 5.4, 7.3, 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { ValidationResult, EnterpriseSignalChecklist } from '../content-validation.types';

/**
 * Flexibility signal phrases that should appear in service content
 * Requirements: 5.1, 5.2, 5.4
 */
export const FLEXIBILITY_SIGNALS = [
  'typical engagement',
  'starting from',
  'scoped collaboratively',
  'adjusted based on complexity',
] as const;

/**
 * Keywords indicating end-to-end ownership capability
 * Requirement: 10.1
 */
export const END_TO_END_KEYWORDS = [
  'end-to-end',
  'end to end',
  'complete',
  'full-stack',
  'full stack',
] as const;

/**
 * Keywords indicating production experience
 * Requirement: 10.2
 */
export const PRODUCTION_KEYWORDS = [
  'production',
  'production-ready',
  'production ready',
  'systems',
  'reliable',
] as const;

/**
 * Keywords indicating technical judgment
 * Requirement: 10.3
 */
export const TECHNICAL_JUDGMENT_KEYWORDS = [
  'judgment',
  'judgement',
  'thoughtful',
  'considered',
] as const;

/**
 * Keywords indicating calm execution
 * Requirement: 10.4
 */
export const CALM_EXECUTION_KEYWORDS = [
  'calm',
  'steady',
  'measured',
] as const;

/**
 * Keywords indicating selectivity in partnerships
 * Requirement: 10.5
 */
export const SELECTIVITY_KEYWORDS = [
  'curated',
  'selected',
  'good fit',
  'if it\'s a good fit',
] as const;

/**
 * Risk-reduction phrases that should appear in contact section
 * Requirement: 7.3
 */
export const RISK_REDUCTION_PHRASES = [
  'review your request',
  'if it\'s a good fit',
  'next steps',
  'no pressure',
  'low pressure',
] as const;

/**
 * Checks if service content contains flexibility signals
 * 
 * @param content - The service content to check
 * @returns ValidationResult indicating if flexibility signals are present
 */
export function checkFlexibilitySignals(content: string): ValidationResult {
  const violations: string[] = [];
  const suggestions: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check if at least one flexibility signal is present
  const hasFlexibilitySignal = FLEXIBILITY_SIGNALS.some((signal) =>
    lowerContent.includes(signal.toLowerCase())
  );

  if (!hasFlexibilitySignal) {
    violations.push('Missing flexibility signal in service content');
    suggestions.push(
      'Add at least one flexibility signal: "Typical engagement", "Starting from", "Scoped collaboratively", or "Adjusted based on complexity"'
    );
  }

  // Check for hard promises that contradict flexibility
  const hardPromisePatterns = [
    /guaranteed\s+in\s+\d+\s+(weeks?|months?|days?)/gi,
    /fixed\s+scope/gi,
    /delivered\s+by\s+\d+/gi,
    /\d+\s+(weeks?|months?)\s+guaranteed/gi,
  ];

  hardPromisePatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      violations.push('Contains hard timeline or scope promise that contradicts flexibility');
      suggestions.push('Remove fixed timeline or scope guarantees');
    }
  });

  // Check for price-shopping language
  const priceShoppingPatterns = [
    /\bcheapest\b/gi,
    /\blowest\s+price\b/gi,
    /\bbudget[- ]friendly\b/gi,
    /\baffordable\s+rates?\b/gi,
  ];

  priceShoppingPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      violations.push('Contains price-shopping language');
      suggestions.push('Remove language that attracts price shoppers');
    }
  });

  return {
    passes: violations.length === 0,
    violations,
    suggestions,
  };
}

/**
 * Checks if content contains keywords for a specific enterprise signal
 * 
 * @param content - The content to check
 * @param keywords - Array of keywords to look for
 * @returns boolean indicating if at least one keyword is present
 */
function hasKeywords(content: string, keywords: readonly string[]): boolean {
  const lowerContent = content.toLowerCase();
  return keywords.some((keyword) => lowerContent.includes(keyword.toLowerCase()));
}

/**
 * Checks if content contains all required enterprise signals
 * 
 * @param content - The content to check (can be full site content or section)
 * @returns EnterpriseSignalChecklist with boolean flags for each signal
 */
export function checkEnterpriseSignals(content: string): EnterpriseSignalChecklist {
  return {
    endToEndOwnership: hasKeywords(content, END_TO_END_KEYWORDS),
    productionExperience: hasKeywords(content, PRODUCTION_KEYWORDS),
    technicalJudgment: hasKeywords(content, TECHNICAL_JUDGMENT_KEYWORDS),
    calmExecution: hasKeywords(content, CALM_EXECUTION_KEYWORDS),
    selectivity: hasKeywords(content, SELECTIVITY_KEYWORDS),
  };
}

/**
 * Validates that all enterprise signals are present in content
 * 
 * @param content - The content to check
 * @returns ValidationResult with details about missing signals
 */
export function validateEnterpriseSignals(content: string): ValidationResult {
  const signals = checkEnterpriseSignals(content);
  const violations: string[] = [];
  const suggestions: string[] = [];

  if (!signals.endToEndOwnership) {
    violations.push('Missing end-to-end ownership signal');
    suggestions.push(
      'Add language signaling end-to-end capability: "end-to-end", "complete", "full-stack"'
    );
  }

  if (!signals.productionExperience) {
    violations.push('Missing production experience signal');
    suggestions.push(
      'Add language signaling production experience: "production", "production-ready", "systems", "reliable"'
    );
  }

  if (!signals.technicalJudgment) {
    violations.push('Missing technical judgment signal');
    suggestions.push(
      'Add language signaling technical judgment: "judgment", "thoughtful", "considered"'
    );
  }

  if (!signals.calmExecution) {
    violations.push('Missing calm execution signal');
    suggestions.push(
      'Add language signaling calm execution: "calm", "steady", "measured"'
    );
  }

  if (!signals.selectivity) {
    violations.push('Missing selectivity signal');
    suggestions.push(
      'Add language signaling selectivity: "curated", "selected", "good fit"'
    );
  }

  return {
    passes: violations.length === 0,
    violations,
    suggestions,
  };
}

/**
 * Checks if contact section contains risk-reduction language
 * 
 * @param content - The contact section content to check
 * @returns ValidationResult indicating if risk-reduction language is present
 */
export function checkRiskReductionLanguage(content: string): ValidationResult {
  const violations: string[] = [];
  const suggestions: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check if at least one risk-reduction phrase is present
  const hasRiskReduction = RISK_REDUCTION_PHRASES.some((phrase) =>
    lowerContent.includes(phrase.toLowerCase())
  );

  if (!hasRiskReduction) {
    violations.push('Missing risk-reduction language in contact section');
    suggestions.push(
      'Add language that reduces pressure and signals selectivity, such as: "We\'ll review your request and follow up with next steps if it\'s a good fit."'
    );
  }

  // Check for high-pressure language that contradicts risk reduction
  const highPressurePatterns = [
    /\blimited\s+time\b/gi,
    /\bact\s+now\b/gi,
    /\bdon't\s+miss\s+out\b/gi,
    /\bexclusive\s+offer\b/gi,
    /\bonly\s+\d+\s+spots?\s+left\b/gi,
  ];

  highPressurePatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      violations.push('Contains high-pressure language that contradicts risk reduction');
      suggestions.push('Remove urgency-creating or pressure-inducing language');
    }
  });

  return {
    passes: violations.length === 0,
    violations,
    suggestions,
  };
}

/**
 * Comprehensive check for all required language patterns in a content section
 * 
 * @param content - The content to check
 * @param sectionType - The type of section being checked
 * @returns ValidationResult with all violations and suggestions
 */
export function checkRequiredPatterns(
  content: string,
  sectionType: 'service' | 'contact' | 'full-site'
): ValidationResult {
  const violations: string[] = [];
  const suggestions: string[] = [];

  if (sectionType === 'service') {
    const flexibilityResult = checkFlexibilitySignals(content);
    violations.push(...flexibilityResult.violations);
    suggestions.push(...flexibilityResult.suggestions);
  } else if (sectionType === 'contact') {
    const riskReductionResult = checkRiskReductionLanguage(content);
    violations.push(...riskReductionResult.violations);
    suggestions.push(...riskReductionResult.suggestions);
  } else if (sectionType === 'full-site') {
    const enterpriseResult = validateEnterpriseSignals(content);
    violations.push(...enterpriseResult.violations);
    suggestions.push(...enterpriseResult.suggestions);
  }

  return {
    passes: violations.length === 0,
    violations,
    suggestions,
  };
}
