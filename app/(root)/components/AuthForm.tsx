'use client';
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import Button from '@/components/Button';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
type Variant = 'REGISTER' | 'LOGIN';

export default function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant])

  const { register, handleSubmit, formState: {
    errors
  } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      // axios register
    }
    if (variant === "LOGIN") {
      // next auth sign in 
    }

  }

  const socialAction = (action: string) => {

  }


  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 shadow sm:rounded sm:px-10'>
        <form
          className='space-y-6'
          onSubmit={handleSubmit(onSubmit)}>
         { variant === "REGISTER" && (<Input id="name" type="text" label='Name' register={register} errors={errors} />)}
         <Input id="email" label='Email' type="email" register={register} errors={errors} />
         <Input id="password" label='Password' type="password" register={register} errors={errors} />
         <div>
        <Button disabled={isLoading} type="submit" fullWidth>{variant === "LOGIN" ?"Sign in":"Sign up"}</Button>
      </div>
        </form>
        <div className='mt-6'>
          <div className="relative">
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'/>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>
          <div className='mt-6 flex gap-2'>
            <AuthSocialButton icon={BsGithub} onClick={()=> socialAction('github')}/>
            <AuthSocialButton icon={BsGoogle} onClick={()=> socialAction('google')}/>
          </div>
        </div>
        <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
          {variant === "REGISTER" ? "Already have an account?":"New to messenger?"}
        <div className='underline cursor-pointer' onClick={toggleVariant}>
          {variant === "LOGIN" ? "Create an account" : "Login"}
        </div>
        </div>
      </div>
    </div>
  )
}
