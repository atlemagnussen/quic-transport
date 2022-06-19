import { generateWebTransportCertificate} from "../src/cert.js"

const attrs = [
    { shortName: 'C', value: 'DE' },
    { shortName: 'ST', value: 'Berlin' },
    { shortName: 'L', value: 'Berlin' },
    { shortName: 'O', value: 'WebTransport Test Server' },
    { shortName: 'CN', value: '127.0.0.1' }
]

const options = {
    days: 13
}

async function start() {
    console.log("start")
    const cert = await generateWebTransportCertificate(attrs, options)
    console.log("cert", cert)
}

start().then(() => {
    console.log("end 2")
}).catch(er => console.error(er))