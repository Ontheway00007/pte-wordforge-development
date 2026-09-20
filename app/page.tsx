'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Brain, Check, ChevronRight, Headphones, House, Lightbulb, List, RotateCcw, Target, Volume2, X } from 'lucide-react'

type Word = { word: string; meaning: string }
type ArticleQuestion = { sentence: string; answer: string; rule: string }

const WORDS: Word[] = [
  ['academic','related to education or formal study'],['access','the ability or right to use something'],['achieve','to successfully reach a goal'],['adequate','enough or satisfactory'],['analyse','to examine carefully'],['appropriate','suitable for a situation'],['assessment','the process of evaluating something'],['challenge','a difficult task or problem'],['communication','the exchange of information'],['concept','an idea or general principle'],['conclusion','a judgement reached after evidence'],['consequence','a result or effect'],['consistent','reliable over time'],['crucial','extremely important'],['demonstrate','to show something clearly'],['development','growth or change'],['efficient','working without waste'],['evidence','information supporting a conclusion'],['evaluate','to judge quality or importance'],['influence','the power to affect something'],['infrastructure','basic systems needed by society'],['innovation','a new idea, method or product'],['interpret','to explain meaning'],['maintain','to keep at the same level'],['participate','to take part'],['relevant','closely connected to the topic'],['reliable','able to be trusted'],['research','systematic investigation'],['significant','important enough to notice'],['sustainable','able to continue without serious damage'],['theory','an explanation based on evidence'],['variable','something that can change']].map(([word, meaning]) => ({ word, meaning }))

const ARTICLES: ArticleQuestion[] = [
  { sentence:'She is studying at ___ university in Melbourne.', answer:'a', rule:'University begins with a /y/ consonant sound, so use A.' },
  { sentence:'The lecture lasted for ___ hour.', answer:'an', rule:'Hour has a silent H and begins with a vowel sound, so use AN.' },
  { sentence:'Students need ___ reliable information.', answer:'none', rule:'Information is uncountable and used generally.' },
  { sentence:'___ information in this report is reliable.', answer:'the', rule:'The phrase identifies specific information.' },
  { sentence:'The lecturer gave ___ example.', answer:'an', rule:'Example begins with a vowel sound.' },
  { sentence:'The government introduced ___ new policy.', answer:'a', rule:'One non-specific policy is introduced.' },
  { sentence:'___ policy introduced last year improved attendance.', answer:'the', rule:'The phrase identifies a particular policy.' },
  { sentence:'Technology has ___ important role in education.', answer:'an', rule:'Important begins with a vowel sound.' },
]

const initialState = { mastery: {} as Record<string, number>, attempts: 0, correct: 0, streak: 0, practised: {} as Record<string, boolean> }

type Tab = 'home' | 'spell' | 'learn' | 'quiz' | 'article' | 'weak' | 'library'

