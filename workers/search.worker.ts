/// <reference lib="webworker" />

import {
  searchWords,
  warmSearchEngine,
} from '../lib/engine/search'
import type {
  SearchFilters,
  SearchResult,
} from '../lib/engine/types'

type WorkerRequest =
  | {
      type: 'warm'
    }
  | {
      type: 'search'
      id: number
      letters: string
      filters: SearchFilters
    }

type WorkerResponse =
  | {
      type: 'ready'
    }
  | {
      type: 'results'
      id: number
      results: SearchResult[]
    }
  | {
      type: 'error'
      id?: number
      message: string
    }

const workerScope =
  self as DedicatedWorkerGlobalScope

workerScope.onmessage = (
  event: MessageEvent<WorkerRequest>
) => {
  const message = event.data

  try {
    if (message.type === 'warm') {
      warmSearchEngine()

      const response: WorkerResponse = {
        type: 'ready',
      }

      workerScope.postMessage(response)
      return
    }

    if (message.type === 'search') {
      const results = searchWords(
        message.letters,
        message.filters
      )

      const response: WorkerResponse = {
        type: 'results',
        id: message.id,
        results,
      }

      workerScope.postMessage(response)
    }
  } catch (error) {
    const response: WorkerResponse = {
      type: 'error',
      id:
        message.type === 'search'
          ? message.id
          : undefined,
      message:
        error instanceof Error
          ? error.message
          : 'Search worker failed',
    }

    workerScope.postMessage(response)
  }
}

export {}