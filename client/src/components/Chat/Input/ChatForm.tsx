import { useRecoilState } from 'recoil';
import { useForm } from 'react-hook-form';
import { memo, useCallback, useRef, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import {
  supportsFiles,
  mergeFileConfig,
  fileConfig as defaultFileConfig,
  EModelEndpoint,
} from 'librechat-data-provider';
import { useChatContext, useAssistantsMapContext } from '~/Providers';
import { useRequiresKey, useTextarea, useSpeechToText, useSpeechToTextExternal } from '~/hooks';
import { TextareaAutosize } from '~/components/ui';
import { useGetFileConfig } from '~/data-provider';
import { cn, removeFocusOutlines } from '~/utils';
import AttachFile from './Files/AttachFile';
import StopButton from './StopButton';
import SendButton from './SendButton';
import FileRow from './Files/FileRow';
import AudioRecorder from './AudioRecorder';
import store from '~/store';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';

const ChatForm = ({ index = 0 }) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [SpeechToText] = useRecoilState<boolean>(store.SpeechToText);
  const [showStopButton, setShowStopButton] = useRecoilState(store.showStopButtonByIndex(index));
  const { requiresKey } = useRequiresKey();

  const methods = useForm<{ text: string }>({
    defaultValues: { text: '' },
  });

  const { handlePaste, handleKeyUp, handleKeyDown, handleCompositionStart, handleCompositionEnd } =
    useTextarea({
      textAreaRef,
      submitButtonRef,
      disabled: !!requiresKey,
      setValue: methods.setValue,
      getValues: methods.getValues,
    });

  const {
    ask,
    files,
    setFiles,
    conversation,
    isSubmitting,
    handleStopGenerating,
    filesLoading,
    setFilesLoading,
  } = useChatContext();

  const assistantMap = useAssistantsMapContext();

  const submitMessage = useCallback(
    (data?: { text: string }) => {
      if (!data) {
        return console.warn('No data provided to submitMessage');
      }
      ask({ text: data.text });
      methods.reset();
      textAreaRef.current?.setRangeText('', 0, data.text.length, 'end');
    },
    [ask, methods],
  );

  const { endpoint: _endpoint, endpointType } = conversation ?? { endpoint: null };
  const endpoint = endpointType ?? _endpoint;
  const { data: startupConfig } = useGetStartupConfig();
  const useExternalSpeech = startupConfig?.speechToTextExternal;

  const {
    isListening: speechIsListening,
    isLoading: speechIsLoading,
    text: speechText,
    startRecording: startSpeechRecording,
    stopRecording: stopSpeechRecording,
  } = useSpeechToText();

  const {
    isListening: externalIsListening,
    isLoading: externalIsLoading,
    text: externalSpeechText,
    externalStartRecording: startExternalRecording,
    externalStopRecording: stopExternalRecording,
  } = useSpeechToTextExternal();

  const isListening = useExternalSpeech ? externalIsListening : speechIsListening;
  const isLoading = useExternalSpeech ? externalIsLoading : speechIsLoading;
  const startRecording = useExternalSpeech ? startExternalRecording : startSpeechRecording;
  const stopRecording = useExternalSpeech ? stopExternalRecording : stopSpeechRecording;
  const speechTextForm = useExternalSpeech ? externalSpeechText : speechText;
  const finalText =
    isListening || (externalSpeechText && externalSpeechText.length > 0)
      ? externalSpeechText
      : speechTextForm || textAreaRef.current?.value || '';

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.value = finalText;
      methods.setValue('text', finalText, { shouldValidate: true });
    }
  }, [finalText, methods]);

  const { data: fileConfig = defaultFileConfig } = useGetFileConfig({
    select: (data) => mergeFileConfig(data),
  });

  const endpointFileConfig = fileConfig.endpoints[endpoint ?? ''];
  const invalidAssistant = useMemo(
    () =>
      conversation?.endpoint === EModelEndpoint.assistants &&
      (!conversation?.assistant_id || !assistantMap?.[conversation?.assistant_id ?? '']),
    [conversation?.assistant_id, conversation?.endpoint, assistantMap],
  );
  const disableInputs = useMemo(
    () => !!(requiresKey || invalidAssistant),
    [requiresKey, invalidAssistant],
  );

  return (
    <form
      onSubmit={methods.handleSubmit((data) => submitMessage(data))}
      className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
    >
      <div className="relative flex h-full flex-1 items-stretch md:flex-col">
        <div className="flex w-full items-center">
          <div className="[&:has(textarea:focus)]:border-token-border-xheavy border-token-border-medium bg-token-main-surface-primary relative flex w-full flex-grow flex-col overflow-hidden rounded-2xl border dark:border-gray-600 dark:text-white [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] dark:[&:has(textarea:focus)]:border-gray-500">
            <FileRow
              files={files}
              setFiles={setFiles}
              setFilesLoading={setFilesLoading}
              Wrapper={({ children }) => (
                <div className="mx-2 mt-2 flex flex-wrap gap-2 px-2.5 md:pl-0 md:pr-4">
                  {children}
                </div>
              )}
            />
            {endpoint && (
              <TextareaAutosize
                {...methods.register('text', {
                  required: true,
                  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
                    methods.setValue('text', e.target.value, { shouldValidate: true });
                  },
                })}
                autoFocus
                ref={(e) => {
                  textAreaRef.current = e;
                }}
                disabled={disableInputs}
                onPaste={handlePaste}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                id="prompt-textarea"
                tabIndex={0}
                data-testid="text-input"
                style={{ height: 44, overflowY: 'auto' }}
                rows={1}
                className={cn(
                  supportsFiles[endpointType ?? endpoint ?? ''] && !endpointFileConfig?.disabled
                    ? ' pl-10 md:pl-[55px]'
                    : 'pl-3 md:pl-4',
                  'm-0 w-full resize-none border-0 bg-transparent py-[10px] placeholder-black/50 focus:ring-0 focus-visible:ring-0 dark:bg-transparent dark:placeholder-white/50 md:py-3.5  ',
                  SpeechToText ? 'pr-20 md:pr-[85px]' : 'pr-10 md:pr-12',
                  removeFocusOutlines,
                  'max-h-[65vh] md:max-h-[75vh]',
                )}
              />
            )}
            <AttachFile
              endpoint={_endpoint ?? ''}
              endpointType={endpointType}
              disabled={disableInputs}
            />
            {isSubmitting && showStopButton ? (
              <StopButton stop={handleStopGenerating} setShowStopButton={setShowStopButton} />
            ) : (
              endpoint && (
                <SendButton
                  ref={submitButtonRef}
                  control={methods.control}
                  disabled={!!(filesLoading || isSubmitting || disableInputs)}
                />
              )
            )}
            {SpeechToText && (
              <AudioRecorder
                isListening={isListening}
                isLoading={isLoading}
                startRecording={startRecording}
                stopRecording={stopRecording}
                disabled={!!disableInputs}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default memo(ChatForm);
