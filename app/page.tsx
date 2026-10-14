'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Brain, Check, ChevronLeft, ChevronRight, Headphones, House, Lightbulb, List, RotateCcw, Target, Volume2, X } from 'lucide-react'

import listeningWords from '@/data/listening-words.json'
import { WordLesson } from '@/components/word-lesson'

type Word = { word: string; meaning: string }
type ArticleQuestion = { sentence: string; answer: string; rule: string }

const PRIORITY_WORDS: Word[] = [
  ['academic','related to education or formal study'],['access','the ability or right to use something'],['achieve','to successfully reach a goal'],['adequate','enough or satisfactory'],['analyse','to examine carefully'],['appropriate','suitable for a situation'],['assessment','the process of evaluating something'],['challenge','a difficult task or problem'],['communication','the exchange of information'],['concept','an idea or general principle'],['conclusion','a judgement reached after evidence'],['consequence','a result or effect'],['consistent','reliable over time'],['crucial','extremely important'],['demonstrate','to show something clearly'],['development','growth or change'],['efficient','working without waste'],['evidence','information supporting a conclusion'],['evaluate','to judge quality or importance'],['influence','the power to affect something'],['infrastructure','basic systems needed by society'],['innovation','a new idea, method or product'],['interpret','to explain meaning'],['maintain','to keep at the same level'],['participate','to take part'],['relevant','closely connected to the topic'],['reliable','able to be trusted'],['research','systematic investigation'],['significant','important enough to notice'],['sustainable','able to continue without serious damage'],['theory','an explanation based on evidence'],['variable','something that can change'],
  ['accompany','to go together with something'],['accumulate','to collect or build up over time'],['acquire','to gain or obtain something'],['adapt','to change to suit new conditions'],['alter','to change partly or completely'],['alternative','another possibility or choice'],['ambiguous','having more than one possible meaning'],['annual','happening once every year'],['apparent','easy to see or understand'],['approach','a way of dealing with something'],['assess','to judge or estimate quality'],['assign','to give a task or responsibility'],['attain','to succeed in achieving something'],['attribute','a quality or feature of something'],['benefit','an advantage or helpful result'],['brief','short in time or length'],['capacity','the maximum amount something can contain'],['cease','to stop happening'],['cite','to mention as evidence or an example'],['clarify','to make something easier to understand'],['coherent','logical and well organised'],['coincide','to happen at the same time'],['compile','to collect information into one place'],['complement','to add to something in a useful way'],['complex','having many connected parts'],['comprehensive','including all or nearly all details'],['comprise','to consist of or include'],['confirm','to establish that something is true'],['considerable','large or important enough to notice'],['construct','to build or create'],['consume','to use up a resource'],['contemporary','belonging to the present time'],['contradict','to say the opposite of something'],['controversial','causing disagreement or debate'],['convert','to change from one form to another'],['correspond','to match or be similar'],['derive','to get or develop from a source'],['detect','to discover or notice something'],['diminish','to become or make less'],['discrete','separate and distinct'],['diverse','including many different types'],['domestic','related to one country or home'],['edit','to correct or improve written material'],['eliminate','to remove or get rid of'],['emerge','to appear or become known'],['empirical','based on observation or experience'],['enhance','to improve quality or value'],['equivalent','equal in value, meaning or function'],['ethic','a moral principle guiding behaviour'],['exclude','to leave out or prevent inclusion'],['explicit','clearly stated and not implied'],['expose','to reveal or make visible'],['facilitate','to make an action or process easier'],['flexible','able to change or adapt easily'],['framework','a basic structure supporting an idea'],['fundamental','forming the essential base of something'],['generate','to produce or create'],['hypothesis','a proposed explanation to be tested'],['indicate','to show or point out'],['inevitable','certain to happen'],['initial','existing at the beginning'],['innovative','introducing new ideas or methods'],['justify','to give a reason or explanation'],['likewise','in the same way'],['logical','based on clear reasoning'],['mechanism','a system or process that produces a result'],['mediate','to help settle a disagreement'],['modify','to change slightly'],['notion','an idea or belief'],['objective','a goal or something based on facts'],['obtain','to get or acquire'],['ongoing','continuing to happen'],['paradigm','a typical model or pattern'],['perspective','a particular way of viewing something'],['precise','exact and accurate'],['predominant','more common or important than others'],['previous','existing or happening before'],['priority','something treated as more important'],['prohibit','to officially prevent something'],['promote','to support or encourage progress'],['prospect','the possibility of a future event'],['qualitative','related to qualities rather than numbers'],['quantitative','related to numbers or amounts'],['refine','to improve by making small changes'],['reinforce','to strengthen or support'],['reluctant','unwilling or hesitant'],['resolve','to solve a problem'],['retain','to continue to keep something'],['reveal','to make something known'],['rigid','not able or willing to change'],['scenario','a possible situation or sequence of events'],['seek','to try to find or obtain'],['shift','to change position, focus or direction'],['sole','the only one'],['subsequent','happening after something else'],['substitute','to use instead of another thing'],['supplement','something added to complete or improve'],['transmit','to send or pass something on'],['unify','to bring together as one'],['unique','one of a kind'],['valid','based on sound reasoning or evidence'],['widespread','existing or happening in many places'],
  ['necessary','needed or essential'],['practising','training or rehearsing a skill'],['grammatically','according to grammar rules'],['together','with or alongside one another'],['financing','providing money for something'],['carbon dioxide','a gas produced by burning fuel'],['independent','not controlled by others'],['separate','apart or distinct'],['receive','to get or accept something'],['occurred','happened'],['beginning','the start of something'],['success','the achievement of a desired result'],['successful','achieving a desired result'],['responsibility','a duty or obligation'],['collaboration','working together'],['accommodation','a place to live or stay'],['financial','related to money'],['essay','a structured piece of academic writing'],['required','needed or demanded'],['requirements','things that are needed'],['according','as stated or indicated'],['template','a pattern used as a guide'],['writing','the activity of producing written text'],['related','connected with something'],['approach','a method of dealing with something'],['correct','free from mistakes'],['synthetic','made artificially rather than naturally'],['significance','importance or meaning'],['explanation','a description that makes something clear'],['beneficial','producing a helpful result'],['opportunity','a favourable chance'],['because','for the reason that'],['improvement','a change that makes something better'],['achievement','something successfully completed'],['knowledge','information and understanding'],['management','the control or organisation of something'],['governmental','related to government'],['availability','the state of being obtainable'],['variability','the extent to which something changes'],['individual','one person or thing'],['society','people living together in a community'],['positive','helpful or favourable'],['negative','harmful or unfavourable'],['argument','a reason supporting a view'],['arguments','reasons supporting a view'],['introduction','the opening section'],['paragraph','a distinct section of writing'],['sentence','a group of words expressing an idea'],['vocabulary','the words used in a language'],['grammar','rules for using a language'],['reason','a cause or explanation'],['example','something illustrating an idea'],['statement','a written or spoken claim'],['opinion','a personal view'],['consequently','as a result'],['therefore','for that reason'],['moreover','in addition'],['furthermore','also or additionally'],['however','in contrast'],['economic','related to the economy'],['economy','the system of production and trade'],['responsible','having a duty to deal with something'],['available','able to be obtained'],['benefits','helpful results or advantages'],['significantly','in an important or noticeable way'],['effectively','in a successful way'],['productivity','the rate of useful output'],['qualification','an examination or skill that proves ability'],['transaction','an act of buying or selling'],['transparency','openness and clarity'],['examining','looking at something carefully'],['decision','a choice made after consideration'],['decisions','choices made after consideration'],['administered','officially given or applied'],['intravenously','through a vein'],['simultaneously','at the same time'],['constitution','the basic principles of a state or organisation'],['recognise','to identify as familiar'],['recognize','to identify as familiar'],['statistics','numerical data'],['sophisticated','advanced and complex'],['psychology','the study of mind and behaviour'],['cooperate','to work together'],['emphasis','special importance'],['vernacular','the language commonly spoken in a place'],['architecture','the design of buildings'],['interventions','actions taken to improve a situation'],['transparent','open and easy to understand'],['useful','helpful for a purpose'],['prestigious','highly respected'],['institution','an established organisation'],['researcher','a person who conducts research'],['laboratory','a place for scientific experiments'],['competition','a contest or rivalry'],['sustainability','the ability to continue without harm'],['renewable','able to be replaced naturally'],['electricity','energy produced by electric charge'],['transportation','the movement of people or goods'],['efficiency','achieving results with little waste'],['convenience','ease or comfort'],['accessible','easy to reach or use'],['accountability','responsibility for actions'],['accurate','correct and precise'],['acquisition','the act of obtaining'],['adaptation','a change made to suit conditions'],['additional','extra or added'],['adequately','in a sufficient way'],['administration','the management of an organisation'],['advantageous','providing a benefit'],['affordable','not too expensive'],['agriculture','farming and cultivation'],['allocate','to distribute for a purpose'],['although','despite the fact that'],['analytical','using careful examination'],['artificial','made by humans'],['assumption','an idea accepted without proof'],['authority','the power to make decisions'],['awareness','knowledge or understanding'],['barrier','something that blocks progress'],['biodiversity','variety of living things'],['capacity','the ability or amount something can contain'],['circumstance','a condition affecting a situation'],['civilization','an organised human society'],['climate','the usual weather of a region'],['commercial','related to business'],['commitment','a promise or dedication'],['complexity','the state of having many parts'],['concentration','focused attention'],['construction','the process of building'],['consumption','the use of goods or resources'],['distribution','the way something is shared'],['diversity','the presence of differences'],['employment','paid work'],['emissions','gases released into the atmosphere'],['encourage','to give support or confidence'],['essential','absolutely necessary'],['establish','to create or prove'],['expansion','growth in size or scope'],['global','worldwide'],['healthcare','services for maintaining health'],['limitation','a restriction'],['organisation','an organised group'],['perspective','a particular point of view'],['population','all people in an area'],['pollution','harmful substances in the environment'],['regulation','an official rule'],['renewable energy','energy from sources naturally replenished'],['urbanisation','the growth of cities'],['wellbeing','health and happiness'],['cohesion','the quality of being logically connected'],['coherence','clear and logical connection'],['spelling','the correct arrangement of letters'],['viewpoint','a particular opinion'],['reasonable','fair and sensible'],['alternatives','other possible choices'],['circumstances','conditions affecting an event']
].map(([word, meaning]) => ({ word, meaning }))

