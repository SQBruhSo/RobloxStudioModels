// ===== CONFIGURACIÓN =====
const API_URL = 'https://tu-backend.com/api'; // Cambiar por tu URL real
let globalDownloads = {};

// ===== FUNCIONES DE API =====
async function fetchGlobalDownloads() {
    try {
        // Si tuvieras un backend real
        // const response = await axios.get(`${API_URL}/downloads`);
        // globalDownloads = response.data;
        
        // Simulación mientras no hay backend
        globalDownloads = {
            1: 150 + Math.floor(Math.random() * 50) // Número aleatorio para simular crecimiento
        };
        
        return globalDownloads;
    } catch (error) {
        console.error('Error fetching downloads:', error);
        return {};
    }
}

async function incrementDownload(modelId) {
    try {
        // Si tuvieras un backend real
        // await axios.post(`${API_URL}/downloads/${modelId}/increment`);
        
        // Simulación
        if (!globalDownloads[modelId]) globalDownloads[modelId] = 0;
        globalDownloads[modelId]++;
        
        return true;
    } catch (error) {
        console.error('Error incrementing download:', error);
        return false;
    }
}

// ===== MODIFICAR LAS FUNCIONES EXISTENTES =====
async function loadModels() {
    const container = document.getElementById('models-container');
    
    if (!container) return;
    
    // Obtener descargas globales
    await fetchGlobalDownloads();
    
    container.innerHTML = '';
    
    if (models.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No models available.</p>';
        return;
    }
    
    models.forEach(model => {
        const globalCount = globalDownloads[model.id] || 0;
        const localCount = downloads[model.id] || 0;
        const totalCount = globalCount + localCount;
        
        const card = document.createElement('div');
        card.className = 'model-card';
        
        card.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <div class="model-info">
                <span><strong>Category:</strong> ${model.category}</span>
                <span><strong>Downloads:</strong> ${totalCount}</span>
                <span><strong>Format:</strong> .rbxl</span>
            </div>
            <a href="worlds/${model.filename}" class="download-btn" download 
               onclick="registerDownload(${model.id}); return true;">
                Download
            </a>
        `;
        
        container.appendChild(card);
    });
}

async function registerDownload(modelId) {
    console.log('⬇️ Downloading model:', modelId);
    
    // Contar descarga local
    if (!downloads[modelId]) downloads[modelId] = 0;
    downloads[modelId]++;
    localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
    
    // Intentar incrementar en el "backend" (simulado)
    await incrementDownload(modelId);
    
    // Actualizar UI
    updateStats();
    
    if (currentSection === 'models') {
        setTimeout(() => {
            loadModels();
        }, 100);
    }
    
    return true;
}

async function calculateStats() {
    // Obtener descargas globales actualizadas
    await fetchGlobalDownloads();
    
    let totalDownloads = 0;
    let maxDownloads = 0;
    let topModel = "Custom Chat";
    
    models.forEach(model => {
        const globalCount = globalDownloads[model.id] || 0;
        const localCount = downloads[model.id] || 0;
        const totalCount = globalCount + localCount;
        
        totalDownloads += totalCount;
        
        if (totalCount > maxDownloads) {
            maxDownloads = totalCount;
            topModel = model.name;
        }
    });
    
    return {
        totalDownloads,
        topModel
    };
}

// ===== MODIFICAR initApp =====
async function initApp() {
    console.log('🚀 Initializing RSM...');
    
    // Aplicar tema guardado
    updateTheme();
    
    // Setup navigation
    setupNavigation();
    
    // Setup settings
    setupSettings();
    
    // Setup easter egg
    setupEasterEgg();
    
    // Obtener y actualizar estadísticas
    await updateStats();
    
    // Actualizar UI de settings
    updateSettingsUI();
    
    console.log('✅ RSM initialized');
}
