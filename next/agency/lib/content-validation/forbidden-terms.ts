/**
 * Forbidden Terms Checker
 * 
 * Utilities to detect forbidden terms, unverifiable claims, and marketing jargon
 * in website content according to enterprise positioning requirements.
 * 
 * Requirements: 2.2, 2.3, 4.5, 7.2, 8.1, 9.2, 9.4, 11.3
 */

import { ContentRefinementRule, ValidationResult } from '../content-validation.types';

/**
 * List of forbidden terms that should not appear in content
 * Requirements: 4.5, 7.2, 8.1, 9.4
 */
export const FORBIDDEN_TERMS = [
  'empower',
  'uplift',
  'inspire',
  'driven by innovation',
  "let's build something amazing",
] as const;

/**
 * Patterns that indicate unverifiable claims or user counts
 * Requirements: 2.2, 2.3
 */
export const UNVERIFIABLE_CLAIM_PATTERNS = [
  /\d+\s+(users|downloads|customers|clients)/gi,
  /thousands\s+of\s+\w+/gi,
  /millions\s+of\s+\w+/gi,
  /\d+k\+?\s+(users|downloads|customers)/gi,
  /\d+m\+?\s+(users|downloads|customers)/gi,
  /growing\s+user\s+base/gi,
  /rapid\s+adoption/gi,
  /viral\s+growth/gi,
] as const;

/**
 * Marketing jargon and abstract language patterns
 * Requirements: 9.2, 9.4, 11.3
 */
export const MARKETING_JARGON_PATTERNS = [
  /\bsynergy\b/gi,
  /\bleverage\b/gi,
  /\bparadigm\b/gi,
  /\bdisrupt\b/gi,
  /\binnovative\s+solutions?\b/gi,
  /\bcutting[- ]edge\b/gi,
  /\bnext[- ]generation\b/gi,
  /\bworld[- ]class\b/gi,
  /\bgame[- ]changer\b/gi,
  /\bthought\s+leader/gi,
  /\breimag(ine|ining)/gi,
  /\brevolutioniz(e|ing)/gi,
  /\btransform\s+the\s+world/gi,
  /\bempower\s+communities/gi,
  /\bmission[- ]driven\s+organizations/gi,
] as const;

/**
 * Checks if content contains any forbidden terms
 * 
 * @param content - The content to check
 * @returns ValidationResult with violations and suggestions
 */
export function checkForbiddenTerms(content: string): ValidationResult {
  const violations: string[] = [];
  const suggestions: string[] = [];

  FORBIDDEN_TERMS.forEach((term) => {
    // Use word boundaries for single words, substring match for phrases
    const isPhrase = term.includes(' ');
    if (isPhrase) {
      // For phrases, use case-insensitive substring match
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      if (regex.test(content)) {
        violations.push(`Contains forbidden term: "${term}"`);
      }
    } else {
      // For single words, use word boundary matching
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(content)) {
        violations.push(`Contains forbidden term: "${term}"`);
      }
    }
  });

  if (violations.length > 0) {
    suggestions.push('Replace abstract terms with specific action verbs');
    suggestions.push('Use concrete language that describes what you actually do');
  }

  return {
    passes: violations.length === 0,
    violations,
    suggestions,
  };
}

/**
 * Checks if content contains unverifiable claims or user count references
 * 
 * @param content - The content to check
 * @returns ValidationResult with violations and suggestions
 */
export function checkUnverifiableClaims(content: string): ValidationResult {
  const violations: string[] = [];
  const suggestions: string[] = [];

  UNVERIFIABLE_CLAIM_PATTERNS.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        violations.push(`Contains unverifiable claim: "${match}"`);
      });
    }
  });

  if (violations.length > 0) {
    suggestions.push('Remove user counts and traction numbers unless verifiable');
    suggestions.push('Focus on capabilities and outcomes instead of metrics');
  }

  return {
    passes: violations.length === 0,
    violations,
    suggestions,
  };
}

/**
 * Checks if content contains marketing jargon or abstract language
 * 
 * @param content - The content to check
 * @returns ValidationResult with violations and suggestions
 */
