// js/turma.js
const apiUrlTurma = "/turmas";
console.log(apiUrlTurma)
// リストを表示
function displayTurma(turma) {
  const turmaList = document.getElementById('turmaList')
  turmaList.innerHTML = ''
  turma.forEach(turma => {
    const turmaElement = document.createElement('tr')
    turmaElement.innerHTML = `
          <td>${turma.id_turma}</td>
          <td>${turma.nome_turma}</td>
          <td>${turma.ano_letivo}</td>
          <td>
            <button onclick="updateTurma(${turma.id_turma})">Editar</button>
            <button onclick="deleteTurma(${turma.id_turma})">Excluir</button>
            <button onclick="publicAlunosTurma(${turma.id_turma})">Alunos</button>
          </td>
      `
    turmaList.appendChild(turmaElement)
  })
}

// 取得
function getTurma() {
  fetch(apiUrlTurma)
    .then(response => {
      if (!response.ok) {
          return response.json().then(err => { throw err });
      }
      return response.json();
    })
    .then(data => {
      displayTurma(data)
    })
    .catch(error => console.error('Erro:', error))
}

// 追加
document.getElementById('addTurmaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const turmaName = document.getElementById('turmaName').value
  const turmaAno_letivo = document.getElementById('turmaAno_letivo').value


  fetch(apiUrlTurma, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({
      nome_turma: turmaName,
      ano_letivo: turmaAno_letivo
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('New turma added:', data); // 確認用
      getTurma()
      document.getElementById('addTurmaForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 更新
function updateTurma(id) {
  fetch(`${apiUrlTurma}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editTurmaId').value = data.id_turma
      document.getElementById('editTurmaName').value = data.nome_turma
      document.getElementById('editTurmaAno').value = parseInt(data.ano_letivo)
    })
    .catch(error => console.error('Erro:', error))
}

// 実際に更新
document.getElementById('updateTurmaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const turmaId = document.getElementById('editTurmaId').value
  const turmaName = document.getElementById('editTurmaName').value
  const turmaAno_letivo = document.getElementById('editTurmaAno').value
  const turmaAno_letivoINT = parseInt(turmaAno_letivo)

  // MySQLのYEAR型に合わせて年をフォーマットする
  const formattedYear = new Date(turmaAno_letivoINT, 0).toISOString().substring(0, 4)
  const formattedYear2 = parseInt(formattedYear)

  fetch(`${apiUrlTurma}/${turmaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_turma: turmaName,
      ano_letivo: formattedYear2
    })
  })
    .then(response => response.json())
    .then(data => {
      getTurma()
      /* document.getElementById('editTurmaForm').style.display = 'none'; */
    })
    .catch(error => console.error('Erro:', error))
})

// 削除ボタン
function deleteTurma(id_turma) {
  if (confirm('Tem certeza de que deseja excluí-lo?')) {
  fetch(`${apiUrlTurma}/${id_turma}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getTurma())
    .catch(error => console.error('Erro:', error))
  }
}

getTurma()

function cancelEdit() {
  document.getElementById('updateTurmaForm').reset()
}

function publicAlunosTurma() {
  
}