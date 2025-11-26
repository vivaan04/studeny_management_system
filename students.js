// Students data storage
let students = [];
let sections = [];
let editingId = null;
let deleteId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    loadSections();
    renderTable();
});

// Load data from localStorage
function loadData() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    } else {
        // Sample data
        students = [
            {
                id: 1,
                name: 'Aditya Kumar Sharma',
                email: 'Aditya@gmail.com',
                section: 'Computer Science',
                enrollmentDate: '2024-01-15'
            },
            {
                id: 2,
                name: 'Shreshti Mittal',
                email: 'Shreshti@gmail.com',
                section: 'Mathematics',
                enrollmentDate: '2024-01-20'
            },
            {
                id: 3,
                name: 'Anirudh Singh',
                email: 'Anirudh@gmail.com',
                section: 'Physics',
                enrollmentDate: '2024-02-01'
            }
        ];
        saveData();
    }
}

// Load sections
function loadSections() {
    const savedSections = localStorage.getItem('sections');
    if (savedSections) {
        sections = JSON.parse(savedSections);
    } else {
        sections = [
            { id: 1, name: 'Computer Science' },
            { id: 2, name: 'Mathematics' },
            { id: 3, name: 'Physics' },
            { id: 4, name: 'Chemistry' }
        ];
    }
    populateSectionDropdown();
}

// Populate section dropdown
function populateSectionDropdown() {
    const select = document.getElementById('studentSection');
    select.innerHTML = '<option value="">Select Section</option>';
    sections.forEach(section => {
        const option = document.createElement('option');
        option.value = section.name;
        option.textContent = section.name;
        select.appendChild(option);
    });
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Render table
function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No records found</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.section || '-'}</td>
            <td>${student.enrollmentDate ? formatDate(student.enrollmentDate) : '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editStudent(${student.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteStudent(${student.id})">🗑️ Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Open modal
function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Student';
    document.getElementById('submitBtn').textContent = 'Create Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('studentModal').classList.remove('show');
    document.getElementById('studentForm').reset();
    editingId = null;
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Student';
    document.getElementById('submitBtn').textContent = 'Update Student';
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentSection').value = student.section || '';
    document.getElementById('enrollmentDate').value = student.enrollmentDate || '';
    document.getElementById('studentModal').classList.add('show');
}

// Handle form submit
function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const section = document.getElementById('studentSection').value;
    const enrollmentDate = document.getElementById('enrollmentDate').value;

    if (editingId) {
        // Update existing student
        const index = students.findIndex(s => s.id === editingId);
        if (index !== -1) {
            students[index] = {
                ...students[index],
                name,
                email,
                section,
                enrollmentDate
            };
        }
        showNotification('Student updated successfully!');
    } else {
        // Add new student
        const newStudent = {
            id: Date.now(),
            name,
            email,
            section,
            enrollmentDate
        };
        students.push(newStudent);
        showNotification('Student added successfully!');
    }

    saveData();
    renderTable();
    closeModal();
}

// Delete student
function deleteStudent(id) {
    deleteId = id;
    document.getElementById('deleteModal').classList.add('show');
}

// Confirm delete
function confirmDelete() {
    if (deleteId) {
        students = students.filter(s => s.id !== deleteId);
        saveData();
        renderTable();
        showNotification('Student deleted successfully!');
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
    const studentModal = document.getElementById('studentModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === studentModal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}