import { useState, useEffect } from "react";

export default function Dashboard({ user }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", year: "", level: "", address: "", contact: "" });
  const [editingStudent, setEditingStudent] = useState(null);

  // Load all students
  useEffect(() => {
    fetch("https://akzbackend-production.up.railway.app/students")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  // Add student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    const res = await fetch("https://akzbackend-production.up.railway.app/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent)
    });
    if (res.ok) {
      const savedStudent = await res.json();
      setStudents([...students, savedStudent]);
      setNewStudent({ name: "", year: "", level: "", address: "", contact: "" });
      setShowAddForm(false);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const res = await fetch(`https://akzbackend-production.up.railway.app/students/${id}`, { method: "DELETE" });
    if (res.ok) setStudents(students.filter(s => s.id !== id));
  };

  // Start editing
  const startEdit = (student) => setEditingStudent(student);

  // Update student
  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://akzbackend-production.up.railway.app/students/${editingStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingStudent)
    });
    if (res.ok) {
      setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
      setEditingStudent(null);
    }
  };

  // Filtered students
  const filteredStudents = students.filter(s =>s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toString().includes(search)
  );

  return (
    <div>
      <h2>Welcome, {user?.name}!</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setShowAddForm(true)}>Add Student</button>
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <form onSubmit={handleAddStudent} style={{ marginBottom: "20px" }}>
          {["name","year","level","address","contact"].map(field => (
            <input
              key={field}
              placeholder={field}
              value={newStudent[field]}
              onChange={e => setNewStudent({ ...newStudent, [field]: e.target.value })}
            />
          ))}
          <button type="submit">Save</button>
          <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
        </form>
      )}

      {/* Edit Student Form */}
      {editingStudent && (
        <form onSubmit={handleUpdate} style={{ marginBottom: "20px" }}>
          {["name","year","level","address","contact"].map(field => (
            <input
              key={field}
              value={editingStudent[field]}
              onChange={e => setEditingStudent({ ...editingStudent, [field]: e.target.value })}
            />
          ))}
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
        </form>
      )}

      {/* Students Table */}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Year</th><th>Level</th><th>Address</th><th>Contact</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.year}</td>
              <td>{student.level}</td>
              <td>{student.address}</td>
              <td>{student.contact}</td>
              <td>
                <button onClick={() => startEdit(student)}>Update</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
