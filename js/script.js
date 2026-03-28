// js/script.js - Funções principais
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    const userData = localStorage.getItem('geoscan_user');
    if (!userData && !window.location.pathname.includes('index.html')) {
        window.location.href = '../index.html';
        return;
    }

    if (userData) {
        currentUser = JSON.parse(userData);
        atualizarInfoUsuario();
    }
    // Se houver configuração de dispositivos ESP32 no localStorage, inicializa polling em modo network
    try {
        const espConfig = JSON.parse(localStorage.getItem('esp32_devices') || 'null');
        if (espConfig && window.esp32 && typeof window.esp32.setDeviceIPs === 'function') {
            // espConfig expected to be object mapping deviceId->ip or array of {id,ip}
            let map = {};
            if (Array.isArray(espConfig)) {
                espConfig.forEach(d => { if (d.id && d.ip) map[d.id] = d.ip; });
            } else {
                map = espConfig;
            }

            window.esp32.setDeviceIPs(map);
            window.esp32.useNetworkMode({ pollIntervalMs: 2000 });
            // start polling and notify listeners to update UI
            window.esp32.startNetworkPolling(2000, (leitura) => {
                // dispatch a custom event so dashboards can listen
                window.dispatchEvent(new CustomEvent('esp32:leitura', { detail: leitura }));
            });
        }
    } catch (e) {
        console.warn('Erro ao ler esp32_devices do localStorage', e);
    }

    // Se houver backend configurado (por exemplo http://localhost:4000), iniciar polling de vibração
    try {
        const backend = localStorage.getItem('backend_url');
        if (backend) {
            const pollVibrations = async () => {
                try {
                    const url = backend.replace(/\/$/, '') + '/vibration?limit=10';
                    const resp = await fetch(url, { cache: 'no-store' });
                    if (!resp.ok) throw new Error('HTTP ' + resp.status);
                    const data = await resp.json();
                    // dispatch event for dashboards
                    window.dispatchEvent(new CustomEvent('vibration:leitura', { detail: data }));
                } catch (err) {
                    console.warn('Erro ao buscar vibrações do backend', err);
                }
            };

            // initial fetch + interval
            pollVibrations();
            setInterval(pollVibrations, 3000);
        }
    } catch (err) {
        console.warn('Erro ao iniciar polling de vibração', err);
    }
});

function atualizarInfoUsuario() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo && currentUser) {
        const p = userInfo.querySelector('p');
        if (p) p.textContent = currentUser.nome;
    }
}

function mostrarNotificacao(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<i class="fas fa-info-circle"></i> ${msg}`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function logout() {
    localStorage.removeItem('geoscan_user');
    window.location.href = '../index.html';
}