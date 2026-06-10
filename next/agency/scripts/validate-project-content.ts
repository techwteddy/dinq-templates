/**
 * Validation script for project content
 * Checks if project descriptions meet enterprise positioning requirements
 */

import { 
  checkAllForbiddenPatterns,
  checkUnverifiableClaims 
} from '../lib/content-validation/forbidden-terms';

// Project data extracted directly to avoid image imports
const projectsData = [
  {
    title: "TapIn",
    description: "Digital access control for multi-tenant buildings. Replaces physical keys with secure wallet-based passes. Tenants unlock doors using Apple Wallet or Google Wallet, while property managers control access from a centralized dashboard.",
  },
  {
    title: "Nimbly",
    description: "Grocery savings aggregator for budget-conscious shoppers. Surfaces personalized deals and clearance items from nearby stores in a simple interface. Helps users reduce grocery costs without complex coupon management.",
  },
  {
    title: "Chapters",
    description: "Rate-limited social platform for writers and readers. Users share one post per day, designed to reduce content overload and encourage more thoughtful engagement. Built for communities seeking alternatives to high-frequency social feeds.",
  },
  {
    title: "fLOKr",
    description: "Resource coordination platform for community organizations. Connects people to local resources, mentorship, and mutual aid networks. Designed for newcomers, community groups, and grassroots organizations managing referrals and support networks.",
  },
  {
    title: "Makana",
    description: "Practice tracking platform for personal development. Focuses on clarity and consistency without gamification. Built for individuals and small groups tracking habits, reflections, and progress over time.",
  },
  {
    title: "RezGenie",
    description: "AI-powered resume feedback tool for job seekers. Provides structure, clarity, and improvement suggestions while preserving authentic voice. Helps users strengthen resumes without generic corporate language.",
  },
  {
    title: "RiseUp",
    description: "Event discovery platform for grassroots organizing. Helps people find local events, initiatives, and causes through chronological feeds instead of algorithmic ranking. Built for organizers and activists coordinating local action.",
  },
  {
    title: "sNDa",
    description: "Humanitarian coordination platform for Sudanese communities. Manages aid distribution, referrals, and community storytelling for populations affected by conflict and displacement. Includes multilingual support for Arabic and English.",
  },
  {
    title: "Takia",
    description: "Operations platform for community kitchens. Manages food sourcing, volunteer coordination, and distribution for shared kitchen initiatives. Designed for community-led food security programs and zero-waste kitchen operations.",
  },
];

console.log('🔍 Validating project content against enterprise positioning requirements...\n');

let allPassed = true;

projectsData.forEach((project, index) => {
  console.log(`\n📋 Project ${index + 1}: ${project.title}`);
  console.log(`Description: ${project.description.substring(0, 80)}...`);
  
  // Check for forbidden patterns
  const forbiddenResult = checkAllForbiddenPatterns(project.description);
  
  if (!forbiddenResult.passes) {
    console.log('❌ FAILED: Contains forbidden patterns');
    forbiddenResult.violations.forEach(v => console.log(`   - ${v}`));
    allPassed = false;
  } else {
    console.log('✅ PASSED: No forbidden patterns detected');
  }
  
  // Check for unverifiable claims specifically
  const claimsResult = checkUnverifiableClaims(project.description);
  
  if (!claimsResult.passes) {
    console.log('❌ FAILED: Contains unverifiable claims');
    claimsResult.violations.forEach(v => console.log(`   - ${v}`));
    allPassed = false;
  } else {
    console.log('✅ PASSED: No unverifiable claims');
  }
  
  // Check for clear problem statement (basic heuristic)
  const hasVerb = /\b(replaces|surfaces|helps|connects|manages|provides|tracks|coordinates|focuses|includes|designed)\b/i.test(project.description);
  const hasPurpose = project.description.length > 50;
  
  if (hasVerb && hasPurpose) {
    console.log('✅ PASSED: Contains clear problem statement');
  } else {
    console.log('⚠️  WARNING: Problem statement may need clarification');
  }
});

console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('✅ ALL PROJECTS PASSED VALIDATION');
  process.exit(0);
} else {
  console.log('❌ SOME PROJECTS FAILED VALIDATION');
  process.exit(1);
}
