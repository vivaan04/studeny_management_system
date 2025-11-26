
let sections = [];
let students = [];
let editingId = null;
let deleteId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderTable();
});

function loadData() {
    const savedSections = localStorage.getItem('sections');
    if (savedSections) {
        sections = JSON.parse(savedSections);
    } else {
      
        sections = [
            {
                id: 1,
                name: 'Computer Science',
                description: 'Study of computation, programming, and software development'
            },
            {
                id: 2,
                name: 'Mathematics',
                description: 'Advanced mathematical concepts and problem-solving techniques'
            },
            {
                id: 3,
                name: 'Physics',
                description: 'Exploration of matter, energy, and the fundamental laws of nature'
            },
            {
                id: 4,
                name: 'Chemistry',
                description: 'Study of chemical reactions, elements, and molecular structures'
            }
        ];
        saveData();
    }

    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
}

function saveData() {
    localStorage.setItem('sections', JSON.stringify(sections));
}

function getTotalStudents(sectionName) {
    return students.filter(student => student.section === sectionName).length;
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (sections.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No records found</td></tr>';
        return;
    }

    tbody.innerHTML = sections.map(section => `
        <tr>
            <td><strong>${section.name}</strong></td>
            <td>${section.description || '-'}</td>
            <td><span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 12px; border-radius: 20px; font-weight: 600;">${getTotalStudents(section.name)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editSection(${section.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteSection(${section.id})">🗑️ Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Section';
    document.getElementById('submitBtn').textContent = 'Create Section';
    document.getElementById('sectionForm').reset();
    document.getElementById('sectionModal').classList.add('show');
}

function closeModal() {
    document.getElementById('sectionModal').classList.remove('show');
    document.getElementById('sectionForm').reset();
    editingId = null;
}


function editSection(id) {
    const section = sections.find(s => s.id === id);
    if (!section) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Section';
    document.getElementById('submitBtn').textContent = 'Update Section';
    document.getElementById('sectionName').value = section.name;
    document.getElementById('sectionDescription').value = section.description || '';
    document.getElementById('sectionModal').classList.add('show');
}

function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('sectionName').value;
    const description = document.getElementById('sectionDescription').value;

    if (editingId) {

        const index = sections.findIndex(s => s.id === editingId);
        if (index !== -1) {
            const oldName = sections[index].name;
            sections[index] = {
                ...sections[index],
                name,
                description
            };

            if (oldName !== name) {
                students = students.map(student => {
                    if (student.section === oldName) {
                        return { ...student, section: name };
                    }
                    return student;
                });
                localStorage.setItem('students', JSON.stringify(students));
            }
        }
        showNotification('Section updated successfully!');
    } else {

        const newSection = {
            id: Date.now(),
            name,
            description
        };
        sections.push(newSection);
        showNotification('Section added successfully!');
    }

    saveData();
    renderTable();
    closeModal();
}


function deleteSection(id) {
    deleteId = id;
    document.getElementById('deleteModal').classList.add('show');
}


function confirmDelete() {
    if (deleteId) {
        sections = sections.filter(s => s.id !== deleteId);
        saveData();
        renderTable();
        showNotification('Section deleted successfully!');
        closeDeleteModal();
    }
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteId = null;
}


function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}


window.onclick = function(event) {
    const sectionModal = document.getElementById('sectionModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === sectionModal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}
