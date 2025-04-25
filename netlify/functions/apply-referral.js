const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const { code, userId } = JSON.parse(event.body);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  // Validate code
  const { data: referrer } = await supabase
    .from('users')
    .select('id')
    .eq('referral_code', code)
    .single();

  if (!referrer) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid code' }) };

  // Process referral
  const { error } = await supabase.rpc('process_referral', {
    code_input: code,
    referee_id: userId
  });

  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
