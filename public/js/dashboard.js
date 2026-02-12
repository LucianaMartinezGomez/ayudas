// Importar funciones de auth
const API_URL = window.location.origin + '/api';

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = '/login.html';
        return;
    }

    const userData = JSON.parse(user);
    initializeDashboard(userData);
});

// Inicializar dashboard
function initializeDashboard(user) {
    // Mostrar mensaje de bienvenida
    document.getElementById('welcomeMessage').textContent = 
        `Bienvenido, ${user.nombre} ${user.apellido}`;

    // Mostrar menú de clanes solo para administradores
    if (user.rol === 'administrador') {
        document.getElementById('clanMenu').style.display = 'block';
    }

    // Cargar notificaciones
    loadNotifications();

    // Cargar contenido inicial
    loadSection('inicio');

    // Event listeners para el menú
    document.querySelectorAll('.sidebar-menu a[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase active de todos los links
            document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al link clickeado
            e.target.classList.add('active');
            
            // Cargar la sección
            const section = e.target.getAttribute('data-section');
            loadSection(section);
        });
    });

    // Event listener para cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Event listener para notificaciones
    document.getElementById('notificationBtn').addEventListener('click', () => {
        showNotifications();
    });
}

// Cargar sección del dashboard
function loadSection(section) {
    const contentArea = document.getElementById('contentArea');
    const user = JSON.parse(localStorage.getItem('user'));

    switch(section) {
        case 'inicio':
            contentArea.innerHTML = `
                <div class="card">
                    <h2>Panel de Inicio</h2>
                    <p>Bienvenido al sistema de gestión de tareas.</p>
                    <p>Rol: <strong>${user.rol}</strong></p>
                    ${user.celula_id ? `<p>Célula ID: <strong>${user.celula_id}</strong></p>` : ''}
                </div>
                <div class="grid grid-3">
                    <div class="card">
                        <h3>Tareas Pendientes</h3>
                        <p class="text-center" style="font-size: 2em; color: var(--warning-color);">0</p>
                    </div>
                    <div class="card">
                        <h3>Tareas Completadas</h3>
                        <p class="text-center" style="font-size: 2em; color: var(--success-color);">0</p>
                    </div>
                    <div class="card">
                        <h3>Total Tareas</h3>
                        <p class="text-center" style="font-size: 2em; color: var(--primary-color);">0</p>
                    </div>
                </div>
            `;
            break;

        case 'tareas':
            loadTareas();
            break;

        case 'celula':
            loadCelula();
            break;

        case 'clanes':
            if (user.rol === 'administrador') {
                loadClanes();
            }
            break;

        case 'perfil':
            loadPerfil();
            break;

        default:
            contentArea.innerHTML = '<div class="card"><h2>Sección en construcción</h2></div>';
    }
}

