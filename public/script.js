document.getElementById("genBtn").onclick = async () => {
  const creator = document.getElementById("creator").value;
  let res = await fetch("/.netlify/functions/generate-code", {
    method: "POST", body: JSON.stringify({ creator })
  });
  let json = await res.json();
  document.getElementById("genResult").textContent =
    json.code ? `Your code: ${json.code}` : `Error: ${json.error}`;
};

document.getElementById("redBtn").onclick = async () => {
  const code = document.getElementById("refCode").value;
  let res = await fetch("/.netlify/functions/redeem-code", {
    method: "POST", body: JSON.stringify({ code })
  });
  let json = await res.json();
  document.getElementById("redResult").textContent =
    json.success
      ? `Success! Referrer (${json.creator}) now has ${json.totalUses} uses.`
      : `Error: ${json.error}`;
};