const WORDS: Word[] = Array.from(new Map([
  ...listeningWords.map(word => [word, { word, meaning: '' }] as const),
  ...PRIORITY_WORDS.map(item => [item.word, item] as const),
]).values()).sort((a, b) => Number(PRIORITY_WORDS.some(w => w.word === b.word)) - Number(PRIORITY_WORDS.some(w => w.word === a.word)))
const DEFINED_WORDS = WORDS.filter(w => w.meaning)
const todayKey = () => new Date().toLocaleDateString('en-CA')

const ARTICLES: ArticleQuestion[] = [
  { sentence:'She is studying at ___ university in Melbourne.', answer:'a', rule:'University begins with a /y/ consonant sound, so use A.' },
  { sentence:'The lecture lasted for ___ hour.', answer:'an', rule:'Hour has a silent H and begins with a vowel sound, so use AN.' },
  { sentence:'Students need ___ reliable information.', answer:'none', rule:'Information is uncountable and used generally.' },
  { sentence:'___ information in this report is reliable.', answer:'the', rule:'The phrase identifies specific information.' },
  { sentence:'The lecturer gave ___ example.', answer:'an', rule:'Example begins with a vowel sound.' },
  { sentence:'The government introduced ___ new policy.', answer:'a', rule:'One non-specific policy is introduced.' },
  { sentence:'___ policy introduced last year improved attendance.', answer:'the', rule:'The phrase identifies a particular policy.' },
  { sentence:'Technology has ___ important role in education.', answer:'an', rule:'Important begins with a vowel sound.' },
  { sentence:'The university launched ___ innovative research project.', answer:'an', rule:'Innovative begins with a vowel sound.' },
  { sentence:'Researchers identified ___ significant difference between the groups.', answer:'a', rule:'Significant begins with a consonant sound.' },
  { sentence:'___ difference was larger than expected.', answer:'the', rule:'The difference has already been identified.' },
  { sentence:'Students should develop ___ effective study strategy.', answer:'an', rule:'Effective begins with a vowel sound.' },
  { sentence:'___ strategy recommended by the lecturer is practical.', answer:'the', rule:'The strategy is specifically identified.' },
  { sentence:'The article presents ___ overview of climate research.', answer:'an', rule:'Overview begins with a vowel sound.' },
  { sentence:'___ research published last year supports this view.', answer:'the', rule:'The research is made specific by the phrase that follows.' },
  { sentence:'Many students face ___ challenge when learning vocabulary.', answer:'a', rule:'Challenge begins with a consonant sound.' },
  { sentence:'Vocabulary learning requires ___ consistent approach.', answer:'a', rule:'Consistent begins with a consonant sound.' },
  { sentence:'The researcher used ___ unusual method.', answer:'an', rule:'Unusual begins with a vowel sound.' },
  { sentence:'___ method produced reliable results.', answer:'the', rule:'The method refers to the one just mentioned.' },
  { sentence:'Education plays ___ essential role in development.', answer:'an', rule:'Essential begins with a vowel sound.' },
  { sentence:'___ role of technology is becoming more important.', answer:'the', rule:'The role is specific.' },
  { sentence:'The study included ___ large number of participants.', answer:'a', rule:'Large begins with a consonant sound.' },
  { sentence:'___ participants completed the survey online.', answer:'the', rule:'The participants are a specific group from the study.' },
  { sentence:'Researchers need ___ accurate measurement.', answer:'an', rule:'Accurate begins with a vowel sound.' },
  { sentence:'The report provides ___ detailed analysis of the data.', answer:'a', rule:'Detailed begins with a consonant sound.' },
  { sentence:'___ analysis reveals several important patterns.', answer:'the', rule:'The analysis has already been introduced.' },
  { sentence:'The lecturer gave ___ useful explanation.', answer:'a', rule:'Useful begins with a /y/ consonant sound.' },
  { sentence:'Climate change affects ___ environment worldwide.', answer:'the', rule:'The environment refers to the natural world as a shared concept.' },
  { sentence:'Researchers collected ___ information about study habits.', answer:'none', rule:'Information is uncountable and used generally.' },
  { sentence:'The questionnaire included ___ question about sleep.', answer:'a', rule:'Question begins with a consonant sound.' },
  { sentence:'___ question was difficult to answer.', answer:'the', rule:'The question is specific because it was mentioned before.' },
  { sentence:'The experiment required ___ equipment.', answer:'none', rule:'Equipment is uncountable and used generally.' },
  { sentence:'The laboratory purchased ___ advanced piece of equipment.', answer:'an', rule:'Advanced begins with a vowel sound.' },
  { sentence:'Public transport can reduce ___ traffic in cities.', answer:'none', rule:'Traffic is uncountable and discussed generally.' },
  { sentence:'The city built ___ efficient transport network.', answer:'an', rule:'Efficient begins with a vowel sound.' },
  { sentence:'___ network connects the suburbs with the city centre.', answer:'the', rule:'The network is specifically identified.' },
  { sentence:'The findings support ___ theory proposed by the researcher.', answer:'the', rule:'The theory is specified by the following phrase.' },
  { sentence:'The researchers developed ___ hypothesis.', answer:'a', rule:'Hypothesis begins with a consonant sound.' },
  { sentence:'___ hypothesis was tested in a controlled experiment.', answer:'the', rule:'The hypothesis has already been introduced.' },
  { sentence:'The results showed ___ increase in attendance.', answer:'an', rule:'Increase begins with a vowel sound.' },
  { sentence:'Attendance showed ___ steady improvement over time.', answer:'a', rule:'Steady begins with a consonant sound.' },
  { sentence:'___ improvement was linked to better teaching methods.', answer:'the', rule:'The improvement is specific and already mentioned.' },
  { sentence:'Students need ___ opportunity to practise speaking.', answer:'an', rule:'Opportunity begins with a vowel sound.' },
  { sentence:'Practice is ___ important part of language learning.', answer:'an', rule:'Important begins with a vowel sound.' },
  { sentence:'___ language used in the presentation was formal.', answer:'the', rule:'The language is specific to the presentation.' },
  { sentence:'Language is ___ powerful tool for communication.', answer:'a', rule:'Powerful begins with a consonant sound.' },
  { sentence:'The paper discusses ___ impact of social media.', answer:'the', rule:'The phrase identifies a specific impact.' },
  { sentence:'Social media has ___ considerable impact on communication.', answer:'a', rule:'Considerable begins with a consonant sound.' },
  { sentence:'The university offers ___ range of academic courses.', answer:'a', rule:'Range begins with a consonant sound.' },
  { sentence:'___ courses are available to international students.', answer:'the', rule:'The courses refer to the specific courses just mentioned.' },
  { sentence:'Researchers observed ___ unexpected result.', answer:'an', rule:'Unexpected begins with a vowel sound.' },
  { sentence:'___ result changed the direction of the study.', answer:'the', rule:'The result is already known to the reader.' },
  { sentence:'Students should use ___ reliable source in academic writing.', answer:'a', rule:'Reliable begins with a consonant sound.' },
  { sentence:'___ sources listed in the reference section were peer-reviewed.', answer:'the', rule:'The sources are specifically identified.' },
  { sentence:'Research requires ___ patience and careful planning.', answer:'none', rule:'Patience is uncountable and used generally.' },
  { sentence:'The project was ___ valuable learning experience.', answer:'a', rule:'Valuable begins with a consonant sound.' },
  { sentence:'___ experience helped the students understand research methods.', answer:'the', rule:'The experience is specific because it was already mentioned.' },
  { sentence:'The report reached ___ clear conclusion.', answer:'a', rule:'Clear begins with a consonant sound.' },
  { sentence:'___ conclusion was supported by statistical evidence.', answer:'the', rule:'The conclusion has already been introduced.' },
]

