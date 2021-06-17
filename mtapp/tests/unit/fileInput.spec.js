import FileInput from '@/components/FileInput.vue';
import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

const disabledStr = 'disabled="disabled"';

global.requestAnimationFrame = (cb) => { cb(); };

const { expect } = require('chai');

describe('FileInput.vue', () => {
  let wrapper;
  beforeEach(() => {
    const vuetify = new Vuetify({});
    wrapper = mount(FileInput,
      {
        vuetify,
      });
    wrapper.vm.updateControls();
  });

  it('shows controls on create', async () => {
    expect(wrapper.find('#fileInput').isVisible()).is.true;
    expect(wrapper.find('#audio').isVisible()).is.false;
    expect(wrapper.find('#dropInfo').isVisible()).is.true;
    expect(wrapper.find('#transcribeButton').html()).includes(disabledStr);
  });

  it('cheeck when no file', async () => {
    wrapper.setData({ file: null });
    wrapper.vm.updateControls();
    expect(wrapper.vm.working).is.false;
    expect(wrapper.vm.fileLoaded).is.false;
    expect(wrapper.vm.canTranscribe).is.false;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('#dropInfo').isVisible()).is.true;
    expect(wrapper.find('#fileInput').isVisible()).is.true;
    expect(wrapper.find('#audio').isVisible()).not.is.true;
    expect(wrapper.find('#transcribeButton').html()).includes(disabledStr);
  });

  it('check when file is set', async () => {
    wrapper.setData({ file: new File(['fake'], 'audio.wav') });
    wrapper.vm.updateControls();
    expect(wrapper.vm.file).not.is.null;
    expect(wrapper.vm.working).is.false;
    expect(wrapper.vm.fileLoaded).is.true;
    expect(wrapper.vm.canTranscribe).is.true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('#dropInfo').isVisible()).not.is.true;
    expect(wrapper.find('#fileInput').isVisible()).is.true;
    expect(wrapper.find('#audio').isVisible()).is.true;
    expect(wrapper.find('#transcribeButton').html()).not.includes(disabledStr);
  });

  it('extension OK', () => {
    expect(wrapper.vm.extensionOK(new File(['olia'], 'music.wav'))).is.true;
    expect(wrapper.vm.extensionOK(new File(['olia'], 'olia/music.wav'))).is.true;
    expect(wrapper.vm.extensionOK(new File(['olia'], 'olia/music.mp3'))).is.false;
  });
});
