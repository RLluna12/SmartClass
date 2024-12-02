// public/js/veriResponsavel.js
// userの情報をHTMLから取得
function getUserFromPage() {
  const userInfo = document.getElementById('user-info2');
  const id_responsavel = userInfo.getAttribute('data-id-responsavel');
  const nome_usuario = userInfo.getAttribute('data-nome-usuario-resp');

  return {
    id_responsavel: parseInt(id_responsavel, 10),
    nome_usuario: nome_usuario
  };
}

async function fetchAlunos() {
  const user = getUserFromPage();
  const id_responsavel = user.id_responsavel
  const response = await fetch(`/resps_aluno/${id_responsavel}/alunos`);
  const alunos = await response.json();
  const selectAluno = document.getElementById('selectAluno');
  alunos.forEach(aluno => {
    const option = document.createElement('option');
    option.value = aluno.id_aluno;
    option.textContent = aluno.nome_usuario;
    selectAluno.appendChild(option);
  });
}

// 成績・欠席情報を取得して表示
async function fetchNotasFaltas() {
  const idAluno = document.getElementById('selectAluno').value;
  const response = await fetch(`/resps_aluno/${idAluno}/notas_faltas`);
  const notas = await response.json();
  const notasTable = document.getElementById('notasTable').querySelector('tbody');
  notasTable.innerHTML = '';

  notas.forEach(nota => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${nota.nome_disciplina}</td>
      <td class="text-center">${nota.N1 !== null ? nota.N1 : 0}</td>
      <td class="text-center">${nota.AP !== null ? nota.AP : 0}</td>
      <td class="text-center">${nota.AI !== null ? nota.AI : 0}</td>
      <td class="text-center">${nota.faltas !== null ? nota.faltas : 0}</td>
      <td class="text-center">${nota.ano_academico}</td>
      <td class="text-center">${nota.semestre}</td>
    `;
    notasTable.appendChild(row);
  });
}

// ページロード時に生徒リストを表示
fetchAlunos();