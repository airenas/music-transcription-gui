import ErrorService from '@/service/error';

const es = new ErrorService();

const { expect } = require('chai');

describe('ErrorService tests', () => {
  it('test msgs', () => {
    expect(es.msg('Request failed with status code 500')).eq('Serviso klaida (500)');
    expect(es.msg('Request failed with status code 404')).eq('Servisas nepasiekiamas (404)');
    expect(es.msg('Error from service')).eq('Error from service');
    expect(es.msg('Network Error')).eq('Servisas nepasiekiamas');
  });
});
