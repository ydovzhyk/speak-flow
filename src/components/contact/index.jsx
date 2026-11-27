'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Text from '../shared/text/text';
import TextField from '../shared/text-field';
import Button from '../shared/button';
import { isValidEmail } from '@/utils/check-email';

function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    message: null,
  });

  const validate = () => {
    const next = { name: null, email: null, message: null };

    if (!userInput.name.trim())
      next.name = { message: 'Your name is required' };
    if (!userInput.email.trim()) next.email = { message: 'Email is required' };
    else if (!isValidEmail(userInput.email))
      next.email = { message: 'Please provide a valid email' };

    if (!userInput.message.trim())
      next.message = { message: 'Message is required' };

    setErrors(next);
    return !next.name && !next.email && !next.message;
  };

  const handleSendMail = async e => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';
      setIsLoading(true);
      await axios.post(`${origin}/api/contact`, { ...userInput, origin });
      toast.success('Message sent successfully!');
      setUserInput({ name: '', email: '', message: '' });
      setErrors({ name: null, email: null, message: null });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-md border border-[rgba(82,85,95,0.2)] p-4 bg-white h-full landscape:!h-auto landscape:min-h-0"
    >
      <div className="mb-5 flex flex-col gap-2">
        <Text type="tiny" as="p" fontWeight="light">
          SpeakFlow is operated by <strong>Yuriy Dovzhyk</strong>. Have
          questions about the app, privacy, or ideas for new features? Fill out
          the form below — your message goes to me.
        </Text>
        <Text type="tiny" as="p" fontWeight="light">
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent2)] underline underline-offset-2"
          >
            Privacy Policy
          </a>
          {' · '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent2)] underline underline-offset-2"
          >
            Terms of Use
          </a>
        </Text>
      </div>
      <form className="flex flex-col gap-10" onSubmit={handleSendMail}>
        <TextField
          type="text"
          name="name"
          value={userInput.name}
          handleChange={e =>
            setUserInput(s => ({ ...s, name: e.target.value }))
          }
          placeholder="Your Name"
          required
          error={errors.name}
          autoComplete="off"
        />
        <TextField
          type="email"
          name="email"
          value={userInput.email}
          handleChange={e =>
            setUserInput(s => ({ ...s, email: e.target.value }))
          }
          placeholder="Your Email"
          required
          error={errors.email}
          autoComplete="off"
        />
        <label className="relative inline-block w-full text-[var(--text-main)]">
          <textarea
            className={`pl-[10px] w-full h-[120px] font-normal text-[14px] leading-none regular-border border-opacity-50 rounded-[5px] tracking-[1px] transition-all duration-300 ease-in-out outline-none bg-transparent py-2`}
            name="message"
            value={userInput.message}
            onChange={e =>
              setUserInput(s => ({ ...s, message: e.target.value }))
            }
            required
            title="Your Message"
            maxLength={500}
          />
          {userInput.message ? (
            <div className="absolute -top-5 left-0.5 flex items-center gap-2">
              <Text type="tiny" as="span" fontWeight="normal">
                Your Message
              </Text>
            </div>
          ) : (
            <Text
              type="tiny"
              as="span"
              fontWeight="normal"
              className="absolute top-[11px] left-2.5"
            >
              Your Message
            </Text>
          )}
          {errors.message && (
            <Text
              type="extraSmall"
              as="span"
              fontWeight="normal"
              className="absolute top-[128px] text-red-500"
            >
              {errors.message.message}
            </Text>
          )}
        </label>
        <div className="w-full flex flex-row items-center justify-center mt-[-20px]">
          <Button
            text={isLoading ? 'Sending Message...' : 'Send Message'}
            btnClass="btnDark"
            disabled={isLoading}
            type="submit"
            width="170px"
          />
        </div>
      </form>
    </div>
  );
}

export default Contact;
