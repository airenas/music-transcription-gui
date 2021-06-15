import axios from 'axios';

export default class Transcriber {
    transcribe(file, instrument) {
        const data = new FormData();
        data.append('instrument', instrument);
        data.append('file', file);
        const headers = {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json'
        }
        return axios.post('/mts/transcription', data, headers);
    }
}
