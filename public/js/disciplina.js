// disciplina.js
const apiUrlDisciplina = '/disciplinas'

// リストを表示
function displayDisciplina(disciplinas) {
  const disciplinaList = document.getElementById('disciplinaList')
  disciplinaList.innerHTML = ''
  disciplinas.forEach(disciplina => {
    const disciplinaElement = document.createElement('tr')
    disciplinaElement.innerHTML = `
          <td>${disciplina.id_disciplina}</td>
          <td>${disciplina.nome_disciplina}</td>
          <td>${disciplina.horario}</td>
          <td>
            <button onclick="updateDisciplina(${disciplina.id_disciplina})">Editar</button>
            <button onclick="deleteDisciplina(${disciplina.id_disciplina})">Excluir</button>
          </td>
      `
    disciplinaList.appendChild(disciplinaElement)
  })
}

// 取得
function getDisciplina() {
  fetch(apiUrlDisciplina)
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw err
        })
      }
      return response.json()
    })
    .then(data => {
      displayDisciplina(data) // データを表示する
    })
    .catch(error => {
      console.error('Erro:', error)
      alert('Erro ao obter disciplinas' + error.message)
    })
}

// 追加
document.getElementById('addDisciplinaForm').addEventListener('submit', function (event) {
  console.log('Add button clicked')
  event.preventDefault()
  const disciplinaName = document.getElementById('disciplinaName').value
  const disciplinaHorario = document.getElementById('disciplinaHorario').value

  fetch(apiUrlDisciplina, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      nome_disciplina: disciplinaName,
      horario: disciplinaHorario
    })
  })
    .then(response => {
      console.log('Response:', response) // ここで確認
      if (!response.ok) {
        return response.json().then(err => {
          throw err
        })
      }
      return response.json()
    })
    .then(data => {
      console.log('Disciplina added:', data) // ここで確認
      getDisciplina()
      document.getElementById('addDisciplinaForm').reset()
    })
    .catch(error => {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao adicionar disciplina')
    })
})

// 更新
function updateDisciplina(id) {
  fetch(`${apiUrlDisciplina}/${id}`)
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw err
        })
      }
      return response.json()
    })
    .then(data => {
      document.getElementById('editDisciplinaId').value = data.id_disciplina
      document.getElementById('editDisciplinaName').value = data.nome_disciplina
      document.getElementById('editDisciplinaHorario').value = data.horario
      document.getElementById('updateDisciplinaForm').style.display = 'block' // フォームを表示
    })
    .catch(error => {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao buscar disciplina')
    })
}

// 実際に更新
document.getElementById('updateDisciplinaForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const disciplinaId = document.getElementById('editDisciplinaId').value
  const disciplinaName = document.getElementById('editDisciplinaName').value
  const disciplinaHorario = document.getElementById('editDisciplinaHorario').value

  fetch(`${apiUrlDisciplina}/${disciplinaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome_disciplina: disciplinaName,
      horario: disciplinaHorario
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw err
        })
      }
      return response.json()
    })
    .then(data => {
      getDisciplina()
      document.getElementById('updateDisciplinaForm').style.display = 'none'
      document.getElementById('updateDisciplinaForm').reset()
    })
    .catch(error => {
      console.error('Erro:', error)
      alert(error.message || 'Erro ao atualizar disciplina')
    })
})

// 削除ボタン
function deleteDisciplina(id_disciplina) {
  if (confirm('Tem certeza de que deseja excluí-lo?')) {
    fetch(`${apiUrlDisciplina}/${id_disciplina}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw err
          })
        }
        return response.json()
      })
      .then(data => {
        getDisciplina()
      })
      .catch(error => {
        console.error('Erro:', error)
        alert(error.message || 'Erro ao excluir disciplina')
      })
  }
}

getDisciplina()

// 編集キャンセル
function cancelEdit() {
  document.getElementById('updateDisciplinaForm').reset()
  document.getElementById('updateDisciplinaForm').style.display = 'none'
}
