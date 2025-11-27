/**
 * useAsync Hook
 * 
 * Reusable hook for managing async operations with proper state tracking.
 * Handles loading, error, and success states automatically.
 */

import { useState, useCallback } from 'react'
import { logger } from '@/lib/logger'

interface AsyncState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

interface UseAsyncReturn<T, Args extends unknown[]> extends AsyncState<T> {
  execute: (...args: Args) => Promise<void>
  reset: () => void
}

/**
 * Hook for managing async operations
 * 
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately on mount
 * @returns Async state and control functions
 * 
 * @example
 * const { data, error, isLoading, execute } = useAsync(fetchUserData)
 * 
 * useEffect(() => {
 *   execute(userId)
 * }, [userId])
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage error={error} />
 * if (data) return <UserProfile data={data} />
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate = false
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isError: false,
    isSuccess: false,
  })

  // Execute the async function
  const execute = useCallback(
    async (...args: Args): Promise<void> => {
      setState({
        data: null,
        error: null,
        isLoading: true,
        isError: false,
        isSuccess: false,
      })

      try {
        const data = await asyncFunction(...args)
        
        setState({
          data,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        })

        logger.debug('Async operation succeeded', { function: asyncFunction.name })
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error')
        
        setState({
          data: null,
          error: err,
          isLoading: false,
          isError: true,
          isSuccess: false,
        })

        logger.error('Async operation failed', err, { function: asyncFunction.name })
      }
    },
    [asyncFunction]
  )

  // Reset state
  const reset = useCallback((): void => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    })

    logger.debug('Async state reset')
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
