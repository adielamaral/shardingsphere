import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10, // número de usuários virtuais que vão executar o teste
    duration: '60s',
    thresholds: {
        http_req_failed: ['rate<0.01'], // Menos de 1% de falhas
        http_req_duration: ['p(95)<200'], // 95% das requisições devem demorar menos de 200ms
    },
};

export default function () {
    // Realiza uma requisição GET para listar todos os usuários
    let res = http.get('http://localhost/users/list');

    // Logs para verificar a resposta e tempo
    console.log(`Requisição feita para: http://localhost:8080/users/list`);
    console.log(`Status da resposta: ${res.status}`);
    console.log(`Duração da requisição: ${res.timings.duration}ms`);

    // Verifica se o status da resposta é 200 (OK)
    let success = check(res, {
        'status 200': (r) => r.status === 200,
        // Verifica se o retorno contém uma lista de usuários
        'tem usuários': (r) => {
            const users = JSON.parse(r.body);
            return users.length >= 0; // A quantidade pode ser zero ou mais
        },
    });

    // Logs baseados nos resultados dos testes
    if (success) {
        console.log('Requisição bem-sucedida e usuários retornados.');
    } else {
        console.log('Falha na requisição ou na validação dos usuários.');
    }

    // Aguarda 1 segundo antes de enviar outra requisição
    sleep(1);
}
