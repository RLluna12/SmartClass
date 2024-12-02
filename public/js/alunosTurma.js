// public/js/alunosTurma.js
const apiUrlTurmaAlunos = '/turma_alunos'
const apiUrlAluno = '/alunos'
const apiUrlTurma = '/turmas'


document.getElementById('searchAlunoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = document.getElementById('searchQuery').value;
  const alunoResultContainer = document.getElementById('alunoResultContainer');
  alunoResultContainer.innerHTML = '';

  try {
    const response = await fetch(`/alunos/search/${query}`);
    const alunos = await response.json();
  
  
    if (alunos.length > 0) {
      alunos.forEach(aluno => {
        const alunoCard = document.getElementById('alunoCardTemplate').cloneNode(true);
        alunoCard.style.display = 'block';
        alunoCard.querySelector('.nomeAluno').textContent = aluno.nome_usuario;
        alunoCard.querySelector('.cpfAluno').textContent = aluno.cpf_usuario;
        alunoCard.querySelector('.emailAluno').textContent = aluno.email_usuario;
        alunoCard.querySelector('.raAluno').textContent = aluno.ra_aluno;
        alunoCard.querySelector('.turmaAtual').textContent = aluno.nome_turma ? aluno.nome_turma : 'Não alocado';
  
        const turmaSelect = alunoCard.querySelector('.newTurmaSelect');
        getTurmas().then(turmas => {
          turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id_turma;
            option.textContent = turma.nome_turma;
            turmaSelect.appendChild(option);
          });
        });
  
        alunoCard.querySelector('.changeTurmaBtn').addEventListener('click', () => {
          const newTurmaId = turmaSelect.value;
          if (newTurmaId) {
            updateAlunoTurma(aluno.id_aluno, newTurmaId);
          } else {
            alert('Selecione uma turma válida!');
          }
        });
  
        alunoResultContainer.appendChild(alunoCard);
      });
    } else {
      alunoResultContainer.innerHTML = '<p>Nenhum aluno encontrado.</p>';
    }
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    alert('Erro ao buscar alunos.');
  }
});

async function updateAlunoTurma(alunoId, turmaId) {
  try {
    const response = await fetch(`/alunos/${alunoId}/turma`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turmaId }),
    });

    if (response.ok) {
      alert('Turma alterada com sucesso!');
      // 必要ならUIを更新
    } else {
      throw new Error('Erro ao alterar turma.');
    }
  } catch (error) {
    console.error(error);
    alert('Erro ao alterar turma.');
  }
}

// Turmasを取得
function getTurmas() {
  return fetch(apiUrlTurma)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}