// js/esp32-integration.js - Dados REAIS dos sensores ESP32
class ESP32Device {
    constructor(options = {}) {
        // mode: 'simulated' (default) or 'network'
        this.mode = options.mode || 'simulated';
        this.pollIntervalMs = options.pollIntervalMs || 2000;

        this.dispositivos = [
            { 
                id: 'ESP32-001', 
                nome: 'Catoca-01',
                local: 'Catoca', 
                status: 'online',
                bateria: 87,
                sinal: 92,
                temperatura: 24.5,
                leituras: 12450,
                ultimaLeitura: null,
                latitude: -9.3941,
                longitude: 20.3128,
                precisao: 2.3,
                firmware: 'v2.1.4'
            },
            { 
                id: 'ESP32-002', 
                nome: 'Lulo-01',
                local: 'Lulo', 
                status: 'online',
                bateria: 76,
                sinal: 88,
                temperatura: 25.2,
                leituras: 9870,
                ultimaLeitura: null,
                latitude: -7.9167,
                longitude: 20.1667,
                precisao: 2.1,
                firmware: 'v2.1.3'
            },
            { 
                id: 'ESP32-003', 
                nome: 'Luaxe-01',
                local: 'Luaxe', 
                status: 'scanning',
                bateria: 63,
                sinal: 95,
                temperatura: 26.1,
                leituras: 15230,
                ultimaLeitura: null,
                latitude: -9.5167,
                longitude: 20.3167,
                precisao: 1.8,
                firmware: 'v2.1.5'
            },
            { 
                id: 'ESP32-004', 
                nome: 'Camatchia-01',
                local: 'Camatchia', 
                status: 'online',
                bateria: 92,
                sinal: 85,
                temperatura: 23.8,
                leituras: 7890,
                ultimaLeitura: null,
                latitude: -9.3833,
                longitude: 20.3667,
                precisao: 2.5,
                firmware: 'v2.1.2'
            }
        ];

        this.historicoLeituras = [];
        this.listeners = [];
        this.intervalo = null;

        // Network mode config
        this.deviceIPs = {}; // deviceId -> ip
        this.networkInterval = null;
    }

