'use client';

import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { getLogin, getUser } from '@/redux/auth/auth-selectors';
import SelectLanguagePanel from '../select-language-panel';
import Text from '@/components/shared/text/text';
import TranslateMe from '@/utils/translating/translating';
import FileUpload from '@/components/shared/file-upload';
import { useTranslate } from '@/utils/translating/translating';
import TextField from '@/components/shared/text-field';
import { fields } from '@/components/shared/text-field/fields';
import Button from '@/components/shared/button';
import { cropSquareAndCompressToBase64 } from '@/utils/cropSquareAndCompress';
import { updateUser } from '@/redux/auth/auth-operations';

const SettingsContent = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getLogin);
  const user = useSelector(getUser);

  const tUserNameReq = useTranslate('User name is required');
  const tNameMin = useTranslate('Name must have at least 2 characters');
  const tNameMax = useTranslate('Name must have no more than 15 characters');
  const tWarningImage = useTranslate('Image must be ≤ 500KB.');
  const tUploadAvatar = useTranslate('Upload new avatar (≤ 500KB):');
  const tChooseFile = useTranslate('Please choose an avatar file.');
  const btnText = useTranslate('Update Profile');

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: user?.username || '',
      avatarFile: null,
    },
  });

  const avatarFileList = watch('avatarFile');
  const previewUrl = useMemo(() => {
    const f = avatarFileList?.[0];
    return f ? URL.createObjectURL(f) : null;
  }, [avatarFileList]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSubmit = async data => {
    const nextUsername = (data.username ?? '').trim() || user?.username || '';

    let nextAvatar = user?.userAvatar || '';

    const file = data?.avatarFile?.[0];
    if (file) {
      const { dataUrl } = await cropSquareAndCompressToBase64(file, {
        size: 300, // цільовий квадрат
        sizesFallback: [256, 192], // якщо 300 не влазить
        biasY: 0, // 0 = строго центр
        upscale: false, // не збільшувати маленькі
        base64MaxKB: 360, // серверний ліміт
        overheadBytes: 256,
        initialQuality: 0.9,
        minQuality: 0.5,
      });
      nextAvatar = dataUrl;
    }

    const userData = { username: nextUsername, userAvatar: nextAvatar };
    await dispatch(updateUser(userData)).unwrap();

    reset({ username: nextUsername, avatarFile: null });
  };

  return (
    <div className="w-full min-h-full rounded-md border border-[rgba(82,85,95,0.2)] p-4 bg-white flex flex-col justify-start gap-5">
      <SelectLanguagePanel />
      <div className="border-b border-[rgba(82,85,95,0.2)]" />
      <div className="w-full flex flex-col gap-5">
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

      {isLoggedIn && user && (
        <>
          <div className="border-b border-[rgba(82,85,95,0.2)]" />
          <div className="flex flex-col gap-5">
            <Text type="tiny" as="p" fontWeight="light">
              Keep your profile updated for the best experience.
            </Text>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-row items-center justify-between">
                {(previewUrl || user?.userAvatar) && (
                  <img
                    src={previewUrl || user.userAvatar}
                    alt="User avatar"
                    className="h-[50px] w-[50px] rounded-full object-cover border border-[rgba(0,0,0,0.1)]"
                  />
                )}

                <Controller
                  control={control}
                  name="avatarFile"
                  rules={{
                    validate: fileList => {
                      if (!fileList || fileList.length === 0) return true;
                      const f = fileList[0];
                      if (!/^image\//.test(f.type)) return tChooseFile;
                      if (f.size > 500 * 1024) return tWarningImage;
                      return true;
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <FileUpload
                      id="avatar-image"
                      label={tUploadAvatar}
                      single
                      accept="image/*"
                      maxFiles={1}
                      maxFileSize={500 * 1024}
                      value={value}
                      onChange={onChange}
                      error={fieldState.error}
                    />
                  )}
                />
              </div>

              <Controller
                control={control}
                name="username"
                rules={{
                  required: tUserNameReq,
                  minLength: { value: 2, message: tNameMin },
                  maxLength: { value: 15, message: tNameMax },
                }}
                render={({ field: { onChange, value }, fieldState }) => (
                  <TextField
                    value={value}
                    handleChange={onChange}
                    error={fieldState.error}
                    autoComplete="off"
                    {...fields.username}
                  />
                )}
              />

              <div className="w-full flex flex-row items-center justify-center mt-[5px]">
                <Button
                  text={btnText}
                  btnClass="btnDark"
                  type="submit"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsContent;

