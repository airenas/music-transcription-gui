import { shallowMount } from '@vue/test-utils';
import FileInput from '@/components/FileInput.vue';

const disabledStr = 'disabled="true"';



var expect = require('chai').expect;

describe('FileInput.vue', () => {
  it('shows controls on no file', () => {
    const wrapper = shallowMount(FileInput);
    expect(wrapper.find("#fileInput").isVisible()).is.true;
    expect(wrapper.find("#audio").isVisible()).is.false;
    expect(wrapper.find("#dropInfo").isVisible()).is.true;
    expect(wrapper.find("#transcribeButton").html()).includes(disabledStr);
  });

  it('cheeck file', () => {
    const wrapper = shallowMount(FileInput, {
      data() {
        return {
          file: new File(["olia"], 'music.wav')
        }
      }
    });
    expect(wrapper.vm.working).is.false;
    expect(wrapper.vm.fileLoaded).is.true;
    expect(wrapper.vm.canTranscribe).is.true;
  });

  it('extension OK', () => {
    const wrapper = shallowMount(FileInput, {});
    expect(wrapper.vm.extensionOK(new File(["olia"], 'music.wav'))).is.true;
    expect(wrapper.vm.extensionOK(new File(["olia"], 'olia/music.wav'))).is.true;
    expect(wrapper.vm.extensionOK(new File(["olia"], 'olia/music.mp3'))).is.false;
  });
});
