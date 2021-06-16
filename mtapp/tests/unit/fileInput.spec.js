import { shallowMount, mount } from '@vue/test-utils';
import FileInput from '@/components/FileInput.vue';

var expect = require('chai').expect;
var disabledStr = 'disabled="true"';

describe('FileInput.vue', () => {
  it('shows controls on no file', () => {
    const wrapper = shallowMount(FileInput, {
      propsData: {},
    });
    expect(wrapper.find("#fileInput").isVisible()).is.true;
    expect(wrapper.find("#audio").isVisible()).is.false;
    expect(wrapper.find("#dropInfo").isVisible()).is.true;
    expect(wrapper.find("#transcribeButton").html()).includes(disabledStr);
  });

  it('shows controls with file', () => {
    const wrapper = shallowMount(FileInput, {
      data() {
        return {
          file: new File(["olia"], 'music.wav')
        }
      }
    });
    expect(wrapper.find("#fileInput").isVisible()).is.true;
    expect(wrapper.find("#audio").isVisible()).is.true;
    expect(wrapper.find("#dropInfo").isVisible()).is.false;
    expect(wrapper.find("#transcribeButton").html()).not.includes(disabledStr);
  });
});
