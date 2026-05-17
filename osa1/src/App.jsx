const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14


  return (
    <div>
   
     <Header course={course} />

      <Content
        part1={part1}
        exercises1={exercises1}
        part2={part2}
        exercises2={exercises2}
        part3={part3}
        exercises3={exercises3}
      />
      <Total total = {exercises1 + exercises2 + exercises3}/>
    </div>
  )
}



const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Total = (props) => {
  return (
    <p>
      Tehtävien lkm {props.total}
    </p>
  )
}




const Content = (props) => {
  return (
/*
1.1 oli tälleen nyt muutettu
    <div>
      <p>
        {props.part1} {props.exercises1}
      </p>
*/
    <div>
      <Part
        name={props.part1}
        exercises={props.exercises1}
      />

      <Part
        name={props.part2}
        exercises={props.exercises2}
      />

      <Part
        name={props.part3}
        exercises={props.exercises3}
      />
    </div>
  )
}

// 1.2 lisäys
const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}


export default App