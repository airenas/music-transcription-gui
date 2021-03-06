import axios from 'axios';

export default class Transcriber {
  static url= '';

  static initURL = (url) => {
    this.url = url;
  }

  transcribe = (file, instrument) => {
    const data = new FormData();
    data.append('instrument', instrument);
    data.append('file', file);
    const headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };
    return axios.post(Transcriber.url, data, headers);
  }
}