// Cargar tareas
async function loadTareas() {
    const contentArea = document.getElementById('contentArea');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user.celula_id) {
        contentArea.innerHTML = `
            <div class="card">
                <h2>Mis Tareas</h2>
                <p>No estás asignado a ninguna célula. Únete a una célula usando un código de acceso.</p>
            </div>
        `;
        return;
    }

    contentArea.innerHTML = `
        <div class="card">
            <h2>Mis Tareas</h2>
            <p>Cargando tareas...</p>
        </div>
    `;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/tareas/celula/${user.celula_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const tareas = data.data;
            
            let html = `
                <div class="card">
                    <h2>Mis Tareas</h2>
                    ${user.rol === 'lider' || user.rol === 'administrador' ? 
                        '<button class="btn btn-primary mb-2" onclick="showCreateTaskForm()">+ Nueva Tarea</button>' : ''
                    }
                    ${tareas.length === 0 ? 
                        '<p>No hay tareas disponibles.</p>' :
                        `<table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Estado</th>
                                    <th>Prioridad</th>
                                    <th>Fecha Vencimiento</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tareas.map(tarea => `
                                    <tr>
                                        <td>${tarea.titulo}</td>
                                        <td>${tarea.estado}</td>
                                        <td>${tarea.prioridad}</td>
                                        <td>${tarea.fecha_vencimiento || 'N/A'}</td>
                                        <td>
                                            <button class="btn btn-primary" onclick="viewTask(${tarea.id})">Ver</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>`
                    }
                </div>
            `;

            contentArea.innerHTML = html;
        }
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        contentArea.innerHTML = `
            <div class="card">
                <h2>Error</h2>
                <p>No se pudieron cargar las tareas.</p>
            </div>
        `;
    }
}

// Cargar célula
async function loadCelula() {
    const contentArea = document.getElementById('contentArea');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user.celula_id) {
        contentArea.innerHTML = `
            <div class="card">
                <h2>Mi Célula</h2>
                <p>No estás asignado a ninguna célula.</p>
                <div class="form-group mt-2">
                    <label for="codigoCelula">Código de Célula</label>
                    <input type="text" id="codigoCelula" placeholder="Ej: CLAN-12345678-C1">
                    <button class="btn btn-primary mt-1" onclick="joinCelula()">Unirse</button>
                </div>
            </div>
        `;
        return;
    }

    contentArea.innerHTML = '<div class="card"><p>Cargando información de la célula...</p></div>';

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/celulas/${user.celula_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const celula = data.data;
            
            contentArea.innerHTML = `
                <div class="card">
                    <h2>${celula.nombre}</h2>
                    <p><strong>Código de Acceso:</strong> ${celula.codigo_acceso}</p>
                    <p><strong>Descripción:</strong> ${celula.descripcion || 'N/A'}</p>
                    <h3 class="mt-2">Miembros (${celula.miembros.length})</h3>
                    <ul>
                        ${celula.miembros.map(m => `<li>${m.nombre} ${m.apellido} - ${m.rol}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar célula:', error);
    }
}

// Cargar clanes (solo para administradores)
async function loadClanes() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="card">
            <h2>Mis Clanes</h2>
            <button class="btn btn-primary mb-2" onclick="showCreateClanForm()">+ Crear Nuevo Clan</button>
            <p>Cargando clanes...</p>
        </div>
    `;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/clanes/my-clanes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const clanes = data.data;
            
            contentArea.innerHTML = `
                <div class="card">
                    <h2>Mis Clanes</h2>
                    <button class="btn btn-primary mb-2" onclick="showCreateClanForm()">+ Crear Nuevo Clan</button>
                    ${clanes.length === 0 ? 
                        '<p>No has creado ningún clan todavía.</p>' :
                        `<div class="grid grid-2">
                            ${clanes.map(clan => `
                                <div class="card">
                                    <h3>${clan.nombre}</h3>
                                    <p>${clan.descripcion || ''}</p>
                                    <p><strong>Código:</strong> ${clan.codigo_acceso}</p>
                                    <button class="btn btn-primary mt-1" onclick="viewClan(${clan.id})">Ver Detalles</button>
                                </div>
                            `).join('')}
                        </div>`
                    }
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar clanes:', error);
    }
}

// Cargar perfil
function loadPerfil() {
    const contentArea = document.getElementById('contentArea');
    const user = JSON.parse(localStorage.getItem('user'));

    contentArea.innerHTML = `
        <div class="card">
            <h2>Mi Perfil</h2>
            <p><strong>Nombre:</strong> ${user.nombre} ${user.apellido}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.rol}</p>
            ${user.celula_id ? `<p><strong>Célula ID:</strong> ${user.celula_id}</p>` : ''}
        </div>
    `;
}

// Cargar notificaciones
async function loadNotifications() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/notificaciones/count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('notificationCount').textContent = data.data.count;
        }
    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
    }
}

// Funciones auxiliares
function showNotifications() {
    alert('Panel de notificaciones - En construcción');
}

function showCreateClanForm() {
    alert('Formulario de creación de clan - En construcción');
}

function viewClan(id) {
    alert(`Ver clan ${id} - En construcción`);
}

function showCreateTaskForm() {
    alert('Formulario de creación de tarea - En construcción');
}

function viewTask(id) {
    alert(`Ver tarea ${id} - En construcción`);
}

function joinCelula() {
    const codigo = document.getElementById('codigoCelula').value;
    if (codigo) {
        alert(`Unirse a célula con código: ${codigo} - En construcción`);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}
