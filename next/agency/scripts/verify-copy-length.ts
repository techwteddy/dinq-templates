/**
 * Script to verify copy length constraint (Requirement 11.2)
 * Ensures refined copy is not longer than original (or max 10% longer)
 */

interface CopyComparison {
  section: string;
  field: string;
  originalWordCount: number;
  refinedWordCount: number;
  percentageChange: number;
  passes: boolean;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function calculatePercentageChange(original: number, refined: number): number {
  if (original === 0) return refined > 0 ? 100 : 0;
  return ((refined - original) / original) * 100;
}

function verifyLengthConstraint(
  section: string,
  field: string,
  originalText: string,
  refinedText: string
): CopyComparison {
  const originalWordCount = countWords(originalText);
  const refinedWordCount = countWords(refinedText);
  const percentageChange = calculatePercentageChange(originalWordCount, refinedWordCount);
  
  // Passes if refined is shorter or at most 10% longer
  const passes = percentageChange <= 10;
  
  return {
    section,
    field,
    originalWordCount,
    refinedWordCount,
    percentageChange,
    passes,
  };
}

// Original content (before refinement)
const originalContent = {
  values: [
    {
      title: "Care",
      description: "We build with care, pride in our craft, respect for the people using it, and responsibility for what we leave behind.",
    },
    {
      title: "Collaboration",
      description: "We work closely with our clients, valuing their input and fostering a spirit of teamwork to achieve the best results.",
    },
    {
      title: "Integrity",
      description: "We uphold the highest standards of honesty and transparency in all our interactions and deliverables.",
    },
    {
      title: "Sustainability",
      description: "We create solutions that are effective and sustainable, delivering long-term benefits for our clients.",
    },
  ],
  differentiators: [
    {
      title: "Lightning Fast",
      description: "We move quickly without sacrificing quality. Most projects launch in 4-8 weeks, not months.",
    },
    {
      title: "Radically Transparent",
      description: "No surprises, no hidden costs. You'll know exactly what we're building and why, every step of the way.",
    },
    {
      title: "Technical Excellence",
      description: "We use modern, battle-tested technologies and follow best practices to ensure your product is built to last.",
    },
    {
      title: "True Partnership",
      description: "We're not just contractors, we're invested in your success. Your wins are our wins.",
    },
  ],
  expertiseAreas: [
    {
      title: "Product Strategy & UX",
      description: "Typical engagement includes defining the right product, designing intuitive experiences, and validating ideas with real users. Scoped collaboratively based on your product stage.",
    },
    {
      title: "Web & Mobile Development",
      description: "We build fast, reliable, and beautiful applications using modern frameworks and best practices. Adjusted based on complexity and technical requirements.",
    },
    {
      title: "Data & AI Integration",
      description: "Typical engagement integrates intelligent features that make your product smarter and more valuable to users. Scoped collaboratively based on your data maturity.",
    },
    {
      title: "Growth & Marketing",
      description: "We help you reach your audience, optimize conversions, and scale your digital presence. Adjusted based on your growth stage and channels.",
    },
  ],
};

// Refined content (after refinement)
const refinedContent = {
  values: [
    {
      title: "Careful Execution",
      description: "We test thoroughly, document clearly, and maintain code that others can understand and extend.",
    },
    {
      title: "Direct Communication",
      description: "We provide regular updates, clear timelines, and honest assessments of what's working and what needs adjustment.",
    },
    {
      title: "Reliable Delivery",
      description: "We scope projects realistically, deliver incrementally, and support systems through launch and stabilization.",
    },
    {
      title: "Long-term Thinking",
      description: "We build systems that can scale, use stable technologies, and create documentation for future maintenance.",
    },
  ],
  differentiators: [
    {
      title: "Efficient Delivery",
      description: "We scope projects clearly, work in focused sprints, and deliver production-ready systems in weeks, not months.",
    },
    {
      title: "Clear Process",
      description: "We provide weekly updates, share work-in-progress demos, and document decisions so you understand what we're building and why.",
    },
    {
      title: "Production-Ready Code",
      description: "We use proven frameworks, write tests for critical paths, and follow practices that ensure systems are maintainable and reliable.",
    },
    {
      title: "Ongoing Support",
      description: "We stay involved through launch, provide documentation for handoff, and offer maintenance support as systems stabilize.",
    },
  ],
  expertiseAreas: [
    {
      title: "Product Strategy & UX",
      description: "We define product requirements, design user interfaces, and validate assumptions through prototyping and testing. Scoped collaboratively based on your product stage.",
    },
    {
      title: "Web & Mobile Development",
      description: "We build responsive web applications and mobile products using modern frameworks. Adjusted based on complexity and technical requirements.",
    },
    {
      title: "Data & AI Integration",
      description: "We integrate data pipelines, machine learning models, and intelligent features into production systems. Scoped collaboratively based on your data maturity.",
    },
    {
      title: "Growth & Marketing",
      description: "We optimize site performance, implement analytics, and set up conversion tracking. Adjusted based on your growth stage and channels.",
    },
  ],
};

// Run comparisons
const comparisons: CopyComparison[] = [];

// Compare values
originalContent.values.forEach((original, index) => {
  const refined = refinedContent.values[index];
  
  comparisons.push(
    verifyLengthConstraint(
      "Values",
      `${original.title} - Title`,
      original.title,
      refined.title
    )
  );
  
  comparisons.push(
    verifyLengthConstraint(
      "Values",
      `${original.title} - Description`,
      original.description,
      refined.description
    )
  );
});

// Compare differentiators
originalContent.differentiators.forEach((original, index) => {
  const refined = refinedContent.differentiators[index];
  
  comparisons.push(
    verifyLengthConstraint(
      "Differentiators",
      `${original.title} - Title`,
      original.title,
      refined.title
    )
  );
  
  comparisons.push(
    verifyLengthConstraint(
      "Differentiators",
      `${original.title} - Description`,
      original.description,
      refined.description
    )
  );
});

// Compare expertise areas
originalContent.expertiseAreas.forEach((original, index) => {
  const refined = refinedContent.expertiseAreas[index];
  
  comparisons.push(
    verifyLengthConstraint(
      "Expertise Areas",
      `${original.title} - Description`,
      original.description,
      refined.description
    )
  );
});

// Print results
console.log("\n=== Copy Length Constraint Verification ===\n");
console.log("Requirement 11.2: Refined copy should not be longer than original (or max 10% longer)\n");

let allPassed = true;

comparisons.forEach((comparison) => {
  const status = comparison.passes ? "✓ PASS" : "✗ FAIL";
  const changeIndicator = comparison.percentageChange > 0 ? "+" : "";
  
  console.log(`${status} | ${comparison.section} - ${comparison.field}`);
  console.log(`  Original: ${comparison.originalWordCount} words`);
  console.log(`  Refined: ${comparison.refinedWordCount} words`);
  console.log(`  Change: ${changeIndicator}${comparison.percentageChange.toFixed(1)}%`);
  console.log();
  
  if (!comparison.passes) {
    allPassed = false;
  }
});

// Summary
const totalComparisons = comparisons.length;
const passedComparisons = comparisons.filter(c => c.passes).length;
const failedComparisons = totalComparisons - passedComparisons;

console.log("=== Summary ===");
console.log(`Total comparisons: ${totalComparisons}`);
console.log(`Passed: ${passedComparisons}`);
console.log(`Failed: ${failedComparisons}`);
console.log();

if (allPassed) {
  console.log("✓ All copy length constraints satisfied!");
  process.exit(0);
} else {
  console.log("✗ Some copy length constraints violated!");
  process.exit(1);
}
