// ===== MODELS DATA =====
const models = [
    {
        id: 1,
        name: "Custom Chat System",
        filename: "CustomChatSystem.rbxl",
        description: "This chat system is fully customizable and designed to integrate easily into your projects. Make sure to follow the rules provided to avoid errors or conflicts within the system.",
        size: "138 KB",
        category: "Game Systems",
        addedDate: "2025-01-16"
    }
];

// ===== APP STATE =====
let currentSection = 'home';
let downloads = JSON.parse(localStorage.getItem('rsm_downloads') || '{}');
let modelsLoaded = false;

// ===== CONFIGURACIÓN DE TEMA =====
const defaultConfig = {
    darkMode: false,
    primaryColor: '#4CAF50',
    clickCount: 0,
    easterEggUnlocked: false
};

let config = JSON.parse(localStorage.getItem('rsm_config') || JSON.stringify(defaultConfig));

// ===== FUNCIONES DE TEMA =====
function updateTheme() {
    const root = document.documentElement;
    
    if (config.darkMode) {
        // Modo oscuro
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--sidebar-color', '#2d2d2d');
        root.style.setProperty('--card-color', '#333333');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--text-secondary', '#b0b0b0');
        root.style.setProperty('--border-color', '#404040');
    } else {
        // Modo claro (valores por defecto)
        root.style.setProperty('--bg-color', '#f5f5f5');
        root.style.setProperty('--sidebar-color', '#e0e0e0');
        root.style.setProperty('--card-color', '#ffffff');
        root.style.setProperty('--text-color', '#333333');
        root.style.setProperty('--text-secondary', '#666666');
        root.style.setProperty('--border-color', '#d6d6d6');
    }
    
    // Actualizar color primario
    root.style.setProperty('--primary-color', config.primaryColor);
    
    // Calcular color hover automáticamente
    const hoverColor = darkenColor(config.primaryColor, 10);
    root.style.setProperty('--primary-hover', hoverColor);
}

