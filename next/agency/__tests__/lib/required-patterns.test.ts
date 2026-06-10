/**
 * Unit tests for Required Language Pattern Checker
 * 
 * Tests the detection of required language patterns that must be present
 * in website content for enterprise positioning.
 * 
 * Requirements: 5.1, 5.2, 5.4, 7.3, 10.1, 10.2, 10.3, 10.4, 10.5
 */

import {
  checkFlexibilitySignals,
  checkEnterpriseSignals,
  validateEnterpriseSignals,
  checkRiskReductionLanguage,
  checkRequiredPatterns,
  FLEXIBILITY_SIGNALS,
  END_TO_END_KEYWORDS,
  PRODUCTION_KEYWORDS,
  TECHNICAL_JUDGMENT_KEYWORDS,
  CALM_EXECUTION_KEYWORDS,
  SELECTIVITY_KEYWORDS,
  RISK_REDUCTION_PHRASES,
} from '@/lib/content-validation/required-patterns';

describe('Required Language Pattern Checker', () => {
  describe('checkFlexibilitySignals', () => {
    it('should pass when content has "typical engagement"', () => {
      const content = 'This is a typical engagement that we offer';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass when content has "starting from"', () => {
      const content = 'Pricing starting from $10,000';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass when content has "scoped collaboratively"', () => {
      const content = 'Each project is scoped collaboratively with the client';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass when content has "adjusted based on complexity"', () => {
      const content = 'Timeline adjusted based on complexity of requirements';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should fail when content has no flexibility signals', () => {
      const content = 'We build software for clients';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing flexibility signal in service content');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const content = 'TYPICAL ENGAGEMENT for enterprise clients';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
    });

    it('should detect hard timeline promises', () => {
      const content = 'Typical engagement guaranteed in 4 weeks';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains hard timeline or scope promise that contradicts flexibility'
      );
    });

    it('should detect fixed scope language', () => {
      const content = 'Starting from $5000 with fixed scope';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains hard timeline or scope promise that contradicts flexibility'
      );
    });

    it('should detect "delivered by" promises', () => {
      const content = 'Scoped collaboratively, delivered by 2024';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains hard timeline or scope promise that contradicts flexibility'
      );
    });

    it('should detect price-shopping language: "cheapest"', () => {
      const content = 'The cheapest option for your needs';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains price-shopping language');
    });

    it('should detect price-shopping language: "lowest price"', () => {
      const content = 'Typical engagement at the lowest price';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains price-shopping language');
    });

    it('should detect price-shopping language: "budget-friendly"', () => {
      const content = 'Budget-friendly packages starting from $1000';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains price-shopping language');
    });

    it('should detect price-shopping language: "affordable rates"', () => {
      const content = 'Affordable rates for all clients';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains price-shopping language');
    });

    it('should pass with flexibility signal and no contradictions', () => {
      const content = 'Typical engagement scoped collaboratively based on your needs';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('checkEnterpriseSignals', () => {
    it('should detect end-to-end ownership signals', () => {
      const content = 'We build end-to-end solutions';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.endToEndOwnership).toBe(true);
    });

    it('should detect "end to end" with spaces', () => {
      const content = 'Complete end to end development';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.endToEndOwnership).toBe(true);
    });

    it('should detect "complete" as end-to-end signal', () => {
      const content = 'Complete software solutions';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.endToEndOwnership).toBe(true);
    });

    it('should detect "full-stack" as end-to-end signal', () => {
      const content = 'Full-stack development services';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.endToEndOwnership).toBe(true);
    });

    it('should detect production experience signals', () => {
      const content = 'We build production-ready systems';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.productionExperience).toBe(true);
    });

    it('should detect "reliable" as production signal', () => {
      const content = 'Reliable software for enterprises';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.productionExperience).toBe(true);
    });

    it('should detect technical judgment signals', () => {
      const content = 'Thoughtful approach to software design';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.technicalJudgment).toBe(true);
    });

    it('should detect "judgment" and "judgement" spellings', () => {
      const content1 = 'Technical judgment in every decision';
      const content2 = 'Technical judgement in every decision';
      
      expect(checkEnterpriseSignals(content1).technicalJudgment).toBe(true);
      expect(checkEnterpriseSignals(content2).technicalJudgment).toBe(true);
    });

    it('should detect calm execution signals', () => {
      const content = 'Calm, steady execution of complex projects';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.calmExecution).toBe(true);
    });

    it('should detect "measured" as calm execution signal', () => {
      const content = 'Measured approach to development';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.calmExecution).toBe(true);
    });

    it('should detect selectivity signals', () => {
      const content = 'A curated set of selected projects';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.selectivity).toBe(true);
    });

    it('should detect "good fit" as selectivity signal', () => {
      const content = 'We work with clients who are a good fit';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.selectivity).toBe(true);
    });

    it('should detect all signals in comprehensive content', () => {
      const content = `
        We design and build calm, reliable software end-to-end, from early ideas 
        to production systems. Our thoughtful approach and steady execution make us 
        a good fit for serious product work.
      `;
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.endToEndOwnership).toBe(true);
      expect(signals.productionExperience).toBe(true);
      expect(signals.technicalJudgment).toBe(true);
      expect(signals.calmExecution).toBe(true);
      expect(signals.selectivity).toBe(true);
    });

    it('should return false for missing signals', () => {
      const content = 'We build software';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.endToEndOwnership).toBe(false);
      expect(signals.productionExperience).toBe(false);
      expect(signals.technicalJudgment).toBe(false);
      expect(signals.calmExecution).toBe(false);
      expect(signals.selectivity).toBe(false);
    });

    it('should be case-insensitive', () => {
      const content = 'END-TO-END PRODUCTION-READY THOUGHTFUL CALM CURATED';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.endToEndOwnership).toBe(true);
      expect(signals.productionExperience).toBe(true);
      expect(signals.technicalJudgment).toBe(true);
      expect(signals.calmExecution).toBe(true);
      expect(signals.selectivity).toBe(true);
    });
  });

  describe('validateEnterpriseSignals', () => {
    it('should pass when all signals are present', () => {
      const content = `
        We design and build calm, reliable software end-to-end, from early ideas 
        to production systems. Our thoughtful approach and steady execution make us 
        a good fit for serious product work.
      `;
      const result = validateEnterpriseSignals(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });

    it('should fail when end-to-end ownership signal is missing', () => {
      const content = 'We build production systems with thoughtful, calm execution for selected clients';
      const result = validateEnterpriseSignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing end-to-end ownership signal');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should fail when production experience signal is missing', () => {
      const content = 'We build end-to-end solutions with thoughtful, calm execution for selected clients';
      const result = validateEnterpriseSignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing production experience signal');
    });

    it('should fail when technical judgment signal is missing', () => {
      const content = 'We build end-to-end production systems with calm execution for selected clients';
      const result = validateEnterpriseSignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing technical judgment signal');
    });

    it('should fail when calm execution signal is missing', () => {
      const content = 'We build thoughtful end-to-end production systems for selected clients';
      const result = validateEnterpriseSignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing calm execution signal');
    });

    it('should fail when selectivity signal is missing', () => {
      const content = 'We build thoughtful end-to-end production systems with calm execution';
      const result = validateEnterpriseSignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing selectivity signal');
    });

    it('should report all missing signals', () => {
      const content = 'We build software';
      const result = validateEnterpriseSignals(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toHaveLength(5);
      expect(result.suggestions).toHaveLength(5);
    });
  });

  describe('checkRiskReductionLanguage', () => {
    it('should pass when content has "review your request"', () => {
      const content = 'We will review your request and get back to you';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass when content has "if it\'s a good fit"', () => {
      const content = 'We\'ll follow up if it\'s a good fit for both parties';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass when content has "next steps"', () => {
      const content = 'We\'ll discuss next steps after reviewing your needs';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass when content has "no pressure"', () => {
      const content = 'No pressure, just a conversation about your project';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass when content has "low pressure"', () => {
      const content = 'A low pressure discussion about your needs';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should fail when content has no risk-reduction language', () => {
      const content = 'Contact us today to get started';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing risk-reduction language in contact section');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const content = 'We will REVIEW YOUR REQUEST and follow up';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(true);
    });

    it('should detect high-pressure language: "limited time"', () => {
      const content = 'Limited time offer - review your request today';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains high-pressure language that contradicts risk reduction'
      );
    });

    it('should detect high-pressure language: "act now"', () => {
      const content = 'Act now to secure your spot';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains high-pressure language that contradicts risk reduction'
      );
    });

    it('should detect high-pressure language: "don\'t miss out"', () => {
      const content = 'Don\'t miss out on this opportunity';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains high-pressure language that contradicts risk reduction'
      );
    });

    it('should detect high-pressure language: "exclusive offer"', () => {
      const content = 'Exclusive offer for new clients';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains high-pressure language that contradicts risk reduction'
      );
    });

    it('should detect high-pressure language: "only X spots left"', () => {
      const content = 'Only 3 spots left this month';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain(
        'Contains high-pressure language that contradicts risk reduction'
      );
    });

    it('should pass with risk-reduction language and no high-pressure contradictions', () => {
      const content = 'We\'ll review your request and follow up with next steps if it\'s a good fit.';
      const result = checkRiskReductionLanguage(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('checkRequiredPatterns', () => {
    it('should check flexibility signals for service section', () => {
      const content = 'Typical engagement scoped collaboratively';
      const result = checkRequiredPatterns(content, 'service');
      
      expect(result.passes).toBe(true);
    });

    it('should fail for service section without flexibility signals', () => {
      const content = 'We build software';
      const result = checkRequiredPatterns(content, 'service');
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing flexibility signal in service content');
    });

    it('should check risk-reduction language for contact section', () => {
      const content = 'We\'ll review your request and follow up with next steps';
      const result = checkRequiredPatterns(content, 'contact');
      
      expect(result.passes).toBe(true);
    });

    it('should fail for contact section without risk-reduction language', () => {
      const content = 'Contact us today';
      const result = checkRequiredPatterns(content, 'contact');
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Missing risk-reduction language in contact section');
    });

    it('should check enterprise signals for full-site content', () => {
      const content = `
        We design and build calm, reliable software end-to-end, from early ideas 
        to production systems. Our thoughtful approach and steady execution make us 
        a good fit for serious product work.
      `;
      const result = checkRequiredPatterns(content, 'full-site');
      
      expect(result.passes).toBe(true);
    });

    it('should fail for full-site content missing enterprise signals', () => {
      const content = 'We build software';
      const result = checkRequiredPatterns(content, 'full-site');
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', () => {
      const flexResult = checkFlexibilitySignals('');
      const enterpriseResult = validateEnterpriseSignals('');
      const riskResult = checkRiskReductionLanguage('');
      
      expect(flexResult.passes).toBe(false);
      expect(enterpriseResult.passes).toBe(false);
      expect(riskResult.passes).toBe(false);
    });

    it('should handle content with only whitespace', () => {
      const content = '   \n\t  ';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(false);
    });

    it('should handle content with special characters', () => {
      const content = 'Typical engagement! Scoped collaboratively? Yes.';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
    });

    it('should handle mixed case variations', () => {
      const content = 'TYPICAL ENGAGEMENT scoped COLLABORATIVELY';
      const result = checkFlexibilitySignals(content);
      
      expect(result.passes).toBe(true);
    });

    it('should handle partial keyword matches correctly', () => {
      // "production" within "reproduction" should still match
      const content = 'We handle reproduction of systems';
      const signals = checkEnterpriseSignals(content);
      
      expect(signals.productionExperience).toBe(true);
    });
  });

  describe('Constants exports', () => {
    it('should export FLEXIBILITY_SIGNALS', () => {
      expect(FLEXIBILITY_SIGNALS).toBeDefined();
      expect(FLEXIBILITY_SIGNALS.length).toBeGreaterThan(0);
    });

    it('should export END_TO_END_KEYWORDS', () => {
      expect(END_TO_END_KEYWORDS).toBeDefined();
      expect(END_TO_END_KEYWORDS.length).toBeGreaterThan(0);
    });

    it('should export PRODUCTION_KEYWORDS', () => {
      expect(PRODUCTION_KEYWORDS).toBeDefined();
      expect(PRODUCTION_KEYWORDS.length).toBeGreaterThan(0);
    });

    it('should export TECHNICAL_JUDGMENT_KEYWORDS', () => {
      expect(TECHNICAL_JUDGMENT_KEYWORDS).toBeDefined();
      expect(TECHNICAL_JUDGMENT_KEYWORDS.length).toBeGreaterThan(0);
    });

    it('should export CALM_EXECUTION_KEYWORDS', () => {
      expect(CALM_EXECUTION_KEYWORDS).toBeDefined();
      expect(CALM_EXECUTION_KEYWORDS.length).toBeGreaterThan(0);
    });

    it('should export SELECTIVITY_KEYWORDS', () => {
      expect(SELECTIVITY_KEYWORDS).toBeDefined();
      expect(SELECTIVITY_KEYWORDS.length).toBeGreaterThan(0);
    });

    it('should export RISK_REDUCTION_PHRASES', () => {
      expect(RISK_REDUCTION_PHRASES).toBeDefined();
      expect(RISK_REDUCTION_PHRASES.length).toBeGreaterThan(0);
    });
  });
});
