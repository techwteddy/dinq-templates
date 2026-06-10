/**
 * Integration tests for Content Validation Module
 * 
 * Tests that all validation utilities work together correctly
 * and can be imported from the main index.
 */

import {
  // Types
  ValidationResult,
  EnterpriseSignalChecklist,
  // Forbidden terms
  checkForbiddenTerms,
  checkAllForbiddenPatterns,
  // Required patterns
  checkFlexibilitySignals,
  checkEnterpriseSignals,
  validateEnterpriseSignals,
  checkRiskReductionLanguage,
  checkRequiredPatterns,
} from '@/lib/content-validation';

describe('Content Validation Integration', () => {
  describe('Service section validation', () => {
    it('should validate service content with both forbidden and required checks', () => {
      const goodContent = 'Typical engagement scoped collaboratively based on your needs';
      
      // Check for forbidden patterns
      const forbiddenResult = checkAllForbiddenPatterns(goodContent);
      expect(forbiddenResult.passes).toBe(true);
      
      // Check for required patterns
      const requiredResult = checkFlexibilitySignals(goodContent);
      expect(requiredResult.passes).toBe(true);
    });

    it('should fail service content with forbidden terms', () => {
      const badContent = 'We empower teams with innovative solutions at the cheapest price';
      
      const forbiddenResult = checkAllForbiddenPatterns(badContent);
      expect(forbiddenResult.passes).toBe(false);
      expect(forbiddenResult.violations.length).toBeGreaterThan(0);
    });

    it('should fail service content without flexibility signals', () => {
      const badContent = 'We build software for clients';
      
      const requiredResult = checkFlexibilitySignals(badContent);
      expect(requiredResult.passes).toBe(false);
      expect(requiredResult.violations).toContain('Missing flexibility signal in service content');
    });
  });

  describe('Contact section validation', () => {
    it('should validate contact content with both forbidden and required checks', () => {
      const goodContent = 'Tell us what you\'re trying to build. We\'ll review your request and follow up with next steps if it\'s a good fit.';
      
      // Check for forbidden patterns
      const forbiddenResult = checkAllForbiddenPatterns(goodContent);
      expect(forbiddenResult.passes).toBe(true);
      
      // Check for required patterns
      const requiredResult = checkRiskReductionLanguage(goodContent);
      expect(requiredResult.passes).toBe(true);
    });

    it('should fail contact content with forbidden headline', () => {
      const badContent = 'Let\'s Build Something Amazing together!';
      
      const forbiddenResult = checkForbiddenTerms(badContent);
      expect(forbiddenResult.passes).toBe(false);
    });

    it('should fail contact content without risk-reduction language', () => {
      const badContent = 'Contact us today to get started!';
      
      const requiredResult = checkRiskReductionLanguage(badContent);
      expect(requiredResult.passes).toBe(false);
    });
  });

  describe('Full site validation', () => {
    it('should validate comprehensive site content', () => {
      const siteContent = `
        Steady hands for serious products
        
        We design and build calm, reliable software end-to-end, from early ideas 
        to production systems. Our thoughtful approach and steady execution make us 
        a good fit for serious product work.
        
        A curated set of product builds developed end-to-end, from early concepts 
        to production-ready systems, using modern web, mobile, and data stacks.
        
        Services are scoped collaboratively and adjusted based on complexity.
        
        Tell us what you're trying to build. We'll review your request and follow 
        up with next steps if it's a good fit.
      `;
      
      // Check for forbidden patterns
      const forbiddenResult = checkAllForbiddenPatterns(siteContent);
      expect(forbiddenResult.passes).toBe(true);
      
      // Check for enterprise signals
      const enterpriseResult = validateEnterpriseSignals(siteContent);
      expect(enterpriseResult.passes).toBe(true);
      
      // Verify all signals are present
      const signals = checkEnterpriseSignals(siteContent);
      expect(signals.endToEndOwnership).toBe(true);
      expect(signals.productionExperience).toBe(true);
      expect(signals.technicalJudgment).toBe(true);
      expect(signals.calmExecution).toBe(true);
      expect(signals.selectivity).toBe(true);
    });

    it('should detect violations in poor site content', () => {
      const poorContent = `
        Let's Build Something Amazing
        
        We empower organizations with innovative solutions and cutting-edge technology.
        
        Used by thousands of users worldwide with rapid adoption.
        
        Guaranteed delivery in 4 weeks at the cheapest price.
        
        Act now - limited time offer!
      `;
      
      // Check for forbidden patterns
      const forbiddenResult = checkAllForbiddenPatterns(poorContent);
      expect(forbiddenResult.passes).toBe(false);
      expect(forbiddenResult.violations.length).toBeGreaterThan(5);
      
      // Check for enterprise signals
      const enterpriseResult = validateEnterpriseSignals(poorContent);
      expect(enterpriseResult.passes).toBe(false);
    });
  });

  describe('Type compatibility', () => {
    it('should return ValidationResult type from all check functions', () => {
      const content = 'Test content';
      
      const result1: ValidationResult = checkForbiddenTerms(content);
      const result2: ValidationResult = checkFlexibilitySignals(content);
      const result3: ValidationResult = checkRiskReductionLanguage(content);
      const result4: ValidationResult = validateEnterpriseSignals(content);
      
      expect(result1).toHaveProperty('passes');
      expect(result1).toHaveProperty('violations');
      expect(result1).toHaveProperty('suggestions');
      
      expect(result2).toHaveProperty('passes');
      expect(result3).toHaveProperty('passes');
      expect(result4).toHaveProperty('passes');
    });

    it('should return EnterpriseSignalChecklist type from checkEnterpriseSignals', () => {
      const content = 'Test content';
      
      const signals: EnterpriseSignalChecklist = checkEnterpriseSignals(content);
      
      expect(signals).toHaveProperty('endToEndOwnership');
      expect(signals).toHaveProperty('productionExperience');
      expect(signals).toHaveProperty('technicalJudgment');
      expect(signals).toHaveProperty('calmExecution');
      expect(signals).toHaveProperty('selectivity');
    });
  });

  describe('Combined validation workflow', () => {
    it('should provide a complete validation workflow for a section', () => {
      const serviceContent = 'Typical engagement scoped collaboratively';
      
      // Step 1: Check for forbidden patterns
      const forbiddenCheck = checkAllForbiddenPatterns(serviceContent);
      
      // Step 2: Check for required patterns
      const requiredCheck = checkRequiredPatterns(serviceContent, 'service');
      
      // Step 3: Combine results
      const allPasses = forbiddenCheck.passes && requiredCheck.passes;
      const allViolations = [
        ...forbiddenCheck.violations,
        ...requiredCheck.violations,
      ];
      const allSuggestions = [
        ...forbiddenCheck.suggestions,
        ...requiredCheck.suggestions,
      ];
      
      expect(allPasses).toBe(true);
      expect(allViolations).toHaveLength(0);
      expect(allSuggestions).toHaveLength(0);
    });

    it('should collect all violations from multiple checks', () => {
      const badContent = 'We empower users with innovative solutions';
      
      // Check forbidden patterns
      const forbiddenCheck = checkAllForbiddenPatterns(badContent);
      
      // Check required patterns
      const requiredCheck = checkRequiredPatterns(badContent, 'service');
      
      // Combine results
      const allViolations = [
        ...forbiddenCheck.violations,
        ...requiredCheck.violations,
      ];
      
      expect(allViolations.length).toBeGreaterThan(2);
    });
  });
});
