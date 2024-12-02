const apiUrl = '/turma_disciplinas2'
const apiUrlTurma = '/turmas'
const apiUrlDisciplina = '/disciplinas'

function displayTurmaDisciplina(turmaDisciplina) {
  const turmaDisciplinaList = document.getElementById('turmaDisciplinaList')
  turmaDisciplinaList.innerHTML = ''
/* 
  // 'turmaName'でソート
  turmaDisciplina.sort((a, b) => {
    // Promiseを使って名前を取得するため、名前が分かる前に並べ替えができない
    // 名前を取得した後に並べ替える必要がある
    return new Promise((resolve, reject) => {
      Promise.all([getTurmaName(a.id_turma), getTurmaName(b.id_turma)])
        .then(([nameA, nameB]) => {
          resolve(nameA.localeCompare(nameB))  // 名前でアルファベット順に並べ替え
        })
        .catch(error => reject(error))
    })
  }) */

  turmaDisciplina.forEach(turmaDisciplina => {
    // TurmaとDisciplinaの名前を取得
    Promise.all([getTurmaName(turmaDisciplina.id_turma), getDisciplinaName(turmaDisciplina.id_disciplina)])
      .then(([turmaName, disciplinaName]) => {
        const turmaDisciplinaElement = document.createElement('tr')
        turmaDisciplinaElement.innerHTML = `
              <td>${turmaName}</td>
              <td>${disciplinaName}</td>
              <td>
                <button onclick="deleteTurmaDisciplina(${turmaDisciplina.id_turma}, ${turmaDisciplina.id_disciplina})">Excluir</button>
              </td>
          `
        turmaDisciplinaList.appendChild(turmaDisciplinaElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// 取得
function getTurmaDisciplinas() {
  fetch(apiUrl, { cache: 'no-store' })
    .then(response => response.json())
    .then(data => displayTurmaDisciplina(data))
    .catch(error => console.error('Erro:', error))
}

// Turmaの名前を取得
function getTurmaName(id_turma) {
  return fetch(`${apiUrlTurma}/${id_turma}`)
    .then(response => response.json())
    .then(data => data.nome_turma)
    .catch(error => console.error('Erro:', error))
}

// Disciplinaの名前を取得
function getDisciplinaName(id_disciplina) {
  return fetch(`${apiUrlDisciplina}/${id_disciplina}`)
    .then(response => response.json())
    .then(data => data.nome_disciplina)
    .catch(error => console.error('Erro:', error))
}

// TurmaDisciplinaの追加
document.getElementById('addTurmaDisciplinaForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  // TurmaのIDを取得
  const turmaId = document.getElementById('turmaId').value;
  const id_turma = parseInt(turmaId);

  // 選択されたDisciplinaのIDをすべて取得
  const disciplinaSelect = document.getElementById('disciplinaId');
  const selectedDisciplinas = Array.from(disciplinaSelect.selectedOptions).map(option => parseInt(option.value));


  console.log("test" + id_turma + " at :" + selectedDisciplinas)
  // TurmaとDisciplinaの組み合わせを作成
  const turmaDisciplinas = selectedDisciplinas.map(id_disciplina => ({ id_turma, id_disciplina }));


  

  try {
    // 各TurmaDisciplinaをサーバーに送信
    const responses = await Promise.all(turmaDisciplinas.map(async turmaDisciplina => {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(turmaDisciplina)
      });
      return response.json();
    }));

    console.log(responses);

    console.log("Added:", responses);  
    // データ取得してフォームをリセット
    await getTurmaDisciplinas();
    document.getElementById('addTurmaDisciplinaForm').reset();
  } catch (error) {
    console.error('Erro:', error);
  }
});



// TurmaDisciplinaを削除
async function deleteTurmaDisciplina(id_turma, id_disciplina) {
  try {
    const response = await fetch(`${apiUrl}/${id_turma}/${id_disciplina}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    
    console.log("Deleted:", data); 
    
    // TurmaDisciplinasデータの更新
    await getTurmaDisciplinas();
  } catch (error) {
    console.error('Erro:', error);
  }
}

getTurmaDisciplinas()

// Turmasを取得
function getTurmas() {
  return fetch(apiUrlTurma)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}

// Disciplinaを取得// Disciplinaを取得
function getDisciplinas() {
  return fetch(apiUrlDisciplina)
    .then(response => response.json())
    .catch(error => console.error('Erro:', error))
}

document.addEventListener('DOMContentLoaded', function () {
  const turmaSelect = document.getElementById('turmaId')
  const disciplinaSelect = document.getElementById('disciplinaId')

  getTurmas().then(turmas => {
    turmas.forEach(turma => {
      const option = document.createElement('option')
      option.value = turma.id_turma
      option.textContent = turma.nome_turma
      turmaSelect.appendChild(option)
    })
  })

  // getDisciplina()をgetDisciplinas()に変更し、複数のDisciplinaを埋め込む
  getDisciplinas().then(disciplinas => {
    disciplinas.forEach(disciplina => {
      const option = document.createElement('option')
      option.value = disciplina.id_disciplina
      option.textContent = disciplina.nome_disciplina
      disciplinaSelect.appendChild(option)
    })
  })
})





// Turmaが選択されたときのイベントリスナーを追加
document.getElementById('turmaId').addEventListener('change', function () {
  const selectedTurmaId = parseInt(this.value)
  if (!isNaN(selectedTurmaId)) {
    // Turmaに関連するDisciplinaを取得し、既存のDisciplinaをリスト化して表示
    getTurmaDisciplinasByTurma(selectedTurmaId)
  }
})
// 特定のTurmaに関連するDisciplinaを取得し、リスト化して表示する関数
function getTurmaDisciplinasByTurma(turmaId) {
  fetch(`${apiUrl}?id_turma=${turmaId}`)
    .then(response => response.json())
    .then(data => displayTurmaDisciplina(data))
    .catch(error => console.error('Erro:', error))
}
// 選択されたTurmaの既存のDisciplinaをリスト化して表示する関数
function displayTurmaDisciplinaByTurma(turmaId) {
  const turmaDisciplinaList = document.getElementById('turmaDisciplinaList')
  turmaDisciplinaList.innerHTML = ''

  fetch(`${apiUrl}?id_turma=${turmaId}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(turmaDisciplina => {
        Promise.all([getTurmaName(turmaDisciplina.id_turma), getDisciplinaName(turmaDisciplina.id_disciplina)])
          .then(([turmaName, disciplinaName]) => {
            const turmaDisciplinaElement = document.createElement('tr')
            turmaDisciplinaElement.innerHTML = `
              <td>${turmaName}</td>
              <td>${disciplinaName}</td>
              <td>
                <button onclick="deleteTurmaDisciplina(${turmaDisciplina.id_turma}, ${turmaDisciplina.id_disciplina})">Excluir</button>
              </td>
            `
            turmaDisciplinaList.appendChild(turmaDisciplinaElement)
          })
          .catch(error => console.error('Erro:', error))
      })
    })
    .catch(error => console.error('Erro:', error))
}