export default function Page() {
  const [state, setState] = useState(initialState)
  const [tab, setTab] = useState<Tab>('home')
  const [spellWord, setSpellWord] = useState(WORDS[0])
  const [spellAnswer, setSpellAnswer] = useState('')
  const [spellFeedback, setSpellFeedback] = useState<{ok:boolean; text:string} | null>(null)
  const [learnIndex, setLearnIndex] = useState(0)
  const [quiz, setQuiz] = useState(() => makeQuiz())
  const [quizFeedback, setQuizFeedback] = useState<{ok:boolean; text:string} | null>(null)
  const [articleIndex, setArticleIndex] = useState(0)
  const [articleFeedback, setArticleFeedback] = useState<{ok:boolean; text:string} | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { try { const saved = localStorage.getItem('pteWordForge'); if (saved) setState({ ...initialState, ...JSON.parse(saved) }) } catch {} }, [])
  useEffect(() => { localStorage.setItem('pteWordForge', JSON.stringify(state)) }, [state])

  function mastery(word: string) { return state.mastery[word] || 0 }
  function updateWord(word: string, amount: number) { setState(s => ({ ...s, mastery: { ...s.mastery, [word]: Math.max(0, Math.min(100, (s.mastery[word] || 0) + amount)) }, practised: { ...s.practised, [word]: true } })) }
  function speak(word: string) { if ('speechSynthesis' in window) { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(word); utterance.lang = 'en-AU'; utterance.rate = .78; speechSynthesis.speak(utterance) } }
  function chooseTab(next: Tab) { setTab(next); if (next === 'spell') nextSpell(); if (next === 'quiz') newQuiz() }
  function nextSpell() { setSpellWord(WORDS[Math.floor(Math.random() * WORDS.length)]); setSpellAnswer(''); setSpellFeedback(null) }
  function checkSpelling() { if (!spellAnswer.trim()) return; const ok = spellAnswer.trim().toLowerCase() === spellWord.word; setState(s => ({ ...s, attempts: s.attempts + 1, correct: s.correct + (ok ? 1 : 0), streak: ok ? s.streak + 1 : 0, practised: { ...s.practised, [spellWord.word]: true } })); updateWord(spellWord.word, ok ? 12 : -4); setSpellFeedback({ ok, text: ok ? `Correct! ${spellWord.word}` : `Correct spelling: ${spellWord.word}` }); if (ok) setTimeout(nextSpell, 850) }
  function newQuiz() { const correct = WORDS[Math.floor(Math.random() * WORDS.length)]; setQuiz({ correct, options: [...WORDS.filter(w => w.word !== correct.word).sort(() => Math.random() - .5).slice(0, 3), correct].sort(() => Math.random() - .5) }); setQuizFeedback(null) }
  function answerQuiz(word: Word) { const ok = word.word === quiz.correct.word; setState(s => ({ ...s, attempts: s.attempts + 1, correct: s.correct + (ok ? 1 : 0), streak: ok ? s.streak + 1 : 0, practised: { ...s.practised, [quiz.correct.word]: true } })); updateWord(quiz.correct.word, ok ? 8 : -2); setQuizFeedback({ ok, text: ok ? 'Correct' : 'Try again' }); if (ok) setTimeout(newQuiz, 700) }
  function reset() { if (confirm('Delete all WordForge progress?')) { localStorage.removeItem('pteWordForge'); location.reload() } }

  const mastered = WORDS.filter(w => mastery(w.word) >= 80).length
  const accuracy = state.attempts ? Math.round(state.correct / state.attempts * 100) : 0
  const weak = WORDS.filter(w => state.practised[w.word] && mastery(w.word) < 80).sort((a,b) => mastery(a.word) - mastery(b.word))
  const filtered = WORDS.filter(w => w.word.includes(search.toLowerCase()) || w.meaning.includes(search.toLowerCase()))
  const nav = [{id:'home' as Tab, label:'Dashboard', icon:House},{id:'spell' as Tab, label:'Spelling', icon:Check},{id:'learn' as Tab, label:'Learn', icon:BookOpen},{id:'quiz' as Tab, label:'Meaning Quiz', icon:Brain},{id:'article' as Tab, label:'A / An / The', icon:List},{id:'weak' as Tab, label:'Weak Words', icon:Target},{id:'library' as Tab, label:'Word Library', icon:BookOpen}]

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><div className="logo">P</div><div><h1>PTE WordForge</h1><p>Academic vocabulary + spelling practice that adapts to your weak words</p></div></div><button className="button danger" onClick={reset}><RotateCcw size={16}/> Reset progress</button></header>
    <section className="stats">{[['Mastered', mastered],['Spelling accuracy', `${accuracy}%`],['Current streak', state.streak],['Words practised', Object.keys(state.practised).length]].map(([label,value]) => <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
    <nav className="nav-tabs">{nav.map(({id,label,icon:Icon}) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => chooseTab(id)}><Icon size={16}/>{label}</button>)}</nav>
    <section className="panel">{tab === 'home' && <Home go={chooseTab}/>} {tab === 'spell' && <Spell word={spellWord} answer={spellAnswer} setAnswer={setSpellAnswer} feedback={spellFeedback} check={checkSpelling} hint={() => setSpellFeedback({ok:true,text:`${spellWord.meaning} • ${spellWord.word.length} letters • starts with ${spellWord.word[0].toUpperCase()}`})} skip={nextSpell} speak={speak}/>} {tab === 'learn' && <Learn word={WORDS[learnIndex % WORDS.length]} mastery={mastery} speak={speak} next={() => setLearnIndex(i => i + 1)} know={() => { updateWord(WORDS[learnIndex % WORDS.length].word, 10); setLearnIndex(i => i + 1) }}/>} {tab === 'quiz' && <Quiz quiz={quiz} feedback={quizFeedback} speak={speak} answer={answerQuiz}/>} {tab === 'article' && <Article q={ARTICLES[articleIndex]} feedback={articleFeedback} answer={(answer) => setArticleFeedback({ok:answer===ARTICLES[articleIndex].answer,text:answer===ARTICLES[articleIndex].answer ? 'Correct' : `Correct answer: ${ARTICLES[articleIndex].answer === 'none' ? 'No article' : ARTICLES[articleIndex].answer}`})} next={() => { setArticleIndex(Math.floor(Math.random()*ARTICLES.length)); setArticleFeedback(null) }}/>} {tab === 'weak' && <WordList title="Weak Words" words={weak} empty="No weak words yet. Start the spelling trainer first." mastery={mastery} speak={speak}/>} {tab === 'library' && <><h2>Fast Track Word Library</h2><input className="search" aria-label="Search words" placeholder="Search word or meaning..." value={search} onChange={e => setSearch(e.target.value)}/><WordList words={filtered} mastery={mastery} speak={speak}/></>}</section>
  </main>
}

