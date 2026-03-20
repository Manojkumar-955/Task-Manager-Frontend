import { useEffect, useState } from "react";
import axios from "axios";
import { base_api_url } from "../api";
import { CgProfile } from "react-icons/cg";
const ITEMS_PER_PAGE = 4;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  const token = localStorage.getItem("token");
  const user_name = localStorage.getItem('user_name');

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_api_url}/tasks/getTasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || res.data || []);
    } catch (err) {
      if (err.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/";
      }
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= ADD TASK ================= */
  const addTask = async (e) => {
    console.log("entered");
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await axios.post(
        `${base_api_url}/tasks/addTask`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(res.data.message)

      setTasks((prev) => [res.data.task, ...prev]);
      setNewTitle("");
      setCurrentPage(1);
    } catch (err) {
      alert("Failed to add task");
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    await axios.delete(`${base_api_url}/tasks/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  /* ================= EDIT MODAL ================= */
  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setIsEditOpen(true);
  };

  const closeModal = () => {
    setIsEditOpen(false);
    setSelectedTask(null);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return alert("Title required");

    try {
      await axios.put(
        `${base_api_url}/tasks/update/${selectedTask.id}`,
        { title: editTitle, status: editStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id
            ? { ...task, title: editTitle, status: editStatus }
            : task,
        ),
      );

      closeModal();
    } catch (err) {
      alert("Failed to update task");
      console.error(err);
    }
  };
  useEffect(() => {
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) {
    setCurrentPage(totalPages || 1);
  }
}, [tasks, currentPage]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTasks = tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /* ================= UI ================= */
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-50">
  <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
    {/* App Name */}
    <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>

    {/* Right Actions */}
    <div className="flex items-center gap-6">
      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <CgProfile size={22} />
        </div>

        <span className="text-sm font-medium text-gray-700">
          {user_name || "User"}
        </span>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="text-sm px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </div>
</nav>

      {/* ================= MAIN CONTENT ================= */}
      <div className="pt-20 h-full flex justify-center">
        <div className="w-full max-w-5xl px-4">
          <div className="bg-white rounded-xl shadow-md border h-[80vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Tasks
              </h2>
              <p className="text-sm text-gray-500">
                Manage your daily work efficiently
              </p>
            </div>

            {/* Add Task */}
            <form onSubmit={addTask} className="px-6 py-4 flex gap-3 border-b">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add new task..."
                className="flex-1 border rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white
                         hover:bg-blue-700 transition"
              >
                Add
              </button>
            </form>

            {/* ================= SCROLLABLE TASK LIST ================= */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {loading ? (
                <p className="text-center text-gray-500">Loading tasks...</p>
              ) : paginatedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
  <div className="text-5xl mb-4">📝</div>
  <h3 className="text-lg font-semibold text-gray-700">
    No tasks yet
  </h3>
  <p className="text-sm">
    Add a task to start organizing your work
  </p>
</div>
              ) : (
                paginatedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center p-4
                             border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <p
                        className={`font-medium flex self-start ${
                          task.status === "completed"
                            ? "line-through text-gray-400"
                            : task.status === "in-progress"
                              ? "text-blue-700"
                              : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </p>

                      <span
                        className={`text-xs w-[100px] font-semibold px-3 py-1 flex self-start rounded-full ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {task.status === "completed"
                          ? "Completed"
                          : task.status === "in-progress"
                            ? "In Progress"
                            : "Pending"}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t px-6 py-4 flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-md text-sm
                           disabled:opacity-40 hover:bg-gray-50"
                >
                  Prev
                </button>

                <span className="text-sm  font-medium">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 border rounded-md text-sm
                           disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL (UNCHANGED) ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-6"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-5 py-2 rounded-md bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
