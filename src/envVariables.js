
const envVariables = {
    port: process.env.service_port || 5000,
    level: process.env.service_log_level || 'info'
}
module.exports = envVariables;