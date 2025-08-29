'use client';

import SelectLanguagePanel from '../select-language-panel';
import Text from '@/components/shared/text/text';
import TranslateMe from '@/utils/translating/translating';

const SettingsContent = () => {
  return (
    <div className="w-full min-h-full rounded-md border border-[rgba(82,85,95,0.2)] p-4 bg-white flex flex-col justify-start gap-5">
      <SelectLanguagePanel />
      <div className="border-b border-[rgba(82,85,95,0.2)]" />
      <div className='w-full flex flex-col gap-5'>
        <Text type="tiny" as="p" fontWeight="light">
          Choose your app language (interface language).
        </Text>
        <div className="w-full flex items-center">
          <Text
            type="tiny"
            as="p"
            fontWeight="normal"
            className="text-[var(--text-main)]"
          >
            App language
          </Text>
          <div className="ml-auto">
            <TranslateMe />
          </div>
        </div>
      </div>
      <div className="border-b border-[rgba(82,85,95,0.2)]" />
      <div>
        <Text type="tiny" as="p" fontWeight="light">
          Keep your profile updated for the best experience.
        </Text>
      </div>
    </div>
  );
};

export default SettingsContent;
