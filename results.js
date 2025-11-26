// Results data storage
let results = [];
let students = [];
let editingId = null;
let deleteId = null;
let filteredResults = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    populateDropdowns();
    applyFilters();
});

// Load data from localStorage
function loadData() {
    const savedResults = localStorage.getItem('results');
    if (savedResults) {
        results = JSON.parse(savedResults);
    } else {
        // Sample data
        results = [
            {
                id: 1,
                studentName: 'John Doe',
                subject: 'Mathematics',
                marks: 95,
                examDate: '2024-03-15'
            },
            {
                id: 2,
                studentName: 'Jane Smith',
                subject: 'Physics',
                marks: 88,
                examDate: '2024-03-16'
            },
            {
                id: 3,
                studentName: 'Mike Johnson',
                subject: 'Chemistry',
                marks: 76,
                examDate: '2024-03-17'
            },
            {
                id: 4,
                studentName: 'John Doe',
                subject: 'Physics',
                marks: 82,
                examDate: '2024-03-18'
            },
            {
                id: 5,
                studentName: 'Jane Smith',
                subject: 'Mathematics',
                marks: 92,
                examDate: '2024-03-19'
            }
        ];
        saveData();
    }

    // Load students
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('results', JSON.stringify(results));
}

// Populate dropdowns
function populateDropdowns() {
    // Populate student dropdown in form
    const studentSelect = document.getElementById('resultStudent');
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });

    // Populate filter dropdowns
    const uniqueStudents = [...new Set(results.map(r => r.studentName))];
    const studentFilter = document.getElementById('studentFilter');
    studentFilter.innerHTML = '<option value="">All Students</option>';
    uniqueStudents.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        studentFilter.appendChild(option);
    });

    const uniqueSubjects = [...new Set(results.map(r => r.subject))];
    const subjectFilter = document.getElementById('subjectFilter');
    subjectFilter.innerHTML = '<option value="">All Subjects</option>';
    uniqueSubjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
}

// Calculate grade based on marks
function calculateGrade(marks) {
    if (marks >= 90) return { grade: 'A+', class: 'grade-a-plus' };
    if (marks >= 80) return { grade: 'A', class: 'grade-a' };
    if (marks >= 70) return { grade: 'B', class: 'grade-b' };
    if (marks >= 60) return { grade: 'C', class: 'grade-c' };
    if (marks >= 50) return { grade: 'D', class: 'grade-d' };
    return { grade: 'F', class: 'grade-f' };
}

// Apply filters
function applyFilters() {
    const studentFilter = document.getElementById('studentFilter').value;
    const subjectFilter = document.getElementById('subjectFilter').value;

    filteredResults = results.filter(result => {
        const matchStudent = !studentFilter || result.studentName === studentFilter;
        const matchSubject = !subjectFilter || result.subject === subjectFilter;
        return matchStudent && matchSubject;
    });

    renderTable();
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Render table
function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (filteredResults.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No records found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredResults.map(result => {
        const gradeInfo = calculateGrade(result.marks);
        return `
            <tr>
                <td><strong>${result.studentName}</strong></td>
                <td>${result.subject}</td>
                <td><strong>${result.marks}</strong>/100</td>
                <td><span class="grade-badge ${gradeInfo.class}">${gradeInfo.grade}</span></td>
                <td>${formatDate(result.examDate)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editResult(${result.id})">✏️ Edit</button>
                        <button class="btn-delete" onclick="deleteResult(${result.id})">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Open modal
function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Result';
    document.getElementById('submitBtn').textContent = 'Create Result';
    document.getElementById('resultForm').reset();
    document.getElementById('resultModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('resultModal').classList.remove('show');
    document.getElementById('resultForm').reset();
    editingId = null;
}

// Edit result
function editResult(id) {
    const result = results.find(r => r.id === id);
    if (!result) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Result';
    document.getElementById('submitBtn').textContent = 'Update Result';
    document.getElementById('resultStudent').value = result.studentName;
    document.getElementById('resultSubject').value = result.subject;
    document.getElementById('resultMarks').value = result.marks;
    document.getElementById('examDate').value = result.examDate || '';
    document.getElementById('resultModal').classList.add('show');
}

// Handle form submit
function handleSubmit(e) {
    e.preventDefault();

    const studentName = document.getElementById('resultStudent').value;
    const subject = document.getElementById('resultSubject').value;
    const marks = parseInt(document.getElementById('resultMarks').value);
    const examDate = document.getElementById('examDate').value;

    if (marks < 0 || marks > 100) {
        alert('Marks must be between 0 and 100');
        return;
    }

    if (editingId) {
        // Update existing result
        const index = results.findIndex(r => r.id === editingId);
        if (index !== -1) {
            results[index] = {
                ...results[index],
                studentName,
                subject,
                marks,
                examDate
            };
        }
        showNotification('Result updated successfully!');
    } else {
        // Add new result
        const newResult = {
            id: Date.now(),
            studentName,
            subject,
            marks,
            examDate
        };
        results.push(newResult);
        showNotification('Result added successfully!');
    }

    saveData();
    populateDropdowns();
    applyFilters();
    closeModal();
}

// Delete result
function deleteResult(id) {
    deleteId = id;
    document.getElementById('deleteModal').classList.add('show');
}

// Confirm delete
function confirmDelete() {
    if (deleteId) {
        results = results.filter(r => r.id !== deleteId);
        saveData();
        populateDropdowns();
        applyFilters();
        showNotification('Result deleted successfully!');
        closeDeleteModal();
    }
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteId = null;
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Close modal on outside click
window.onclick = function(event) {
    const resultModal = document.getElementById('resultModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === resultModal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}