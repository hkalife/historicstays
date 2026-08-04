import { useMutation } from '@tanstack/react-query';
import { login, register, type LoginInput, type RegisterInput } from '@/lib/api/auth';

export function useRegisterMutation() {
  return useMutation({ mutationFn: (input: RegisterInput) => register(input) });
}

export function useLoginMutation() {
  return useMutation({ mutationFn: (input: LoginInput) => login(input) });
}
