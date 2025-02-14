import http from 'k6/http';
import { check, sleep } from 'k6';

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

    let data = {
        name: firstName,
        email: email,
        cpf: cpf
    };

    console.log(`Gerando usuário: Nome = ${firstName}, CPF = ${cpf}, Email = ${email}`);

    // Realiza a requisição POST com o corpo da requisição sendo o JSON gerado
    let res = http.post('http://localhost/users/save', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });

    // Verifica se a resposta foi bem-sucedida
    if (res.status === 201) {
        console.log(`Usuário criado com sucesso!`);
    } else {
        console.log(`Erro ao criar usuário. Status: ${res.status}`);
        console.log(`Detalhes do erro: ${res.body}`);
    }

    check(res, {
        'status 201': (r) => r.status === 201,
    });

    // Aguarda 1 segundo antes de realizar a próxima requisição
    sleep(1);
}
