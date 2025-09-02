export const fields = {
  username: {
    label: 'Name',
    name: 'username',
    type: 'text',
    placeholder: 'Name',
    title: '*The Name field must be more than 2 and less than 15 characters',
    required: true,
  },
  email: {
    label: 'Email',
    name: 'email',
    type: 'text',
    placeholder: 'Email',
    title: '*Enter a valid email',
    required: true,
  },
  password: {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    title:
      '*The Password field must be more than 2 and less than 21 characters',
    required: true,
  },
  title: {
    label: 'Title',
    name: 'title',
    type: 'text',
    placeholder: 'Title',
    title: '*The Title field must be more than 2 characters',
    required: true,
  },
};
