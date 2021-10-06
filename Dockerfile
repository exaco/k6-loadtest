FROM loadimpact/k6:0.34.1
COPY files files
WORKDIR files
CMD ["run", "--out", "influxdb=http://influxdb:8086/myk6db", "test.js"]
