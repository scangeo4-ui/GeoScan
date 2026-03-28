const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const dashboardPath = path.join(__dirname, 'pages', 'dashboard-inicio.html');

const html = fs.readFileSync(indexPath, 'utf8');

// Extract usuarios array block
const match = html.match(/const usuarios = \[([\s\S]*?)\];/);
if (!match) {
  console.error('Não foi possível encontrar o array `usuarios` em index.html');
  process.exit(2);
}

const block = match[1];

// Parse entries like { user: 'geoscan', pass: 'geoscan2026', nome: 'geoscan' }
const entryRegex = /\{\s*user:\s*'([^']+)'\s*,\s*pass:\s*'([^']+)'\s*,\s*nome:\s*'([^']+)'\s*\}/g;
let m;
const users = [];
while ((m = entryRegex.exec(block)) !== null) {
  users.push({ user: m[1], pass: m[2], nome: m[3] });
}

if (users.length === 0) {
  console.error('Nenhum usuário parseado do arquivo. Conteúdo do bloco:', block.slice(0,200));
  process.exit(3);
}

console.log('Usuários encontrados:', users.map(u=>u.user).join(', '));

// Test a known credential
const testUser = 'geoscan';
const testPass = 'geoscan2026';

const found = users.find(u => u.user.toLowerCase() === testUser && u.pass === testPass);
if (!found) {
  console.error(`Credenciais de teste ${testUser}/${testPass} não encontradas ou inválidas.`);
  process.exit(4);
}

// Verify dashboard file exists
if (!fs.existsSync(dashboardPath)) {
  console.error('Arquivo de dashboard não encontrado:', dashboardPath);
  process.exit(5);
}

console.log('Teste de login simulado OK — redirecionamento para pages/dashboard-inicio.html é possível.');
process.exit(0);
