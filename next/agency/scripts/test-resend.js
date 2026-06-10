// Test Resend configuration
// Run with: node scripts/test-resend.js

const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

console.log('\n=== Resend Configuration Test ===\n');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
  console.log('✓ Loaded .env.local file\n');
} else {
  console.error('❌ .env.local file not found!');
  console.log('   Create a .env.local file in the project root with your Resend credentials.\n');
  process.exit(1);
}

// Check environment variables
console.log('1. Checking environment variables:');
console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 8)}...` : 'NOT SET');
console.log('   RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'NOT SET (will use onboarding@resend.dev)');
console.log('   RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL || 'NOT SET');
console.log('   BCC_EMAIL:', process.env.BCC_EMAIL || 'NOT SET');

if (!process.env.RESEND_API_KEY) {
  console.error('\n❌ ERROR: RESEND_API_KEY is not set in .env.local');
  console.log('\n📋 To get your API key:');
  console.log('   1. Go to https://resend.com/signup');
  console.log('   2. Sign up (no credit card needed)');
  console.log('   3. Go to https://resend.com/api-keys');
  console.log('   4. Create a new API key');
  console.log('   5. Add it to your .env.local file\n');
  process.exit(1);
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Prepare test email
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const toEmail = process.env.RECIPIENT_EMAIL || 'delivered@resend.dev';

const emailData = {
  from: fromEmail,
  to: toEmail,
  subject: 'Resend Test Email - Sakia Labs',
  html: '<p>This is a test email from your Sakia Labs contact form setup using Resend.</p><p>If you received this, your email configuration is working! 🎉</p>',
};

if (process.env.BCC_EMAIL) {
  emailData.bcc = process.env.BCC_EMAIL;
}

console.log('\n2. Attempting to send test email...');
console.log('   From:', emailData.from);
console.log('   To:', emailData.to);
if (emailData.bcc) console.log('   BCC:', emailData.bcc);

// Send email
resend.emails.send(emailData)
  .then((result) => {
    console.log('\n✅ SUCCESS! Test email sent successfully.');
    console.log('   Email ID:', result.data?.id || result.id);
    console.log('   Check your inbox at:', emailData.to);
    if (emailData.bcc) console.log('   Also check BCC inbox at:', emailData.bcc);
    console.log('\n📧 Your contact form is ready to use!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR: Failed to send email\n');
    console.error('Error details:', error.message);
    
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
    
    console.log('\n📋 Common Issues:');
    console.log('  1. API key is invalid or expired');
    console.log('  2. From email domain is not verified (use onboarding@resend.dev for testing)');
    console.log('  3. Resend account has issues');
    console.log('  4. Rate limit exceeded (100 emails/day on free tier)');
    console.log('\n💡 Tip: Use onboarding@resend.dev as RESEND_FROM_EMAIL for testing\n');
    
    process.exit(1);
  });
