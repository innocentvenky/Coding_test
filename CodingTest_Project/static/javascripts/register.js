function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

/* =====================
   EDIT ROW
===================== */
function editRow(btn) {
    const row = btn.closest("tr");
    const cells = row.querySelectorAll("td");

    cells.forEach((cell, index) => {
        if (index < 10) {
            cell.contentEditable = "true";
            cell.style.backgroundColor = "#f9fafb";
        }
    });

    btn.style.display = "none";
    row.querySelector(".btn-save").style.display = "inline-block";
}

/* =====================
   SAVE ROW (EMAIL BASED)
===================== */
function saveRow(btn) {
    const row = btn.closest("tr");

    // 🔥 Read email from data-email
    let email = row.dataset.email;

    if (!email) {
        alert("Email not found ❌");
        return;
    }

    // 🔥 VERY IMPORTANT: encode email
    const encodedEmail = encodeURIComponent(email);
    console.log("Sending email:", email);

    const cells = row.querySelectorAll("td");

    const payload = {
        student_name: cells[0].innerText.trim(),
        student_email: cells[1].innerText.trim(),
        student_dob: cells[2].innerText.trim(),
        student_id: cells[3].innerText.trim(),
        student_password: cells[4].innerText.trim(),
        exam_date: cells[5].innerText.trim(),
        is_active: cells[6].innerText.trim(),
        marks_obtained: cells[7].innerText.trim(),
        total_marks: cells[8].innerText.trim(),
        result: cells[9].innerText.trim(),
    };

    fetch(`/update/${encodedEmail}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert("Updated successfully ✅");

            // 🔥 Update data-email if email changed
            row.dataset.email = payload.student_email;

            cells.forEach(cell => {
                cell.contentEditable = "false";
                cell.style.backgroundColor = "";
            });

            btn.style.display = "none";
            row.querySelector(".btn-update").style.display = "inline-block";
        } else {
            alert("Update failed ❌");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Server error ❌");
    });
}

/* =====================
   SEARCH
===================== */
function searchStudent() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#studentTable tbody tr");

    rows.forEach(row => {
        const name = row.cells[0].innerText.toLowerCase();
        const email = row.cells[1].innerText.toLowerCase();

        row.style.display =
            name.includes(input) || email.includes(input) ? "" : "none";
    });
}

/* =====================
   RESET SEARCH
===================== */
function resetSearch() {
    document.getElementById("searchInput").value = "";
    document
        .querySelectorAll("#studentTable tbody tr")
        .forEach(row => row.style.display = "");
}
