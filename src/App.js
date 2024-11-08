import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]); // Liste des tâches
  const [taskContent, setTaskContent] = useState(''); // Contenu de la tâche en cours
  const [nextId, setNextId] = useState(1); // ID auto-incrémenté
  const [editingTaskId, setEditingTaskId] = useState(null); // ID de la tâche en cours d'édition

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal d'ajout
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal d'édition

  // Chargement des tâches depuis le localStorage au démarrage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
      setNextId(savedTasks.length > 0 ? savedTasks[savedTasks.length - 1].id + 1 : 1);
    }
  }, []);

  // Mettre à jour le contenu de la tâche
  const handleChange = (event) => {
    setTaskContent(event.target.value);
  };

  // Ajout d'une nouvelle tâche ou sauvegarde d'une tâche modifiée
  const handleSubmit = (event) => {
    event.preventDefault();

    if (taskContent.trim() === '') return;

    if (editingTaskId) {
      // Mode édition : mettre à jour la tâche existante
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, content: taskContent } : task
        )
      );
      setEditingTaskId(null);
      setIsEditModalOpen(false); // Ferme le modal d'édition après la mise à jour
    } else {
      // Mode ajout : créer une nouvelle tâche
      const newTask = {
        id: nextId,
        content: taskContent,
        cacher: false
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNextId((prevId) => prevId + 1);
      setIsAddModalOpen(false); // Ferme le modal d'ajout après l'ajout de la tâche
    }

    setTaskContent('');
  };

  // Mise à jour des tâches dans le localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Marquer une tâche comme cachée ou non
  const handleCache = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, cacher: !task.cacher } : task
      )
    );
  };

  // Ouvrir le modal d'édition avec la tâche sélectionnée
  const handleEdit = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setTaskContent(taskToEdit.content);
    setEditingTaskId(id);
    setIsEditModalOpen(true);
  };

  // Supprimer une tâche
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="App">
      <h1>TodoList</h1>

      {/* Affiche la liste des tâches */}
      <ul>
        {tasks.map((task) => (
          <div className='tasks'>
            <p style={{ textDecoration: task.cacher ? 'line-through' : 'none' }}>{task.content}</p>
            <li key={task.id}>
              <img className='icon' src={task.cacher ? 'assets/eye-slash-solid.svg' : 'assets/eye-solid.svg'} alt={task.cacher ? 'Hidden' : 'Show'} onClick={() => handleCache(task.id)} />
              <img className='icon' src={'assets/pen-to-square-solid.svg'} alt={task.cacher ? 'Hidden' : 'Show'} onClick={() => handleEdit(task.id)} />
              <img className='icon' src={'assets/trash-can-solid.svg'} alt={'Delete'} onClick={() => handleDelete(task.id)} />
            </li>
          </div>
        ))}
      </ul>

      {/* Bouton pour ouvrir le modal d'ajout */}
      <img className='icon add' src={'assets/plus-solid.svg'} alt={'Add'} onClick={() => setIsAddModalOpen(true)} />

      {/* Modal d'ajout */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add a new Task:</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Task content"
                value={taskContent}
                onChange={handleChange}
                autoFocus
              />
              <input type="submit" value={'Add Task'} />
              <button onClick={() => setIsAddModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Task:</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Edit task content"
                value={taskContent}
                onChange={handleChange}
                autoFocus
              />
              <input type="submit" value="Save Task" />
              <button onClick={() => setIsEditModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