function makeQuiz() { const correct = WORDS[Math.floor(Math.random()*WORDS.length)]; return { correct, options: [...WORDS.filter(w=>w.word!==correct.word).sort(()=>Math.random()-.5).slice(0,3), correct].sort(()=>Math.random()-.5) } }
function Home({go}:{go:(tab:Tab)=>void}) { return <><h2>Fast Track 100</h2><p className="muted">High-value academic words to focus on when your PTE test is close.</p><div className="cards">{[['Spelling Trainer','Listen to a word, type the spelling and get instant feedback.','spell',Check],['Learn & Speak','Learn the meaning of each word and hear its pronunciation.','learn',BookOpen],['Meaning Quiz','Choose the correct meaning from four answers.','quiz',Brain],['A / An / The','Practise articles using short academic sentences.','article',List]].map(([title,text,id,Icon]) => <div className="mode-card" key={title as string}><Icon size={22}/><h3>{title as string}</h3><p>{text as string}</p><button className="button primary" onClick={() => go(id as Tab)}>Open practice <ChevronRight size={16}/></button></div>)}</div></> }
function Spell({word,answer,setAnswer,feedback,check,hint,skip,speak}:{word:Word;answer:string;setAnswer:(s:string)=>void;feedback:{ok:boolean;text:string}|null;check:()=>void;hint:()=>void;skip:()=>void;speak:(s:string)=>void}) { return <div className="center"><h2>Spelling Trainer</h2><p className="muted">Listen carefully and type the word.</p><button className="speaker" onClick={() => speak(word.word)} aria-label="Pronounce word"><Volume2 size={48}/></button><input autoFocus className="spell-input" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing&&e.keyCode!==229)check()}} placeholder="Type the word..."/><div className="controls"><button className="button" onClick={hint}><Lightbulb size={16}/> Hint</button><button className="button primary" onClick={check}>Check</button><button className="button" onClick={skip}>Skip</button></div>{feedback && <div className={`feedback ${feedback.ok ? 'correct':'wrong'}`}>{feedback.ok ? <Check size={18}/> : <X size={18}/>} {feedback.text}</div>}<div className="progress"><div style={{width:`${Math.min(100, Math.max(0, 0))}%`}}/></div></div> }
function Learn({word,mastery,speak,next,know}:{word:Word;mastery:(w:string)=>number;speak:(w:string)=>void;next:()=>void;know:()=>void}) { return <div className="center"><h2>Learn & Speak</h2><div className="big-word">{word.word}</div><div className="meaning">{word.meaning}</div><p className="muted">Mastery: {mastery(word.word)}%</p><div className="controls"><button className="button" onClick={()=>speak(word.word)}><Volume2 size={16}/> Pronounce</button><button className="button good" onClick={know}><Check size={16}/> I know this</button><button className="button primary" onClick={next}>Next <ChevronRight size={16}/></button></div></div> }
function Quiz({quiz,feedback,speak,answer}:{quiz:{correct:Word;options:Word[]};feedback:{ok:boolean;text:string}|null;speak:(w:string)=>void;answer:(w:Word)=>void}) { return <div className="center"><h2>Meaning Quiz</h2><p className="muted">Choose the correct meaning.</p><div className="big-word">{quiz.correct.word}</div><button className="button" onClick={()=>speak(quiz.correct.word)}><Volume2 size={16}/> Pronounce</button><div className="quiz">{quiz.options.map(option=><button className="option" key={option.word} onClick={()=>answer(option)}>{option.meaning}</button>)}</div>{feedback && <div className={`feedback ${feedback.ok?'correct':'wrong'}`}>{feedback.text}</div>}</div> }
function Article({q,feedback,answer,next}:{q:ArticleQuestion;feedback:{ok:boolean;text:string}|null;answer:(a:string)=>void;next:()=>void}) { return <div className="center"><h2>A / An / The Trainer</h2><p className="muted">Choose the correct article for the blank.</p><div className="article-sentence">{q.sentence}</div><div className="article-buttons">{['a','an','the','none'].map(a=><button className="option" key={a} onClick={()=>answer(a)}>{a==='none'?'Ø No article':a.toUpperCase()}</button>)}</div>{feedback && <div className={`feedback ${feedback.ok?'correct':'wrong'}`}>{feedback.text}</div>}<div className="rule">{feedback ? q.rule : 'One non-specific thing → a/an; specific thing → the; things in general → often no article.'}</div><button className="button primary" onClick={next}>Next <ChevronRight size={16}/></button></div> }
function WordList({title,words,mastery,speak,empty}:{title?:string;words:Word[];mastery:(w:string)=>number;speak:(w:string)=>void;empty?:string}) { return <>{title && <><h2>{title}</h2><p className="muted">Words below 80% mastery appear here after you practise them.</p></>}{words.length ? <div className="word-list">{words.map(w=><div className="word-row" key={w.word}><b>{w.word}</b><span>{w.meaning}</span><small>{mastery(w.word)}% <button className="icon-button" onClick={()=>speak(w.word)} aria-label={`Pronounce ${w.word}`}><Volume2 size={16}/></button></small></div>)}</div> : <div className="empty">{empty}</div>}</>}

// Keep the tuple-like source data readable while exposing objects to the UI.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _wordforgeReady = true
