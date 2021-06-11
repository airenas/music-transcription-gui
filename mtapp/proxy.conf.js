const PROXY_CONFIG = {
  "/mts/transcription": {
    "target": "http://localhost:8002/",
    "secure": false,
    "pathRewrite": {"^/mts": ""},
    "logLevel": "debug"
  },
}

module.exports = PROXY_CONFIG;
