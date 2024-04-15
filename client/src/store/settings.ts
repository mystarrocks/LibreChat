import { atom } from 'recoil';
import { SettingsViews } from 'librechat-data-provider';
import type { TOptionSettings } from '~/common';

const abortScroll = atom<boolean>({
  key: 'abortScroll',
  default: false,
});

const showFiles = atom<boolean>({
  key: 'showFiles',
  default: false,
});

const optionSettings = atom<TOptionSettings>({
  key: 'optionSettings',
  default: {},
});

const showPluginStoreDialog = atom<boolean>({
  key: 'showPluginStoreDialog',
  default: false,
});

const showAgentSettings = atom<boolean>({
  key: 'showAgentSettings',
  default: false,
});

const currentSettingsView = atom<SettingsViews>({
  key: 'currentSettingsView',
  default: SettingsViews.default,
});

const showBingToneSetting = atom<boolean>({
  key: 'showBingToneSetting',
  default: false,
});

const showPopover = atom<boolean>({
  key: 'showPopover',
  default: false,
});

const autoScroll = atom<boolean>({
  key: 'autoScroll',
  default: localStorage.getItem('autoScroll') === 'true',
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('autoScroll');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('autoScroll', newValue.toString());
        }
      });
    },
  ] as const,
});

const showCode = atom<boolean>({
  key: 'showCode',
  default: localStorage.getItem('showCode') === 'true',
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('showCode');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('showCode', newValue.toString());
        }
      });
    },
  ] as const,
});

const hideSidePanel = atom<boolean>({
  key: 'hideSidePanel',
  default: localStorage.getItem('hideSidePanel') === 'true',
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('hideSidePanel');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('hideSidePanel', newValue.toString());
        }
      });
    },
  ] as const,
});

const modularChat = atom<boolean>({
  key: 'modularChat',
  default: localStorage.getItem('modularChat') === 'true',
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('modularChat');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('modularChat', newValue.toString());
        }
      });
    },
  ] as const,
});

const LaTeXParsing = atom<boolean>({
  key: 'LaTeXParsing',
  default: true,
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('LaTeXParsing');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('LaTeXParsing', newValue.toString());
        }
      });
    },
  ] as const,
});

const UsernameDisplay = atom<boolean>({
  key: 'UsernameDisplay',
  default: localStorage.getItem('UsernameDisplay') === 'true',
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('UsernameDisplay');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('UsernameDisplay', newValue.toString());
        }
      });
    },
  ] as const,
});

const TextToSpeech = atom<boolean>({
  key: 'TextToSpeech',
  default: true,
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('TextToSpeech');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('TextToSpeech', newValue.toString());
        }
      });
    },
  ] as const,
});

const enterToSend = atom<boolean>({
  key: 'enterToSend',
  default: true,
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('enterToSend');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('enterToSend', newValue.toString());
        }
      });
    },
  ] as const,
});

const SpeechToText = atom<boolean>({
  key: 'SpeechToText',
  default: true,
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('SpeechToText');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('SpeechToText', newValue.toString());
        }
      });
    },
  ] as const,
});

const chatAudio = atom<boolean>({
  key: 'chatAudio',
  default: false,
  effects: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('chatAudio');
      if (savedValue != null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue: unknown) => {
        if (typeof newValue === 'boolean') {
          localStorage.setItem('chatAudio', newValue.toString());
        }
      });
    },
  ] as const,
});

export default {
  abortScroll,
  showFiles,
  optionSettings,
  showPluginStoreDialog,
  showAgentSettings,
  currentSettingsView,
  showBingToneSetting,
  showPopover,
  autoScroll,
  enterToSend,
  showCode,
  hideSidePanel,
  modularChat,
  LaTeXParsing,
  UsernameDisplay,
  TextToSpeech,
  SpeechToText,
  chatAudio,
};
