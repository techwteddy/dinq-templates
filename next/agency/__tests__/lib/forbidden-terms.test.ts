/**
 * Unit tests for Forbidden Terms Checker
 * 
 * Tests the detection of forbidden terms, unverifiable claims,
 * and marketing jargon in website content.
 * 
 * Requirements: 2.2, 2.3, 4.5, 7.2, 8.1, 9.2, 9.4, 11.3
 */

import {
  checkForbiddenTerms,
  checkUnverifiableClaims,
  checkMarketingJargon,
  checkAllForbiddenPatterns,
  forbiddenTermsRule,
  unverifiableClaimsRule,
  marketingJargonRule,
  FORBIDDEN_TERMS,
  UNVERIFIABLE_CLAIM_PATTERNS,
  MARKETING_JARGON_PATTERNS,
} from '@/lib/content-validation/forbidden-terms';

describe('Forbidden Terms Checker', () => {
  describe('checkForbiddenTerms', () => {
    it('should pass when content has no forbidden terms', () => {
      const content = 'We build reliable software for established organizations';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });

    it('should detect "empower" as forbidden term', () => {
      const content = 'We empower organizations to succeed';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains forbidden term: "empower"');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should detect "uplift" as forbidden term', () => {
      const content = 'Our mission is to uplift communities';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains forbidden term: "uplift"');
    });

    it('should detect "inspire" as forbidden term', () => {
      const content = 'We inspire teams to do their best work';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains forbidden term: "inspire"');
    });

    it('should detect "driven by innovation" as forbidden term', () => {
      const content = 'We are driven by innovation and excellence';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains forbidden term: "driven by innovation"');
    });

    it('should detect "Let\'s Build Something Amazing" as forbidden term', () => {
      const content = "Let's Build Something Amazing together";
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toContain('Contains forbidden term: "let\'s build something amazing"');
    });

    it('should be case-insensitive', () => {
      const content = 'We EMPOWER and INSPIRE teams';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toHaveLength(2);
    });

    it('should detect multiple forbidden terms', () => {
      const content = 'We empower and inspire organizations to uplift their communities';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toHaveLength(3);
    });
  });

  describe('checkUnverifiableClaims', () => {
    it('should pass when content has no unverifiable claims', () => {
      const content = 'We build production-ready systems for enterprise clients';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });

    it('should detect user count claims', () => {
      const content = 'Used by 10000 users worldwide';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations[0]).toContain('unverifiable claim');
    });

    it('should detect download count claims', () => {
      const content = 'Over 5000 downloads in the first month';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "thousands of" patterns', () => {
      const content = 'Thousands of users trust our platform';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "millions of" patterns', () => {
      const content = 'Millions of people benefit from our work';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect abbreviated counts like "10k+ users"', () => {
      const content = 'Serving 10k+ users daily';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "growing user base" claims', () => {
      const content = 'Our growing user base loves the product';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "rapid adoption" claims', () => {
      const content = 'Experiencing rapid adoption in the market';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect multiple unverifiable claims', () => {
      const content = 'With 50000 users and thousands of downloads, we have rapid adoption';
      const result = checkUnverifiableClaims(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(1);
    });
  });

  describe('checkMarketingJargon', () => {
    it('should pass when content has no marketing jargon', () => {
      const content = 'We design and build reliable software systems';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });

    it('should detect "synergy"', () => {
      const content = 'Creating synergy between teams';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "leverage"', () => {
      const content = 'We leverage cutting-edge technology';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "paradigm"', () => {
      const content = 'A new paradigm in software development';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "disrupt"', () => {
      const content = 'We disrupt the industry with innovation';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "innovative solutions"', () => {
      const content = 'Providing innovative solutions for modern problems';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "cutting-edge" and "cutting edge"', () => {
      const content = 'Using cutting-edge and cutting edge technology';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "next-generation"', () => {
      const content = 'Next-generation software platform';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "world-class"', () => {
      const content = 'World-class engineering team';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "game-changer"', () => {
      const content = 'This is a game-changer for the industry';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "thought leader"', () => {
      const content = 'Recognized as a thought leader in the space';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "reimagine" and "reimagining"', () => {
      const content = 'Reimagining how software is built';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "revolutionize"', () => {
      const content = 'Revolutionizing the development process';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "transform the world"', () => {
      const content = 'Our mission is to transform the world';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "empower communities"', () => {
      const content = 'We empower communities to build better software';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect "mission-driven organizations"', () => {
      const content = 'Working with mission-driven organizations';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect multiple jargon terms', () => {
      const content = 'We leverage cutting-edge technology to disrupt the paradigm';
      const result = checkMarketingJargon(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(2);
    });
  });

  describe('checkAllForbiddenPatterns', () => {
    it('should pass when content has no forbidden patterns', () => {
      const content = 'We design and build reliable software for established organizations';
      const result = checkAllForbiddenPatterns(content);
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });

    it('should detect all types of violations', () => {
      const content = 'We empower 10000 users with cutting-edge solutions';
      const result = checkAllForbiddenPatterns(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(2);
    });

    it('should combine suggestions without duplicates', () => {
      const content = 'We empower and inspire teams with innovative solutions';
      const result = checkAllForbiddenPatterns(content);
      
      expect(result.passes).toBe(false);
      const uniqueSuggestions = new Set(result.suggestions);
      expect(uniqueSuggestions.size).toBe(result.suggestions.length);
    });
  });

  describe('forbiddenTermsRule', () => {
    it('should have correct name', () => {
      expect(forbiddenTermsRule.name).toBe('forbidden-terms');
    });

    it('should check content correctly', () => {
      const content = 'We empower teams';
      const result = forbiddenTermsRule.check(content);
      
      expect(result.passes).toBe(false);
    });

    it('should suggest replacements for forbidden terms', () => {
      const content = 'We empower and inspire teams to uplift their work';
      const suggested = forbiddenTermsRule.suggest(content);
      
      expect(suggested).not.toContain('empower');
      expect(suggested).not.toContain('inspire');
      expect(suggested).not.toContain('uplift');
      expect(suggested).toContain('enable');
      expect(suggested).toContain('guide');
      expect(suggested).toContain('support');
    });

    it('should replace "driven by innovation"', () => {
      const content = 'We are driven by innovation';
      const suggested = forbiddenTermsRule.suggest(content);
      
      expect(suggested).not.toContain('driven by innovation');
      expect(suggested).toContain('focused on reliable solutions');
    });

    it('should replace "Let\'s Build Something Amazing"', () => {
      const content = "Let's Build Something Amazing";
      const suggested = forbiddenTermsRule.suggest(content);
      
      expect(suggested).not.toContain('Build Something Amazing');
      expect(suggested).toContain('Tell us what you\'re trying to build');
    });
  });

  describe('unverifiableClaimsRule', () => {
    it('should have correct name', () => {
      expect(unverifiableClaimsRule.name).toBe('unverifiable-claims');
    });

    it('should check content correctly', () => {
      const content = 'Used by 10000 users';
      const result = unverifiableClaimsRule.check(content);
      
      expect(result.passes).toBe(false);
    });

    it('should suggest removing unverifiable claims', () => {
      const content = 'With 50000 users and thousands of downloads';
      const suggested = unverifiableClaimsRule.suggest(content);
      
      expect(suggested).not.toContain('50000 users');
      expect(suggested).not.toContain('thousands of downloads');
    });
  });

  describe('marketingJargonRule', () => {
    it('should have correct name', () => {
      expect(marketingJargonRule.name).toBe('marketing-jargon');
    });

    it('should check content correctly', () => {
      const content = 'We leverage cutting-edge technology';
      const result = marketingJargonRule.check(content);
      
      expect(result.passes).toBe(false);
    });

    it('should suggest replacements for jargon', () => {
      const content = 'We leverage cutting-edge technology to disrupt the paradigm';
      const suggested = marketingJargonRule.suggest(content);
      
      expect(suggested).not.toContain('leverage');
      expect(suggested).not.toContain('cutting-edge');
      expect(suggested).not.toContain('disrupt');
      expect(suggested).not.toContain('paradigm');
      expect(suggested).toContain('use');
      expect(suggested).toContain('modern');
      expect(suggested).toContain('improve');
      expect(suggested).toContain('approach');
    });

    it('should replace "mission-driven organizations"', () => {
      const content = 'We work with mission-driven organizations';
      const suggested = marketingJargonRule.suggest(content);
      
      expect(suggested).not.toContain('mission-driven organizations');
      expect(suggested).toContain('established organizations');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', () => {
      const result = checkAllForbiddenPatterns('');
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should handle content with only whitespace', () => {
      const result = checkAllForbiddenPatterns('   \n\t  ');
      
      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should handle terms within other words', () => {
      // "inspire" within "inspiration" should NOT be detected with word boundaries
      const content = 'Our inspiration comes from great design';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(true);
    });

    it('should handle mixed case variations', () => {
      const content = 'We EMPOWER teams and Inspire innovation';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations.length).toBeGreaterThan(1);
    });

    it('should handle content with special characters', () => {
      const content = 'We empower! And inspire? Yes, we uplift.';
      const result = checkForbiddenTerms(content);
      
      expect(result.passes).toBe(false);
      expect(result.violations).toHaveLength(3);
    });
  });
});
