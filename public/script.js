async function handleResponse(res, resultElement) {
  let json;
  try {
    json = await res.json();
  } catch (e) {
    console.error("Invalid JSON:", await res.text());
    resultElement.textContent = "Error parsing response";
    return;
  }
  console.log("Function response:", json);
  if (json.error) {
    resultElement.textContent = `Error: ${json.error}`;
  } else {
    // for generate
    if (json.code) resultElement.textContent = `Your code: ${json.code}`;
    // for redeem
    if (json.success) resultElement.textContent =
      `Success! Referrer (${json.creator}) now has ${json.totalUses} uses.`;
  }
}

document.getElementById("genBtn").onclick = async () => {
  const creator = document.getElementById("creator").value;
  const res = await fetch("/.netlify/functions/generate-code", {
    method: "POST",
    body: JSON.stringify({ creator })
  });
  handleResponse(res, document.getElementById("genResult"));
};

document.getElementById("redBtn").onclick = async () => {
  const code = document.getElementById("refCode").value;
  const res = await fetch("/.netlify/functions/redeem-code", {
    method: "POST",
    body: JSON.stringify({ code })
  });
  handleResponse(res, document.getElementById("redResult"));
};
