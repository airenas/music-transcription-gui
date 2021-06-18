export default class ErrorService {
    msg = (e) => {
      const es = e.toString() || '';
      console.error(es);
      if (es.includes('Request failed with status code 500')) {
        return 'Serviso klaida (500)';
      } if (es.includes('Request failed with status code 404')) {
        return 'Servisas nepasiekiamas (404)';
      }
       if (es.includes('Network Error')) {
        return 'Servisas nepasiekiamas';
      }

      return es;
    }
}