const initialState = { mastery: {} as Record<string, number>, attempts: 0, correct: 0, streak: 0, practised: {} as Record<string, boolean>, spellingReviews: {} as Record<string, { dueAt: number; correctStreak: number }>, daily: {} as Record<string, { newWords: string[]; answers: number }> }

type Tab = 'home' | 'spell' | 'learn' | 'quiz' | 'article' | 'weak' | 'library'

export default function Page() {
  const [state, setState] = useState(initialState)
  const [tab, setTab] = useState<Tab>('home')
  const [spellHistory, setSpellHistory] = useState([WORDS[0]])
  const [spellIndex, setSpellIndex] = useState(0)
  const spellWord = spellHistory[spellIndex]
  const [spellAnswer, setSpellAnswer] = useState('')
  const [spellFeedback, setSpellFeedback] = useState<{ok:boolean; text:string} | null>(null)
  const [learnIndex, setLearnIndex] = useState(0)
  const [quiz, setQuiz] = useState(() => makeQuiz())
  const [quizFeedback, setQuizFeedback] = useState<{ok:boolean; text:string} | null>(null)
  const [articleIndex, setArticleIndex] = useState(0)
  const [articleFeedback, setArticleFeedback] = useState<{ok:boolean; text:string} | null>(null)
  const [search, setSearch] = useState('')

  const [loaded, setLoaded] = useState(false)
  const [answered, setAnswered] = useState<Record<number, boolean>>({})
  const [studyNotice, setStudyNotice] = useState('')
  const [hintUsed, setHintUsed] = useState(false)
  useEffect(() => { try { const saved = localStorage.getItem('pteWordForge'); if (saved) setState({ ...initialState, ...JSON.parse(saved) }) } catch {} finally { setLoaded(true) } }, [])
  useEffect(() => { if (loaded) localStorage.setItem('pteWordForge', JSON.stringify(state)) }, [state, loaded])

  function mastery(word: string) { return state.mastery[word] || 0 }
  function updateWord(word: string, amount: number) { setState(s => ({ ...s, mastery: { ...s.mastery, [word]: Math.max(0, Math.min(100, (s.mastery[word] || 0) + amount)) }, practised: { ...s.practised, [word]: true } })) }
  function scheduleSpellingReview(word: string, correct: boolean) {
    setState(s => {
      const previous = s.spellingReviews[word] || { dueAt: 0, correctStreak: 0 }
      const correctStreak = correct ? previous.correctStreak + 1 : 0
      const delay = correct ? [1, 3, 7, 14][Math.min(correctStreak - 1, 3)] * 86_400_000 : 30_000
      const day = s.daily[todayKey()] || { newWords: [], answers: 0 }
      return { ...s, mastery: { ...s.mastery, [word]: correctStreak * 25 },
        daily: { ...s.daily, [todayKey()]: { newWords: s.spellingReviews[word] ? day.newWords : [...day.newWords, word], answers: day.answers + 1 } },
        spellingReviews: { ...s.spellingReviews, [word]: { dueAt: Date.now() + delay, correctStreak } } }
    })
  }
  function speak(word: string) { if ('speechSynthesis' in window) { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(word); utterance.lang = 'en-AU'; utterance.rate = .78; speechSynthesis.speak(utterance) } }
  function chooseTab(next: Tab) { setTab(next); if (next === 'spell') nextSpell(); if (next === 'quiz') newQuiz() }
  function nextSpell() {
    if (spellIndex < spellHistory.length - 1) {
      setSpellIndex(i => i + 1)
    } else {
      const now = Date.now()
      const available = WORDS.filter(w => (state.spellingReviews[w.word]?.correctStreak || 0) < 4)
      const due = available.filter(w => state.spellingReviews[w.word]?.dueAt <= now)
        .sort((a, b) => state.spellingReviews[a.word].dueAt - state.spellingReviews[b.word].dueAt)
      const unseen = available.filter(w => !state.spellingReviews[w.word] && !spellHistory.some(h => h.word === w.word))
      const skipped = available.filter(w => !state.spellingReviews[w.word])
      const allowNew = (state.daily[todayKey()]?.newWords.length || 0) < 20
      const next = due[0] || (allowNew ? unseen[0] || skipped[0] : undefined)
      if (!next) {
        setStudyNotice('You are caught up. Missed words return after 30 seconds; correct words return after 1, 3 and 7 days. Come back tomorrow for up to 20 new words, or press Next later to check for due reviews.')
        return
      }
      setStudyNotice('')
      setHintUsed(false)
      setSpellHistory(history => [...history, next])
      setSpellIndex(i => i + 1)
    }
    setSpellAnswer('')
    setSpellFeedback(null)
  }
  function previousSpell() {
    if (spellIndex === 0) return
    setSpellIndex(i => i - 1)
    setSpellAnswer('')
    setSpellFeedback(null)
  }
  function checkSpelling() {
    if (!loaded || !spellAnswer.trim() || answered[spellIndex] || studyNotice) return
    const review = state.spellingReviews[spellWord.word]
    if (review && (review.correctStreak >= 4 || review.dueAt > Date.now())) {
      setSpellFeedback({ ok: true, text: 'This word is already saved for later review or mastered. Press Next for another word.' })
      return
    }
    const ok = spellAnswer.trim().toLowerCase().replace(/\s+/g, ' ') === spellWord.word
    setAnswered(s => ({ ...s, [spellIndex]: true }))
    setState(s => ({ ...s, attempts: s.attempts + 1, correct: s.correct + (ok ? 1 : 0), streak: ok ? s.streak + 1 : 0, practised: { ...s.practised, [spellWord.word]: true } }))
    scheduleSpellingReview(spellWord.word, ok && !hintUsed)
    const retired = (state.spellingReviews[spellWord.word]?.correctStreak || 0) >= 3
    setSpellFeedback({ ok, text: ok ? `Correct! ${spellWord.word}. ${hintUsed ? 'With a hint — we will review this again shortly.' : retired ? 'Four successful reviews — mastered and removed from regular practice.' : 'Saved for a later spaced review.'} Press Next.` : `Correct spelling: ${spellWord.word}. Listen again, notice the tricky letters, then press Next. We will ask again after 30 seconds.` })
  }
  function newQuiz() { setQuiz(makeQuiz()); setQuizFeedback(null) }
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
    <aside className="rule"><strong>Daily spelling plan · {WORDS.length} unique words and phrases</strong><p>Review due words first, then practise up to 20 new words. Existing vocabulary comes before the imported PDF list. Misses return after 30 seconds; unassisted correct answers are reviewed after 1, 3 and 7 days. Four successful reviews retire a word.</p><p>Today: {state.daily[todayKey()]?.newWords.length || 0}/20 new words · {state.daily[todayKey()]?.answers || 0} answers. Listen → type without hints → check → inspect mistakes → Next.</p><small>The PDF contains 1,122 numbered entries, not 1,223 unique words. Duplicates are merged. Imported spelling-only entries are excluded from meaning quizzes.</small></aside>
    {studyNotice && <p role="status" className="rule">{studyNotice}</p>}
    <nav className="nav-tabs">{nav.map(({id,label,icon:Icon}) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => chooseTab(id)}><Icon size={16}/>{label}</button>)}</nav>
    <section className="panel">{tab === 'home' && <Home go={chooseTab}/>} {tab === 'spell' && <Spell submitted={!!answered[spellIndex]} word={spellWord} answer={spellAnswer} setAnswer={setSpellAnswer} feedback={spellFeedback} check={checkSpelling} hint={() => { setHintUsed(true); setSpellFeedback({ok:true,text:`${spellWord.meaning || 'PDF spelling practice'} • ${spellWord.word.length} characters including spaces • starts with ${spellWord.word[0].toUpperCase()}`}) }} previous={previousSpell} next={nextSpell} canGoBack={spellIndex > 0} speak={speak}/>} {tab === 'learn' && <Learn word={WORDS[learnIndex % WORDS.length]} mastery={mastery} speak={speak} next={() => setLearnIndex(i => i + 1)} know={() => { updateWord(WORDS[learnIndex % WORDS.length].word, 10); setLearnIndex(i => i + 1) }}/>} {tab === 'quiz' && <Quiz quiz={quiz} feedback={quizFeedback} speak={speak} answer={answerQuiz}/>} {tab === 'article' && <Article q={ARTICLES[articleIndex]} feedback={articleFeedback} answer={(answer) => setArticleFeedback({ok:answer===ARTICLES[articleIndex].answer,text:answer===ARTICLES[articleIndex].answer ? 'Correct' : `Correct answer: ${ARTICLES[articleIndex].answer === 'none' ? 'No article' : ARTICLES[articleIndex].answer}`})} next={() => { setArticleIndex(Math.floor(Math.random()*ARTICLES.length)); setArticleFeedback(null) }}/>} {tab === 'weak' && <WordList title="Weak Words" words={weak} empty="No weak words yet. Start the spelling trainer first." mastery={mastery} speak={speak}/>} {tab === 'library' && <><h2>Fast Track Word Library</h2><input className="search" aria-label="Search words" placeholder="Search word or meaning..." value={search} onChange={e => setSearch(e.target.value)}/><WordList words={filtered} mastery={mastery} speak={speak}/></>}</section>
  </main>
}

