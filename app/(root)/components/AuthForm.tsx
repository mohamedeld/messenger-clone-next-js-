'use client';
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import Button from '@/components/Button';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
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
    errors, isSubmitting
  } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      try{
        const response = await axios.post('/api/register', {
          name: data?.name,
          email: data?.email,
          password: data?.password,
        })
        if (response?.status === 200) {
          toast.success("user created successfully");
          setIsLoading(false);
        }
      }catch(error:any){
        toast.error("something went wrong",error)
      }
    }
    if (variant === "LOGIN") {
     try{ 


      const res = await signIn('credentials',{
        email:data?.email,
        password:data?.password,
        redirect:false
      })
    

      if(res?.ok && !res?.error){
        toast.success('logged in successfully')
      }
      
    }catch(error:any){
      toast.error("error ",error);
    }finally{
       setIsLoading(false)
     }
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
          {variant === "REGISTER" && (<Input id="name" type="text" label='Name' register={register} errors={errors} disabled={isLoading} />)}
          <Input id="email" label='Email' type="email" register={register} errors={errors} disabled={isLoading} />
          <Input id="password" label='Password' type="password" register={register} errors={errors} disabled={isLoading} />
          <div>
            <Button disabled={isLoading} type="submit" fullWidth>{variant === "LOGIN" ? (
              isSubmitting ? 'Login in...':"Sign in"
            ) : (
              <>
                {isSubmitting ? "Registering..." : "Sign up"}
              </>
            )}</Button>
          </div>
        </form>
        <div className='mt-6'>
          <div className="relative">
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>
          <div className='mt-6 flex gap-2'>
            <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
            <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
          </div>
        </div>
        <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
          {variant === "REGISTER" ? "Already have an account?" : "New to messenger?"}
          <div className='underline cursor-pointer' onClick={toggleVariant}>
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  )
}
