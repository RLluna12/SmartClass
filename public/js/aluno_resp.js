const apiUrlAlunoResp = '/resps_aluno'
const apiUrlAluno = '/alunos'
const apiUrlResp = '/responsaveis'

// リストを表示
function displayAlunoResp(alunoResp) {
  const alunoRespList = document.getElementById('alunoRespList')
  alunoRespList.innerHTML = ''
  alunoResp.forEach(alunoResp => {
    // RespとAlunoの名前を取得
    Promise.all([getAlunoName(alunoResp.id_aluno), getRespName(alunoResp.id_responsavel)])
      .then(([alunoName, respName]) => {
        const alunoRespElement = document.createElement('tr')
        alunoRespElement.innerHTML = `
              <td>${alunoName}</td>
              <td>${respName}</td>
              <td>
                <button onclick="deleteAlunoResp(${alunoResp.id_resp_aluno})">Excluir</button>
              </td>
          `
        alunoRespList.appendChild(alunoRespElement)
      })
      .catch(error => console.error('Erro:', error))
  })
}

// AlunoRespを取得する関数
async function getAlunoResp() {
  try {
    const response = await fetch(apiUrlAlunoResp);
    const data = await response.json();
    displayAlunoResp(data);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Alunoの名前を取得する関数
async function getAlunoName(id_aluno) {
  try {
    const response = await fetch(`${apiUrlAluno}/${id_aluno}`);
    const data = await response.json();
    return data.nome_usuario; // 戻り値としてdataを返す
  } catch (error) {
    console.error('Erro:', error);
  }
}
// Respの名前を取得
async function getRespName(id_resp) {
  try {
    const response = await fetch(`${apiUrlResp}/${id_resp}`)
    const data = await response.json();
    return data.nome_usuario; // 戻り値としてdataを返す
  } catch (error) {
    console.error('Erro:', error);
  }
}

// 追加
document.getElementById('addAlunoRespForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const alunoId = parseInt(document.getElementById('alunoId').value)
  const respId = parseInt(document.getElementById('respId').value)
  console.log("aluno :" + alunoId + " resp :" + respId)
  
  fetch(apiUrlAlunoResp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_aluno: alunoId,
      id_responsavel: respId
    })
  })
    .then(response => response.json())
    .then(data => {
      getAlunoResp()
      document.getElementById('addAlunoRespForm').reset()
    })
    .catch(error => console.error('Erro:', error))
})

// 削除
async function deleteAlunoResp(id_resp_aluno) {
  try {
    const response = await fetch(`${apiUrlAlunoResp}/${id_resp_aluno}`, {
      method: 'DELETE'
    });
    // DELETEのレスポンスが空でない場合のみJSONを解析
    if (response.ok) {
      await getAlunoResp(); // 削除後、最新のデータを取得して表示
    } else {
      console.error('Erro:', response.statusText);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

getAlunoResp()

// Alunosを取得
async function getAlunos() {
  try {
    const response = await fetch(apiUrlAluno);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
  }
}
// Turmasを取得
async function getResp() {
  try {
    const response = await fetch(apiUrlResp);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const alunoSelect = document.getElementById('alunoId')
  const respSelect = document.getElementById('respId')

  getAlunos().then(alunos => {
    alunos.forEach(aluno => {
      const option = document.createElement('option')
      option.value = aluno.id_aluno
      option.textContent = aluno.nome_usuario
      alunoSelect.appendChild(option)
    })
  })

  getResp().then(resp => {
    resp.forEach(resp => {
      const option = document.createElement('option')
      option.value = resp.id_responsavel
      option.textContent = resp.nome_usuario
      respSelect.appendChild(option)
    })
  })
})
