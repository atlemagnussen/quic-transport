export async function echoTestsConnection(transport) {
    // some echo tests for testing the webtransport library, not for production
    const stream = await transport.createBidirectionalStream()
    const writer = stream.writable.getWriter()
    const data1 = new Uint8Array([65, 66, 67])
    const data2 = new Uint8Array([68, 69, 70])
    writer.write(data1)
    writer.write(data2)
    const reader = stream.readable.getReader()
    let i = data1.length + data2.length
    let pos = 0
    const refArray1 = new Uint8Array(i);
    refArray1.set(data1);
    refArray1.set(data2, data1.length);

    const resultArray1 = new Uint8Array(i);

    while (true && i > 0) {
        const { done, value } = await reader.read()
        if (done) {
            break
        }
        // value is a Uint8Array
        console.log('incoming bidi stream', value)
        resultArray1.set(value, pos)
        i -= value.length
        pos += value.length
    }
    console.log('all bidi received, next close writer')
    try {
        await writer.close()
        console.log('All data has been sent.')
    } catch (error) {
        console.error(`An error occurred: ${error}`)
        throw new Error('outgoing bidi stream test failed')
    }
    testArraysEqual(refArray1, resultArray1)

    console.log('webtransport sending bidistream success')
    const bidiReader = transport.incomingBidirectionalStreams.getReader()
    const incombidi = await bidiReader.read()
    if (incombidi.value) {
        const bidistream = incombidi.value
        console.log('got a bidistream')
        const write = bidistream.writable.getWriter()
        const data3 = new Uint8Array([71, 72, 73])
        const data4 = new Uint8Array([74, 75, 76])
        write.write(data3)
        write.write(data4)



        const readbd = bidistream.readable.getReader()
        let i = data3.length + data4.length
        let pos = 0

        const refArray2 = new Uint8Array(i);
        refArray2.set(data3);
        refArray2.set(data4, data3.length);

        const resultArray2 = new Uint8Array(i);
        while (true && i > 0) {
            const { done, value } = await readbd.read()
            if (done) {
                break
            }
            // value is a Uint8Array
            console.log('incom bd', value)
            resultArray2.set(value, pos)
            i -= value.length
            pos += value.length
        }
        try {
            await write.close()
            console.log('All data has been sent for incoming bidi stream.')
        } catch (error) {
            console.error(`An error occurred: ${error}`)
            throw new Error('incoming bidi stream test failed')
        }
        testArraysEqual(refArray2, resultArray2)
    }

    console.log('now unidirectional tests')
    const unidioutstream = await transport.createUnidirectionalStream()
    const unidiwrite = unidioutstream.getWriter()
    const data5 = new Uint8Array([77, 78, 79])
    const data6 = new Uint8Array([80, 81, 82])
    unidiwrite.write(data5)
    unidiwrite.write(data6)
    const unidiReader = transport.incomingUnidirectionalStreams.getReader()
    const incomunidi = await unidiReader.read()

    i = data5.length + data6.length

    const refArray3 = new Uint8Array(i);
    refArray3.set(data5);
    refArray3.set(data6, data5.length);


    if (incomunidi.value) {
        const unidistream = incomunidi.value
        console.log('got a unidistream')
        const readud = unidistream.getReader()
        let pos = 0

        const resultArray3 = new Uint8Array(i);

        while (true && i > 0) {
            const { done, value } = await readud.read()
            if (done) {
                break
            }
            // value is a Uint8Array
            console.log('incom ud', value)
            resultArray3.set(value, pos)
            i -= value.length
            pos += value.length
        }
        testArraysEqual(refArray3, resultArray3)
    }
    try {
        await unidiwrite.close()
        console.log('All data has been sent for incoming unidi stream.')
    } catch (error) {
        console.error(`An error occurred: ${error}`)
        throw new Error('incoming unidi stream test failed')
    }
    console.log('finally test datagrams')
    const datawrite = await transport.datagrams.writable.getWriter()
    const data7 = new Uint8Array([83, 84, 85])
    const data8 = new Uint8Array([86, 87, 88])

    i = data7.length + data8.length
    const refArray4 = new Uint8Array(i);
    refArray4.set(data7);
    refArray4.set(data8, data7.length);

    datawrite.write(data7)
    datawrite.write(data8)
    const readdg = await transport.datagrams.readable.getReader()
    pos = 0
    const resultArray4 = new Uint8Array(i);

    while (true && i > 0) {
        const { done, value } = await readdg.read()
        if (done) {
            break
        }
        // value is a Uint8Array
        console.log('incom dg', value)
        resultArray4.set(value, pos)
        i -= value.length
        pos += value.length
    }
    testArraysEqual(refArray4, resultArray4)
    try {
        await datawrite.close()
        console.log('All data has been sent for datagram stream.')
    } catch (error) {
        console.error(`An error occurred: ${error}`)
        throw new Error('datagram stream test failed')
    }
    console.log('test datagrams finished')
}

async function startClientTests(args, hashes) {
    const url = 'https://' + args.hostname + ':' + args.port + '/echo'
    console.log('startconnection')
    const hashargs = { ...hashes }
    // hashargs.serverCertificateHashes = hashes.serverCertificateHashes.map(
    //     (el) => ({
    //         algorithm: el.algorithm,
    //         value: Buffer.from(el.value.split(':').map((el) => parseInt(el, 16)))
    //     })
    // )
    // eslint-disable-next-line no-undef
    console.log('hashagrs', hashargs)
    const transport = new WebTransport(url)
    transport.closed
        .then(() => {
            console.log('The HTTP/3 connection to ', url, 'closed gracefully.')
        })
        .catch((error) => {
            console.error(
                'The HTTP/3 connection to',
                url,
                'closed due to ',
                error,
                '.'
            )
        })

    await transport.ready
    console.log('webtransport is ready', transport)
    echoTestsConnection(transport)
}

// edit the next lines for your test setting
startClientTests(
    { hostname: '192.168.1.3', port: 8080 },
    {
        serverCertificateHashes: [
            {
                algorithm: 'sha-256',
                value:
                    '78:CB:61:68:30:4D:9F:CF:9F:7E:D8:20:B6:4E:4E:85:62:FE:F7:70:84:64:73:38:4C:D7:76:D5:4B:CF:98:38'
            }
        ]
    }
)
