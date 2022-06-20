open -a "Google Chrome" --ignore-certificate-errors-spki-list=FINGERPRINTOFYOURCERTIFICATE \
    --ignore-certificate-errors --v=2 --enable-logging=stderr --origin-to-force-quic-on=192.168.1.3:8080

open -a "Google Chrome" --ignore-certificate-errors