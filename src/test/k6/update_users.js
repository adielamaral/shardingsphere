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

    // Log antes de enviar a requisição POST para criação do usuário
    console.log(`Enviando requisição POST para criar usuário: ${JSON.stringify(data)}`);

    // Enviar uma requisição POST para criar o usuário
    let res = http.post('http://localhost/users/save', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });

    // Log da resposta da requisição POST
    console.log(`Resposta da criação de usuário: Status ${res.status}, Duração: ${res.timings.duration}ms`);

    // Verifica se o status da resposta é 201 (Criado)
    check(res, {
        'status 201': (r) => r.status === 201,
    });

    if (res.status === 201) {
        let createdUser = JSON.parse(res.body);
        let userId = createdUser.id; // Supondo que o retorno da criação do usuário inclua o id

        console.log(`Usuário criado com sucesso! ID: ${userId}`);

        // Agora simula a atualização do usuário
        let updatedData = {
            name: `Updated ${firstName}`,
            email: `${firstName.toLowerCase()}_updated@test.com`,
            cpf: gerarCPFAleatorio(),
        };

        // Log antes de enviar a requisição PUT para atualizar o usuário
        console.log(`Enviando requisição PUT para atualizar usuário com ID ${userId}: ${JSON.stringify(updatedData)}`);

        // Envia uma requisição PUT para atualizar o usuário
        let updateRes = http.put(`http://localhost/users/${userId}`, JSON.stringify(updatedData), {
            headers: { 'Content-Type': 'application/json' }
        });

        // Log da resposta da requisição PUT
        console.log(`Resposta da atualização do usuário: Status ${updateRes.status}, Duração: ${updateRes.timings.duration}ms`);

        // Verifica se o status da resposta da atualização é 200 (OK)
        check(updateRes, {
            'status 200': (r) => r.status === 200,
        });

        if (updateRes.status === 200) {
            console.log(`Usuário com ID ${userId} atualizado com sucesso!`);
        } else {
            console.log(`Falha na atualização do usuário com ID ${userId}: Status ${updateRes.status}`);
        }
    } else {
        console.log(`Falha na criação do usuário: Status ${res.status}`);
    }

    sleep(1); // Aguardar um tempo antes de enviar a próxima requisição
}
