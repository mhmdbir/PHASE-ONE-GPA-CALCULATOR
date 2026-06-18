const courses = [
    { name: "Phase I Committee Courses (Integrated)", credits: 32 },
    { name: "SOM", credits: 8 },
    { name: "Medical Research", credits: 2 },
    { name: "Biology elective (BIR355)", credits: 4 },
    { name: "Biology elective (BIR351)", credits: 4 },
    { name: "German I", credits: 2 },
    { name: "German II", credits: 2 },
    { name: "Turkish I", credits: 2 },
    { name: "Turkish II", credits: 2 },
    { name: "Career Planning", credits: 2 }
];

function convertScore(score) {
    if (score === null || score === "" || isNaN(score)) return { grade: "-", value: null };
    if (score >= 90 && score <= 100) return { grade: "AA", value: 4.00 };
    if (score >= 85 && score <= 89)  return { grade: "BA", value: 3.50 };
    if (score >= 75 && score <= 84)  return { grade: "BB", value: 3.00 };
    if (score >= 70 && score <= 74)  return { grade: "CB", value: 2.50 };
    if (score >= 60 && score <= 69)  return { grade: "CC", value: 2.00 };
    if (score >= 0  && score <= 59)  return { grade: "FF", value: 0.00 };
    return { grade: "Invalid", value: null };
}

window.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('course-rows');

    courses.forEach((course, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="course-name">${course.name}</span></td>
            <td><span class="course-credits">${course.credits} Cr</span></td>
            <td><input type="number" min="0" max="100" placeholder="0-100" data-index="${index}"></td>
            <td><span class="grade-badge" id="grade-${index}">-</span></td>
        `;
        tbody.appendChild(tr);
    });

    tbody.addEventListener('input', calculateGPA);
});

function calculateGPA() {
    let totalGradePoints = 0;
    let totalWeightedScorePoints = 0;
    let totalCreditsCounted = 0;

    courses.forEach((course, index) => {
        const input = document.querySelector(`input[data-index="${index}"]`);
        const score = input && input.value !== "" ? parseFloat(input.value) : null;
        
        const conversion = convertScore(score);
        const gradeCell = document.getElementById(`grade-${index}`);

        if (conversion.value !== null && conversion.grade !== "Invalid") {
            gradeCell.textContent = conversion.grade;
            gradeCell.className = conversion.grade === "FF" ? "grade-badge fail-grade" : "grade-badge active-grade";
            
            totalGradePoints += (course.credits * conversion.value);
            totalWeightedScorePoints += (score * course.credits);
            totalCreditsCounted += course.credits;
        } else {
            gradeCell.textContent = "-";
            gradeCell.className = "grade-badge";
        }
    });

    const gpaOutput = document.getElementById('gpa-output');
    const scoreOutput = document.getElementById('score-output');
    const creditsOutput = document.getElementById('credits-output');

    if (totalCreditsCounted > 0) {
        const finalGPA = totalGradePoints / totalCreditsCounted;
        const finalScore = totalWeightedScorePoints / totalCreditsCounted;

        gpaOutput.textContent = finalGPA.toFixed(3);
        scoreOutput.textContent = finalScore.toFixed(2) + "%";
        creditsOutput.textContent = `${totalCreditsCounted} of 60 Credits Active`;
    } else {
        gpaOutput.textContent = "0.000";
        scoreOutput.textContent = "0.00%";
        creditsOutput.textContent = "0 of 60 Credits Active";
    }
}