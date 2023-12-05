document.addEventListener('DOMContentLoaded', function () {
    const newTaskInput = document.getElementById('newTaskInput');
    const taskList = document.getElementById('taskList');

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}" data-index="${index}">${task.text} - ${task.timestamp}</span>
                <span class="delete-task" data-index="${index}">&times;</span>
            `;
            taskList.appendChild(listItem);

            const checkbox = listItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
                saveTasks();
            });

            if (task.completed) {
                listItem.style.textDecoration = 'line-through';
                checkbox.style.display = 'none';
            } else {
                listItem.style.textDecoration = 'none';
                checkbox.style.display = 'inline-block';
            }

            const deleteBtn = listItem.querySelector('.delete-task');
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                renderTasks();
                saveTasks();
            });

            const taskText = listItem.querySelector('.task-text');
            taskText.addEventListener('dblclick', function () {
                const originalText = taskText.innerText;
                const input = document.createElement('input');
                input.value = originalText;

                input.addEventListener('keyup', function (event) {
                    if (event.key === 'Enter') {
                        task.text = input.value;
                        renderTasks();
                        saveTasks();
                    } else if (event.key === 'Escape') {
                        listItem.replaceChild(taskText, input);
                    }
                });

                listItem.replaceChild(input, taskText);
                input.select();
            });
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    newTaskInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter' && newTaskInput.value.trim() !== '') {
            const newTask = {
                text: newTaskInput.value.trim(),
                completed: false,
                timestamp: new Date().toLocaleString()
            };

            tasks.push(newTask);
            renderTasks();
            saveTasks();

            newTaskInput.value = '';
        }
    });

    renderTasks();
});
