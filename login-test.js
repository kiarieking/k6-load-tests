import http from 'k6/http'
import {check, sleep} from 'k6'

const ODOO_URL = "https://sandbox.erp.quatrixglobal.com"
const EMAIL = "kelvin.kiarie@quatrixglobal.com"
const DATABASE = "odoo15sandbox"
const PASSWORD = "$kingara120"

export const options = {
    stages: [
        {duration: '30s', target: 5},
        {duration: '1m', target: 10},
        {duration: '30s', target: 0},

    ],
    thresholds: {
        http_req_failed: ['rate<0.02'],
        http_req_duration: ['p(95)<1500']
    },
}

export default function(){
    const headers = {'Content-Type': 'application/json'}

    let webPageResponse = http.get(`${ODOO_URL}/web/login`)

    check(webPageResponse, {
        "Landing page is status 200": (r) => r.status == 200
    })

    sleep(2)

    const loginPayload = JSON.stringify({
        jsonrpc: '2.0',
        method : 'call',
        params: {
            db: DATABASE,
            login: EMAIL,
            password: PASSWORD
        }
    })

    let authResponse = http.post(
        `${ODOO_URL}/web/session/authenticate`,
        loginPayload,
        {headers: headers}
    )

    let isloggedon = false

    if (authResponse.status == 200){
        try{
            const body = JSON.parse(authResponse)

            if(body.result && body.result.uid){
                isloggedon = true
            }
        }
        catch{
            isloggedon = false
        }
    }

    check(authResponse, {
        "Auth endpoint response is 200": (r) => r.status === 200,
        "Odoo login is successful": () => isloggedon === true,
    })

    if(isloggedon){
        sleep(3)
    }
    else{
        sleep(1)
    }

}