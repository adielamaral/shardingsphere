import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10, // número de usuários virtuais
    duration: '60s', // duração do teste
    thresholds: {
        http_req_failed: ['rate<0.01'], // Menos de 1% de falha
        http_req_duration: ['p(95)<200'], // 95% das requisições abaixo de 200ms
    },
};

function gerarCPFAleatorio() {
    let cpf = '';
    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10); // Gera um número aleatório de 0 a 9
    }
    return cpf;
}

export default function () {
    let firstName = `Anderson${Math.floor(Math.random() * 1000)}`;
    let email = `${firstName.toLowerCase()}@test.com`;
    let cpf = gerarCPFAleatorio();

    // Criação de dados para o usuário
    let data = {
        name: firstName,
        email: email,
        cpf: cpf
    };

    // Log de dados gerados
    console.log(`Dados gerados: Nome: ${firstName}, Email: ${email}, CPF: ${cpf}`);

    // Enviar uma requisição POST para criar o usuário
    let res = http.post('http://localhost/users/save', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });

    // Log de status da requisição POST
    console.log(`Resposta da requisição POST para criar o usuário: Status - ${res.status}`);
    console.log(`Duração da requisição POST: ${res.timings.duration}ms`);

    check(res, {
        'status 201': (r) => r.status === 201,
    });

    let createdUser = JSON.parse(res.body);
    let userId = createdUser.id; // Supondo que o retorno da criação do usuário inclua o id

    // Log de usuário criado
    console.log(`Usuário criado com sucesso! ID: ${userId}`);

    // Agora simula a exclusão do usuário
    let deleteRes = http.del(`http://localhost/users/${userId}`);

    // Log de status da requisição DELETE
    console.log(`Resposta da requisição DELETE para excluir o usuário ID ${userId}: Status - ${deleteRes.status}`);
    console.log(`Duração da requisição DELETE: ${deleteRes.timings.duration}ms`);

    check(deleteRes, {
        'status 204': (r) => r.status === 204, // Verifica se a resposta foi 204 (No Content)
    });

    // Log de sucesso na exclusão
    if (deleteRes.status === 204) {
        console.log(`Usuário ID ${userId} excluído com sucesso.`);
    } else {
        console.log(`Falha ao excluir o usuário ID ${userId}.`);
    }

    sleep(1); // Aguardar um tempo antes de enviar a próxima requisição
}