function darkenColor(color, percent) {
    // Función para oscurecer un color
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

// ===== CALCULAR ESTADÍSTICAS =====
function calculateStats() {
    // Total de descargas
    let totalDownloads = 0;
    Object.values(downloads).forEach(count => {
        totalDownloads += count;
    });
    
    // Modelo más descargado
    let topModel = "None";
    let maxDownloads = 0;
    
    models.forEach(model => {
        const modelDownloads = downloads[model.id] || 0;
        if (modelDownloads > maxDownloads) {
            maxDownloads = modelDownloads;
            topModel = model.name;
        }
    });
    
    return {
        totalDownloads,
        topModel: maxDownloads > 0 ? topModel : "None"
    };
}

// ===== FUNCTION TO SHOW SECTION =====
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Update current section
    currentSection = sectionId;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the corresponding menu item
    const menuItem = document.querySelector(`.menu-item[data-section="${sectionId}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    // Update title
    document.title = `RSM - ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`;
    
    // Load models if necessary (only once)
    if (sectionId === 'models' && !modelsLoaded) {
        loadModels();
        modelsLoaded = true;
    }
    
    // Update statistics if necessary
    if (sectionId === 'home') {
        updateStats();
    }
    
    // Cargar configuración si es necesario
    if (sectionId === 'settings') {
        loadSettings();
    }
}

// ===== INITIALIZE APP =====
function initApp() {
    console.log('🚀 Initializing RSM...');
    
    // Aplicar tema guardado
    updateTheme();
    
    // Setup navigation
    setupNavigation();
    
    // Añadir sección de configuración al menú
    addSettingsToMenu();
    
    // Añadir sección de configuración al contenido
    addSettingsSection();
    
    // Añadir evento para el easter egg
    setupEasterEgg();
    
    // Update statistics
    updateStats();
    
    console.log('✅ RSM initialized');
}

// ===== SETUP NAVIGATION =====
function setupNavigation() {
    // Add events to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });
}

// ===== AÑADIR CONFIGURACIÓN AL MENÚ =====
function addSettingsToMenu() {
    const menu = document.querySelector('.menu');
    if (!menu) return;
    
    const settingsItem = document.createElement('a');
    settingsItem.href = '#';
    settingsItem.className = 'menu-item';
    settingsItem.setAttribute('data-section', 'settings');
    
    settingsItem.innerHTML = `
        <img src="https://cdn-icons-png.freepik.com/512/2092/2092718.png" class="menu-icon" alt="Settings">
        <span class="menu-text">Settings</span>
    `;
    
    menu.appendChild(settingsItem);
}

// ===== AÑADIR SECCIÓN DE CONFIGURACIÓN =====
function addSettingsSection() {
    const content = document.querySelector('.content');
    if (!content) return;
    
    const settingsSection = document.createElement('section');
    settingsSection.id = 'settings';
    settingsSection.className = 'section';
    
    settingsSection.innerHTML = `
        <h1>Settings</h1>
        <p>Customize your RSM experience.</p>
        
        <div class="info-cards">
            <div class="info-card">
                <h3>Theme Settings</h3>
                <div class="theme-toggle" style="margin: 20px 0;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="darkModeToggle" ${config.darkMode ? 'checked' : ''}>
                        <span>Dark Mode</span>
                    </label>
                </div>
                
                <h4>Primary Color</h4>
                <div class="color-picker" style="margin: 20px 0;">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336', '#607D8B']
                            .map(color => `
                                <button class="color-option" 
                                        style="width: 40px; height: 40px; border-radius: 50%; background: ${color}; border: 2px solid ${config.primaryColor === color ? '#333' : 'transparent'}; cursor: pointer;"
                                        data-color="${color}">
                                </button>
                            `).join('')}
                    </div>
                    <div style="margin-top: 15px;">
                        <label for="customColor">Custom Color:</label>
                        <input type="color" id="customColor" value="${config.primaryColor}" style="margin-left: 10px;">
                    </div>
                </div>
            </div>
            
            <div class="info-card">
                <h3>Data Management</h3>
                <div style="margin: 20px 0;">
                    <button id="resetStats" class="download-btn" style="background: #ff9800; margin-right: 10px;">
                        Reset Download Stats
                    </button>
                    <button id="resetConfig" class="download-btn" style="background: #f44336;">
                        Reset All Settings
                    </button>
                </div>
                <p style="font-size: 12px; color: var(--text-secondary);">
                    Note: Settings are saved automatically in your browser.
                </p>
            </div>
            
            ${config.easterEggUnlocked ? `
            <div class="info-card" style="border-left: 4px solid gold;">
                <h3 style="color: gold;">🎮 Easter Egg Unlocked! 🎮</h3>
                <p>You found the secret! Here's a special message:</p>
                <p style="font-style: italic; color: var(--text-secondary);">
                    "The best way to predict the future is to create it." - Peter Drucker
                </p>
                <p>Thanks for exploring the site! 🚀</p>
                <button id="hideEasterEgg" class="download-btn" style="background: gold; color: #333; margin-top: 10px;">
                    Hide This Message
                </button>
            </div>
            ` : ''}
        </div>
    `;
    
    content.appendChild(settingsSection);
}

// ===== CARGAR CONFIGURACIÓN =====
function loadSettings() {
    // Configurar toggle de modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            config.darkMode = this.checked;
            saveConfig();
            updateTheme();
        });
    }
    
    // Configurar opciones de color predefinidas
    document.querySelectorAll('.color-option').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            config.primaryColor = color;
            saveConfig();
            updateTheme();
            loadSettings(); // Recargar para actualizar bordes
        });
    });
    
    // Configurar selector de color personalizado
    const customColor = document.getElementById('customColor');
    if (customColor) {
        customColor.addEventListener('change', function() {
            config.primaryColor = this.value;
            saveConfig();
            updateTheme();
            loadSettings(); // Recargar para actualizar interfaz
        });
    }
    
    // Configurar botón de reset de estadísticas
    const resetStatsBtn = document.getElementById('resetStats');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all download statistics? This cannot be undone.')) {
                downloads = {};
                localStorage.removeItem('rsm_downloads');
                updateStats();
                if (currentSection === 'models') {
                    loadModels();
                }
                alert('Download statistics have been reset.');
            }
        });
    }
    
    // Configurar botón de reset de configuración
    const resetConfigBtn = document.getElementById('resetConfig');
    if (resetConfigBtn) {
        resetConfigBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
                config = {...defaultConfig};
                saveConfig();
                updateTheme();
                alert('Settings have been reset to default.');
                setTimeout(() => {
                    showSection('settings');
                }, 100);
            }
        });
    }
    
    // Configurar botón para ocultar easter egg
    const hideEasterEggBtn = document.getElementById('hideEasterEgg');
    if (hideEasterEggBtn) {
        hideEasterEggBtn.addEventListener('click', function() {
            showSection('home');
        });
    }
}

// ===== GUARDAR CONFIGURACIÓN =====
function saveConfig() {
    localStorage.setItem('rsm_config', JSON.stringify(config));
}

// ===== LOAD MODELS =====
function loadModels() {
    const container = document.getElementById('models-container');
    
    if (!container) {
        console.error('❌ Models container not found!');
        return;
    }
    
    console.log('📦 Loading models...');
    
    // Clear container
    container.innerHTML = '';
    
    // Check if we have models
    if (models.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No models available.</p>';
        return;
    }
    
    // Create model cards
    models.forEach(model => {
        const downloadCount = downloads[model.id] || 0;
        
        // Create card
        const card = document.createElement('div');
        card.className = 'model-card';
        
        card.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <div class="model-info">
                <span><strong>Category:</strong> ${model.category}</span>
                <span><strong>Size:</strong> ${model.size}</span>
                <span><strong>Downloads:</strong> ${downloadCount}</span>
                <span><strong>Format:</strong> .rbxl</span>
            </div>
            <a href="worlds/${model.filename}" class="download-btn" download 
               onclick="registerDownload(${model.id}); return true;">
                Download
            </a>
        `;
        
        container.appendChild(card);
    });
    
    console.log(`✅ Loaded ${models.length} models`);
}

