const fs = require('fs');
const path = require('path');

// Read auth.js to extract usuarios array
const authPath = path.join(__dirname, 'auth.js');
const authContent = fs.readFileSync(authPath, 'utf8');

// Parse usuarios array from auth.js
const match = authContent.match(/const usuarios = \[([\s\S]*?)\];/);
if (!match) {
  console.error('❌ Não foi possível encontrar o array `usuarios` em auth.js');
  process.exit(1);
}

const block = match[1];
const entryRegex = /\{\s*user:\s*'([^']+)'\s*,\s*pass:\s*'([^']+)'\s*,\s*nome:\s*'([^']+)'\s*\}/g;

let m;
const users = [];
while ((m = entryRegex.exec(block)) !== null) {
  users.push({ user: m[1], pass: m[2], nome: m[3] });
}

if (users.length === 0) {
  console.error('❌ Nenhum usuário parseado de auth.js');
  process.exit(1);
}

console.log('✓ Usuários encontrados em auth.js:');
users.forEach(u => console.log(`  - ${u.user} (${u.nome})`));
console.log('');

// Test 3 credenciais: admin, ambrosio, mechack
const testCreds = [
  { user: 'admin', pass: 'geoscan2026' },
  { user: 'ambrosio', pass: 'zambote2026' },
  { user: 'mechack', pass: 'ilandia2026' }
];

let allPassed = true;

testCreds.forEach(test => {
  const found = users.find(u => u.user === test.user && u.pass === test.pass);
  if (found) {
    console.log(`✓ [OK] ${test.user}/${test.pass} → ${found.nome}`);
  } else {
    console.log(`✗ [FALHA] ${test.user}/${test.pass} não encontrado`);
    allPassed = false;
  }
});

console.log('');

// Verify index.html loads auth.js
const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (indexContent.includes('<script src="auth.js"></script>')) {
  console.log('✓ index.html carrega auth.js corretamente');
} else {
  console.log('✗ index.html não referencia auth.js');
  allPassed = false;
}

// Verify dashboard exists
const dashboardPath = path.join(__dirname, 'pages', 'dashboard-inicio.html');
if (fs.existsSync(dashboardPath)) {
  console.log('✓ Dashboard (pages/dashboard-inicio.html) existe');
} else {
  console.log('✗ Dashboard não encontrado');
  allPassed = false;
}

console.log('');
if (allPassed) {
  console.log('✅ Todos os testes passaram! Login deve funcionar agora.');
  process.exit(0);
} else {
  console.log('❌ Alguns testes falharam.');
  process.exit(1);
}
