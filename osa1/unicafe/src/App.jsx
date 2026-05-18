import { useState } from 'react'

const App = () => {
  
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
    
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={good + neutral + bad}/>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {


  // step 4
  const yhteensa = props.good + props.neutral + props.bad

  if (yhteensa === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }

  const keskiarvo = (props.good - props.bad) / yhteensa
  const positiivisia = (props.good / yhteensa) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.good} />
        <StatisticLine text="neutral" value={props.neutral} />
        <StatisticLine text="bad" value={props.bad} />
        <StatisticLine text="all" value={yhteensa} />
        <StatisticLine text="average" value={keskiarvo} />
        <StatisticLine text="positive" value={positiivisia + ' %'} />
      </tbody>
    </table>
  )
}

export default App