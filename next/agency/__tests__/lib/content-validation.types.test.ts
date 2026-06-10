/**
 * Unit tests for content validation types
 * 
 * These tests verify that the TypeScript interfaces and types
 * are correctly defined and can be used as expected.
 */

import {
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
} from '@/lib/content-validation.types';

describe('Content Validation Types', () => {
  describe('ValidationResult', () => {
    it('should create a valid ValidationResult object', () => {
      const result: ValidationResult = {
        passes: true,
        violations: [],
        suggestions: ['Consider adding more specific language'],
      };

      expect(result.passes).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.suggestions).toHaveLength(1);
    });

    it('should handle validation failures with violations', () => {
      const result: ValidationResult = {
        passes: false,
        violations: ['Contains forbidden term: empower', 'Missing required CTA'],
        suggestions: ['Remove "empower" and use specific action verbs', 'Add primary CTA button'],
      };

      expect(result.passes).toBe(false);
      expect(result.violations).toHaveLength(2);
      expect(result.suggestions).toHaveLength(2);
    });
  });

  describe('ContentRefinementRule', () => {
    it('should create a valid ContentRefinementRule with check and suggest functions', () => {
      const rule: ContentRefinementRule = {
        name: 'forbidden-terms',
        check: (content: string) => ({
          passes: !content.includes('empower'),
          violations: content.includes('empower') ? ['Contains forbidden term: empower'] : [],
          suggestions: content.includes('empower') ? ['Use specific action verbs instead'] : [],
        }),
        suggest: (content: string) => content.replace(/empower/gi, 'enable'),
      };

      expect(rule.name).toBe('forbidden-terms');
      expect(typeof rule.check).toBe('function');
      expect(typeof rule.suggest).toBe('function');

      // Test the check function
      const checkResult = rule.check('We empower teams');
      expect(checkResult.passes).toBe(false);
      expect(checkResult.violations).toContain('Contains forbidden term: empower');

      // Test the suggest function
      const suggestion = rule.suggest('We empower teams');
      expect(suggestion).toBe('We enable teams');
    });
  });

  describe('EnterpriseSignalChecklist', () => {
    it('should create a valid EnterpriseSignalChecklist', () => {
      const checklist: EnterpriseSignalChecklist = {
        endToEndOwnership: true,
        productionExperience: true,
        technicalJudgment: true,
        calmExecution: true,
        selectivity: false,
      };

      expect(checklist.endToEndOwnership).toBe(true);
      expect(checklist.selectivity).toBe(false);
    });

    it('should handle all signals as false', () => {
      const checklist: EnterpriseSignalChecklist = {
        endToEndOwnership: false,
        productionExperience: false,
        technicalJudgment: false,
        calmExecution: false,
        selectivity: false,
      };

      const allFalse = Object.values(checklist).every(value => value === false);
      expect(allFalse).toBe(true);
    });
  });

  describe('ContentSection type', () => {
    it('should accept valid content section values', () => {
      const sections: ContentSection[] = [
        'hero',
        'selected-work',
        'project-card',
        'about',
        'services',
        'reviews',
        'contact',
        'footer',
      ];

      expect(sections).toHaveLength(8);
      expect(sections).toContain('hero');
      expect(sections).toContain('footer');
    });
  });

  describe('ContentAuditItem', () => {
    it('should create a valid ContentAuditItem', () => {
      const auditItem: ContentAuditItem = {
        section: 'hero',
        component: 'headline',
        currentContent: 'Let\'s Build Something Amazing',
        requirementRefs: ['7.2'],
        violatesRules: ['forbidden-terms'],
        proposedContent: 'Tell us what you\'re trying to build',
        priority: 'critical',
      };

      expect(auditItem.section).toBe('hero');
      expect(auditItem.priority).toBe('critical');
      expect(auditItem.violatesRules).toContain('forbidden-terms');
    });
  });

  describe('ContentValidation', () => {
    it('should create a valid ContentValidation report', () => {
      const validation: ContentValidation = {
        section: 'hero',
        passesGlobalRules: true,
        passesSpecificRequirements: true,
        enterpriseSignals: {
          endToEndOwnership: true,
          productionExperience: true,
          technicalJudgment: false,
          calmExecution: true,
          selectivity: false,
        },
        recommendations: ['Consider adding technical judgment signals'],
      };

      expect(validation.section).toBe('hero');
      expect(validation.passesGlobalRules).toBe(true);
      expect(validation.recommendations).toHaveLength(1);
    });
  });

  describe('CopyRefinement', () => {
    it('should create a valid CopyRefinement record', () => {
      const refinement: CopyRefinement = {
        original: 'We empower mission-driven organizations to build amazing products',
        refined: 'We build reliable software for established organizations',
        rationale: 'Removed forbidden terms and made language more specific',
        requirementRefs: ['9.2', '9.4'],
        beforeWordCount: 9,
        afterWordCount: 8,
        changeType: 'clarify',
      };

      expect(refinement.beforeWordCount).toBe(9);
      expect(refinement.afterWordCount).toBe(8);
      expect(refinement.changeType).toBe('clarify');
      expect(refinement.afterWordCount).toBeLessThan(refinement.beforeWordCount);
    });

    it('should handle different change types', () => {
      const changeTypes: ChangeType[] = ['shorten', 'clarify', 'harden', 'remove'];
      
      changeTypes.forEach(changeType => {
        const refinement: CopyRefinement = {
          original: 'Original text',
          refined: 'Refined text',
          rationale: `Applied ${changeType} change`,
          requirementRefs: [],
          beforeWordCount: 2,
          afterWordCount: 2,
          changeType,
        };

        expect(refinement.changeType).toBe(changeType);
      });
    });
  });

  describe('ProjectCard', () => {
    it('should create a valid ProjectCard', () => {
      const projectCard: ProjectCard = {
        title: 'Enterprise Task Manager',
        problemStatement: 'Teams need a reliable way to track complex projects',
        organizationType: 'Mid-size technology companies',
        technicalStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
        description: 'A production-ready task management system built end-to-end',
      };

      expect(projectCard.title).toBe('Enterprise Task Manager');
      expect(projectCard.technicalStack).toHaveLength(4);
      expect(projectCard.problemStatement).toContain('reliable');
    });
  });

  describe('Review', () => {
    it('should create a valid Review', () => {
      const review: Review = {
        quote: 'Delivered on time with clear communication throughout',
        clientName: 'Jane Smith',
        clientRole: 'CTO',
        emphasis: 'delivery',
      };

      expect(review.emphasis).toBe('delivery');
      expect(review.clientRole).toBe('CTO');
    });

    it('should handle different review emphasis types', () => {
      const emphases: ReviewEmphasis[] = [
        'professionalism',
        'clarity',
        'delivery',
        'calm_execution',
      ];

      emphases.forEach(emphasis => {
        const review: Review = {
          quote: 'Great work',
          clientName: 'Test Client',
          clientRole: 'Manager',
          emphasis,
        };

        expect(review.emphasis).toBe(emphasis);
      });
    });
  });

  describe('ServicePackage', () => {
    it('should create a valid ServicePackage', () => {
      const servicePackage: ServicePackage = {
        name: 'Product Build',
        startingPointFraming: 'This is a typical starting point for product builds',
        flexibilitySignal: 'Scoped collaboratively based on your needs',
        scopeApproach: 'Adjusted based on complexity and requirements',
        typicalIncludes: [
          'Product strategy',
          'Design system',
          'Full-stack development',
          'Production deployment',
        ],
      };

      expect(servicePackage.name).toBe('Product Build');
      expect(servicePackage.typicalIncludes).toHaveLength(4);
      expect(servicePackage.flexibilitySignal).toContain('collaboratively');
    });
  });

  describe('ValidationReport', () => {
    it('should create a valid ValidationReport', () => {
      const report: ValidationReport = {
        timestamp: new Date('2024-01-15T10:00:00Z'),
        sectionValidations: [
          {
            section: 'hero',
            passesGlobalRules: true,
            passesSpecificRequirements: true,
            enterpriseSignals: {
              endToEndOwnership: true,
              productionExperience: true,
              technicalJudgment: true,
              calmExecution: true,
              selectivity: true,
            },
            recommendations: [],
          },
        ],
        overallPass: true,
        totalViolations: 0,
        totalRecommendations: 0,
        enterpriseSignalsSummary: {
          endToEndOwnership: true,
          productionExperience: true,
          technicalJudgment: true,
          calmExecution: true,
          selectivity: true,
        },
      };

      expect(report.overallPass).toBe(true);
      expect(report.totalViolations).toBe(0);
      expect(report.sectionValidations).toHaveLength(1);
      expect(report.timestamp).toBeInstanceOf(Date);
    });

    it('should handle validation failures', () => {
      const report: ValidationReport = {
        timestamp: new Date(),
        sectionValidations: [
          {
            section: 'about',
            passesGlobalRules: false,
            passesSpecificRequirements: false,
            enterpriseSignals: {
              endToEndOwnership: false,
              productionExperience: false,
              technicalJudgment: false,
              calmExecution: false,
              selectivity: false,
            },
            recommendations: [
              'Remove forbidden terms',
              'Add enterprise signals',
            ],
          },
        ],
        overallPass: false,
        totalViolations: 5,
        totalRecommendations: 2,
        enterpriseSignalsSummary: {
          endToEndOwnership: false,
          productionExperience: false,
          technicalJudgment: false,
          calmExecution: false,
          selectivity: false,
        },
      };

      expect(report.overallPass).toBe(false);
      expect(report.totalViolations).toBe(5);
      expect(report.totalRecommendations).toBe(2);
    });
  });
});
