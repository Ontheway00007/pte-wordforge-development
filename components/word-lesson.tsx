'use client'

import { useState } from 'react'
import useSWR from 'swr'

type Lesson = { meaning: string; partOfSpeech: string; combinations: string[]; examples: string[]; usageTip: string; practicePrompt: string }
async function fetchLesson([, word]: [string, string]): Promise<Lesson> {
  const response = await fetch('/api/word-lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ word }) })
  if (!response.ok) throw new Error('Unable to load this lesson. Please try again.')
  return response.json()
}

export function WordLesson({ word, meaning }: { word: string; meaning: string }) {
  const [open, setOpen] = useState(false)
  const [hideExamples, setHideExamples] = useState(false)
  const [sentence, setSentence] = useState('')
  const { data, error, isLoading, mutate } = useSWR(open ? ['word-lesson', word] : null, fetchLesson, { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false })
  return <section style={{ marginTop: 20 }}>
    <button className="button" aria-expanded={open} aria-controls="word-lesson" onClick={() => setOpen(v => !v)}>{open ? 'Hide meaning & essay use' : 'Meaning & essay use'}</button>
    {open && <div id="word-lesson" className="rule" style={{ textAlign: 'left' }}>
      <h3>{word}</h3>
      {meaning && !data && <p><strong>Meaning:</strong> {meaning}</p>}
      {isLoading && <p role="status">Preparing the meaning and contextual examples…</p>}
      {error && <div role="alert"><p>Could not load the examples. Your spelling result is still saved.</p><button className="button" onClick={() => mutate()}>Try again</button></div>}
      {data && <>
        <p><strong>Meaning:</strong> {data.meaning}</p><p><strong>Word type:</strong> {data.partOfSpeech}</p>
        <p><strong>Common combinations:</strong> {data.combinations.join(' · ')}</p>
        <h4>See it in context</h4>
        <button className="button" onClick={() => setHideExamples(v => !v)} aria-expanded={!hideExamples}>{hideExamples ? 'Show examples to compare' : 'Hide examples & try from memory'}</button>
        {!hideExamples && <ul>{data.examples.map(example => <li key={example} style={{ marginBlock: 12 }}>{example}</li>)}</ul>}
        <p><strong>Usage tip:</strong> {data.usageTip}</p>
        <label htmlFor="essay-practice"><strong>Your turn:</strong> {data.practicePrompt}</label>
        <textarea id="essay-practice" className="search" style={{ marginTop: 12, fontSize: 16, minHeight: 110 }} value={sentence} onChange={e => setSentence(e.target.value)} maxLength={1500} placeholder={`Write an original sentence using “${word}”…`} />
        <p>Self-check: Does the word fit your meaning? Check word order, articles and common combinations. Compare with the examples, then write a different sentence tomorrow.</p>
        <small>AI-generated learning examples, not official PTE guidance. This scratchpad is not graded or saved and clears when you change words.</small>
      </>}
    </div>}
  </section>
}