function makeQuiz() { const correct = DEFINED_WORDS[Math.floor(Math.random()*DEFINED_WORDS.length)]; return { correct, options: [...DEFINED_WORDS.filter(w=>w.word!==correct.word).sort(()=>Math.random()-.5).slice(0,3), correct].sort(()=>Math.random()-.5) } }
function Home({go}:{go:(tab:Tab)=>void}) { return <><h2>Your daily practice</h2><p className="muted">High-value academic words to focus on when your PTE test is close.</p><div className="cards">{[['Spelling Trainer','Listen to a word, type the spelling and get instant feedback.','spell',Check],['Learn & Speak','Learn the meaning of each word and hear its pronunciation.','learn',BookOpen],['Meaning Quiz','Choose the correct meaning from four answers.','quiz',Brain],['A / An / The','Practise articles using short academic sentences.','article',List]].map(([title,text,id,Icon]) => <div className="mode-card" key={title as string}><Icon size={22}/><h3>{title as string}</h3><p>{text as string}</p><button className="button primary" onClick={() => go(id as Tab)}>Open practice <ChevronRight size={16}/></button></div>)}</div></> }
function Spell({submitted,word,answer,setAnswer,feedback,check,hint,previous,next,canGoBack,speak}:{submitted:boolean;word:Word;answer:string;setAnswer:(s:string)=>void;feedback:{ok:boolean;text:string}|null;check:()=>void;hint:()=>void;previous:()=>void;next:()=>void;canGoBack:boolean;speak:(s:string)=>void}) { return <div className="center"><h2>Spelling Trainer</h2><p className="muted">Listen carefully and type the word.</p><button className="speaker" onClick={() => speak(word.word)} aria-label="Pronounce word"><Volume2 size={48}/></button><input autoFocus className="spell-input" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing&&e.keyCode!==229)check()}} placeholder="Type the word..."/><div className="controls"><button className="button" onClick={previous} disabled={!canGoBack} aria-label="Previous spelling word"><ChevronLeft size={16}/> Back</button><button className="button" onClick={hint}><Lightbulb size={16}/> Hint</button><button className="button primary" onClick={check}>Check</button><button className="button" onClick={next} aria-label="Next spelling word">Next <ChevronRight size={16}/></button></div>{feedback && <div className={`feedback ${feedback.ok ? 'correct':'wrong'}`}>{feedback.ok ? <Check size={18}/> : <X size={18}/>} {feedback.text}</div>}{submitted && <WordLesson key={word.word} word={word.word} meaning={word.meaning}/>}<div className="progress"><div style={{width:`${Math.min(100, Math.max(0, 0))}%`}}/></div></div> }
function Learn({word,mastery,speak,next,know}:{word:Word;mastery:(w:string)=>number;speak:(w:string)=>void;next:()=>void;know:()=>void}) { return <div className="center"><h2>Learn & Speak</h2><div className="big-word">{word.word}</div><div className="meaning">{word.meaning || 'Listening-list spelling practice. This PDF does not supply a definition.'}</div><p className="muted">Mastery: {mastery(word.word)}%</p><div className="controls"><button className="button" onClick={()=>speak(word.word)}><Volume2 size={16}/> Pronounce</button><button className="button good" onClick={know}><Check size={16}/> I know this</button><button className="button primary" onClick={next}>Next <ChevronRight size={16}/></button></div></div> }
function Quiz({quiz,feedback,speak,answer}:{quiz:{correct:Word;options:Word[]};feedback:{ok:boolean;text:string}|null;speak:(w:string)=>void;answer:(w:Word)=>void}) { return <div className="center"><h2>Meaning Quiz</h2><p className="muted">Choose the correct meaning.</p><div className="big-word">{quiz.correct.word}</div><button className="button" onClick={()=>speak(quiz.correct.word)}><Volume2 size={16}/> Pronounce</button><div className="quiz">{quiz.options.map(option=><button className="option" key={option.word} onClick={()=>answer(option)}>{option.meaning}</button>)}</div>{feedback && <div className={`feedback ${feedback.ok?'correct':'wrong'}`}>{feedback.text}</div>}</div> }
function Article({q,feedback,answer,next}:{q:ArticleQuestion;feedback:{ok:boolean;text:string}|null;answer:(a:string)=>void;next:()=>void}) { return <div className="center"><h2>A / An / The Trainer</h2><p className="muted">Choose the correct article for the blank.</p><div className="article-sentence">{q.sentence}</div><div className="article-buttons">{['a','an','the','none'].map(a=><button className="option" key={a} onClick={()=>answer(a)}>{a==='none'?'Ø No article':a.toUpperCase()}</button>)}</div>{feedback && <div className={`feedback ${feedback.ok?'correct':'wrong'}`}>{feedback.text}</div>}<div className="rule">{feedback ? q.rule : 'One non-specific thing → a/an; specific thing → the; things in general → often no article.'}</div><button className="button primary" onClick={next}>Next <ChevronRight size={16}/></button></div> }
function WordList({title,words,mastery,speak,empty}:{title?:string;words:Word[];mastery:(w:string)=>number;speak:(w:string)=>void;empty?:string}) { return <>{title && <><h2>{title}</h2><p className="muted">Words below 80% mastery appear here after you practise them.</p></>}{words.length ? <div className="word-list">{words.map(w=><div className="word-row" key={w.word}><b>{w.word}</b><span>{w.meaning}</span><small>{mastery(w.word)}% <button className="icon-button" onClick={()=>speak(w.word)} aria-label={`Pronounce ${w.word}`}><Volume2 size={16}/></button></small></div>)}</div> : <div className="empty">{empty}</div>}</>}

// Keep the tuple-like source data readable while exposing objects to the UI.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _wordforgeReady = true
