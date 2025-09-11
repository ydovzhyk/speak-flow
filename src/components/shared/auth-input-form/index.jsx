'use client';

import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login, register } from '@/redux/auth/auth-operations';
import loadAvatar from '@/utils/load-avatar';
import Button from '../button';
import { fields } from '../text-field/fields';
import TextField from '../text-field';
import Text from '../text/text';
import { useTranslate } from '@/utils/translating/translating';
import avatarMale from '../../../../public/images/male.png';
import avatarFemale from '../../../../public/images/female.png';

const AuthInputForm = ({ typeOperation = 'login' }) => {
  const dispatch = useDispatch();

  const tLogin = useTranslate('Login');
  const tRegistration = useTranslate('Registration');
  const tUserNameReq = useTranslate('User name is required');
  const tNameMin = useTranslate('Name must have at least 2 characters');
  const tNameMax = useTranslate('Name must have no more than 15 characters');
  const tEmailReq = useTranslate('Email is required');
  const tEmailInvalid = useTranslate('Invalid email address');
  const tPassReq = useTranslate('Password is required');
  const tPassMin = useTranslate('Password must have at least 8 characters');
  const tPassMax = useTranslate(
    'Password must have no more than 20 characters'
  );
  const tMale = useTranslate('Male');
  const tFemale = useTranslate('Female');

  const btnText = typeOperation === 'registration' ? tRegistration : tLogin;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      sex: 'male',
    },
  });

  const onSubmit = async data => {
    if (typeOperation === 'registration') {
      const base64Avatar =
        data.sex === 'male'
          ? await loadAvatar(avatarMale.src)
          : await loadAvatar(avatarFemale.src);

      const userData = {
        ...data,
        userAvatar: base64Avatar,
      };
      dispatch(register(userData));
    } else {
      dispatch(login({ email: data.email, password: data.password }));
    }
    reset({ username: '', email: '', password: '', sex: 'male' });
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {typeOperation === 'registration' && (
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
      )}

      <Controller
        control={control}
        name="email"
        rules={{
          required: tEmailReq,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: tEmailInvalid,
          },
        }}
        render={({ field: { onChange, value }, fieldState }) => (
          <TextField
            value={value}
            handleChange={onChange}
            error={fieldState.error}
            {...fields.email}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: tPassReq,
          minLength: { value: 8, message: tPassMin },
          maxLength: { value: 20, message: tPassMax },
        }}
        render={({ field: { onChange, value }, fieldState }) => (
          <TextField
            value={value}
            handleChange={onChange}
            error={fieldState.error}
            autoComplete="current-password"
            {...fields.password}
          />
        )}
      />

      {typeOperation === 'registration' && (
        <Controller
          control={control}
          name="sex"
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-4 items-center text-sm text-black mt-[-15px] mb-[-20px]">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="male"
                  checked={value === 'male'}
                  onChange={onChange}
                  className="accent-black"
                />
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="normal"
                  className="text-black"
                >
                  {tMale}
                </Text>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="female"
                  checked={value === 'female'}
                  onChange={onChange}
                  className="accent-black"
                />
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="normal"
                  className="text-black"
                >
                  {tFemale}
                </Text>
              </label>
            </div>
          )}
        />
      )}

      <div
        className="w-full flex flex-row items-center justify-center"
        style={{ marginTop: typeOperation === 'login' ? '-15px' : '0' }}
      >
        <Button text={btnText} btnClass="btnDark" type="submit" />
      </div>
    </form>
  );
};

export default AuthInputForm;
