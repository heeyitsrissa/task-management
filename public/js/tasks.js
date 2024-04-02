

// const updateForm = async (event) => {
//     event.preventDefault();
  
//     const description = document.querySelector('#task-description').value.trim();
//     const title = document.querySelector('#task-title').value.trim();
//     const status = document.querySelector('#task-status').value.trim();
  
//     if (status && title && description) {
//       const response = await fetch(`/api/tasks/:id`, {
//         method: 'GET',
//         body: JSON.stringify({ title, status, description }),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       if (response.ok) {
//         document.location.reload();
//       } else {
//         alert('Failed to create project');
//       }
//     }
//   };

// Add an event listener to the form submission
document.getElementById('addTaskForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Extract task details from the form
  const title = document.querySelector('input[name="title"]').value.trim();
  const description = document.querySelector('textarea[name="description"]').value.trim();

  try {
      // Send a POST request to the server to add the new task
      const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description })
      });

      if (response.ok) {
          // If the task was added successfully, reload the tasks on the page
          document.location.reload();
      } else {
          // If there was an error, display an error message
          const responseData = await response.json();
          alert(responseData.message);
      }
  } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred while adding the task.');
  }
});

const updateButton = async (event) => {
  event.preventDefault();

  const taskBox = event.target.closest('.box');
  const taskId = taskBox.dataset.taskId;

  const description = taskBox.querySelector('.description')
  const title = taskBox.querySelector('.title')
  const status = taskBox.querySelector('.status')

  if (status && title && description) {
      const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          body: JSON.stringify({ title, status, description }),
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
          document.location.reload();
      } else {
          alert('Failed to update task');
      }
  }
};

const delButtonHandler = async (event) => {
  const taskBox = event.target.closest('.box');
  const taskId = taskBox.dataset.taskId;

  // Show confirmation dialog
  const confirmed = window.confirm('Are you sure you want to delete this task?');

  if (confirmed) {
      // User clicked OK, proceed with deletion
      const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
      });

      if (response.ok) {
          taskBox.remove(); // Remove the task box from the DOM
      } else {
          alert('Failed to delete task');
      }
  } else {
      // User clicked Cancel, do nothing
      return;
  }
};

  document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener for update button
    const updateButtons = document.querySelectorAll('.update-status-button');
    updateButtons.forEach(button => {
      button.addEventListener('click', updateButton);
    });
  
    // Attach event listener for delete button
    const deleteButtons = document.querySelectorAll('.delete-task');
    deleteButtons.forEach(button => {
      button.addEventListener('click', delButtonHandler);
    });
  });

// document.addEventListener('DOMContentLoaded', async () => {
//     const taskList = document.getElementById('taskList');

//     async function displayTasks() {
//         try {
//             const response = await fetch('/api/tasks');
//             console.log('Response from server:', response);
    
//             if (!response.ok) {
//                 throw new Error('Failed to fetch tasks');
//             }
    
//             const tasks = await response.json();
//             console.log('Tasks received:', tasks);

//             // Clear the task list before adding new tasks
//             taskList.innerHTML = '';

//             // Iterate through each task and render it using the task template
//             tasks.forEach(task => {
//                 const taskElement = document.createElement('div');
//                 taskElement.classList.add('task');
//                 taskElement.innerHTML = `
//                     <p>Title: ${task.title}</p>
//                     <p>Description: ${task.description}</p>
//                     <p>Status: ${task.status}</p>
//                     <select class="status-select">
//                         <option value="pending"${task.status === 'pending' ? ' selected' : ''}>Pending</option>
//                         <option value="completed"${task.status === 'completed' ? ' selected' : ''}>Completed</option>
//                         <option value="inProgress"${task.status === 'inProgress' ? ' selected' : ''}>In Progress</option>
//                     </select>
//                     <button class="update-status" data-task-id="${task.id}">Update Status</button>
//                 `;
//                 taskList.appendChild(taskElement);
//             });

//             // Add event listeners to update status buttons
//             const updateButtons = document.querySelectorAll('.update-status');
//             updateButtons.forEach(button => {
//                 button.addEventListener('click', async (event) => {
//                     const taskId = event.target.dataset.taskId;
//                     const newStatus = event.target.previousElementSibling.value;
//                     await updateStatus(taskId, newStatus);
//                 });
//             });
//         } catch (error) {
//             console.error('Error fetching or displaying tasks:', error);
//         }
//     }

//     async function updateStatus(taskId, newStatus) {
//         try {
//             await fetch(`/api/tasks/${taskId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ status: newStatus })
//             });
//             displayTasks();
//         } catch (error) {
//             console.error('Error updating task status:', error);
//         }
//     }

//     displayTasks();
// });

console.log('tasks.js connected');


// Removes tasks from view tasks pages
const tasksEl = document.querySelectorAll('.taskList');

const deleteTask = async (id, parentEl) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if(response.ok) {
      parentEl.remove();
    }
    
  } catch (error) {
    console.error('Error deleting task:', error.message);
  }
}

tasksEl.forEach(task => {
  task.addEventListener('click', (e) => {
    e.stopPropagation();
    const targetTag = e.target.tagName;
    const taskId = e.target.id;
    if (targetTag === 'BUTTON') {
      deleteTask(taskId, task);
    }
    });
});




    // async function displayTasks() {
    //     const response = await fetch('/api/tasks');
    //     const tasks = await response.json();

    //     taskList.innerHTML = taskTemplate({ tasks });

    //     const updateButtons = document.querySelectorAll('.update-status');
    //     updateButtons.forEach(button => {
    //         button.addEventListener('click', async (event) => {
    //             const taskId = event.target.parentElement.dataset.taskId;
    //             const newStatus = event.target.previousElementSibling.value;

    //             await updateStatus(taskId, newStatus);
    //         });
    //     });
    // }

    // async function updateStatus(taskId, newStatus) {
    //     await fetch(`/tasks/${taskId}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ status: newStatus })
    //     });

    //     displayTasks();
    // }

    // const addTaskForm = document.getElementById('addTaskForm');

    // addTaskForm.addEventListener('click', async (event) => {
    //     event.preventDefault();

    //     const formData = new FormData(addTaskForm);
    //     const title = formData.get('title');
    //     const description = formData.get('description');

    //     try {
    //         const response = await fetch('/tasks', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ title, description })
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to add task');
    //         }

 
    //         const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    //         addTaskModal.hide();


//             displayTasks();
//         } catch (error) {
//             console.error('Error adding task:', error);
//         }
//     });

//     taskList.addEventListener('click', async (event) => {
//         if (event.target.classList.contains('delete-task')) {
//             const taskId = event.target.dataset.taskId;
//             await deleteTask(taskId);
//         }
//     });

//     async function deleteTask(taskId) {
//         try {
//             await fetch(`/api/tasks/${taskId}`, {
//                 method: 'DELETE'
//             });
//             displayTasks();
//         } catch (error) {
//             console.error('Error deleting task:', error);
//         }
//     }

//     displayTasks();
// });

