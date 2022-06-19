
// import { readFileSync } from 'fs'
import { Http3Server } from "@fails-components/webtransport"
import { runEchoServer } from './testsuite.js'

import { generateWebTransportCertificate } from "./cert.js"

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

//const cert = readFileSync('cert/out/leaf_cert.pem')
//const privKey = readFileSync('cert/out/leaf_cert.key')

async function run() {

    const certificate = await generateWebTransportCertificate(attrs, options)
    const cert = certificate.cert // unclear if it is the correct format
    const privKey = certificate.private

    try {
        const http3server = new Http3Server({
            port: 8080,
            host: '0.0.0.0',
            secret: 'mysecret',
            cert,
            privKey
        })

        runEchoServer(http3server)
        http3server.startServer() // you can call destroy to remove the server
    } catch (error) {
        console.log('http3error', error)
    }
}

run().catch(err => {
    console.error("general error", err)
})