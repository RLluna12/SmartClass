// editarNotas.js
const apiUrlNota = '/notas';
const apiUrlAluno = '/alunos';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alunoId = urlParams.get('alunoId');
  const disciplinaId = urlParams.get('disciplinaId');
  const idNotasFaltas = urlParams.get('idNotasFaltas');

  // Aluno情報を取得
  fetchAlunoInfo(alunoId);
  
  // Notas情報を取得
  fetchNotaInfo(idNotasFaltas);

  // フォームの送信イベント
  document.getElementById('editNotaForm').addEventListener('submit', (event) => {
    event.preventDefault();
    updateNota(idNotasFaltas, alunoId, disciplinaId);
  });
});

function fetchAlunoInfo(alunoId) {
  fetch(`${apiUrlAluno}/${alunoId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('nomeAluno').value = data.nome_usuario;
      document.getElementById('matriculaAluno').value = formatDate(data.data_matricula);
    })
    .catch(error => console.error('Error fetching Aluno:', error));
}

function fetchNotaInfo(id_notas_faltas) {
  fetch(`/notasByid_notas_faltas/${id_notas_faltas}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const notaInfo = data[0];
        console.log("Dados :", notaInfo);
        document.getElementById('faltasAluno').value = notaInfo.faltas;
        document.getElementById('n1Input').value = notaInfo.N1;
        document.getElementById('apInput').value = notaInfo.AP;
        document.getElementById('aiInput').value = notaInfo.AI;
        document.getElementById('anoAluno').value = notaInfo.ano_academico;
        document.getElementById('semestreAluno').value = notaInfo.semestre;
      } else {
        console.error('No data found for the specified ID.');
      }
    })
    .catch(error => console.error('Error fetching Nota:', error));
}

function updateNota(idNotasFaltas, alunoId, disciplinaId) {
  const n1Input = document.getElementById('n1Input').value;
  const aiInput = document.getElementById('aiInput').value;
  const apInput = document.getElementById('apInput').value;
  const faltas = document.getElementById('faltasAluno').value;
  const ano_academico = document.getElementById('anoAluno').value;
  const semestre = document.getElementById('semestreAluno').value;

  const data = {
    id_disciplina: disciplinaId,
    id_aluno: alunoId,
    n1: n1Input,
    ai: aiInput,
    ap: apInput,
    faltas: faltas,
    ano_academico: ano_academico,
    semestre: semestre
  };

  fetch(`${apiUrlNota}/${idNotasFaltas}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Nota updated:', data);
    alert('Nota atualizada com sucesso.');
  })
  .catch(error => console.error('Error updating Nota:', error));
}

// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
