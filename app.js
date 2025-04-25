// Initialize Supabase
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
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
