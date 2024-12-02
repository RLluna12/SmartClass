const apiUrl = '/publicacoes';


function getUserFromPage() {
  const user = document.getElementById('user-info');
  const id_perfil = user.getAttribute('data-id-perfil');
  const id_responsavel = user.getAttribute('data-id');
  const nome_usuario = user.getAttribute('data-nome-usuario');

  return {
    id_responsavel: parseInt(id_responsavel, 10),
    id_perfil: parseInt(id_perfil, 10),
    nome_usuario: nome_usuario
  };
}

function displaypublicacao(publicacao, user) {
  const publicacaoList = document.getElementById('publicacaoList');
  publicacaoList.innerHTML = '';
  publicacao.forEach(publicacao => {
    const publicacaoElement = document.createElement('tr');
    publicacaoElement.innerHTML = `
      <td>${publicacao.comentario}</td>
      <td>${formatDate(publicacao.data_pub)}</td>
      <td>${publicacao.nome_pubricador}</td>
        ${
          
          // Apenas exibir os botões para perfis específicos
          user.id_perfil === 1 || user.id_perfil === 2 || user.id_perfil === 5 
            ? `<td>
                <button onclick="updatepublicacao(${publicacao.id_pub})">Editar</button>
                <button onclick="deletepublicacao(${publicacao.id_pub})">Excluir</button>
              </td> `
            : '' // Deixe vazio para não exibir nada para perfis sem permissão
        }
      
    `;
    publicacaoList.appendChild(publicacaoElement);
  });
}

function getpublicacao() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(data => displaypublicacao(data, getUserFromPage())) // Passa o perfil do usuário
    .catch(error => console.error('Erro:', error));
}
document.addEventListener('DOMContentLoaded', () => {
  getpublicacao();
});

/* document.getElementById('addPublicacaoForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const publicacaoNome = document.getElementById('publicacaoNome').value;
  const publicacaoDate = document.getElementById('publicacaoDate').value;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comentario: publicacaoNome,
      data_pub: publicacaoDate
    })
  })
    .then(response => response.json())
    .then(() => {
      getpublicacao();
      document.getElementById('addPublicacaoForm').reset();
    })
    .catch(error => console.error('Erro:', error));
}); */
const addPublicacaoForm = document.getElementById('addPublicacaoForm');
if (addPublicacaoForm) {
  const user = getUserFromPage() 
  addPublicacaoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const publicacaoNome = document.getElementById('publicacaoNome').value;
    const publicacaoDate = document.getElementById('publicacaoDate').value;
    const nome_pubricador = user.nome_usuario;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comentario: publicacaoNome,
        data_pub: publicacaoDate,
        nome_pubricador: nome_pubricador
      })
    })
      .then(response => response.json())
      .then(() => {
        getpublicacao();
        addPublicacaoForm.reset();
      })
      .catch(error => console.error('Erro:', error));
  });
}

function updatepublicacao(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editPublicacaoId').value = data.id_pub;
      document.getElementById('editPublicacaoNome').value = data.comentario;
      document.getElementById('editPublicacaoDate').value = formatDate(data.data_pub);
      document.getElementById('updatePublicacaoForm').style.display = 'block';
    })
    .catch(error => console.error('Erro:', error));
}

/* document.getElementById('updatePublicacaoForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const publicacaoId = document.getElementById('editPublicacaoId').value;
  const publicacaoNome = document.getElementById('editPublicacaoNome').value;
  const publicacaoDate = document.getElementById('editPublicacaoDate').value;

  fetch(`${apiUrl}/${publicacaoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comentario: publicacaoNome,
      data_pub: publicacaoDate
    })
  })
    .then(response => response.json())
    .then(() => {
      getpublicacao();
      document.getElementById('updatePublicacaoForm').style.display = 'none';
    })
    .catch(error => console.error('Erro:', error));
}); */
const updatePublicacaoForm = document.getElementById('updatePublicacaoForm');
if (updatePublicacaoForm) {
  const user = getUserFromPage()
  updatePublicacaoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const publicacaoId = document.getElementById('editPublicacaoId').value;
    const publicacaoNome = document.getElementById('editPublicacaoNome').value;
    const publicacaoDate = document.getElementById('editPublicacaoDate').value;
    const nome_pubricador = user.nome_usuario;

    fetch(`${apiUrl}/${publicacaoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comentario: publicacaoNome,
        data_pub: publicacaoDate,
        nome_pubricador: nome_pubricador
      })
    })
      .then(response => response.json())
      .then(() => {
        getpublicacao();
        document.getElementById('updatePublicacaoForm').style.display = 'none';
      })
      .catch(error => console.error('Erro:', error));
  });
}

function deletepublicacao(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(() => getpublicacao())
    .catch(error => console.error('Erro:', error));
}

function cancelEdit() {
  document.getElementById('updatePublicacaoForm').reset();
  document.getElementById('updatePublicacaoForm').style.display = 'none';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

getpublicacao();