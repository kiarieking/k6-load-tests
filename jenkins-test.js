import http from 'k6/http'
import {check,sleep} from 'k6'
import encoding from 'k6/encoding'

export const options = {
    stages: [
        {duration: '30s', target: 5},
        {duration: '1m', target: 5},
        {duration: '30s', target: 0},
    ],
    thresholds: {
        http_req_failed: ['rate<0.02'],
        http_req_duration: ['p(95)<1500'],
    },
}

export default function(){

    const API_TOKEN = '116324d288a9353cc300d08bc60a1e1544'
    const USERNAME = 'kkiarie'
    const CREDENTIALS = `${USERNAME}:${API_TOKEN}`
    const ENCODEDCREDENTIALS = encoding.b64encode(CREDENTIALS)
    const JENKINSURL = 'http://localhost:8080/'

    const params = {
        headers: {
            'Authorization': `Basic ${ENCODEDCREDENTIALS}`
        },
    }

    const response = http.get(`${JENKINSURL}/`, params)

    check(response, {
        'is status 200': (r) => r.status ===200
    })

    sleep(1)
}