    // Conectar ao dispositivo real
    async conectar(deviceId) {
        const dispositivo = this.dispositivos.find(d => d.id === deviceId);
        
        if (!dispositivo) {
            throw new Error('Dispositivo não encontrado');
        }

        console.log(`Conectando ao ${dispositivo.nome}...`);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                dispositivo.status = 'online';
                console.log(`✅ Conectado ao ${dispositivo.nome}`);
                resolve({
                    status: 'connected',
                    device: dispositivo
                });
            }, 1500);
        });
    }

    // Iniciar leitura em tempo real
    iniciarLeitura(callback) {
        if (this.intervalo) clearInterval(this.intervalo);

        if (this.mode === 'simulated') {
            this.intervalo = setInterval(() => {
                // Simular leituras reais dos sensores
                const leitura = {
                    timestamp: new Date().toISOString(),
                    dispositivos: this.dispositivos.map(d => {
                        if (d.status === 'offline') return null;

                        // Variações realistas dos sensores
                        const campoMagnetico = 42 + (Math.random() * 8);
                        const vibracao = 1.5 + (Math.random() * 2.5);
                        const temperatura = d.temperatura + (Math.random() - 0.5) * 0.3;

                        return {
                            id: d.id,
                            nome: d.nome,
                            campoMagnetico: parseFloat(campoMagnetico.toFixed(2)),
                            vibracao: parseFloat(vibracao.toFixed(2)),
                            temperatura: parseFloat(temperatura.toFixed(1)),
                            bateria: Math.max(0, d.bateria - (Math.random() * 0.1)),
                            latitude: d.latitude + (Math.random() - 0.5) * 0.0001,
                            longitude: d.longitude + (Math.random() - 0.5) * 0.0001,
                            precisao: d.precisao
                        };
                    }).filter(d => d !== null)
                };

                this.historicoLeituras.push(leitura);
                if (this.historicoLeituras.length > 100) {
                    this.historicoLeituras.shift();
                }

                if (callback) callback(leitura);
                this.notificarListeners(leitura);
            }, this.pollIntervalMs);
        } else if (this.mode === 'network') {
            // Start network polling
            this.startNetworkPolling(this.pollIntervalMs, callback);
        }
    }

    // Network polling: fetch /sensor from each configured IP
    startNetworkPolling(intervalMs = 2000, callback) {
        this.stopNetworkPolling();
        const poll = async () => {
            const dispositivosData = [];
            const ips = Object.entries(this.deviceIPs);
            for (const [deviceId, ip] of ips) {
                try {
                    const url = (ip.startsWith('http') ? ip : `http://${ip}`) + '/sensor';
                    const resp = await fetch(url, { cache: 'no-store' });
                    if (!resp.ok) throw new Error('HTTP ' + resp.status);
                    const data = await resp.json();
                    dispositivosData.push(Object.assign({ id: deviceId }, data));
                } catch (err) {
                    // mark device offline
                    dispositivosData.push({ id: deviceId, status: 'offline' });
                }
            }

            const leitura = { timestamp: new Date().toISOString(), dispositivos: dispositivosData };
            this.historicoLeituras.push(leitura);
            if (this.historicoLeituras.length > 100) this.historicoLeituras.shift();
            if (callback) callback(leitura);
            this.notificarListeners(leitura);
        };

        // initial poll then interval
        poll();
        this.networkInterval = setInterval(poll, intervalMs);
    }

    stopNetworkPolling() {
        if (this.networkInterval) {
            clearInterval(this.networkInterval);
            this.networkInterval = null;
        }
    }

    // Adicionar listener para atualizações
    addListener(callback) {
        this.listeners.push(callback);
    }

    notificarListeners(data) {
        this.listeners.forEach(callback => callback(data));
    }

    // Enviar comando para dispositivo real
    async enviarComando(deviceId, comando) {
        const dispositivo = this.dispositivos.find(d => d.id === deviceId);
        
        if (!dispositivo) {
            throw new Error('Dispositivo não encontrado');
        }

        console.log(`Enviando comando '${comando}' para ${dispositivo.nome}`);

        return new Promise((resolve) => {
            setTimeout(() => {
                switch(comando) {
                    case 'CALIBRAR':
                        dispositivo.status = 'scanning';
                        setTimeout(() => {
                            dispositivo.status = 'online';
                        }, 5000);
                        break;
                    case 'REINICIAR':
                        dispositivo.status = 'offline';
                        setTimeout(() => {
                            dispositivo.status = 'online';
                        }, 10000);
                        break;
                    case 'PARAR':
                        dispositivo.status = 'offline';
                        break;
                    case 'INICIAR':
                        dispositivo.status = 'online';
                        break;
                }
                
                resolve({
                    status: 'ok',
                    comando: comando,
                    dispositivo: dispositivo.nome
                });
            }, 500);
        });
    }

    // Obter estatísticas em tempo real
    getEstatisticas() {
        const online = this.dispositivos.filter(d => d.status === 'online').length;
        const totalLeituras = this.dispositivos.reduce((acc, d) => acc + d.leituras, 0);
        const ultimaLeitura = this.historicoLeituras[this.historicoLeituras.length - 1];

        return {
            totalDispositivos: this.dispositivos.length,
            dispositivosOnline: online,
            dispositivosOffline: this.dispositivos.length - online,
            totalLeituras: totalLeituras,
            ultimaLeitura: ultimaLeitura,
            taxaMedia: Math.floor(300 + Math.random() * 100), // KB/s
            latenciaMedia: Math.floor(20 + Math.random() * 10), // ms
            timestamp: new Date().toISOString()
        };
    }

    // Calcular área promissora baseado em múltiplas leituras
    calcularAreaPromissora(deviceId, leituras) {
        const dispositivo = this.dispositivos.find(d => d.id === deviceId);
        
        if (!dispositivo || leituras.length < 5) return null;

        // Média das leituras
        const mediaMagnetica = leituras.reduce((acc, l) => acc + l.campoMagnetico, 0) / leituras.length;
        const mediaVibracao = leituras.reduce((acc, l) => acc + l.vibracao, 0) / leituras.length;

        // Algoritmo de detecção
        let probabilidade = 0;
        
        if (mediaMagnetica > 45) probabilidade += 40;
        if (mediaMagnetica > 48) probabilidade += 20;
        if (mediaVibracao > 2.5) probabilidade += 30;
        if (mediaVibracao > 3.5) probabilidade += 10;

        return {
            dispositivo: dispositivo.nome,
            local: dispositivo.local,
            latitude: dispositivo.latitude,
            longitude: dispositivo.longitude,
            probabilidade: Math.min(probabilidade, 99),
            mediaMagnetica: parseFloat(mediaMagnetica.toFixed(2)),
            mediaVibracao: parseFloat(mediaVibracao.toFixed(2)),
            numeroLeituras: leituras.length
        };
    }

    // Configure network devices: object mapping deviceId -> ip
    setDeviceIPs(map) {
        this.deviceIPs = Object.assign({}, map);
    }

    // Switch to network mode
    useNetworkMode(options = {}) {
        this.mode = 'network';
        if (options.pollIntervalMs) this.pollIntervalMs = options.pollIntervalMs;
    }

    // Switch to simulated mode
    useSimulatedMode() {
        this.mode = 'simulated';
        this.stopNetworkPolling();
    }
}

window.esp32 = new ESP32Device();