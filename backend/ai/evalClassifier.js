require('dotenv').config();
const { classifyIssue, ALLOWED_CATEGORIES } = require('./classify');

const TEST_SUITE = [
  // 1. Criminal Defence
  { text: "My brother has been accused of theft and the police are questioning him.", expectedCategory: "Criminal Defence", expectedUrgency: "routine" },
  { text: "Accused of assault in a local dispute and need criminal defense representation.", expectedCategory: "Criminal Defence", expectedUrgency: "routine" },

  // 2. Family Law
  { text: "Seeking child custody after separation from my husband.", expectedCategory: "Family Law", expectedUrgency: "routine" },
  { text: "Dispute over adoption papers and guardianship rights of a minor.", expectedCategory: "Family Law", expectedUrgency: "routine" },

  // 3. Property Law
  { text: "The builder has delayed possession of my flat by 2 years and refusing refund.", expectedCategory: "Property Law", expectedUrgency: "routine" },
  { text: "Land dispute with neighbor over boundary demarcation and trespass.", expectedCategory: "Property Law", expectedUrgency: "routine" },

  // 4. Corporate Law
  { text: "Need assistance drafting a shareholder agreement for a new startup venture.", expectedCategory: "Corporate Law", expectedUrgency: "routine" },
  { text: "Co-founder dispute regarding equity distribution and company incorporation.", expectedCategory: "Corporate Law", expectedUrgency: "routine" },

  // 5. Consumer Rights
  { text: "Purchased a defective laptop online and seller is refusing warranty repair.", expectedCategory: "Consumer Rights", expectedUrgency: "routine" },
  { text: "Flight cancelled without refund by airline despite booking insurance.", expectedCategory: "Consumer Rights", expectedUrgency: "routine" },

  // 6. Labour Law
  { text: "Employer terminated my contract without notice pay or severance bonus.", expectedCategory: "Labour Law", expectedUrgency: "routine" },
  { text: "Unpaid salary for 4 months from my previous IT employer.", expectedCategory: "Labour Law", expectedUrgency: "routine" },

  // 7. Cyber Law
  { text: "Victim of online banking phishing fraud where funds were stolen from my account.", expectedCategory: "Cyber Law", expectedUrgency: "routine" },
  { text: "Someone created a fake profile using my photos on social media to harass me.", expectedCategory: "Cyber Law", expectedUrgency: "routine" },

  // 8. Intellectual Property
  { text: "Need to register a trademark for my new brand logo and business name.", expectedCategory: "Intellectual Property", expectedUrgency: "routine" },
  { text: "Competitor is copying my patented medical device design.", expectedCategory: "Intellectual Property", expectedUrgency: "routine" },

  // 9. Taxation
  { text: "Received income tax notice under Section 143 for mismatched income returns.", expectedCategory: "Taxation", expectedUrgency: "routine" },
  { text: "GST audit notice issued to my trading firm.", expectedCategory: "Taxation", expectedUrgency: "routine" },

  // 10. Civil Disputes
  { text: "Need to recover money loaned to a friend who is refusing to repay.", expectedCategory: "Civil Disputes", expectedUrgency: "routine" },

  // 11. Divorce
  { text: "Want to file a mutual consent divorce petition with alimony settlement terms.", expectedCategory: "Divorce", expectedUrgency: "routine" },

  // 12. Bail & FIR / Emergency Cases
  { text: "POLICE HAVE ARRESTED MY SON AND HE IS IN LOCKUP! Need emergency bail right now!", expectedCategory: "Bail & FIR", expectedUrgency: "emergency" },
  { text: "FIR lodged against me under IPC 420, police are coming to my house to arrest me tonight!", expectedCategory: "Bail & FIR", expectedUrgency: "emergency" }
];

async function runClassifierEvaluation() {
  console.log('====================================================');
  console.log('  JUSTICE JUNCTION 24/7 — AI CLASSIFIER EVALUATION ');
  console.log('====================================================\n');

  let categoryMatches = 0;
  let urgencyMatches = 0;
  const total = TEST_SUITE.length;

  const categoryStats = {};
  ALLOWED_CATEGORIES.forEach(c => {
    categoryStats[c] = { total: 0, correct: 0 };
  });

  console.log(`Running evaluation on ${total} test cases...\n`);

  for (let i = 0; i < TEST_SUITE.length; i++) {
    const testCase = TEST_SUITE[i];
    const prediction = await classifyIssue(testCase.text);

    const isCategoryCorrect = prediction.category === testCase.expectedCategory;
    const isUrgencyCorrect = prediction.urgency === testCase.expectedUrgency;

    if (isCategoryCorrect) categoryMatches++;
    if (isUrgencyCorrect) urgencyMatches++;

    if (categoryStats[testCase.expectedCategory]) {
      categoryStats[testCase.expectedCategory].total++;
      if (isCategoryCorrect) categoryStats[testCase.expectedCategory].correct++;
    }

    const catStatus = isCategoryCorrect ? '✅ PASS' : `❌ FAIL (Got: ${prediction.category})`;
    const urgStatus = isUrgencyCorrect ? '✅' : `❌ (Got: ${prediction.urgency})`;

    console.log(`[Test ${String(i + 1).padStart(2, '0')}] ${catStatus} | Urgency: ${urgStatus}`);
    console.log(`  Text    : "${testCase.text.substring(0, 75)}..."`);
    console.log(`  Expected: Category="${testCase.expectedCategory}", Urgency="${testCase.expectedUrgency}"`);
    console.log(`  Predicted: Category="${prediction.category}", Urgency="${prediction.urgency}" (Conf: ${prediction.confidence})\n`);
  }

  const categoryAccuracy = Math.round((categoryMatches / total) * 100);
  const urgencyAccuracy = Math.round((urgencyMatches / total) * 100);

  console.log('====================================================');
  console.log('                EVALUATION SUMMARY                  ');
  console.log('====================================================');
  console.log(`Category Classification Accuracy : ${categoryMatches}/${total} (${categoryAccuracy}%)`);
  console.log(`Urgency Detection Accuracy       : ${urgencyMatches}/${total} (${urgencyAccuracy}%)\n`);

  console.log('--- PER-CATEGORY BREAKDOWN ---');
  ALLOWED_CATEGORIES.forEach(cat => {
    const stat = categoryStats[cat];
    if (stat.total > 0) {
      const acc = Math.round((stat.correct / stat.total) * 100);
      console.log(`- ${cat.padEnd(25)} : ${stat.correct}/${stat.total} (${acc}%)`);
    } else {
      console.log(`- ${cat.padEnd(25)} : N/A (No test cases)`);
    }
  });

  console.log('\n====================================================');
  console.log('       ✅ AI CLASSIFIER EVALUATION COMPLETE         ');
  console.log('====================================================');
}

if (require.main === module) {
  runClassifierEvaluation().catch(console.error);
}

module.exports = {
  runClassifierEvaluation
};
