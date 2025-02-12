import http from 'k6/http';
import { check, sleep } from 'k6';

// Variável global de contador para garantir unicidade
let counter = 0;

// Função para gerar um ID único
function gerarIDUnico() {
    const timestamp = Date.now(); // Obtém o timestamp atual em milissegundos
    counter++; // Incrementa o contador para garantir a unicidade do ID
    const randomPart = Math.floor(Math.random() * 1000); // Gera uma parte aleatória para maior unicidade
    return `${timestamp}${counter}${randomPart}`; // Combina timestamp, contador e valor aleatório
}

// Configurações de opções para o teste
export const options = {
    vus: 10, // número de usuários virtuais
    duration: '60s',
    thresholds: {
        http_req_failed: ['rate<0.01'], // Menos de 1% de falha
        http_req_duration: ['p(95)<200'], // 95% das requisições abaixo de 200ms
    },
};

// Função para gerar CPF aleatório
function gerarCPFAleatorio() {
    let cpf = '';
    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10); // Gera um número aleatório de 0 a 9
    }
    return cpf;
}

export default function () {
    let firstName = `David${Math.floor(Math.random() * 1000)}`;
    let email = `${firstName.toLowerCase()}@test.com`;
    let cpf = gerarCPFAleatorio();
    let id = gerarIDUnico(); // Gera um ID único para o usuário

    let data = {
        id: id,  // Incluindo o ID gerado no payload
        name: firstName,
        email: email,
        cpf: cpf
    };

    console.log(`Gerando usuário: ID = ${id}, Nome = ${firstName}, CPF = ${cpf}, Email = ${email}`);

    // Realiza a requisição POST com o corpo da requisição sendo o JSON gerado
    let res = http.post('http://localhost/users/save', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });

    // Verifica se o status da resposta foi 201 (criação bem-sucedida) e loga o sucesso ou falha
    if (res.status === 201) {
        console.log(`Usuário criado com sucesso! ID: ${id}`);
    } else {
        console.log(`Erro ao criar usuário com ID: ${id}. Status: ${res.status}`);
        console.log(`Detalhes do erro: ${res.body}`);
    }

    check(res, {
        'status 201': (r) => r.status === 201,
    });

    // Aguarda 1 segundo antes de realizar a próxima requisição
    sleep(1);
}
