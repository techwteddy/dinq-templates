# Content Validation Module

This module provides utilities for validating website content against enterprise positioning requirements. It ensures content meets quality standards by detecting forbidden patterns and verifying required language signals.

## Overview

The content validation system consists of two main components:

1. **Forbidden Terms Checker** - Detects language that should NOT appear in content
2. **Required Patterns Checker** - Verifies language that MUST appear in content

## Installation

Import from the main module:

```typescript
import {
  // Forbidden terms
  checkForbiddenTerms,
  checkUnverifiableClaims,
  checkMarketingJargon,
  checkAllForbiddenPatterns,
  
  // Required patterns
  checkFlexibilitySignals,
  checkEnterpriseSignals,
  validateEnterpriseSignals,
  checkRiskReductionLanguage,
  checkRequiredPatterns,
  
  // Types
  ValidationResult,
  EnterpriseSignalChecklist,
} from '@/lib/content-validation';
```

## Forbidden Terms Checker

### Purpose

Detects language patterns that contradict enterprise positioning:
- Forbidden terms: "empower", "uplift", "inspire", "driven by innovation"
- Unverifiable claims: user counts, traction numbers, adoption metrics
- Marketing jargon: "synergy", "leverage", "paradigm", "cutting-edge", etc.

### Usage

```typescript
// Check for forbidden terms
const result = checkForbiddenTerms(content);
if (!result.passes) {
  console.log('Violations:', result.violations);
  console.log('Suggestions:', result.suggestions);
}

// Check for unverifiable claims
const claimsResult = checkUnverifiableClaims(content);

// Check for marketing jargon
const jargonResult = checkMarketingJargon(content);

// Check all forbidden patterns at once
const allResult = checkAllForbiddenPatterns(content);
```

### Example

```typescript
const content = 'We empower 10000 users with cutting-edge solutions';
const result = checkAllForbiddenPatterns(content);

// Result:
// {
//   passes: false,
//   violations: [
//     'Contains forbidden term: "empower"',
//     'Contains unverifiable claim: "10000 users"',
//     'Contains marketing jargon: "cutting-edge"'
//   ],
//   suggestions: [
//     'Replace abstract terms with specific action verbs',
//     'Remove user counts unless verifiable',
//     'Replace abstract language with specific descriptions'
//   ]
// }
```

## Required Patterns Checker

### Purpose

Verifies that content includes required language patterns for enterprise positioning:
- **Flexibility signals** (for service content): "typical engagement", "starting from", "scoped collaboratively"
- **Enterprise signals** (for full site): end-to-end ownership, production experience, technical judgment, calm execution, selectivity
- **Risk-reduction language** (for contact section): "review your request", "if it's a good fit", "next steps"

### Usage

#### Check Flexibility Signals (Service Content)

```typescript
const serviceContent = 'Typical engagement scoped collaboratively';
const result = checkFlexibilitySignals(serviceContent);

if (result.passes) {
  console.log('Service content has flexibility signals');
}
```

#### Check Enterprise Signals (Full Site)

```typescript
const siteContent = `
  We design and build calm, reliable software end-to-end, 
  from early ideas to production systems. Our thoughtful 
  approach makes us a good fit for serious product work.
`;

// Get checklist of which signals are present
const signals = checkEnterpriseSignals(siteContent);
console.log(signals);
// {
//   endToEndOwnership: true,
//   productionExperience: true,
//   technicalJudgment: true,
//   calmExecution: true,
//   selectivity: true
// }

// Validate that all signals are present
const result = validateEnterpriseSignals(siteContent);
if (!result.passes) {
  console.log('Missing signals:', result.violations);
}
```

#### Check Risk-Reduction Language (Contact Section)

```typescript
const contactContent = `
  Tell us what you're trying to build. We'll review your 
  request and follow up with next steps if it's a good fit.
`;

const result = checkRiskReductionLanguage(contactContent);
if (result.passes) {
  console.log('Contact section has risk-reduction language');
}
```

#### Unified Check by Section Type

```typescript
// For service section
const serviceResult = checkRequiredPatterns(content, 'service');

// For contact section
const contactResult = checkRequiredPatterns(content, 'contact');

// For full site
const siteResult = checkRequiredPatterns(content, 'full-site');
```

## Complete Validation Workflow

Here's how to validate a content section completely:

```typescript
function validateContent(content: string, sectionType: 'service' | 'contact' | 'full-site') {
  // Step 1: Check for forbidden patterns
  const forbiddenCheck = checkAllForbiddenPatterns(content);
  
  // Step 2: Check for required patterns
  const requiredCheck = checkRequiredPatterns(content, sectionType);
  
  // Step 3: Combine results
  const passes = forbiddenCheck.passes && requiredCheck.passes;
  const violations = [
    ...forbiddenCheck.violations,
    ...requiredCheck.violations,
  ];
  const suggestions = [
    ...forbiddenCheck.suggestions,
    ...requiredCheck.suggestions,
  ];
  
  return { passes, violations, suggestions };
}

// Usage
const result = validateContent(serviceContent, 'service');
if (!result.passes) {
  console.log('Content validation failed:');
  result.violations.forEach(v => console.log(`  - ${v}`));
  console.log('\nSuggestions:');
  result.suggestions.forEach(s => console.log(`  - ${s}`));
}
```

