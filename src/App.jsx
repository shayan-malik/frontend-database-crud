import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";

const API = `https://database-crud-production.up.railway.app/students`;

function App() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    course: "",
    batch: "",
    roll_number: "",
    age: ""
  });

  const getApi = async () => {
    try {
      const response = await axios.get(`${API}`);
      setStudents(response.data.students);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getApi();
  }, []);


const handleChange = (e) => {
  setFormData({...formData, [e.target.name]: e.target.value});
}

const handleOpenAddModal = () => {
  setEditingId(null);
  setFormData({
    first_name: "",
    last_name: "",
    course: "",
    batch: "",
    roll_number: "",
    age: ""
  })
  setIsModalOpen(true);
};


const handleOpenEditModal = (student) => {
  setEditingId(student.id);
  setFormData({
    first_name: student.first_name,
    last_name: student.last_name,
    course: student.course,
    batch: student.batch,
    roll_number: student.roll_number,
    age: student.age
  });
  setIsModalOpen(true)
}

const handleSubmit = async (e) => {
  e.preventDefault();

  try{
    let response;
    if(editingId){
      response = await axios.put(`https://database-crud-production.up.railway.app/student/${editingId}`, formData);
    }
    else{
      response = await axios.post(`https://database-crud-production.up.railway.app/student`, formData);
    }

    if(response.data.status === "success" || response.status === 200){
      alert(editingId ? "Student Updated Successfully" : "Student Added Successfully");
      getApi();
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        first_name: "",
        last_name: "",
        course: "",
        batch: "",
        roll_number: "",
        age: ""
      });

    }

    else{
      alert(response.data.message);
    }

  }

  catch(error){
    console.log("error:", error.message);
    alert(error.response?.data?.error || "Operation failed");
  }
};


const handleDelete =  async (id) => {
  if(window.confirm("Are you sure you want to delete this student?")){
    try{
      await axios.delete(`https://database-crud-production.up.railway.app/student/${id}`);
      alert("Student Deleted Successfully");
      getApi();
    } 
    catch(error){
      console.log("error", error.message);
      alert("failed to delete student");
    }
  }
}


  return (
    <>
    <div className="container">
      <div className="main">
        <h1>Student Data</h1>
        <button onClick={handleOpenAddModal} className="new-student">Add New Student</button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? "Edit Student" : "Add New Student"}</h3>

            <form onSubmit={handleSubmit} className="form">
              <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
              <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
              <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
              <input type="text" name="batch" placeholder="Batch" value={formData.batch} onChange={handleChange} required />
              <input type="text" name="roll_number" placeholder="Roll Number" value={formData.roll_number} onChange={handleChange} required />
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />

              <div className="form1">
                <button onClick={() => setIsModalOpen(false)} className="cancel">Cancel</button>
                <button type="submit" className="submit">{editingId ? "Update" : "Add Student"}</button>
              </div>

            </form>

          </div>

        </div>
      )}


        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Roll Number</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
              {students.map((student) => {
                return( 
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.course}</td>
                  <td>{student.batch}</td>
                  <td>{student.roll_number}</td>
                  <td>{student.age}</td>
                  <td className="bt-gap">
                    <button onClick={() => handleOpenEditModal(student)} className="action">Edit</button>
                    <button onClick={() => handleDelete(student.id)} className="action-delete">Delete</button>
                  </td>
                </tr>
              )
              })}
          </tbody>
        </table>
      </div>
      
    </>
  );
}

export default App;
