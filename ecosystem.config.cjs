module.exports = {
  apps: [
    {
      name: 'IMGX',
      port: '4573',
      exec_mode: 'cluster',
      script: './server/index.mjs',
    }
  ]
}