// ===== REGISTER DOWNLOAD =====
function registerDownload(modelId) {
    console.log('⬇️ Downloading model:', modelId);
    
    // Count download
    if (!downloads[modelId]) downloads[modelId] = 0;
    downloads[modelId]++;
    
    // Save
    localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
    
    // Update statistics
    updateStats();
    
    // Reload models to update counter
    if (currentSection === 'models') {
        setTimeout(() => {
            loadModels();
        }, 100);
    }
    
    return true;
}

// ===== UPDATE STATISTICS =====
function updateStats() {
    // Total models
    const totalModelsElement = document.getElementById('total-models');
    if (totalModelsElement) {
        totalModelsElement.textContent = models.length;
    }
    
    // Calculate and display other stats
    const stats = calculateStats();
    
    // Total downloads
    const totalDownloadsElement = document.getElementById('total-downloads');
    if (totalDownloadsElement) {
        totalDownloadsElement.textContent = stats.totalDownloads;
    }
    
    // Top model
    const topModelElement = document.getElementById('top-model');
    if (topModelElement) {
        topModelElement.textContent = stats.topModel;
    }
}

// ===== SETUP EASTER EGG =====
function setupEasterEgg() {
    let clickCount = config.clickCount || 0;
    const secretElement = document.querySelector('.sidebar h2');
    
    if (!secretElement) return;
    
    secretElement.style.cursor = 'pointer';
    secretElement.title = "Click me...";
    
    secretElement.addEventListener('click', function() {
        clickCount++;
        config.clickCount = clickCount;
        
        // Efecto visual
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.2s';
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Comprobar si se ha desbloqueado el easter egg
        if (clickCount === 7 && !config.easterEggUnlocked) {
            config.easterEggUnlocked = true;
            saveConfig();
            
            // Mostrar mensaje especial
            alert('🎉 Congratulations! You found the secret easter egg! 🎉\n\nCheck the Settings section for something special!');
            
            // Si estamos en settings, recargar
            if (currentSection === 'settings') {
                loadSettings();
            }
        }
        
        saveConfig();
    });
}

// ===== START APP WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', initApp);
