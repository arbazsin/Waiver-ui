async function submitForm() {

  const waive = document.getElementById("waive").checked;
  const response = document.getElementById("response").value;
  const justification = document.getElementById("justification").value;
  const comment = document.getElementById("comment").value;

  const fileInput = document.getElementById("attachment");
  const file = fileInput.files[0];

  const issueKey = window.location.pathname.split("/").pop();

  try {

    // ✅ UPDATE FIELDS
    await fetch(`/rest/api/3/issue/${issueKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          customfield_10615: justification,   // ✅ Justification
          customfield_10382: response,        // ✅ Response Details
          customfield_10619: waive ? "Yes" : "No"   // ⚠️ may need fix → see below
        }
      })
    });

    // ✅ ADD COMMENT
    await fetch(`/rest/api/3/issue/${issueKey}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: `
Waiver Request Submitted:

Waive: ${waive ? "Yes" : "No"}
Justification: ${justification}
Response: ${response}

User Comment:
${comment}
        `
      })
    });

    // ✅ UPLOAD ATTACHMENT (if selected)
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      await fetch(`/rest/api/3/issue/${issueKey}/attachments`, {
        method: "POST",
        headers: {
          "X-Atlassian-Token": "no-check"
        },
        body: formData
      });
    }

    alert("✅ Waiver request submitted successfully");

  } catch (e) {
    console.error(e);
    alert("❌ Error submitting waiver request");
  }
}
