// Initialize Supabase
const supabaseUrl = 'https://oexmwlofkkmngszkalgw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leG13bG9ma2ttbmdzemthbGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTc5MDksImV4cCI6MjA2MTA5MzkwOX0.ib6Yr1gDL1i_M-43nWJZc1yeDZwHxklKoezC_4ZCN80';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const authSection = document.getElementById('authSection');
const dashboard = document.getElementById('dashboard');
const githubAuthBtn = document.getElementById('githubAuthBtn');
const copyBtn = document.getElementById('copyBtn');

// GitHub Auth
githubAuthBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.href }
  });
  if (error) console.error(error);
});

// Check Auth State
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    authSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('username').textContent = session.user.user_metadata.user_name;
    await initializeUser(session.user);
  }
});

// Initialize User Profile
async function initializeUser(user) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!data) {
    const referralCode = generateReferralCode();
    await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      github_username: user.user_metadata.user_name,
      referral_code: referralCode
    });
    document.getElementById('userCode').textContent = referralCode;
  } else {
    document.getElementById('userCode').textContent = data.referral_code;
  }
}

// Generate Random Code
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Copy Code
copyBtn.addEventListener('click', () => {
  const code = document.getElementById('userCode').textContent;
  navigator.clipboard.writeText(code);
  document.getElementById('status').textContent = 'Copied!';
});