export function checkMarketingJargon(content: string): ValidationResult {
  const violations: string[] = [];
  const suggestions: string[] = [];

  MARKETING_JARGON_PATTERNS.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        violations.push(`Contains marketing jargon: "${match}"`);
      });
    }
  });

  if (violations.length > 0) {
    suggestions.push('Replace abstract language with specific descriptions');
    suggestions.push('Use action-oriented language: "we build", "we design", "we deliver"');
    suggestions.push('Avoid vague buzzwords and focus on concrete capabilities');
  }

  return {
    passes: violations.length === 0,
    violations,
    suggestions,
  };
}

/**
 * Comprehensive check for all forbidden patterns
 * Combines forbidden terms, unverifiable claims, and marketing jargon checks
 * 
 * @param content - The content to check
 * @returns ValidationResult with all violations and suggestions
 */
export function checkAllForbiddenPatterns(content: string): ValidationResult {
  const termsResult = checkForbiddenTerms(content);
  const claimsResult = checkUnverifiableClaims(content);
  const jargonResult = checkMarketingJargon(content);

  const allViolations = [
    ...termsResult.violations,
    ...claimsResult.violations,
    ...jargonResult.violations,
  ];

  const allSuggestions = [
    ...new Set([
      ...termsResult.suggestions,
      ...claimsResult.suggestions,
      ...jargonResult.suggestions,
    ]),
  ];

  return {
    passes: allViolations.length === 0,
    violations: allViolations,
    suggestions: allSuggestions,
  };
}

/**
 * Content refinement rule for forbidden terms
 */
export const forbiddenTermsRule: ContentRefinementRule = {
  name: 'forbidden-terms',
  check: checkForbiddenTerms,
  suggest: (content: string): string => {
    let refined = content;
    
    // Replace forbidden terms with more specific alternatives
    refined = refined.replace(/\bempower\b/gi, 'enable');
    refined = refined.replace(/\buplift\b/gi, 'support');
    refined = refined.replace(/\binspire\b/gi, 'guide');
    refined = refined.replace(/driven by innovation/gi, 'focused on reliable solutions');
    refined = refined.replace(/let's build something amazing/gi, 'Tell us what you\'re trying to build');
    
    return refined;
  },
};

/**
 * Content refinement rule for unverifiable claims
 */
export const unverifiableClaimsRule: ContentRefinementRule = {
  name: 'unverifiable-claims',
  check: checkUnverifiableClaims,
  suggest: (content: string): string => {
    let refined = content;
    
    // Remove or replace unverifiable claim patterns
    UNVERIFIABLE_CLAIM_PATTERNS.forEach((pattern) => {
      refined = refined.replace(pattern, '[specific capability or outcome]');
    });
    
    return refined;
  },
};

/**
 * Content refinement rule for marketing jargon
 */
export const marketingJargonRule: ContentRefinementRule = {
  name: 'marketing-jargon',
  check: checkMarketingJargon,
  suggest: (content: string): string => {
    let refined = content;
    
    // Replace common jargon with more specific language
    refined = refined.replace(/\bsynergy\b/gi, 'collaboration');
    refined = refined.replace(/\bleverage\b/gi, 'use');
    refined = refined.replace(/\bparadigm\b/gi, 'approach');
    refined = refined.replace(/\bdisrupt\b/gi, 'improve');
    refined = refined.replace(/\binnovative\s+solutions?\b/gi, 'practical solutions');
    refined = refined.replace(/\bcutting[- ]edge\b/gi, 'modern');
    refined = refined.replace(/\bnext[- ]generation\b/gi, 'current');
    refined = refined.replace(/\bworld[- ]class\b/gi, 'high-quality');
    refined = refined.replace(/\bgame[- ]changer\b/gi, 'significant improvement');
    refined = refined.replace(/\bthought\s+leader/gi, 'experienced practitioner');
    refined = refined.replace(/\breimag(ine|ining)\b/gi, 'rethink$1');
    refined = refined.replace(/\brevolutioniz(e|ing)\b/gi, 'improv$1');
    refined = refined.replace(/\btransform\s+the\s+world/gi, 'make meaningful improvements');
    refined = refined.replace(/\bempower\s+communities/gi, 'support organizations');
    refined = refined.replace(/\bmission[- ]driven\s+organizations/gi, 'established organizations');
    
    return refined;
  },
};

/**
 * Export all refinement rules as a collection
 */
export const forbiddenPatternRules = [
  forbiddenTermsRule,
  unverifiableClaimsRule,
  marketingJargonRule,
] as const;
