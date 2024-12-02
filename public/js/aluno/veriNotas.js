
const apiUrlNotasFaltas = '/notas_faltas'
const apiUrlDisciplina = '/disciplinas'
const apiUrlAluno = '/alunos'

// userの情報をHTMLから取得
function getUserFromPage() {
  const userInfo = document.getElementById('user-info');
  const id_aluno = userInfo.getAttribute('data-id-aluno');
  const nome_usuario = userInfo.getAttribute('data-nome-usuario');

  return {
    id_aluno: parseInt(id_aluno, 10),
    nome_usuario: nome_usuario
  };
}


function populateAnoSelect(data_matricula) {
  const selectAno = document.getElementById('selectAno');
  const currentYear = new Date().getFullYear(); // 現在の年を取得
  const startYear = new Date(data_matricula).getFullYear();

  // 選択肢を生成
  for (let year = startYear; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    selectAno.appendChild(option);
  }
}

function displayNota(nota) {
  const notaList = document.getElementById('notaList')
  notaList.innerHTML = ''
  nota.forEach(nota => {
    // Escolaの情報を取得
    fetch(`${apiUrlDisciplina}/${nota.id_disciplina}`)
      .then(response => response.json())
      .then(disciplina => {
        const notaElement = document.createElement('tr')
        notaElement.innerHTML = `

              <td>${disciplina.nome_disciplina}</td>
              <td>${nota.N1 !== null ? nota.N1 : 0}</td>
              <td>${nota.AI !== null ? nota.AI : 0}</td>
              <td>${nota.AP !== null ? nota.AP : 0}</td>
              <td>${nota.ano_academico}</td>

              <td>${nota.semestre}</td>
          `
        notaList.appendChild(notaElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

function getNotasByAluno() {

  // HTMLからuser情報を取得
  const user = getUserFromPage();
  const id_aluno = user.id_aluno; // user から id_aluno を取得

  if (!id_aluno) {
    console.error('User ID is missing.');
    return;
  }


  fetch(`${apiUrlAluno}/${id_aluno}`)
    .then(response => response.json())
    .then(aluno => {
      // ログインした生徒のIDを使用して、その生徒の成績や欠席情報を取得するリクエストを送信
      fetch(`${apiUrlAluno}/${id_aluno}/notas_faltas`)
        .then(response => response.json())
        .then(data => {
          notas = data;
          displayNota(notas);
          populateAnoSelect(aluno.data_matricula); 
        })
        .catch(error => console.error('Erro:', error))
    })
    .catch(error => console.error('Erro:', error))
}

function filterNotas() {
  const ano = document.getElementById('selectAno').value;
  const semestre = document.getElementById('selectSemestre').value;

  const id_aluno = getUserFromPage().id_aluno; // user情報をHTMLから取得


  if (!ano || !semestre) {
    console.error('Ano ou Semestre esta errado.');
    return;
  }
  
  fetch(`${apiUrlAluno}/${id_aluno}/notas_faltas`)
    .then(response => response.json())
    .then(data => {
      const filteredNotas = data.filter(nota => nota.ano_academico == ano && nota.semestre == semestre);

      displayNota(filteredNotas);
    })
    .catch(error => console.error('filter Erro:', error));
}

document.getElementById('filterButton').addEventListener('click', filterNotas);




// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

getNotasByAluno()



