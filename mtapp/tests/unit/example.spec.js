import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import FileInput from '@/components/FileInput.vue';

describe('FileInput.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(FileInput, {
      propsData: { msg },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
