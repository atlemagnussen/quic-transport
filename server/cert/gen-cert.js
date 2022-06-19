import { generateWebTransportCertificate} from "./cert.js"

async function start() {
    console.log("start")
    await generateWebTransportCertificate()
    console.log("end")
}

start().then(() => {
    console.log("end 2")
}).catch(er => console.error(er))