## ValidationResult Type

All check functions return a `ValidationResult`:

```typescript
interface ValidationResult {
  passes: boolean;        // Whether content passes validation
  violations: string[];   // List of specific violations found
  suggestions: string[];  // List of suggestions for improvement
}
```

## EnterpriseSignalChecklist Type

The `checkEnterpriseSignals` function returns an `EnterpriseSignalChecklist`:

```typescript
interface EnterpriseSignalChecklist {
  endToEndOwnership: boolean;     // "end-to-end", "complete", "full-stack"
  productionExperience: boolean;  // "production", "reliable", "systems"
  technicalJudgment: boolean;     // "judgment", "thoughtful", "considered"
  calmExecution: boolean;         // "calm", "steady", "measured"
  selectivity: boolean;           // "curated", "selected", "good fit"
}
```

## Requirements Mapping

This module implements the following requirements from the enterprise positioning refinement spec:

### Forbidden Terms Checker
- **Requirements 2.2, 2.3**: Detect unverifiable traction numbers and user counts
- **Requirements 4.5, 7.2, 8.1**: Detect forbidden terms ("empower", "uplift", "inspire", etc.)
- **Requirements 9.2, 9.4, 11.3**: Detect marketing jargon and abstract language

### Required Patterns Checker
- **Requirements 5.1, 5.2, 5.4**: Verify flexibility signals in service content
- **Requirement 7.3**: Verify risk-reduction language in contact section
- **Requirements 10.1-10.5**: Verify all five enterprise signals across site content

## Testing

The module includes comprehensive test coverage:

- **Unit tests**: 67 tests for required patterns, 54 tests for forbidden terms
- **Integration tests**: 12 tests for combined validation workflows
- **Type tests**: 16 tests for TypeScript interfaces

Run tests:

```bash
# Run all content validation tests
npm test -- __tests__/lib/

# Run specific test suites
npm test -- __tests__/lib/forbidden-terms.test.ts
npm test -- __tests__/lib/required-patterns.test.ts
npm test -- __tests__/lib/content-validation-integration.test.ts
```

## Examples

### Example 1: Validate Service Package Description

```typescript
const description = `
  Typical engagement starting from $15,000. Each project is 
  scoped collaboratively and adjusted based on complexity.
`;

const forbiddenCheck = checkAllForbiddenPatterns(description);
const flexibilityCheck = checkFlexibilitySignals(description);

if (forbiddenCheck.passes && flexibilityCheck.passes) {
  console.log('✓ Service description is valid');
}
```

### Example 2: Validate Contact Section

```typescript
const contactSection = `
  Tell us what you're trying to build
  
  We'll review your request and follow up with next steps 
  if it's a good fit. No pressure, just a conversation.
`;

const forbiddenCheck = checkAllForbiddenPatterns(contactSection);
const riskCheck = checkRiskReductionLanguage(contactSection);

if (forbiddenCheck.passes && riskCheck.passes) {
  console.log('✓ Contact section is valid');
}
```

### Example 3: Validate Full Site Content

```typescript
const fullSiteContent = `
  Steady hands for serious products
  
  We design and build calm, reliable software end-to-end, 
  from early ideas to production systems. Our thoughtful 
  approach and steady execution make us a good fit for 
  serious product work.
  
  A curated set of product builds developed end-to-end, 
  from early concepts to production-ready systems.
`;

const forbiddenCheck = checkAllForbiddenPatterns(fullSiteContent);
const enterpriseCheck = validateEnterpriseSignals(fullSiteContent);

if (forbiddenCheck.passes && enterpriseCheck.passes) {
  console.log('✓ Site content meets enterprise positioning standards');
  
  const signals = checkEnterpriseSignals(fullSiteContent);
  console.log('Enterprise signals present:', signals);
}
```

## Best Practices

1. **Always check both forbidden and required patterns** - Content must avoid forbidden terms AND include required signals
2. **Use section-specific checks** - Different sections have different requirements (service vs contact vs full-site)
3. **Provide actionable feedback** - Use the suggestions array to guide content improvements
4. **Validate early and often** - Run validation during content creation, not just at the end
5. **Combine with manual review** - Automated checks catch patterns, but human review ensures tone and clarity

## Related Files

- `lib/content-validation.types.ts` - TypeScript type definitions
- `lib/content-validation/forbidden-terms.ts` - Forbidden terms checker implementation
- `lib/content-validation/required-patterns.ts` - Required patterns checker implementation
- `__tests__/lib/` - Comprehensive test suites

## Support

For questions or issues with the content validation module, refer to:
- Design document: `.kiro/specs/enterprise-positioning-refinement/design.md`
- Requirements: `.kiro/specs/enterprise-positioning-refinement/requirements.md`
- Test files for usage examples
