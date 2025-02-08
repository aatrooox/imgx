module.exports = {
  apps: [
    {
      name: 'IMGX',
      port: '4573',
      exec_mode: 'cluster',
      instances: 'max',
      script: './server/index.mjs',
    }
  ]
}
