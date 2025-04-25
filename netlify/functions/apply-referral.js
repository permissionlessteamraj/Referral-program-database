const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const { code, userId } = JSON.parse(event.body);
  const supabase = createClient(
    process.env.https://oexmwlofkkmngszkalgw.supabase.co,
    process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leG13bG9ma2ttbmdzemthbGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTc5MDksImV4cCI6MjA2MTA5MzkwOX0.ib6Yr1gDL1i_M-43nWJZc1yeDZwHxklKoezC_4ZCN80
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
