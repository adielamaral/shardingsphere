import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    // Definindo o cenário de estresse
    stages: [
        { duration: '30s', target: 50 },  // Aumenta de 0 para 50 usuários virtuais em 30 segundos
        { duration: '1m', target: 50 },   // Mantém 50 usuários virtuais por 1 minuto
        { duration: '30s', target: 100 }, // Aumenta de 50 para 100 usuários virtuais em 30 segundos
        { duration: '1m', target: 100 },  // Mantém 100 usuários virtuais por 1 minuto
        { duration: '30s', target: 200 }, // Aumenta de 100 para 200 usuários virtuais em 30 segundos
        { duration: '1m', target: 200 },  // Mantém 200 usuários virtuais por 1 minuto
        { duration: '30s', target: 0 },   // Diminui de 200 para 0 usuários virtuais em 30 segundos
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% das requisições devem durar menos de 500ms
        http_req_failed: ['rate<0.01'], // Menos de 1% de falhas
    },
};

export default function () {
    // Log para indicar o início do teste
    console.log(`Iniciando requisição GET para listar usuários`);

    // Envia uma requisição GET para testar a aplicação
    let res = http.get('http://localhost/users/list');

    // Log para verificar o status da resposta
    console.log(`Resposta recebida: Status ${res.status}, Duração da requisição: ${res.timings.duration}ms`);

    // Verifica se a resposta foi bem-sucedida (status 200)
    check(res, {
        'status 200': (r) => r.status === 200,
    });

    // Log de sucesso ou falha da verificação
    if (res.status === 200) {
        console.log(`Requisição GET bem-sucedida: Status 200`);
    } else {
        console.log(`Falha na requisição GET: Status ${res.status}`);
    }

    // Aguarda 1 segundo antes de enviar a próxima requisição
    sleep(1);
}

/* Primeiro Estágio (30s): Aumenta de 0 para 50 usuários em 30 segundos.
   Segundo Estágio (1m): Mantém 50 usuários por 1 minuto.
   Terceiro Estágio (30s): Aumenta de 50 para 100 usuários em 30 segundos.
   Quarto Estágio (1m): Mantém 100 usuários por 1 minuto.
   Quinto Estágio (30s): Aumenta de 100 para 200 usuários em 30 segundos.
   Sexto Estágio (1m): Mantém 200 usuários por 1 minuto.
   Sétimo Estágio (30s): Diminui de 200 para 0 usuários em 30 segundos. */
