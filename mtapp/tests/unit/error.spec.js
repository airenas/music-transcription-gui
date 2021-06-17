import ErrorService from '@/service/error';

const es = new ErrorService();

var expect = require('chai').expect;

describe('ErrorService tests', () => {
  it('test msgs', () => {
    expect(es.msg('Request failed with status code 500')).eq('Serviso klaida (500)');
    expect(es.msg('Error')).eq('Įvyko nenumatyta klaida');
    expect(es.msg('Network Error')).eq('Servisas nepasiekiamas');
  });
});
